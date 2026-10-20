
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

/** Real local Cloudflare Worker + Durable Objects integration smoke test. */
const origin = 'http://127.0.0.1:8788';
const child = spawn('./node_modules/.bin/wrangler', ['dev', '--port', '8788', '--ip', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
});
let logs = '';
for (const stream of [child.stdout, child.stderr]) stream?.on('data', data => { logs += data.toString().slice(-4000); logs = logs.slice(-12000); });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function request(path, { method = 'GET', data, token } = {}) {
  const response = await fetch(origin + path, {
    method,
    headers: { ...(data ? { 'content-type': 'application/json' } : {}), ...(token ? { authorization: 'Bearer ' + token } : {}) },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  return { status: response.status, body: await response.json() };
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 65; attempt++) {
    if (child.exitCode !== null) throw new Error('Wrangler ended before becoming ready');
    try {
      const response = await fetch(origin + '/');
      if (response.ok) { ready = true; break; }
    } catch { /* not started */ }
    await sleep(450);
  }
  if (!ready) throw new Error('Wrangler did not start: ' + logs);

  const pixelAsset = await fetch(origin + '/characters/pixel-atlas.png');
  assert.equal(pixelAsset.status, 200, 'pixel art asset must be public');
  assert.ok(pixelAsset.headers.get('content-type')?.includes('image/png'), 'PNG should have correct MIME type');
  const png = new Uint8Array(await pixelAsset.arrayBuffer());
  assert.ok(png.length > 1000, 'pixel atlas should not be empty');
  assert.deepEqual([...png.slice(0, 8)], [137,80,78,71,13,10,26,10]);

  const created = await request('/api/surveys', { method: 'POST', data: { name: 'テスト用' } });
  assert.equal(created.status, 201, JSON.stringify(created));
  const { id, token } = created.body;
  assert.match(id, /^[a-f0-9]{24}$/);
  const base = '/api/surveys/' + id;

  const sharePage = await fetch(origin + '/s/' + id);
  const html = await sharePage.text();
  assert.equal(sharePage.status, 200);
  assert.ok(html.includes('テスト用ってどんな人？'), 'Per-link OG preview must contain survey nickname');
  assert.equal(sharePage.headers.get('x-robots-tag'), 'noindex, nofollow');

  const info = await request(base);
  assert.equal(info.body.version, 3);
  assert.equal(info.body.closed, false);

  const unauthorized = await request(base + '/results');
  assert.equal(unauthorized.status, 403);
  const missingConfirmation = await request(base, { method: 'DELETE', token, data: { confirmation: 'oops' } });
  assert.equal(missingConfirmation.status, 400);

  const before = await request(base + '/results', { token });
  assert.equal(before.status, 200);
  assert.equal(before.body.total.scores, null);

  const answers = [0, 0, 0, 0, 3, 3, 3, 3];
  for (let i = 1; i <= 3; i++) {
    const submitted = await request(base + '/answers', { method: 'POST', data: {
      relation: 'best', position: 'peer', visitorId: i.toString(16).padStart(32, '0'),
      nickname: i === 1 ? 'りん' : '', answers,
    } });
    assert.equal(submitted.status, 201, JSON.stringify(submitted));
    const report = await request(base + '/results', { token });
    assert.equal(report.body.count, i);
    if (i < 3) assert.equal(report.body.total.scores, null);
    else {
      assert.deepEqual(report.body.total.scores, [0, 0, 0, 0]);
      assert.deepEqual(report.body.relations.find(g => g.key === 'relation:best').scores, [0, 0, 0, 0]);
      assert.deepEqual(report.body.positions.find(g => g.key === 'position:peer').scores, [0, 0, 0, 0]);
      assert.deepEqual(report.body.respondents.nicknames, ['りん']);
    }
  }

  const duplicate = await request(base + '/answers', { method: 'POST', data: {
    relation: 'best', position: 'peer', visitorId: '1'.padStart(32, '0'), answers,
  } });
  assert.equal(duplicate.status, 409);

  const closeDenied = await request(base + '/status', { method: 'POST', data: { closed: true }, token: '0'.repeat(64) });
  assert.equal(closeDenied.status, 403);
  const close = await request(base + '/status', { method: 'POST', data: { closed: true }, token });
  assert.equal(close.status, 200);
  assert.equal((await request(base)).body.closed, true);
  const blocked = await request(base + '/answers', { method: 'POST', data: {
    relation: 'friend', position: 'none', visitorId: '4'.padStart(32, '0'), answers,
  } });
  assert.equal(blocked.status, 403);

  const reopen = await request(base + '/status', { method: 'POST', data: { closed: false }, token });
  assert.equal(reopen.status, 200);
  assert.equal((await request(base)).body.closed, false);
  assert.equal((await request(base + '/results', { token })).body.count, 3);

  const removed = await request(base, { method: 'DELETE', token, data: { confirmation: 'DELETE' } });
  assert.equal(removed.status, 200);
  assert.equal((await request(base)).status, 404);
  assert.equal((await request(base + '/results', { token })).status, 404);
  console.log('Worker smoke test passed: v3, counts, privacy, duplicate, close, reopen, delete');
} catch (error) {
  console.error('Worker smoke test FAILED:', error);
  console.error('Wrangler log tail:', logs.slice(-6500));
  process.exitCode = 1;
} finally {
  child.kill('SIGTERM');
}
