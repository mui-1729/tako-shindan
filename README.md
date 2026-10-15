# 🐙 たこしんだん — みんなから見たわたし

「親友から見た私」「先輩から見た私」がわかる、学生向けの匿名・他己診断アプリ。

## できること

- ニックネームだけで診断専用URLを作成（ユーザー登録不要）
- 回答者は「親友 / 友達 / 恋人 / SNSの知り合い / 知り合い」と「先輩 / 同期・同級生 / 後輩 / 該当なし」を各1つ選択
- 性格8問で4軸を採点し、16種類のキャラクターに分類（各質問に「わからない」あり）
- 診断直後に個人向け結果を表示、SNS用テキストコピーとPNGカード保存
- 所有者専用リンクから集計結果を表示（全体・関係性別・立場別）
- 各グループ5人以上になった場合にのみ集計スコア・タイプを開示

## 技術構成

**React + Vite + TypeScript** と **Cloudflare Workers + SQLite-backed Durable Objects**。

独立したDBサービス、Supabase、ログインシステムは使いません。ただしDurable Objectsには永続的なSQLiteストレージがあり、完全な無保存システムではありません。

1診断リンク = 1 Durable Object。回答は個人の生データではなく、重複送信対策のランダムIDのハッシュと、集計人数および4軸のスコア合計だけを保存します。管理者も個人回答は確認できません。

## 初回セットアップ

必要なもの：Node.js 20以上、npm、Cloudflareアカウント（公開時）。

```bash
# リポジトリを取得
git clone https://github.com/mui-1729/tako-shindan.git
cd tako-shindan

npm install
npm test
npm run dev
```

`npm run dev` は最初に静的ファイルをビルドし、`wrangler dev` (API: 8787) と Vite (画面: 5173) を起動します。ブラウザで `http://localhost:5173` を開いてください。最初のビルド後はフロントエンドの変更が即時反映されます。APIやDurable Objectの変更はWranglerが読み込みます。

> この環境ではnpmの依存関係を取得できなかったため、npm install / Workerのローカル実行テストはまだ完了していません。実機での動作確認が必要です。

## 公開

```bash
npx wrangler login
npm run deploy
```

初回デプロイはCloudflareへのブラウザ認証とアカウント選択が必要です。WranglerがWorkers、静的ファイル、Durable Objectsの設定をまとめてデプロイします。`wrangler.jsonc` に `new_sqlite_classes` の初回マイグレーションが含まれています。

> Cloudflare Workersのプロジェクトです。**Cloudflare Pagesの「静的サイト」だけにデプロイしてもAPIは動きません**。

## 仕組み

```text
/                       トップ・診断URL作成
/s/<24桁のID>           友達の回答ページ（公開）
/manage/<ID>#token=...  管理用リンク（秘密）

POST /api/surveys                   診断作成
GET  /api/surveys/:id               公開情報（名前・回答人数のみ）
POST /api/surveys/:id/answers       回答受付
GET  /api/surveys/:id/results       Bearerトークン必須の集計情報
```

ブラウザでの個人診断は8問の回答から即時計算。サーバーは同じ採点処理を行い、全体とカテゴリ別の累積値を更新します。結果に生の回答配列や回答者名は含まれません。

**注意：** 管理リンクはトークンを含みます。友達には `/s/` の回答リンクだけを共有してください。管理リンクを失くしても復旧できません。この端末で作った管理リンクは `localStorage` に最新10件だけ保存しています。端末移行前にリンクを保管してください。

## キャラクター画像

キャラごとに `0000` 〜 `1111` の4ビットコードが割り当てられています。現在は16種類の名前・説明と絵文字ベースの仮カードが表示されます。今後画像制作後に `public/characters/0000.webp` 〜 `1111.webp` を置き、`src/main.tsx` の `CharacterDisplay` を画像表示に切り替えます。詳細は `public/characters/README.md`。

## 本番公開前に追加したいこと

- **Bot・荒らし対策**：Cloudflare Turnstileと、Workersレベルのレート制限を導入。現在の重複回答防止は「同一ブラウザのランダムID」に基づく簡易対策なので回避可能です。
- **利用上限**：回答上限やリンク作成数の制御を導入（大量投稿による無料枠超過対策）。
- **削除・非公開**：管理トークンで診断を閉じたり消したりする機能。
- **SNSプレビュー**：共有リンク固有のOGP画像とタイトル（SPAの静的メタデータは全リンク共通）。
- **診断精度**：8問はあくまで遊び用。タイプは心理学的に検証されたものではなく、4軸それぞれ2問の簡易スコアです。

## 開発

```bash
npm run typecheck
npm test
npm run build
```

単体テストは `tests/diagnosis.test.ts`。
