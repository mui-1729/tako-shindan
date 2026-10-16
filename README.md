# 🐙 たこしんだん — みんなから見たわたし

「親友から見た私」「先輩から見た私」がわかる、学生向けの匿名・他己診断アプリ。

## できること

- ニックネームだけで診断専用URLを作成（ユーザー登録不要）
- 回答者は「親友 / 友達 / 恋人 / SNSの知り合い / 知り合い」と「先輩 / 同期・同級生 / 後輩 / 該当なし」を各1つ選択
- 回答者のニックネーム入力は任意。記入した名前だけが管理者専用の「回答してくれた人」欄に表示され、未入力は匿名のまま
- 新設計v2の性格8問で4軸（会話の入り方／進め方／選び方／助ける初動）を採点し、16種の動物キャラクターに分類（各質問に「わからない」あり）
- 診断直後に個人向け結果を表示、SNS用テキストコピーとPNGカード保存
- 所有者専用リンクから集計結果を表示（全体・関係性別・立場別・多面性プロフィール）
- 各グループ5人以上になった場合にのみ集計スコア・タイプを開示

## 技術構成

**React + Vite + TypeScript** と **Cloudflare Workers + SQLite-backed Durable Objects**。

独立したDBサービス、Supabase、ログインシステムは使いません。ただしDurable Objectsには永続的なSQLiteストレージがあり、完全な無保存システムではありません。

1診断リンク = 1 Durable Object。個別の回答やスコアは保存せず、重複送信対策のランダムIDのハッシュと、集計人数および4軸のスコア合計を保存します。任意入力のニックネームだけは別テーブルに保存し、管理トークンを持つ診断作成者にのみ最新100件を表示します。**ニックネームから個別の回答内容やタイプを追跡する機能はありません。**

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

> GitHub Actionsで依存パッケージのインストール、単体テスト、TypeScriptチェック、Viteビルドを検証しています。公開先での実ブラウザ操作と負荷テストは別途必要です。

## 公開

**PCに開発環境がなくても、GitHub Actionsから公開できます。** 最初の1回だけCloudflareとGitHubの設定が必要です。

1. CloudflareのダッシュボードでアカウントIDを確認し、権限をWorkersの編集に限定したAPIトークンを作成します。
2. GitHubリポジトリの **Settings → Secrets and variables → Actions** で次のRepository secretsを設定します。
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
3. **Actions → Deploy to Cloudflare → Run workflow** を押して実行します。GitHub Actionsでテスト・ビルド・Worker公開まで行います。

CloudflareのAPIトークンは秘密情報なので、チャットや通常のリポジトリファイルには記載しないでください。実際の公開URLはDeployジョブのログに表示されます。

PCから手動デプロイする場合は以下を使えます。

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

キャラごとに `0000` 〜 `1111` の4ビットコードを割り当てています。新規診断(v2)には16種類の**別々の動物**をあしらった軽量SVGを表示し、旧リンク(v1)には従来のタコキャラを表示します。画像は外部ホスト不要で、結果画面とPNG保存の両方に使用。今後、正式なドット絵・WebPに差し替える余地があります。\n\n新しい性格軸、全8問の根拠、動物の一覧、集計方法については [診断設計v2](docs/DIAGNOSIS_V2.md) を参照してください。**既存の診断リンクは質問と採点を変更せずv1のまま**、新規リンクだけv2を使います。

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
