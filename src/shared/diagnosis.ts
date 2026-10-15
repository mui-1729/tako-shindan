/** Shared by the browser and Worker; never relies on a server-side secret. */
export const relations = [
  { id: 'best', label: '親友', emoji: '💞' },
  { id: 'friend', label: '友達', emoji: '🤝' },
  { id: 'lover', label: '恋人', emoji: '💌' },
  { id: 'sns', label: 'SNSの知り合い', emoji: '📱' },
  { id: 'acquaintance', label: '知り合い', emoji: '👋' },
] as const;
export const positions = [
  { id: 'senior', label: '先輩', emoji: '🌟' },
  { id: 'peer', label: '同期・同級生', emoji: '🎒' },
  { id: 'junior', label: '後輩', emoji: '🌱' },
  { id: 'none', label: '該当なし', emoji: '✨' },
] as const;
export type Relation = (typeof relations)[number]['id'];
export type Position = (typeof positions)[number]['id'];

export const axes = [
  { name: 'かかわり方', left: '前に出る', right: '支える', icon: '🎤' },
  { name: '行動スタイル', left: '即興派', right: '計画派', icon: '🧭' },
  { name: '考え方', left: 'ひらめき派', right: '堅実派', icon: '💡' },
  { name: '助け方', left: '共感派', right: '解決派', icon: '🫶' },
] as const;

// Values are explicitly assigned so reversing the order doesn't reverse the meaning.
export const questions: ReadonlyArray<{ axis: number; question: string; options: ReadonlyArray<{ label: string; value: number }> }> = [
  { axis: 0, question: 'グループで話がまとまらないとき、この人は？', options: [
    { label: '自分が進行役になってまとめる', value: 0 }, { label: '方向性を積極的に提案する', value: 33 },
    { label: 'みんなの意見を整理する', value: 67 }, { label: '決まったことを裏から支える', value: 100 },
  ] },
  { axis: 1, question: '急に予定が変わったとき、この人は？', options: [
    { label: 'その場のノリで切り替える', value: 0 }, { label: '大枠だけ決め直す', value: 33 },
    { label: '条件を確認してから動く', value: 67 }, { label: '計画を立て直してから動く', value: 100 },
  ] },
  { axis: 2, question: '何かを改善するとき、この人は？', options: [
    { label: '今までにない方法を考える', value: 0 }, { label: '新しいアイデアをいくつか出す', value: 33 },
    { label: '実現しやすい方法を探す', value: 67 }, { label: '実績のある確実な方法を選ぶ', value: 100 },
  ] },
  { axis: 3, question: '友達に悩みを相談されたとき、この人は？', options: [
    { label: 'じっくり話を聞いて共感する', value: 0 }, { label: '気持ちを一緒に整理する', value: 33 },
    { label: '話を聞きながら対策を考える', value: 67 }, { label: '具体的な解決策を提案する', value: 100 },
  ] },
  { axis: 0, question: 'グループで役割を分けるなら、この人は？', options: [
    { label: '裏方の作業を確実に進める', value: 100 }, { label: '抜けている役割を補う', value: 67 },
    { label: '周りに声をかけて動かす', value: 33 }, { label: '全体をまとめるリーダーになる', value: 0 },
  ] },
  { axis: 1, question: '遊びや企画を準備するとき、この人は？', options: [
    { label: '事前に細かく予定を決める', value: 100 }, { label: '必要な段取りを整理する', value: 67 },
    { label: '最低限だけ決めておく', value: 33 }, { label: 'その場で考えながら進める', value: 0 },
  ] },
  { axis: 2, question: 'いつものやり方を変えるとき、この人は？', options: [
    { label: '慣れたやり方を大切にする', value: 100 }, { label: '明確なメリットがあれば変える', value: 67 },
    { label: '改善できそうなら試してみる', value: 33 }, { label: '積極的に新しい方法に挑戦する', value: 0 },
  ] },
  { axis: 3, question: '友達が失敗して落ち込んだとき、この人は？', options: [
    { label: '次に失敗しない対策を考える', value: 100 }, { label: '一緒に改善策を探す', value: 67 },
    { label: 'まず励まして元気づける', value: 33 }, { label: 'その人の気持ちを受け止める', value: 0 },
  ] },
];

export const characters = [
  { title: 'ひらめきのムードメーカー', emoji: '🦊', color: '#ffb4a2', description: '思いついたら即行動！ 周りも巻き込む、自由な盛り上げ役。' },
  { title: '突破力のあるアイデア隊長', emoji: '🐯', color: '#f8b85d', description: '直感と解決力で道を切り開く、頼もしい冒険家。' },
  { title: 'みんなを守るまとめ役', emoji: '🦁', color: '#f5ce7a', description: '周りの気持ちを忘れない、あたたかなリーダー。' },
  { title: '現実派のリーダー', emoji: '🦅', color: '#a5d9ba', description: '困ったらこの人。地に足のついた頼れる指揮官。' },
  { title: '理想を形にする司令塔', emoji: '🦄', color: '#d7c0ef', description: '新しい未来を描いて、一歩ずつ実現へ導く人。' },
  { title: '計画的な改革リーダー', emoji: '🐲', color: '#b5c5fd', description: '大胆なアイデアにも、しっかりした作戦がある。' },
  { title: '頼れる世話焼きリーダー', emoji: '🐻', color: '#f4bd9d', description: 'みんなのことを考えながら、安定感で引っ張る存在。' },
  { title: '冷静沈着な指揮官', emoji: '🐺', color: '#b2c9d5', description: '段取り上手で、どんな場面でも落ち着いている。' },
  { title: '自由な感性の応援団長', emoji: '🐬', color: '#a6d7ef', description: '自分らしく動きながら、人の気持ちを照らす人。' },
  { title: '静かなる発明家', emoji: '🐙', color: '#cab6e9', description: 'マイペースなアイデアと、意外な切れ味が魅力。' },
  { title: '優しさの縁の下の力持ち', emoji: '🐰', color: '#f5b6c9', description: '目立たなくても、そっとみんなを支えてくれる。' },
  { title: '頼れる実務サポーター', emoji: '🐢', color: '#b4d9bf', description: '派手さより確実さ。静かに問題を解決する人。' },
  { title: '思いやりのある戦略家', emoji: '🦋', color: '#c7b7ed', description: '優しいアイデアを、着実な行動に変えていく。' },
  { title: '緻密なアイデア職人', emoji: '🦉', color: '#b1c2fa', description: 'ひらめきを仕組みに落とし込む、知的な工夫家。' },
  { title: '安心感のある守護者', emoji: '🐼', color: '#c5d8d1', description: '穏やかで慎重。そばにいるとほっとする。' },
  { title: '静かなる作戦参謀', emoji: '🐈', color: '#f3c4a8', description: 'じっくり観察して、必要なときに正解を出す人。' },
] as const;

export type Answers = number[];
/** -1 means "can't judge"; otherwise answers are 0..3 option indices. */
export function isValidAnswers(input: unknown): input is Answers {
  return Array.isArray(input) && input.length === questions.length &&
    input.every(v => Number.isInteger(v) && v >= -1 && v <= 3) &&
    input.filter(v => v >= 0).length >= 6 &&
    axes.every((_, axis) => questions.some((q, index) => q.axis === axis && input[index] !== -1));
}

export function scoreAnswers(answers: Answers): number[] {
  if (!isValidAnswers(answers)) throw new Error('回答が不足しています。各軸1問以上、合計6問以上回答してください。');
  return axes.map((_, axis) => {
    const scores = questions.flatMap((q, i) => q.axis === axis && answers[i] >= 0 ? [q.options[answers[i]].value] : []);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  });
}

export function characterIndex(scores: ReadonlyArray<number>): number {
  if (scores.length !== 4 || scores.some(v => !Number.isFinite(v) || v < 0 || v > 100)) throw new Error('Invalid scores');
  return scores.reduce((index, score) => index * 2 + (score >= 50 ? 1 : 0), 0);
}

export function characterFromScores(scores: ReadonlyArray<number>) {
  const index = characterIndex(scores);
  return { ...characters[index], index, code: index.toString(2).padStart(4, '0') };
}

export type GroupSummary = { key: string; count: number; scores: number[] | null };
export type Report = { name: string; count: number; total: GroupSummary; relations: GroupSummary[]; positions: GroupSummary[] };
