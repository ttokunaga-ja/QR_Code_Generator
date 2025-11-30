# Wi-Fi / URL QR Code Generator

FigmaAI で設計した白黒ミニマル UI を React + TypeScript + Vite で再現し、SSID/パスワードから Wi-Fi 接続用、または URL リンク用の QR コードをクライアントサイドのみで生成するアプリです。  
Go 製の軽量サーバーは静的ファイルを配信するだけで、入力情報はブラウザ外へ送信されません。

## 現在のフロントエンド実装状況

- `src/components/QRGeneratorApp.tsx` に Wi-Fi/URL モード切替、リアルタイム検証、PNG ダウンロードを備えたメイン画面を実装済み。
- i18next（`src/lib/i18n.ts` + `src/locales`）で日英切替可能。トグルで JA/EN を瞬時に切り替えます。
- QR コードは `qrcode` ライブラリで `<canvas>` へ描画し、256px（モバイル）/320px（デスクトップ）の白黒プレビューを提供。
- UI は白黒基調のカスタムコンポーネント（`src/components/ui/*`）で構成され、FigmaAI の要件（最低限の情報量＆高コントラスト）に準拠。

## 開発環境

- Node.js 20+
- npm 10+
- Go 1.22+

### セットアップ

```bash
npm install
```

### 開発サーバー

```bash
npm run dev
```

`http://localhost:3000` で Vite のホットリロードが有効になります。

### 本番ビルド

```bash
npm run build
```

出力先は `build/` です（`vite.config.ts` の `outDir` 参照）。Tailwind v4 の `@import` 警告が現状 1 件出力されますが、ビルドは完了します。

## Go 静的サーバー

- エントリーポイント: `server/main.go`
- 環境変数:
  - `PORT`（デフォルト `8080`）
  - `STATIC_DIR`（デフォルト `build`）
- Docker ビルド時に社内プロキシや独自レジストリを利用する場合は、`NPM_REGISTRY` / `HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY` などの build args を指定できます（後述）。
- `/healthz` でヘルスチェックを提供し、存在しないパスは SPA として `index.html` にフォールバックします。

ローカルで単体起動する場合:

```bash
go build -o bin/server ./server
STATIC_DIR=build PORT=8080 ./bin/server
```

## Docker / Compose

マルチステージ `Dockerfile` でフロントエンドを Node 20 でビルドし、Go 1.22 でサーバーをビルドしたあとに Alpine イメージへまとめます。

```bash
# 1. コンテナイメージをビルド（要 Docker Desktop）
docker compose build

# 2. 起動
docker compose up
```

> **Note**: この開発環境（WSL セッション）には Docker CLI が入っていないため `docker compose build` は未検証です。Docker Desktop の WSL 統合を有効にした環境で実行してください。  
> ネットワーク制約がある環境では、以下の build args を利用して社内レジストリやプロキシを指定できます。

```bash
NPM_REGISTRY=https://registry.npmjs.org/ \
HTTP_PROXY=http://proxy.example.com:8080 \
HTTPS_PROXY=http://proxy.example.com:8080 \
docker compose build --no-cache
```

`docker-compose.yml` 内で `NPM_FETCH_RETRIES` や `NPM_FETCH_TIMEOUT` も上書き可能です。

## 主なディレクトリ

```
.
├── src/                # React + i18next + Tailwind 実装
├── server/             # Go 静的ファイルサーバー
├── src/docs/           # 要件定義、FigmaAI プロンプト、開発ログ
├── Dockerfile          # Node/Go マルチステージ
├── docker-compose.yml  # 8080 ポート公開構成
└── README.md
```

## 今後のタスク例

1. Docker Desktop 環境で `docker compose up --build` を実行し、本番構成を検証する。
2. Tailwind v4 の `@import` 警告を解消する（プリプロセッサ設定の整理）。
3. README / docs にデプロイ先や CI フローが確定したら追記する。
