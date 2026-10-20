import { axes, characterFromScores, characterIndex, type DiagnosisVersion } from './diagnosis';

/**
 * Playful editorial descriptions, not clinical personality judgments.
 * The stories depend only on the four reported averages / a respondent's own scoring.
 */
export const animalStories = [
  {
    tagline: '思いつくたびに、みんなの世界がちょっと広がる。',
    tags: ['話題の火付け役', '自由な発想', '寄り添い上手'],
    impression: '話しかけると、気軽に新しい話が始まる。勢いだけでなく、その場の人の気持ちもちゃんと見ている印象。',
    scene: '「何する？」と迷う時間を、ワクワクする作戦会議に変える瞬間。',
    surprise: 'ひとりで考え込む時間もあるかもしれない。明るさだけが、この人の全部ではない。',
  },
  {
    tagline: '迷ったら一歩。動きながら道をひらく。',
    tags: ['挑戦の先頭', '即興に強い', '次の一手'],
    impression: '新しいことに前向きで、周りが迷っているときに行動のきっかけを作ってくれそう。',
    scene: '予想外の出来事に「じゃあこうしよう」と動き出す瞬間。',
    surprise: '即決に見えても、実は周囲をよく観察したうえで動いていることも。',
  },
  {
    tagline: '自然と人が集まる、あったかい中心地。',
    tags: ['会話の中心', 'さりげない気遣い', '気楽な空気'],
    impression: '場を明るくしながら、みんなの居心地も気にかけているように見える。',
    scene: 'いつものメンバーが集まったとき、空気がふっとほぐれる瞬間。',
    surprise: 'いつも前向きに見えるけれど、弱音を吐く日もあるはず。',
  },
  {
    tagline: 'ピンチのときこそ、頼れる一手を。',
    tags: ['行動の早さ', '切り替え上手', '実用的な提案'],
    impression: '迷う場面では、何かできることを見つけて動き出してくれる印象。',
    scene: '急な予定変更でも、次のプランを提案して場を進める瞬間。',
    surprise: '具体策を先に出すのは、相手を気にかけていないからとは限らない。',
  },
  {
    tagline: '優しい理想を、ちゃんと明日の予定にする。',
    tags: ['未来志向', '準備もできる', '共感的'],
    impression: '新しい可能性を話すときも、誰かを置いていかないように考えてくれそう。',
    scene: '「こんなことできたらいいね」を、少しずつ計画に変える瞬間。',
    surprise: '夢見がちに映っても、見えないところで段取りを組んでいるかも。',
  },
  {
    tagline: 'まだない未来に、ちゃんと道順をつける。',
    tags: ['発想と計画', '先を読む', '具体的に動く'],
    impression: 'アイデアの面白さだけでなく、どう実行するかまで考えている印象。',
    scene: '新企画のアイデアを、タスクや手順に落とし込む瞬間。',
    surprise: '計画を大事にしていても、変化や挑戦が苦手ということではない。',
  },
  {
    tagline: 'みんなが安心できる進め方を、さりげなく。',
    tags: ['世話好き', '丁寧な段取り', '温かい空気'],
    impression: '周りの困りごとを気にしながら、無理のない流れを作ってくれそう。',
    scene: '集合時間や役割が曖昧なとき、自然と確認してくれる瞬間。',
    surprise: '頼りになる人だって、誰かに任せたり甘えたりしたい日がある。',
  },
  {
    tagline: '積み重ねた経験が、いざというときの翼。',
    tags: ['落ち着いた進行', '実績を重視', '先回りの工夫'],
    impression: '状況を整理し、経験のある方法で着実に進めてくれる存在に見える。',
    scene: '複雑な相談を、順番に整理して現実的な行動へつなぐ瞬間。',
    surprise: '慎重そうに見えても、準備が整えば大胆な判断をすることも。',
  },
  {
    tagline: 'みんなの声を拾いながら、新しい海へ。',
    tags: ['聞き上手', '好奇心', '柔軟な対応'],
    impression: '自分から目立つより、会話の流れを受け止めて新しい方向へ動けそう。',
    scene: '誰かのちょっとした一言から、面白い遊びが生まれる瞬間。',
    surprise: '静かに聞いているときにも、頭の中ではたくさん考えているかも。',
  },
  {
    tagline: '静かに試して、意外な答えを見つける。',
    tags: ['観察上手', '柔軟な試行錯誤', '解決アイデア'],
    impression: 'よく話を聞いていて、必要なときには思いがけない提案をしてくれそう。',
    scene: 'みんなが悩んでいるとき、別の角度から突破口を見つける瞬間。',
    surprise: '口数が少なく見えても、何も考えていないわけじゃない。',
  },
  {
    tagline: '一緒にいるだけで、ふっと力が抜ける。',
    tags: ['聞き役', '自然体', '寄り添う姿勢'],
    impression: '相手の話を急かさず聞いてくれる、居心地のよい人として見られそう。',
    scene: '誰かが落ち込んだとき、言葉を急がず隣にいてくれる瞬間。',
    surprise: '優しそうに見えても、自分なりの譲れない考えを持っているかも。',
  },
  {
    tagline: 'あわてず、少しずつ、確かな一歩を。',
    tags: ['着実', '冷静な判断', '縁の下の実力'],
    impression: '目立つより、状況を見て確実に動くタイプとして周囲に映りそう。',
    scene: 'うまくいかないことを、一つずつ直していく瞬間。',
    surprise: 'ゆっくり見えるのは、迷っているのではなく確認しているからかも。',
  },
  {
    tagline: 'やさしい想像力で、まだない道を描く。',
    tags: ['想像力', '気持ちへの配慮', 'じっくり考える'],
    impression: '周りの話を聞きながら、新しいやり方を温めているように見える。',
    scene: '誰かの「困った」をきっかけに、新しいアイデアを考える瞬間。',
    surprise: 'ふんわりした雰囲気でも、内側にはしっかりした考えがあるかも。',
  },
  {
    tagline: 'ひらめきを磨いて、使える仕組みに。',
    tags: ['発想を整理', '計画的', '冷静なアイデア'],
    impression: '周りをよく見てから、意外性のある解決方法を組み立てる人に映りそう。',
    scene: '思いついたことを、実際に試せる形へ整えていく瞬間。',
    surprise: '慎重に見えるのは、アイデアが少ないからではない。',
  },
  {
    tagline: 'やさしさを、日々の安心に変えていく。',
    tags: ['穏やか', '段取り上手', '心地よい安定感'],
    impression: '話を聞いてくれて、無理のない進め方を大切にするように見える。',
    scene: '「大丈夫？」と声をかけつつ、みんなが安心できる準備をする瞬間。',
    surprise: '合わせ上手だからといって、自分の意見がないわけではない。',
  },
  {
    tagline: '静かな観察が、とっておきの作戦になる。',
    tags: ['観察と分析', '着実な選択', '段取りの工夫'],
    impression: 'すぐに結論を言わなくても、考え抜いた具体策を持っていそう。',
    scene: '難しい状況をよく眺めてから、無駄のない方法を提案する瞬間。',
    surprise: '無口に見える時間も、その人なりの大事な準備かもしれない。',
  },
] as const;

/** Only the v2 animal descriptions have editorial depth. v1 links remain unchanged. */
export function storyFromScores(scores: ReadonlyArray<number>, version: DiagnosisVersion = 2) {
  if (version === 1) return null;
  return animalStories[characterIndex(scores)];
}

export type ObservedTendency = { axis: string; phrase: string; score: number; distance: number };

/** A midpoint should not be narrated as a clear left or right personality. */
export function observedTendencies(scores: ReadonlyArray<number>, version: DiagnosisVersion = 2): ObservedTendency[] {
  if (scores.length !== 4 || scores.some(v => !Number.isFinite(v) || v < 0 || v > 100)) return [];
  const definitions = version === 1 ? null : axes;
  if (!definitions) return [];
  return scores.map((score, i) => {
    const axis = definitions[i];
    const distance = Math.abs(score - 50);
    let phrase: string;
    if (distance < 12) phrase = `「${axis.left}」と「${axis.right}」の両方の面が見られる`;
    else if (score < 50) phrase = `「${axis.left}」ように見られやすい`;
    else phrase = `「${axis.right}」ように見られやすい`;
    return { axis: axis.name, phrase, score: Math.round(score), distance };
  }).sort((a, b) => b.distance - a.distance);
}

export function resultSampleNote(count: number): string {
  if (!Number.isInteger(count) || count < 3) return '回答が3人集まると、総合的な印象を表示できます。';
  if (count < 6) return 'まだ少人数の印象です。回答が増えるとキャラクターや傾向が変わることがあります。';
  if (count < 12) return 'いくつかの視点が集まってきました。関係性によって見え方が違うかもしれません。';
  return '多くの視点が集まっています。ただし実際の性格を断定するものではありません。';
}

/** Suggest an adjacent animal only when one axis is near the arbitrary 50-point cut. */
export function nearbyCharacter(scores: ReadonlyArray<number>, version: DiagnosisVersion = 3) {
  if (version === 1 || scores.length !== 4 ||
      scores.some(v => !Number.isFinite(v) || v < 0 || v > 100)) return null;
  const closest = scores.map((score, axis) => ({ axis, distance: Math.abs(score - 50) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!closest || closest.distance > 10) return null;
  const alternative = [...scores];
  alternative[closest.axis] = scores[closest.axis] >= 50 ? 49 : 50;
  const character = characterFromScores(alternative, version);
  return { title: character.title, emoji: character.emoji, axis: axes[closest.axis].name };
}
