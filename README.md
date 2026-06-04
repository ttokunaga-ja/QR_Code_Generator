# Wi-Fi / URL / Text QR Code Generator

React + TypeScript + Vite + MUI で Wi-Fi／URL／テキストの QR コードを生成する、**完全クライアントサイド**のシングルページアプリです。入力情報（SSID・パスワード・URL・テキスト）はブラウザ内でのみ処理され、サーバーへ送信されません。ホスティングは **Cloudflare Pages** の静的配信を本番とします。

## ミニマル構成ポリシー
- フロントエンドのみのリポジトリ。QR 生成はブラウザ内で完結し、バックエンドAPIは持たない。
- アプリ本体はリポジトリルートに配置し、Cloudflare Pages からそのままビルドできる構成にする。
- UI は MUI（Emotion）で構築。スタイルは [`src/lib/theme.ts`](src/lib/theme.ts) のテーマに一元化。
- 静的配信とSPAルーティングは Cloudflare Pages の標準挙動を利用し、キャッシュ／セキュリティヘッダは `_headers` で宣言。
- ドキュメントは README のみに集約。

## ディレクトリ構成
```
.
├── content/                   # FAQ / policy の Markdown 原稿（ja / en）
├── public/
│   ├── _headers               # キャッシュ + セキュリティ (CSP 等) ヘッダ
│   ├── robots.txt             # クローラ許可 + sitemap 参照
│   ├── sitemap.xml            # / · /faq · /policy
│   ├── llms.txt               # AI エージェント向けサイト案内
│   ├── favicon.svg            # ブランドファビコン
│   └── og/                    # OGP 画像
├── src/
│   ├── components/            # UI コンポーネント（MUI）
│   ├── content/               # Markdown 読み込み・ページ定義
│   ├── lib/                   # i18n 初期化・MUI テーマ
│   ├── locales/               # ja / en 翻訳
│   └── styles/                # 基本リセット・デザイントークン
├── index.html
├── seo.config.ts              # ルート別メタ/OGP/JSON-LD + Markdown Return 生成プラグイン
├── package*.json
├── tsconfig.json
├── vite.config.ts
├── .nvmrc                     # Node 20
└── build/                     # vite build の出力（未コミット）
```

## SEO / AI 検索対応
完全クライアントサイド SPA は初期 HTML に本文を持たないため、OGP スクレイパや JS を実行しない AI クローラに情報が届かない。これを補うため、[`seo.config.ts`](seo.config.ts) の Vite プラグインがビルド時に以下を生成する。

- **ルート別の静的 `<head>`**: `/`・`/faq`・`/policy` ごとに `title` / `meta description` / `canonical` / OGP / Twitter Card / JSON-LD（`WebSite` + `WebApplication`）を埋め込み、`build/faq/index.html`・`build/policy/index.html` をプリレンダリング出力する。
- **Markdown Return**: `content/ja/*.md` から `/faq.md`・`/policy.md` を生成（重複定義なし）。`_headers` で `X-Robots-Tag: noindex` と canonical を付与し、検索インデックスからは除外しつつ AI からは読めるようにする。
- **静的アセット**: `public/robots.txt`・`public/sitemap.xml`・`public/llms.txt`・`public/favicon.svg`・`public/og/qr-code-generator.png`。

ヘッダ要素（title 等）の編集は [`seo.config.ts`](seo.config.ts) の `routes` を変更する。本番ドメインは同ファイルの `SITE_URL`（`https://qr.takumi-tokunaga.com`）。ナビゲーションは実 `<a href>` でクローラが辿れ、クリック時のみ SPA ルーティングに切り替わる。

> 補足: ローカルの `vite preview` は `/faq` を SPA フォールバックでルート `index.html` に解決するため、プリレンダリングされた `/faq/index.html` を確認するには `/faq/` を開く。Cloudflare Pages は静的ファイルを優先するため本番では `/faq` がそのまま `/faq/index.html` を配信する。

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

接続後は `main` への push が本番デプロイ、その他ブランチ／PR がプレビューデプロイになります。`_headers` はビルド出力（`build/`）に含まれ、Cloudflare Pages が自動的に適用します。

### 配信ポリシー（`public/`）
- `_headers`:
  - `/assets/*` … ハッシュ付きアセットを `immutable` で長期キャッシュ。
  - `/index.html` … `no-store` で常に最新を取得（新しいアセットURLを確実に反映）。
  - `/*` … CSP・`X-Frame-Options: DENY`・`X-Content-Type-Options`・`Referrer-Policy`・`Permissions-Policy` を付与。

## 検証ログ
最新のルート配置構成で、以下を確認済みです。

- `npm run build`（`tsc --noEmit` 型検査込み）
- ブラウザで Wi-Fi / URL / テキスト入力 → QR 生成 → ダウンロードまで正常動作
