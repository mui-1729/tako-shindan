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

export const legacyAxes = [
  { name: 'かかわり方', left: '前に出る', right: '支える', icon: '🎤' },
  { name: '行動スタイル', left: '即興派', right: '計画派', icon: '🧭' },
  { name: '考え方', left: 'ひらめき派', right: '堅実派', icon: '💡' },
  { name: '助け方', left: '共感派', right: '解決派', icon: '🫶' },
] as const;

// Values are explicitly assigned so reversing the order doesn't reverse the meaning.
export const legacyQuestions: ReadonlyArray<{ axis: number; question: string; options: ReadonlyArray<{ label: string; value: number }> }> = [
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

export const legacyCharacters = [
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


/**
 * Version 2 (the default for newly created links):
 * 4 observable, situational preferences. Low/high are BOTH valid styles,
 * not ability scores or psychological diagnoses.
 *
 * Existing v1 surveys still use the legacy item wording, labels and scoring.
 */
/** Minimum independent responses before revealing a group's score or type. */
export const MIN_PUBLIC_GROUP = 3;
export function canShowGroupScore(count: number): boolean {
  return Number.isInteger(count) && count >= MIN_PUBLIC_GROUP;
}

export type DiagnosisVersion = 1 | 2 | 3;
export const axes = [
  { name: '会話の入り方', left: '自分から話す', right: '様子を見て聞く', icon: '💬' },
  { name: '物事の進め方', left: '試しながら', right: '準備してから', icon: '🧭' },
  { name: '物事の選び方', left: '新しい方法', right: '慣れた方法を磨く', icon: '💡' },
  { name: '助けるときの初動', left: 'まず気持ちを聞く', right: 'まず具体策を考える', icon: '🫶' },
] as const;

export const questions: ReadonlyArray<{ axis: number; question: string; options: ReadonlyArray<{ label: string; value: number }> }> = [
  { axis: 0, question: '何人かで話しているとき、この人は？', options: [
    { label: '自分から話題を出して話し始める', value: 0 },
    { label: '話を広げるためによく発言する', value: 33 },
    { label: '周りの話を聞きながら参加する', value: 67 },
    { label: '相手の話を引き出すことが多い', value: 100 },
  ] },
  { axis: 1, question: '急に予定が変わったとき、この人は？', options: [
    { label: 'まず動いて、やりながら考える', value: 0 },
    { label: '大体の方向だけ決めて動く', value: 33 },
    { label: '条件を確認してから動く', value: 67 },
    { label: '新しい段取りを組んでから動く', value: 100 },
  ] },
  { axis: 2, question: 'みんなで企画を考えるとき、この人は？', options: [
    { label: '今までにないことを提案する', value: 0 },
    { label: '新しい要素を取り入れようとする', value: 33 },
    { label: '実績のある案を工夫して改善する', value: 67 },
    { label: '慣れた方法をさらに良くしようとする', value: 100 },
  ] },
  { axis: 3, question: '友達が悩みを話してきた直後、この人は？', options: [
    { label: 'まず気持ちを受け止めて話を聞く', value: 0 },
    { label: '共感しながら状況を聞く', value: 33 },
    { label: '一緒に状況や原因を整理する', value: 67 },
    { label: '具体的にできることを考え始める', value: 100 },
  ] },
  { axis: 0, question: '初対面の人がいるグループで、この人は？', options: [
    { label: 'まず相手の様子を見て聞き役になる', value: 100 },
    { label: '話しかけられたら自然に話に入る', value: 67 },
    { label: '自分から挨拶や質問をする', value: 33 },
    { label: '自分から声をかけて場を作る', value: 0 },
  ] },
  { axis: 1, question: '遊びやイベントの準備をするとき、この人は？', options: [
    { label: '事前に予定や必要なものを整理する', value: 100 },
    { label: '重要な部分だけ先に決める', value: 67 },
    { label: '最低限決めて、あとは臨機応変に動く', value: 33 },
    { label: '当日の流れに任せて楽しむ', value: 0 },
  ] },
  { axis: 2, question: 'いつものやり方を見直すなら、この人は？', options: [
    { label: '今の方法を磨いて完成度を上げる', value: 100 },
    { label: '良いところを残しながら改善する', value: 67 },
    { label: '別の方法も試して比較する', value: 33 },
    { label: '思い切って新しい方法に挑戦する', value: 0 },
  ] },
  { axis: 3, question: '友達が失敗して落ち込んだとき、最初は？', options: [
    { label: '次にできる対策を一緒に考える', value: 100 },
    { label: '何が起きたのかを一緒に整理する', value: 67 },
    { label: '励ましてから話を聞く', value: 33 },
    { label: 'つらかった気持ちを聞く', value: 0 },
  ] },
];


/**
 * v3: concrete, playful scenes. Each pair is deliberately about the SAME
 * observable preference. Options are ordered along a single continuum.
 * Changing these questions again requires another survey version.
 */
export const questionsV3: typeof questions = [
  { axis: 0, question: 'みんなで遊んでいて、会話がふと止まった。この人は？', options: [
    { label: '自分から新しい話題を切り出す', value: 0 },
    { label: 'みんなに質問して会話を始める', value: 33 },
    { label: '誰かが話し始めたら会話に乗る', value: 67 },
    { label: '誰かが話を振るまで様子を見る', value: 100 },
  ] },
  { axis: 1, question: '集合10分前、集合場所が突然変更！ この人は？', options: [
    { label: '「とりあえず行ってみよう」と動く', value: 0 },
    { label: '新しい場所だけ確認して動く', value: 33 },
    { label: '行き方を確認してから動く', value: 67 },
    { label: '移動時間と道順を決め直してから動く', value: 100 },
  ] },
  { axis: 2, question: 'サークルの企画が毎回同じ。この人が提案しそうなのは？', options: [
    { label: '「いっそ全然違う企画にしよう！」', value: 0 },
    { label: '「新しい要素を大きく足そう！」', value: 33 },
    { label: '「前回の企画を工夫してみよう」', value: 67 },
    { label: '「好評だった企画をさらに磨こう」', value: 100 },
  ] },
  { axis: 3, question: '友達から「今日の発表、盛大にやらかした…」と来た。最初に返すのは？', options: [
    { label: '「それはつらかったね。話聞くよ」', value: 0 },
    { label: '「大変だったね。何があった？」', value: 33 },
    { label: '「どこで困ったか一緒に整理しよう」', value: 67 },
    { label: '「次にできること、一緒に考えよう」', value: 100 },
  ] },
  { axis: 0, question: '初対面の人と同じ班になった。この人の最初の動きは？', options: [
    { label: '向こうから話しかけられるまで待つ', value: 100 },
    { label: '声をかけられたら会話に入る', value: 67 },
    { label: '自分からあいさつして会話を始める', value: 33 },
    { label: '自分から話題を振って会話を始める', value: 0 },
  ] },
  { axis: 1, question: '学祭当日に急な追加作業！ この人なら？', options: [
    { label: '作業の順番を整理してから始める', value: 100 },
    { label: '必要なものを確認してから始める', value: 67 },
    { label: '最低限だけ聞いて作業を始める', value: 33 },
    { label: 'まず手を動かし、やりながら調整する', value: 0 },
  ] },
  { axis: 2, question: 'いつもの遊び方がマンネリ気味。この人なら？', options: [
    { label: '定番の遊び方をもっと楽しめるように工夫する', value: 100 },
    { label: 'いつもの遊びに小さな変化を加える', value: 67 },
    { label: 'いつもと少し違う遊びを試す', value: 33 },
    { label: '「未体験のやつやろう！」と新しい遊びを提案', value: 0 },
  ] },
  { axis: 3, question: '友達が「課題が終わらない！」とSOS。この人の第一声は？', options: [
    { label: '「何から片付けるか一緒に決めよう」', value: 100 },
    { label: '「どこが難しいか一緒に整理しよう」', value: 67 },
    { label: '「大変だね。どこまで進んだ？」', value: 33 },
    { label: '「焦るよね。まず話聞くよ」', value: 0 },
  ] },
];

/** One original animal species per result. Art can be replaced independently. */
export const characters = [
  { title: 'ひらめきキツネ', emoji: '🦊', color: '#ffb4a2', description: '思いついた話をすぐ形に。みんなの気持ちも忘れない、自由な発案者。' },
  { title: '冒険トラ', emoji: '🐯', color: '#f8b85d', description: '新しいことにまず挑む。困ったら次の一手を考える行動派。' },
  { title: '陽だまりライオン', emoji: '🦁', color: '#f5ce7a', description: 'いつもの仲間を明るく包む。フットワークの軽い盛り上げ役。' },
  { title: '即断オオカミ', emoji: '🐺', color: '#b2c9d5', description: 'その場で道を見つけて動く。具体策をすぐ出せる頼もしさ。' },
  { title: '夢描きユニコーン', emoji: '🦄', color: '#d7c0ef', description: '新しい未来を語り、準備も怠らない。夢と気配りの両立型。' },
  { title: '未来を組むドラゴン', emoji: '🐉', color: '#b5c5fd', description: '新しい計画を練るのが得意。発想を実行手順に変えるタイプ。' },
  { title: '面倒見クマ', emoji: '🐻', color: '#f4bd9d', description: 'みんなのことを考えつつ段取りを整える、温かなまとめ役。' },
  { title: '頼れるワシ', emoji: '🦅', color: '#a5d9ba', description: '経験を活かし、落ち着いて計画する。頼もしい進行役。' },
  { title: '好奇心イルカ', emoji: '🐬', color: '#a6d7ef', description: '周囲の声を拾いながら、新しい流れにも軽やかに乗るタイプ。' },
  { title: '静かなタコ', emoji: '🐙', color: '#cab6e9', description: '目立たずに試し、柔軟に解決する。実は頼もしいひらめき屋。' },
  { title: 'おだやかウサギ', emoji: '🐰', color: '#f5b6c9', description: '相手の様子をよく見て、自然に寄り添う穏やかな存在。' },
  { title: '実直なカメ', emoji: '🐢', color: '#b4d9bf', description: '周囲を観察して着実に動く、堅実な問題解決役。' },
  { title: '想像のチョウ', emoji: '🦋', color: '#c7b7ed', description: '人の気持ちをくみながら、斬新なアイデアを温めるタイプ。' },
  { title: '工夫のフクロウ', emoji: '🦉', color: '#b1c2fa', description: 'まず考え、組み立てる。発想と分析を静かに両立する人。' },
  { title: '安心パンダ', emoji: '🐼', color: '#c5d8d1', description: '穏やかに話を聞き、丁寧に支える。そばにいると安心する。' },
  { title: '作戦ネコ', emoji: '🐈', color: '#f3c4a8', description: 'よく観察して確実な手を打つ、慎重で頼れる知恵者。' },
] as const;

export function axesForVersion(version: DiagnosisVersion = 2) {
  return version === 1 ? legacyAxes : axes;
}
export function questionsForVersion(version: DiagnosisVersion = 2) {
  return version === 1 ? legacyQuestions : version === 2 ? questions : questionsV3;
}

export type Answers = number[];
/** -1 means "can't judge"; otherwise answers are 0..3 option indices. */
export function isValidAnswers(input: unknown): input is Answers {
  return Array.isArray(input) && input.length === questions.length &&
    input.every(v => Number.isInteger(v) && v >= -1 && v <= 3) &&
    input.filter(v => v >= 0).length >= 6 &&
    axes.every((_, axis) => questions.some((q, index) => q.axis === axis && input[index] !== -1));
}

export function scoreAnswers(answers: Answers, version: DiagnosisVersion = 2): number[] {
  if (!isValidAnswers(answers)) throw new Error('回答が不足しています。各軸1問以上、合計6問以上回答してください。');
  const definitions = questionsForVersion(version);
  return axesForVersion(version).map((_, axis) => {
    const scores = definitions.flatMap((q, i) =>
      q.axis === axis && answers[i] >= 0 ? [q.options[answers[i]].value] : []);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  });
}

export function characterIndex(scores: ReadonlyArray<number>): number {
  if (scores.length !== 4 || scores.some(v => !Number.isFinite(v) || v < 0 || v > 100)) throw new Error('Invalid scores');
  return scores.reduce((index, score) => index * 2 + (score >= 50 ? 1 : 0), 0);
}

export function characterFromScores(scores: ReadonlyArray<number>, version: DiagnosisVersion = 2) {
  const index = characterIndex(scores);
  const designs = version === 1 ? legacyCharacters : characters;
  return { ...designs[index], index, code: index.toString(2).padStart(4, '0') };
}

export type GroupSummary = { key: string; count: number; scores: number[] | null };
export type Report = { name: string; count: number; version: DiagnosisVersion; total: GroupSummary; relations: GroupSummary[]; positions: GroupSummary[]; respondents?: { nicknames: string[]; namedCount: number } };
