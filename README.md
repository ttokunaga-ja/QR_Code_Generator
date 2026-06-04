# Wi-Fi / URL / Text QR Code Generator

React + TypeScript + Vite + MUI で Wi-Fi／URL／テキストの QR コードを生成する、**完全クライアントサイド**のシングルページアプリです。入力情報（SSID・パスワード・URL・テキスト）はブラウザ内でのみ処理され、サーバーへ送信されません。ホスティングは **Cloudflare Pages** の静的配信を本番とします。

## ミニマル構成ポリシー
- フロントエンドのみのリポジトリ。QR 生成はブラウザ内で完結し、バックエンドAPIは持たない。
- アプリ本体はリポジトリルートに配置し、Cloudflare Pages からそのままビルドできる構成にする。
- UI は MUI（Emotion）で構築。スタイルは [`src/lib/theme.ts`](src/lib/theme.ts) のテーマに一元化。
- 静的配信・SPAフォールバック・キャッシュ／セキュリティヘッダは Cloudflare Pages の `_redirects` / `_headers` で宣言。
- ドキュメントは README のみに集約。

## ディレクトリ構成
```
.
├── content/                   # FAQ / policy の Markdown 原稿（ja / en）
├── public/
│   ├── _redirects             # SPA フォールバック (/* -> /index.html 200)
│   └── _headers               # キャッシュ + セキュリティ (CSP 等) ヘッダ
├── src/
│   ├── components/            # UI コンポーネント（MUI）
│   ├── content/               # Markdown 読み込み・ページ定義
│   ├── lib/                   # i18n 初期化・MUI テーマ
│   ├── locales/               # ja / en 翻訳
│   └── styles/                # 基本リセット・デザイントークン
├── index.html
├── package*.json
├── tsconfig.json
├── vite.config.ts
├── .nvmrc                     # Node 20
└── build/                     # vite build の出力（未コミット）
```

## ローカル開発
```bash
npm install           # もしくは npm ci
npm run dev           # http://localhost:3000

# 型チェック
npm run typecheck

# 本番ビルド（tsc --noEmit で型検査 → vite build）
npm run build         # 出力: build
```

## Cloudflare Pages デプロイ（Git 連携・自動デプロイ）
GitHub リポジトリを Cloudflare Pages に接続し、push ごとに自動ビルド・本番反映、PR ごとにプレビューURL を発行します。

ダッシュボード（**Workers & Pages → Create → Pages → Connect to Git**）の設定：

| 項目 | 値 |
| --- | --- |
| Production branch | `main` |
| Framework preset | None（Vite） |
| Root directory (Build configurations → Advanced) | 空欄（リポジトリルート） |
| Build command | `npm run build` |
| Build output directory | `build` |
| 環境変数 | `NODE_VERSION = 20`（`.nvmrc` でも指定済み） |

接続後は `main` への push が本番デプロイ、その他ブランチ／PR がプレビューデプロイになります。`_redirects` と `_headers` はビルド出力（`build/`）に含まれ、Cloudflare Pages が自動的に適用します。

### 配信ポリシー（`public/`）
- `_redirects`: 任意のパスを `index.html` に 200 でフォールバック（SPA）。
- `_headers`:
  - `/assets/*` … ハッシュ付きアセットを `immutable` で長期キャッシュ。
  - `/index.html` … `no-store` で常に最新を取得（新しいアセットURLを確実に反映）。
  - `/*` … CSP・`X-Frame-Options: DENY`・`X-Content-Type-Options`・`Referrer-Policy`・`Permissions-Policy` を付与。

## 検証ログ
最新のルート配置構成で、以下を確認済みです。

- `npm run build`（`tsc --noEmit` 型検査込み）
- ブラウザで Wi-Fi / URL / テキスト入力 → QR 生成 → ダウンロードまで正常動作
