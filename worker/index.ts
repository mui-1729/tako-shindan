import { DurableObject } from 'cloudflare:workers';
import { normalizeRespondentNickname } from '../src/shared/nickname';
import { axes, canShowGroupScore, isValidAnswers, positions, relations, scoreAnswers, type Position, type Relation, type Report, type GroupSummary } from '../src/shared/diagnosis';

interface Env {
  SURVEYS: DurableObjectNamespace<SurveyRoom>;
  ASSETS: Fetcher;
}

type AggregateRow = { group_key: string; members: number; a0: number; a1: number; a2: number; a3: number };
type SubmitData = { relation: Relation; position: Position; answers: number[]; visitorId: string; nickname?: unknown };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
  });
}

function randomString(bytes: number): string {
  const input = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(input, x => x.toString(16).padStart(2, '0')).join('');
}

async function sha256(value: string): Promise<string> {
  const data = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(data), x => x.toString(16).padStart(2, '0')).join('');
}

function isAllowedRelation(value: unknown): value is Relation {
  return relations.some(x => x.id === value);
}
function isAllowedPosition(value: unknown): value is Position {
  return positions.some(x => x.id === value);
}
function validId(value: string): boolean { return /^[a-f0-9]{24}$/.test(value); }
function errorMessage(e: unknown): string { return e instanceof Error ? e.message : '予期しないエラーが発生しました'; }

/** Each survey link gets its own durable, SQLite-backed room. Only aggregates are retained. */
export class SurveyRoom extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS survey (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT NOT NULL,
        owner_hash TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS survey_versions (
        version INTEGER NOT NULL CHECK (version IN (1, 2, 3))
      );
      CREATE TABLE IF NOT EXISTS survey_flags (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        closed INTEGER NOT NULL DEFAULT 0,
        deleted INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS visitors (
        visitor_hash TEXT PRIMARY KEY
      );
      CREATE TABLE IF NOT EXISTS respondent_names (
        visitor_hash TEXT PRIMARY KEY,
        nickname TEXT NOT NULL,
        submitted_at INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS aggregates (
        group_key TEXT PRIMARY KEY,
        members INTEGER NOT NULL,
        a0 REAL NOT NULL, a1 REAL NOT NULL, a2 REAL NOT NULL, a3 REAL NOT NULL
      );
    `);
  }

  create(name: string, ownerHash: string): boolean {
    const sql = this.ctx.storage.sql;
    if (sql.exec('SELECT id FROM survey WHERE id = 1').toArray().length) return false;
    if (this.isDeleted()) return false;
    sql.exec('INSERT INTO survey (id, name, owner_hash) VALUES (1, ?, ?)', name, ownerHash);
    // A missing record on a preexisting room means it uses the original v1 quiz.
    sql.exec('INSERT INTO survey_versions (version) VALUES (3)');
    return true;
  }

  surveyVersion(): 1 | 2 | 3 {
    const row = this.ctx.storage.sql.exec('SELECT version FROM survey_versions LIMIT 1').toArray()[0] as { version: number } | undefined;
    return row?.version === 3 ? 3 : row?.version === 2 ? 2 : 1;
  }

  flags(): { closed: number; deleted: number } {
    return this.ctx.storage.sql.exec('SELECT closed, deleted FROM survey_flags WHERE id = 1')
      .toArray()[0] as { closed: number; deleted: number } | undefined ?? { closed: 0, deleted: 0 };
  }

  isDeleted(): boolean { return this.flags().deleted === 1; }
  isClosed(): boolean { return this.flags().closed === 1; }

  publicInfo(): { name: string; count: number; version: 1 | 2 | 3; closed: boolean } | null {
    const config = this.ctx.storage.sql.exec('SELECT name FROM survey WHERE id = 1').toArray()[0] as { name: string } | undefined;
    if (!config) return null;
    const total = this.ctx.storage.sql.exec("SELECT members FROM aggregates WHERE group_key = 'all'").toArray()[0] as { members: number } | undefined;
    return { name: config.name, count: total?.members ?? 0, version: this.surveyVersion(), closed: this.isClosed() };
  }

  async submit(payload: SubmitData): Promise<{ accepted: true; count: number } | { accepted: false; reason: 'duplicate' | 'invalid' | 'not_found' | 'closed' }> {
    if (!isAllowedRelation(payload.relation) || !isAllowedPosition(payload.position) || !isValidAnswers(payload.answers) ||
        typeof payload.visitorId !== 'string' || !/^[a-f0-9]{32}$/.test(payload.visitorId)) {
      return { accepted: false, reason: 'invalid' };
    }
    if (!this.publicInfo()) return { accepted: false, reason: 'not_found' };
    if (this.isClosed()) return { accepted: false, reason: 'closed' };
    const nickname = normalizeRespondentNickname(payload.nickname);
    const scores = scoreAnswers(payload.answers, this.surveyVersion());
    const fingerprint = await sha256(`${this.ctx.id.toString()}:${payload.visitorId}`);
    let alreadyAnswered = false;
    let becameClosed = false;
    this.ctx.storage.transactionSync(() => {
      const sql = this.ctx.storage.sql;
      // Close and submit cannot race: re-check while entering the storage transaction.
      if (this.isClosed()) { becameClosed = true; return; }
      const inserted = sql.exec('INSERT OR IGNORE INTO visitors (visitor_hash) VALUES (?)', fingerprint);
      if (inserted.rowsWritten === 0) { alreadyAnswered = true; return; }
      if (nickname) {
        // Opt-in recognition only: no relationship, scores or answers attached.
        sql.exec('INSERT INTO respondent_names (visitor_hash, nickname, submitted_at) VALUES (?, ?, ?)',
          fingerprint, nickname, Date.now());
      }
      for (const key of ['all', `relation:${payload.relation}`, `position:${payload.position}`]) {
        sql.exec(`INSERT INTO aggregates (group_key, members, a0, a1, a2, a3) VALUES (?, 1, ?, ?, ?, ?)
          ON CONFLICT(group_key) DO UPDATE SET
          members = members + 1, a0 = a0 + excluded.a0, a1 = a1 + excluded.a1,
          a2 = a2 + excluded.a2, a3 = a3 + excluded.a3`, key, ...scores);
      }
    });
    if (becameClosed) return { accepted: false, reason: 'closed' };
    if (alreadyAnswered) return { accepted: false, reason: 'duplicate' };
    return { accepted: true, count: this.publicInfo()?.count ?? 0 };
  }


  private async authorize(token: string): Promise<'ok' | 'not_found' | 'forbidden'> {
    const config = this.ctx.storage.sql.exec('SELECT owner_hash FROM survey WHERE id = 1')
      .toArray()[0] as { owner_hash: string } | undefined;
    if (!config) return 'not_found';
    if (typeof token !== 'string' || token.length !== 64 || await sha256(token) !== config.owner_hash) return 'forbidden';
    return 'ok';
  }

  async setClosed(token: string, closed: boolean): Promise<'ok' | 'not_found' | 'forbidden'> {
    const auth = await this.authorize(token);
    if (auth !== 'ok') return auth;
    this.ctx.storage.sql.exec(`INSERT INTO survey_flags (id, closed, deleted) VALUES (1, ?, 0)
      ON CONFLICT(id) DO UPDATE SET closed=excluded.closed WHERE deleted=0`, closed ? 1 : 0);
    return 'ok';
  }

  async deleteSurvey(token: string): Promise<'ok' | 'not_found' | 'forbidden'> {
    const auth = await this.authorize(token);
    if (auth !== 'ok') return auth;
    this.ctx.storage.transactionSync(() => {
      const sql = this.ctx.storage.sql;
      // A persistent tombstone prevents reusing this room after irreversible deletion.
      sql.exec('INSERT INTO survey_flags (id, closed, deleted) VALUES (1, 1, 1) ON CONFLICT(id) DO UPDATE SET closed=1, deleted=1');
      sql.exec('DELETE FROM respondent_names');
      sql.exec('DELETE FROM visitors');
      sql.exec('DELETE FROM aggregates');
      sql.exec('DELETE FROM survey_versions');
      sql.exec('DELETE FROM survey');
    });
    return 'ok';
  }

  async results(token: string): Promise<Report | null | 'forbidden'> {
    const auth = await this.authorize(token);
    if (auth === 'not_found') return null;
    if (auth === 'forbidden') return 'forbidden';
    const config = this.ctx.storage.sql.exec('SELECT name FROM survey WHERE id = 1').toArray()[0] as { name: string };
    const rows = this.ctx.storage.sql.exec('SELECT group_key, members, a0, a1, a2, a3 FROM aggregates').toArray() as AggregateRow[];
    const named = this.ctx.storage.sql.exec('SELECT COUNT(*) as n FROM respondent_names').toArray()[0] as { n: number };
    const respondents = this.ctx.storage.sql.exec('SELECT nickname FROM respondent_names ORDER BY submitted_at DESC LIMIT 100')
      .toArray() as { nickname: string }[];
    const groups = new Map(rows.map(row => [row.group_key, row]));
    const summary = (key: string): GroupSummary => {
      const row = groups.get(key);
      if (!row) return { key, count: 0, scores: null };
      return {
        key,
        count: row.members,
        scores: canShowGroupScore(row.members) ? axes.map((_, i) =>
          Math.round((row[`a${i}` as keyof AggregateRow] as number) / row.members)) : null,
      };
    };
    const total = summary('all');
    return {
      name: config.name,
      count: total.count,
      version: this.surveyVersion(),
      closed: this.isClosed(),
      total,
      relations: relations.map(r => summary(`relation:${r.id}`)),
      positions: positions.map(p => summary(`position:${p.id}`)),
      respondents: { namedCount: named.n, nicknames: respondents.map(row => row.nickname) },
    };
  }
}

async function parseBody(request: Request): Promise<unknown> {
  const body = await request.text();
  if (body.length > 4000) throw new Error('データが大きすぎます');
  try { return JSON.parse(body); } catch { throw new Error('JSONの形式が正しくありません'); }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    // Social crawlers do not run the React app. Re-write metadata for each public share link.
    if (request.method === 'GET' && segments[0] === 's' && segments.length === 2 && validId(segments[1])) {
      const page = await env.ASSETS.fetch(request);
      if (!page.headers.get('content-type')?.includes('text/html')) return page;
      const info = await env.SURVEYS.getByName(segments[1]).publicInfo();
      if (!info) return page;
      const title = `${info.name}ってどんな人？ | たこしんだん`;
      const description = `${info.name}を診断してみよう！ 仲良しや先輩・後輩から見た意外な一面が分かる、8問の他己診断。`;
      const rewrite = new HTMLRewriter()
        .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', title); } })
        .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', description); } })
        .on('meta[name="description"]', { element(e) { e.setAttribute('content', description); } })
        .on('meta[property="og:url"]', { element(e) { e.setAttribute('content', url.origin + url.pathname); } });
      const headers = new Headers(page.headers);
      headers.set('cache-control', 'no-store');
      headers.set('x-robots-tag', 'noindex, nofollow');
      return rewrite.transform(new Response(page.body, { status: page.status, headers }));
    }
    if (segments[0] !== 'api') return env.ASSETS.fetch(request);
    if (request.method === 'POST' && segments.length === 2 && segments[1] === 'surveys') {
      try {
        const data = await parseBody(request) as { name?: unknown };
        const name = typeof data?.name === 'string' ? data.name.trim() : '';
        if (name.length < 1 || name.length > 24) return json({ error: '名前は1〜24文字で入力してください' }, 400);
        const id = randomString(12);
        const token = randomString(32);
        const stub = env.SURVEYS.getByName(id);
        const created = await stub.create(name, await sha256(token));
        if (!created) return json({ error: 'URLの作成に失敗しました' }, 500);
        return json({ id, token, name }, 201);
      } catch (e) { return json({ error: errorMessage(e) }, 400); }
    }
    if (segments.length >= 3 && segments[1] === 'surveys' && validId(segments[2])) {
      const stub = env.SURVEYS.getByName(segments[2]);
      if (request.method === 'GET' && segments.length === 3) {
        const info = await stub.publicInfo();
        return info ? json(info) : json({ error: '診断リンクが見つかりません' }, 404);
      }
      if (request.method === 'POST' && segments.length === 4 && segments[3] === 'status') {
        try {
          const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
          const body = await parseBody(request) as { closed?: unknown };
          if (typeof body?.closed !== 'boolean') return json({ error: '停止状態が正しくありません' }, 400);
          const result = await stub.setClosed(token, body.closed);
          return result === 'ok' ? json({ closed: body.closed }) :
            json({ error: result === 'forbidden' ? '管理リンクが正しくありません' : '診断リンクが見つかりません' },
              result === 'forbidden' ? 403 : 404);
        } catch (e) { return json({ error: errorMessage(e) }, 400); }
      }
      if (request.method === 'DELETE' && segments.length === 3) {
        try {
          const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
          const body = await parseBody(request) as { confirmation?: unknown };
          if (body?.confirmation !== 'DELETE') return json({ error: '削除確認が必要です' }, 400);
          const result = await stub.deleteSurvey(token);
          return result === 'ok' ? json({ deleted: true }) :
            json({ error: result === 'forbidden' ? '管理リンクが正しくありません' : '診断リンクが見つかりません' },
              result === 'forbidden' ? 403 : 404);
        } catch (e) { return json({ error: errorMessage(e) }, 400); }
      }
      if (request.method === 'POST' && segments.length === 4 && segments[3] === 'answers') {
        try {
          const data = await parseBody(request) as SubmitData;
          const result = await stub.submit(data);
          if (result.accepted) return json(result, 201);
          if (result.reason === 'duplicate') return json({ error: 'このブラウザでは回答済みです' }, 409);
          if (result.reason === 'closed') return json({ error: 'この診断は回答受付を停止しています' }, 403);
          return json({ error: result.reason === 'not_found' ? '診断リンクが見つかりません' : '回答内容が正しくありません' }, result.reason === 'not_found' ? 404 : 400);
        } catch (e) { return json({ error: errorMessage(e) }, 400); }
      }
      if (request.method === 'GET' && segments.length === 4 && segments[3] === 'results') {
        const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
        const report = await stub.results(token);
        if (report === 'forbidden') return json({ error: '管理リンクが正しくありません' }, 403);
        return report ? json(report) : json({ error: '診断リンクが見つかりません' }, 404);
      }
    }
    return json({ error: 'APIが見つかりません' }, 404);
  },
} satisfies ExportedHandler<Env>;
