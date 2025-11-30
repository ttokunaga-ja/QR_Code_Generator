# Wi-Fi / URL QR Code Generator

React + TypeScript + Vite で Wi-Fi／URL の QR コードを生成し、Go 製の軽量サーバーで静的配信するシンプルな構成です。アプリはブラウザ内でのみ入力情報を扱うため、デプロイ時にはフロントのビルド成果物と静的サーバーのバイナリをまとめたコンテナイメージ（Dockerfile）だけを配布する方針（選択肢B）としました。

## ミニマル構成ポリシー
- `frontend/` と `backend/` に役割を分離し、生成物（`build/`, `bin/`, `node_modules/`）はすべて `.gitignore` 管理。
- ドキュメントは README のみに集約し、デプロイに不要な資料はリポジトリから排除。
- 再現性確保のため、`Makefile` でフロント／バックエンドのビルドをワンコマンド化。
- コンテナ配布を前提に Dockerfile / docker-compose.yml を常に最新ディレクトリ構成へ追従。

## ディレクトリ構成
```
.
├── frontend/           # React + Vite + Tailwind + i18next
│   ├── src/
│   ├── index.html
│   ├── package*.json
│   ├── tailwind.config.ts
│   ├── postcss.config.cjs
│   ├── vite.config.ts
│   └── build/          # npm run build の出力（未コミット）
├── backend/            # Go 静的サーバー
│   ├── go.mod
│   └── server/main.go
├── Dockerfile          # Node → Go → Alpine のマルチステージ
├── docker-compose.yml  # qr-app サービス定義
└── Makefile            # 再現ビルド用ユーティリティ
```

## ローカル開発（frontend）
```bash
cd frontend
npm install           # もしくは npm ci
npm run dev           # http://localhost:3000

# 本番ビルド
npm run build         # 出力: frontend/build
```

## 自動ビルド（Makefile）
```bash
# 依存インストール → フロントビルド → Go バイナリ生成
make build

# それぞれ個別に実行する場合
make frontend-build
make backend-build
```
`backend/bin/server` に生成されるバイナリは `.gitignore` 済みです。

## Docker デプロイ（選択肢B）
ローカルまたは CI から Dockerfile を直接利用し、静的ファイルと Go サーバーを同梱したイメージを作成します。
```bash
# Build & run
docker compose build
docker compose up -d

# 任意: プロキシや npm registry を切り替える場合
NPM_REGISTRY=https://registry.npmjs.org/ \
HTTP_PROXY=http://proxy.example.com:8080 \
docker compose build --no-cache
```
コンテナはポート 8080 で待ち受け、環境変数 `STATIC_DIR=/app/build` を通じて Vite ビルド成果物を配信します。ヘルスチェックは `/healthz` を参照してください。

## 検証ログ
最新の構成変更後、以下のコマンドで動作確認済みです（2025-12-01 JST）。

- `cd frontend && npm run build`
- `cd backend && go build -o bin/server ./server`
- `docker compose build`

いずれもエラーなく完了しました。必要に応じて `docker compose up --build` を追加実行してください。
