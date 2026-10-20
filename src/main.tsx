import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { characterImage } from './shared/characterArt';
import { observedTendencies, resultSampleNote, storyFromScores } from './shared/resultNarrative';
import { MIN_PUBLIC_GROUP, axesForVersion, canShowGroupScore, characterFromScores, isValidAnswers, positions, questionsForVersion, relations, scoreAnswers, type DiagnosisVersion, type GroupSummary, type Position, type Relation, type Report } from './shared/diagnosis';
import './styles.css';

type PublicInfo = { name: string; count: number; version: DiagnosisVersion; closed?: boolean };
type Created = { id: string; token: string; name: string };
type LocalSurvey = { name: string; ownerUrl: string; shareUrl: string };

function api<T>(path: string, options?: RequestInit): Promise<T> {
  return fetch(`/api${path}`, { ...options, headers: { 'content-type': 'application/json', ...options?.headers } }).then(async response => {
    const data = await response.json() as T & { error?: string };
    if (!response.ok) throw new Error(data.error || '通信に失敗しました');
    return data;
  });
}
function copy(text: string) { return navigator.clipboard.writeText(text); }
function getLocalSurveys(): LocalSurvey[] {
  try { return JSON.parse(localStorage.getItem('tako_surveys') || '[]') as LocalSurvey[]; } catch { return []; }
}
function saveLocalSurvey(survey: LocalSurvey) {
  try { localStorage.setItem('tako_surveys', JSON.stringify([survey, ...getLocalSurveys()].slice(0, 10))); } catch { /* storage optional */ }
}
function visitorIdFor(surveyId: string): string {
  const key = `tako_visitor_${surveyId}`;
  try {
    const old = localStorage.getItem(key);
    if (old && /^[a-f0-9]{32}$/.test(old)) return old;
  } catch { /* storage may be unavailable */ }
  const value = Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2, '0')).join('');
  try { localStorage.setItem(key, value); } catch { /* duplicate prevention then becomes best-effort */ }
  return value;
}
function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="app-shell"><header className="header container"><a className="logo" href="/"><span className="logo-icon">🐙</span> たこしんだん<span className="logo-sub">TAKO SHINDAN</span></a><span className="header-tag">みんなから見たわたし</span></header><main className="container main">{children}</main><footer className="footer container">あの人から見たあなたを、ちょっとだけ知ってみる。<span>これはエンタメ診断です。性格を断定するものではありません。</span></footer></div>;
}
function ToastButton({ text, label, className = '' }: { text: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  return <button className={`button ${className}`} onClick={async () => { try { await copy(text); setDone(true); window.setTimeout(() => setDone(false), 2200); } catch { window.prompt('こちらのURLをコピーしてください', text); } }}>{done ? '✓ コピーしました' : label}</button>;
}
function CharacterDisplay({ scores, target, perspective, version = 2 }: { scores: number[]; target?: string; perspective?: string; version?: DiagnosisVersion }) {
  const ch = characterFromScores(scores, version);
  const story = storyFromScores(scores, version);
  return <div className="character-card" style={{ '--character-color': ch.color } as React.CSSProperties}>
    <div className="character-topline">FROM MY POINT OF VIEW <span>TYPE {ch.code}</span></div>
    <div className="character-illustration"><img src={characterImage(ch.index, version)} alt={`${ch.title}のタコキャラクター`} width="290" height="290" /></div>
    <p className="character-kicker">{target ? `${perspective || 'みんな'}から見た${target}` : 'あなたから見たこの人'}</p>
    <h2>{ch.title}</h2>
    {story && <p className="character-tagline">{story.tagline}</p>}
    <p className="character-desc">{ch.description}</p>
    {story && <div className="character-traits">{story.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
    <div className="character-footer">TAKO SHINDAN <span>✦ MY CHARACTER ✦</span></div>
  </div>;
}
function Bars({ scores, version = 2 }: { scores: number[]; version?: DiagnosisVersion }) {
  return <div className="bars">{axesForVersion(version).map((axis, index) => <div className="bar-row" key={axis.name}>
    <div className="bar-title"><b>{axis.icon} {axis.name}</b><span>{Math.round(scores[index])} / 100</span></div>
    <div className="bar-track"><span style={{ width: `${scores[index]}%` }} /></div>
    <div className="bar-ends"><span>{axis.left}</span><span>{axis.right}</span></div>
  </div>)}</div>;
}
function TypeDeepDive({ scores, version = 2, count }: { scores: number[]; version?: DiagnosisVersion; count?: number }) {
  const story = storyFromScores(scores, version);
  if (!story) return null;
  const tendencies = observedTendencies(scores, version);
  return <div className="type-deep-dive">
    <div className="section-label">✦ BEYOND THE TYPE</div>
    <h3>もっと詳しく見ると…</h3>
    <p className="type-story-impression">{story.impression}</p>
    <div className="story-points">
      <div><span>✨ こんな場面で輝く</span><p>{story.scene}</p></div>
      <div><span>🔎 意外な一面</span><p>{story.surprise}</p></div>
    </div>
    {tendencies.length > 0 && <div className="type-observations">
      <b>特に印象に出ているところ</b>
      {tendencies.slice(0, 2).map(t => <p key={t.axis}><strong>{t.axis}</strong> — {t.phrase}</p>)}
    </div>}
    {count !== undefined && <p className="micro">{resultSampleNote(count)}</p>}
    <p className="micro">診断は周囲が見た行動の傾向を遊びとして表現したもの。人柄や能力を確定するものではありません。</p>
  </div>;
}
function Home() {
  const [name, setName] = useState('');
  const [created, setCreated] = useState<Created | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const surveys = getLocalSurveys();
  const shareUrl = created ? `${location.origin}/s/${created.id}` : '';
  const ownerUrl = created ? `${location.origin}/manage/${created.id}#token=${created.token}` : '';
  async function create(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!name.trim() || name.trim().length > 24) return setError('名前は1〜24文字で入力してね');
    setCreating(true);
    try {
      const result = await api<Created>('/surveys', { method: 'POST', body: JSON.stringify({ name: name.trim() }) });
      setCreated(result);
      saveLocalSurvey({ name: result.name, shareUrl: `${location.origin}/s/${result.id}`, ownerUrl: `${location.origin}/manage/${result.id}#token=${result.token}` });
    } catch (err) { setError(err instanceof Error ? err.message : '作成できませんでした'); }
    finally { setCreating(false); }
  }
  return <PageShell>
    <div className="hero"><div className="hero-copy"><div className="eyebrow">✦ SELF × OTHERS PERSONALITY ✦</div><h1>あなたって、<br/><em>どんな人？</em></h1><p>親友から見たあなた。先輩から見たあなた。<br/>同じ自分なのに、ちがうキャラが見えてくる。</p><div className="tag-row"><span>🎭 全16タイプ</span><span>📝 約1分</span><span>💌 ログイン不要</span></div></div><div className="hero-visual"><div className="orbit orbit-one">🐙</div><div className="orbit orbit-two">🦊</div><div className="orbit orbit-three">🐰</div><span className="orbit-star star-one">✳</span><span className="orbit-star star-two">✴</span></div></div>
    <section className="panel create-panel">
      {!created ? <><div className="section-label">01 / START</div><h2>自分の診断リンクを作ろう</h2><p className="subtle">ニックネームを入力するだけ。友達に送って診断してもらおう！</p><form onSubmit={create} className="create-form"><label htmlFor="name">診断される人の名前</label><input id="name" maxLength={24} value={name} onChange={e => setName(e.target.value)} placeholder="例：たろう" required/><button className="button primary" type="submit" disabled={creating}>{creating ? '作成中…' : '診断リンクを作る →'}</button></form>{error && <p className="alert" role="alert">{error}</p>}</> : <><div className="section-label">✓ LINK CREATED</div><h2>{created.name}の診断リンクができた！</h2><p className="subtle">まずは友達に回答用リンクを送ってね。</p><div className="url-box">{shareUrl}</div><ToastButton text={shareUrl} label="🔗 回答用リンクをコピー" className="primary block"/><div className="soft-box"><b>🔐 あなた専用の管理リンク</b><p>友達の回答を集計するためのリンク。これを他人には送らないでね。</p><ToastButton text={ownerUrl} label="管理リンクをコピー" className="outline"/><a className="text-link" href={ownerUrl}>集計ページを開く →</a></div><button className="link-button" onClick={() => { setCreated(null); setName(''); }}>別のリンクを作る</button></>}
    </section>
    <div className="steps-grid">{[{ n: '01', icon: '🔗', title: 'リンクを作る', text: '名前を入れて、SNSで友達に共有。' }, { n: '02', icon: '🗳️', title: '友達が診断', text: '関係性2問と性格8問に回答。' }, { n: '03', icon: '🎉', title: 'キャラがわかる', text: '16タイプから自分の印象を発見！' }].map(s => <div className="step-card" key={s.n}><span>{s.n} / {s.icon}</span><h3>{s.title}</h3><p>{s.text}</p></div>)}</div>
    {surveys.length > 0 && <section className="my-links"><h3>📌 この端末で作った診断</h3><div className="saved-links">{surveys.map((s, i) => <a key={`${s.ownerUrl}-${i}`} href={s.ownerUrl}>{s.name}の集計を見る <span>↗</span></a>)}</div><p className="micro">保存はこのブラウザ内だけ。端末を変える場合は管理リンクを保管してね。</p></section>}
  </PageShell>;
}
function Survey({ id }: { id: string }) {
  const [info, setInfo] = useState<PublicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  const [relation, setRelation] = useState<Relation | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [respondentNickname, setRespondentNickname] = useState('');
  const [answers, setAnswers] = useState<number[]>(Array(8).fill(-1));
  const [answered, setAnswered] = useState<boolean[]>(Array(8).fill(false));
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState(false);
  const [resultScores, setResultScores] = useState<number[]>([]);
  const version: DiagnosisVersion = info?.version === 1 ? 1 : info?.version === 2 ? 2 : 3;
  const surveyQuestions = questionsForVersion(version);
  useEffect(() => { api<PublicInfo>(`/surveys/${id}`).then(setInfo).catch(e => setError(e.message)).finally(() => setLoading(false)); }, [id]);
  const optionSelected = step === 0 ? relation !== null : step === 1 ? position !== null : answered[step - 2];
  const canFinish = isValidAnswers(answers);
  const canSkip = step >= 2;
  async function next() {
    setError('');
    if (!optionSelected) return;
    if (step < 9) { setStep(step + 1); return; }
    if (!canFinish || !relation || !position) { setError('回答は各軸1問以上、合計6問以上必要です。前の質問に戻って回答してね。'); return; }
    setSubmitting(true);
    try {
      await api(`/surveys/${id}/answers`, { method: 'POST', body: JSON.stringify({ relation, position, answers, visitorId: visitorIdFor(id), nickname: respondentNickname.trim() }) });
      setResultScores(scoreAnswers(answers, version)); setFinished(true);
    } catch (e) { setError(e instanceof Error ? e.message : '送信できませんでした'); }
    finally { setSubmitting(false); }
  }
  const perspective = relation ? relations.find(r => r.id === relation)?.label : '友達';
  if (loading) return <PageShell><div className="panel centered"><h2>読み込み中… 🐙</h2></div></PageShell>;
  if (!info) return <PageShell><div className="panel centered"><h2>診断リンクが見つかりません</h2><p className="alert">{error}</p><a href="/" className="button primary">トップへ戻る</a></div></PageShell>;
  if (info.closed) return <PageShell><div className="panel centered"><h2>🔒 この診断は回答受付を停止中</h2><p>作成者が再開すると回答できるようになるよ。</p><a href="/" className="button outline">トップへ戻る</a></div></PageShell>;
  if (finished) return <PageShell><div className="result-layout"><div><div className="eyebrow">✦ RESULT</div><h1 className="result-heading">{info.name}は、<br/>こんな人だった！</h1><CharacterDisplay scores={resultScores} target={info.name} perspective={perspective} version={version}/><p className="micro">※ 16種類のオリジナルキャラクターは今後さらにデザインを調整する予定です。</p></div><section className="panel result-details"><h2>あなたから見た{info.name}</h2><p className="subtle">関係：{perspective} ／ 立場：{positions.find(p => p.id === position)?.label}</p><Bars scores={resultScores} version={version}/><TypeDeepDive scores={resultScores} version={version}/><p className="micro">4軸それぞれの0〜100点は優劣ではなく傾向を表します。心理検査ではありません。</p><ToastButton text={`${perspective}から見た${info.name}は「${characterFromScores(resultScores,version).title}」だった！🐙\n${location.origin}/s/${id}`} label="結果をシェアする文章をコピー" className="primary block"/><button className="button outline block" onClick={() => downloadResultCard(info.name, perspective || '', resultScores, version)}>🖼️ 結果カード画像を保存</button><a className="button outline block" href="/">自分の診断リンクも作る →</a></section></div></PageShell>;
  const currentQ = surveyQuestions[step - 2];
  return <PageShell><div className="survey-layout"><div className="survey-intro"><div className="eyebrow">✦ FROM YOUR POINT OF VIEW</div><h1><em>{info.name}</em>って<br/>どんな人？</h1><p>あなたから見た印象を教えてね。<br/>正解・不正解はないよ！</p><div className="respondent-field"><label htmlFor="respondent-name">あなたのニックネーム（任意）</label><input id="respondent-name" value={respondentNickname} onChange={e => setRespondentNickname(e.target.value)} maxLength={20} placeholder="例：りん / 空欄なら匿名"/><p>入力した名前は診断される本人の管理画面に表示されます。回答内容やタイプは公開されません。</p></div><div className="mini-characters">🦊 🐙 🐰</div><p className="micro">現在 {info.count} 人が回答済み</p></div><section className="panel question-panel"><div className="question-meta"><span>{step < 2 ? '関係性について' : '性格について'}</span><strong>{step + 1} <small>/ 10</small></strong></div><div className="progress-track"><span style={{ width: `${(step + 1) * 10}%` }}/></div>{step === 0 ? <><h2>この人とはどんな関係？</h2><p className="subtle">一番近いものを選んでね</p><div className="option-list">{relations.map(r => <button key={r.id} className={`option ${relation === r.id ? 'selected' : ''}`} onClick={() => setRelation(r.id)}><span>{r.emoji} {r.label}</span><b>{relation === r.id ? '✓' : '○'}</b></button>)}</div></> : step === 1 ? <><h2>あなたは、この人の？</h2><p className="subtle">自分から見た立場を選んでね</p><div className="option-list">{positions.map(p => <button key={p.id} className={`option ${position === p.id ? 'selected' : ''}`} onClick={() => setPosition(p.id)}><span>{p.emoji} {p.label}</span><b>{position === p.id ? '✓' : '○'}</b></button>)}</div><p className="micro">例：自分が後輩なら「後輩」。結果は「後輩から見たあなた」と集計されます。</p></> : <><span className="axis-caption">{axesForVersion(version)[currentQ.axis].icon} {axesForVersion(version)[currentQ.axis].name}</span><h2>Q{step - 1}. {currentQ.question}</h2><div className="option-list">{currentQ.options.map((o, i) => <button key={i} className={`option ${answered[step - 2] && answers[step - 2] === i ? 'selected' : ''}`} onClick={() => { setAnswers(p => p.map((a, j) => j === step - 2 ? i : a)); setAnswered(p => p.map((a, j) => j === step - 2 ? true : a)); }}><span>{o.label}</span><b>{answered[step - 2] && answers[step - 2] === i ? '✓' : '○'}</b></button>)}</div>{canSkip && <button className={`skip-button ${answered[step - 2] && answers[step - 2] === -1 ? 'chosen' : ''}`} onClick={() => { setAnswers(p => p.map((a, j) => j === step - 2 ? -1 : a)); setAnswered(p => p.map((a, j) => j === step - 2 ? true : a)); }}>わからない・判断できない</button>}</>}
      {error && <p className="alert" role="alert">{error}</p>}
      <div className="question-actions"><button className="button outline" disabled={step === 0 || submitting} onClick={() => { setStep(s => s - 1); setError(''); }}>← 戻る</button><button className="button primary" disabled={!optionSelected || submitting} onClick={next}>{submitting ? '送信中…' : step === 9 ? '結果を見る ✨' : '次へ →'}</button></div>
    </section></div></PageShell>;
}
function CategoryGroup({ title, summaries, options, version = 2 }: { title: string; summaries: GroupSummary[]; options: readonly { id: string; label: string; emoji: string }[]; version?: DiagnosisVersion }) {
  const active = summaries.map(s => ({ ...s, option: options.find(o => s.key.endsWith(`:${o.id}`)) })).filter(s => s.count > 0);
  return <section className="panel result-section"><h3>{title}</h3>{active.length ? <div className="group-list">{active.map(s => <div className="group-card" key={s.key}><div className="group-title"><b>{s.option?.emoji} {s.option?.label}</b><span>{s.count}人</span></div>{s.scores ? <><p className="group-type">{characterFromScores(s.scores, version).emoji} {characterFromScores(s.scores, version).title}</p><p className="group-story">{storyFromScores(s.scores, version)?.tagline}</p><Bars scores={s.scores} version={version}/>{s.count < 6 && <p className="micro">少人数の結果です。回答が増えると傾向が変わることがあります。</p>}</> : <p className="micro">{MIN_PUBLIC_GROUP}人以上集まるとタイプとスコアを表示します。</p>}</div>)}</div> : <p className="subtle">この分類の回答はまだありません。</p>}</section>;
}
function MultiPerspectiveProfile({ report }: { report: Report }) {
  if (!report.total.scores) return null;
  const axisLabels = axesForVersion(report.version);
  const available = [
    { title: '関係性', rows: report.relations, options: relations },
    { title: '立場', rows: report.positions, options: positions },
  ];
  type Difference = { axis: number; difference: number; group: string; low: string; high: string; lowScore: number; highScore: number };
  const comparisons: Difference[] = [];
  for (const category of available) {
    const visible = category.rows
      .filter(r => r.scores !== null && canShowGroupScore(r.count))
      .map(r => ({ ...r, scores: r.scores!, label: category.options.find(o => r.key.endsWith(':' + o.id))?.label || r.key }));
    if (visible.length < 2) continue;
    for (let axis = 0; axis < axisLabels.length; axis++) {
      const sorted = [...visible].sort((a, b) => a.scores[axis] - b.scores[axis]);
      const low = sorted[0], high = sorted[sorted.length - 1];
      comparisons.push({ axis, difference: Math.round(high.scores[axis] - low.scores[axis]), group: category.title,
        low: low.label, high: high.label, lowScore: Math.round(low.scores[axis]), highScore: Math.round(high.scores[axis]) });
    }
  }
  comparisons.sort((a, b) => b.difference - a.difference);
  const biggest = comparisons[0];
  const core = characterFromScores(report.total.scores, report.version);
  const personality = biggest && biggest.difference >= 20 ? 'いろんな顔を持つタイプ' :
    comparisons.length ? 'どこでも自分らしいタイプ' : 'これから見えてくるタイプ';
  return <section className="panel multi-perspective">
    <div className="section-label">✦ YOUR COMPLETE PORTRAIT</div>
    <h2>みんなの視点を重ねた、あなたの輪郭</h2>
    <p className="subtle">あなたを知る一人ひとりの印象を、1回答につき1票としてまとめた最終プロフィール。</p><p className="micro">{resultSampleNote(report.count)}</p>
    <div className="identity-summary">
      <div><span className="identity-label">最終キャラクター</span><strong>{core.title}</strong></div>
      <div><span className="identity-label">印象の広がり</span><strong>{personality}</strong></div>
    </div>
    {biggest ? <div className="identity-difference">
      <b>🔎 {biggest.group}によって最も印象が違うのは「{axisLabels[biggest.axis].name}」</b>
      <p>「{biggest.low}」からは{axisLabels[biggest.axis].left}寄り（{biggest.lowScore}点）、
      「{biggest.high}」からは{axisLabels[biggest.axis].right}寄り（{biggest.highScore}点）に見られているよ。</p>
      <p className="micro">この差は関係性ごとの平均値の比較で、個人の回答や真の性格を示すものではありません。特に人数が少ないグループでは参考程度に見てね。</p>
    </div> : <p className="micro">関係性や立場ごとに{MIN_PUBLIC_GROUP}人以上の回答が2グループ集まると、どの視点で印象が違うのかを比較できるよ。</p>}
    <p className="micro">診断結果は娯楽用の印象分析です。性格を科学的に確定するものではありません。</p>
  </section>;
}
function Manage({ id }: { id: string }) {
  const token = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token') || '';
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const shareUrl = `${location.origin}/s/${id}`;
  async function changeStatus() {
    if (!report || working) return;
    setWorking(true);
    try {
      await api(`/surveys/${id}/status`, { method: 'POST', headers: { authorization: `Bearer ${token}` },
        body: JSON.stringify({ closed: !report.closed }) });
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : '受付状態を変更できませんでした'); }
    finally { setWorking(false); }
  }
  async function deleteSurvey() {
    if (working || !window.confirm('この診断と回答データをすべて削除します。元に戻せません。本当に削除しますか？')) return;
    if (!window.confirm('最終確認です。回答やニックネームも完全に削除しますか？')) return;
    setWorking(true);
    try {
      await api(`/surveys/${id}`, { method: 'DELETE', headers: { authorization: `Bearer ${token}` },
        body: JSON.stringify({ confirmation: 'DELETE' }) });
      try {
        const saved = getLocalSurveys().filter(s => s.ownerUrl !== location.href);
        localStorage.setItem('tako_surveys', JSON.stringify(saved));
      } catch { /* best effort */ }
      location.assign('/');
    } catch (e) { setError(e instanceof Error ? e.message : '削除できませんでした'); setWorking(false); }
  }
  async function load() {
    setLoading(true);
    try { const data = await api<Report>(`/surveys/${id}/results`, { headers: { authorization: `Bearer ${token}` } }); setReport(data); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'データを取得できませんでした'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id, token]);
  return <PageShell><div className="manage-header"><div><div className="eyebrow">✦ YOUR RESULTS</div><h1>みんなから見た<br/><em>{report?.name || 'あなた'}</em></h1><p>友達からの回答が集まるほど、見えてくる一面も増えていく。</p></div><div className="count-bubble"><span>回答人数</span><strong>{report?.count ?? '—'}</strong><small>人</small></div></div>{loading ? <div className="panel centered">読み込み中…</div> : error ? <div className="panel centered"><h2>集計を表示できません</h2><p className="alert">{error}</p><p className="micro">作成時の管理リンクを使って開いてね。</p></div> : report && <>
    <div className="manage-actions"><ToastButton text={shareUrl} label="🔗 回答用リンクをコピー" className="primary"/><button className="button outline" onClick={() => void load()}>↻ 集計を更新</button></div>
    <div className="manage-controls"><div><b>{report.closed ? '🔒 回答受付を停止中' : '🟢 回答受付中'}</b><p className="micro">受付を停止しても集計結果は残り、あとから再開できるよ。</p></div><button className="button outline" disabled={working} onClick={() => void changeStatus()}>{report.closed ? '受付を再開' : '受付を一時停止'}</button></div>
    {report.total.scores ? <div className="result-layout"><CharacterDisplay scores={report.total.scores} target={report.name} perspective="みんな" version={report.version}/><section className="panel result-details"><h2>全体の印象</h2><Bars scores={report.total.scores} version={report.version}/><TypeDeepDive scores={report.total.scores} version={report.version} count={report.count}/><p className="micro">全員の回答を1人1票で集計しています。値は集計スコアの平均です。</p></section></div> : <section className="panel waiting-panel"><div className="waiting-icon">💌</div><h2>あと {Math.max(0, MIN_PUBLIC_GROUP - report.count)} 人で結果が見られる！</h2><p>回答が{MIN_PUBLIC_GROUP}人集まったら総合結果を公開するよ。少人数の集計なので印象にはばらつきがあるよ。</p></section>}
    {report.total.scores && <MultiPerspectiveProfile report={report} />}
    {report.respondents && <section className="panel respondent-list"><div className="section-label">✦ THANK YOU FOR ANSWERING</div><h2>💌 回答してくれた人</h2><p className="subtle">ニックネームを入力した {report.respondents.namedCount} 人 / 匿名 {Math.max(0, report.count - report.respondents.namedCount)} 人</p>{report.respondents.nicknames.length > 0 ? <div className="respondent-chips">{report.respondents.nicknames.map((name, i) => <span key={i}>{name}</span>)}</div> : <p className="micro">まだニックネーム付きの回答はありません。</p>}{report.respondents.namedCount > report.respondents.nicknames.length && <p className="micro">最新100件のニックネームを表示しています。</p>}<p className="micro">ニックネームは回答者が希望した場合だけ表示。誰がどの選択肢を選んだかは分かりません。</p></section>}
    <div className="result-groups"><CategoryGroup title="💗 関係性ごとの印象" summaries={report.relations} options={relations} version={report.version}/><CategoryGroup title="🎓 立場ごとの印象" summaries={report.positions} options={positions} version={report.version}/></div>
    <div className="soft-box managing-note"><b>🔐 管理リンクを大切に</b><p>管理リンクを知っている人は集計を閲覧できます。なくしても再発行できません。回答者ごとの個別回答は保存・表示していません。</p></div>
    <div className="danger-zone"><div><b>診断を完全に削除</b><p className="micro">診断リンク・集計・回答者のニックネームを消去します。この操作は取り消せません。</p></div><button className="button outline" disabled={working} onClick={() => void deleteSurvey()}>診断を削除</button></div>
  </>}</PageShell>;
}

async function downloadResultCard(target: string, relation: string, scores: number[], version: DiagnosisVersion = 2) {
  const c = characterFromScores(scores, version);
  const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  ctx.fillStyle = '#fff8ee'; ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = c.color; ctx.beginPath(); ctx.roundRect(66, 72, 948, 1196, 55); ctx.fill();
  ctx.fillStyle = '#fff9f0'; ctx.beginPath(); ctx.roundRect(93, 99, 894, 1142, 42); ctx.fill();
  ctx.fillStyle = '#756b72'; ctx.textAlign = 'center'; ctx.font = 'bold 30px sans-serif'; ctx.fillText('TAKO SHINDAN ✦ FROM MY POINT OF VIEW', 540, 185);
  const mascot = new Image();
  mascot.src = characterImage(c.index,version);
  await new Promise<void>(resolve => { mascot.onload = () => resolve(); mascot.onerror = () => resolve(); if (mascot.complete) resolve(); });
  if (mascot.naturalWidth) ctx.drawImage(mascot, 358, 246, 365, 365);
  else { ctx.font = '240px "Apple Color Emoji", "Segoe UI Emoji", sans-serif'; ctx.fillText(c.emoji, 540, 500); }
  ctx.fillStyle = '#4a3945'; ctx.font = 'bold 43px sans-serif'; ctx.fillText(`${relation}から見た${target.slice(0, 12)}`, 540, 638);
  ctx.font = 'bold 62px sans-serif'; ctx.fillText(c.title, 540, 752, 830);
  ctx.font = '32px sans-serif'; ctx.fillStyle = '#665966';
  const words = Array.from(c.description); const length = 25;
  for (let i = 0; i < words.length; i += length) ctx.fillText(words.slice(i, i + length).join(''), 540, 846 + (i / length) * 48);
  ctx.fillStyle = '#bdaec0'; ctx.fillRect(180, 1050, 720, 2);
  ctx.font = 'bold 28px sans-serif'; ctx.fillStyle = '#756b72'; ctx.fillText('あの人から見たあなたは、どんなキャラ？', 540, 1130);
  ctx.fillText('tako-shindan', 540, 1190);
  canvas.toBlob(blob => { if (!blob) return; const anchor = document.createElement('a'); const url = URL.createObjectURL(blob); anchor.href = url; anchor.download = 'tako-shindan-result.png'; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 5000); }, 'image/png');
}

function App() {
  const path = window.location.pathname.split('/').filter(Boolean);
  if (path[0] === 's' && /^[a-f0-9]{24}$/.test(path[1] || '')) return <Survey id={path[1]}/>;
  if (path[0] === 'manage' && /^[a-f0-9]{24}$/.test(path[1] || '')) return <Manage id={path[1]}/>;
  return <Home/>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
