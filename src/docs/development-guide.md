# 開発ノート・環境構築ガイド

**作成日**: 2025-11-30  
**対象**: Wi-Fi/URL QR Generator Web Application  
**想定読者**: 開発チーム、DevOpsエンジニア

---

## 概要

このアプリケーションは、Wi-Fi接続情報およびURL誘導用のQRコードを生成するWebアプリケーションです。
すべての処理がブラウザ内で完結し、Goバックエンドは静的ファイル配信のみを担当します。

### アーキテクチャ概要

```
┌─────────────────────────────────────┐
│        Docker Container              │
│  ┌──────────────────────────────┐   │
│  │   Go HTTP Server (Port 8080) │   │
│  │   └─ http.FileServer         │   │
│  └──────────┬───────────────────┘   │
│             │                        │
│             ├─ /public/              │
│             │  ├─ index.html         │
│             │  ├─ app.js (React)     │
│             │  └─ app.css (Tailwind) │
│             │                        │
│  ┌──────────▼───────────────────┐   │
│  │   Browser                     │   │
│  │  ┌────────────────────────┐  │   │
│  │  │  React App             │  │   │
│  │  │  ├─ QR Generation      │  │   │
│  │  │  │  (qrcode library)   │  │   │
│  │  │  ├─ i18n (ja/en)       │  │   │
│  │  │  └─ Canvas API         │  │   │
│  │  └────────────────────────┘  │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 18+ | UIフレームワーク |
| TypeScript | 5+ | 型安全性 |
| Tailwind CSS | 4.0 | スタイリング |
| i18next | 23+ | 多言語対応（日英） |
| react-i18next | 14+ | i18nextのReact統合 |
| qrcode | 1.5+ | QRコード生成 |

### バックエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Go | 1.21+ | 静的ファイル配信 |
| net/http | 標準ライブラリ | HTTPサーバー |

### 開発ツール

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Vite | 5+ | ビルドツール |
| esbuild | - | バンドラー |

### インフラ

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Docker | 20+ | コンテナ化 |
| Alpine Linux | latest | ベースイメージ |

---

## 環境構築

### 前提条件

- Node.js 20+ (LTS推奨)
- npm 10+
- Go 1.21+
- Docker 20+（本番デプロイ時）

---

### 1. リポジトリクローン

```bash
git clone https://github.com/your-org/wifi-qr-generator.git
cd wifi-qr-generator
```

---

### 2. フロントエンド環境構築

#### 依存関係インストール

```bash
npm install
```

#### インストールされるパッケージ

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "i18next": "^23.7.0",
    "react-i18next": "^14.0.0",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/qrcode": "^1.5.5",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

#### 開発サーバー起動

```bash
npm run dev
```

- アクセスURL: http://localhost:5173
- ホットリロード: 有効
- ポート変更: `vite.config.ts` で設定可能

---

### 3. ビルド

#### 本番用ビルド

```bash
npm run build
```

**出力先**: `dist/`ディレクトリ

**出力内容**:
- `index.html`: エントリーポイント
- `assets/`: JS/CSSファイル（ハッシュ付き）
- その他静的ファイル

#### ビルド最適化

- **Tree Shaking**: 未使用コードの削除
- **Minification**: コード圧縮
- **Code Splitting**: チャンク分割（必要に応じて）

---

### 4. Goバックエンド設定

#### main.go（サンプル）

```go
package main

import (
    "log"
    "net/http"
)

func main() {
    // 静的ファイルサーバー設定
    fs := http.FileServer(http.Dir("./public"))
    http.Handle("/", fs)

    // サーバー起動
    port := ":8080"
    log.Printf("Server starting on http://localhost%s", port)
    
    if err := http.ListenAndServe(port, nil); err != nil {
        log.Fatal("Server failed to start:", err)
    }
}
```

#### ビルド

```bash
go build -o server main.go
```

#### 実行

```bash
./server
```

- アクセスURL: http://localhost:8080

---

### 5. Docker構成

#### Dockerfile（マルチステージビルド）

```dockerfile
# ===============================
# Stage 1: Go Builder
# ===============================
FROM golang:1.21-alpine AS go-builder

WORKDIR /app

# Go依存関係（go.modがある場合）
COPY go.* ./
RUN go mod download || true

# Goソースコードコピー＆ビルド
COPY main.go ./
RUN go build -o server main.go

# ===============================
# Stage 2: Frontend Builder
# ===============================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# 依存関係インストール
COPY package*.json ./
RUN npm ci --only=production

# フロントエンドソースコードコピー＆ビルド
COPY . .
RUN npm run build

# ===============================
# Stage 3: Production Image
# ===============================
FROM alpine:latest

WORKDIR /app

# Goバイナリコピー
COPY --from=go-builder /app/server .

# フロントエンドビルド成果物コピー
COPY --from=frontend-builder /app/dist ./public

# ポート公開
EXPOSE 8080

# ヘルスチェック（オプション）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# サーバー起動
CMD ["./server"]
```

#### ビルド

```bash
docker build -t wifi-qr-generator:latest .
```

#### 実行

```bash
docker run -d -p 8080:8080 --name wifi-qr-app wifi-qr-generator:latest
```

#### 停止・削除

```bash
docker stop wifi-qr-app
docker rm wifi-qr-app
```

---

### 6. docker-compose.yml（オプション）

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    restart: unless-stopped
    environment:
      - ENV=production
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:8080/"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

#### 起動

```bash
docker-compose up -d
```

#### 停止

```bash
docker-compose down
```

---

## プロジェクト構成

```
wifi-qr-generator/
├── public/                     # 静的ファイル（開発時のみ）
├── src/
│   ├── App.tsx                 # メインアプリケーション
│   ├── components/
│   │   ├── QRGeneratorApp.tsx # QR生成ロジック
│   │   └── ui/                # UIコンポーネント
│   │       ├── ModeToggle.tsx
│   │       ├── TextInput.tsx
│   │       ├── PrimaryButton.tsx
│   │       ├── QRPreview.tsx
│   │       ├── NoticeText.tsx
│   │       └── ErrorText.tsx
│   ├── lib/
│   │   └── i18n.ts            # i18n設定
│   ├── locales/               # 翻訳ファイル
│   │   ├── ja.ts              # 日本語
│   │   └── en.ts              # 英語
│   └── styles/
│       └── globals.css        # グローバルスタイル
├── docs/                      # ドキュメント
│   ├── requirements.md
│   ├── component-specifications.md
│   ├── component-catalog.md
│   ├── style-guide.md
│   ├── accessibility-checklist.md
│   ├── functional-verification.md
│   ├── development-guide.md
│   ├── remaining-tasks.md
│   └── dev_log.md
├── main.go                    # Goサーバー
├── Dockerfile                 # Docker設定
├── docker-compose.yml         # Docker Compose設定
├── package.json               # npm設定
├── tsconfig.json              # TypeScript設定
├── vite.config.ts             # Vite設定
└── README.md                  # プロジェクト概要
```

---

## i18next統合

### 設定ファイル（/lib/i18n.ts）

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ja from '../locales/ja';
import en from '../locales/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en }
    },
    lng: 'ja',              // デフォルト言語
    fallbackLng: 'en',      // フォールバック言語
    interpolation: {
      escapeValue: false    // React already escapes
    }
  });

export default i18n;
```

### 翻訳ファイル構造

```typescript
// /locales/ja.ts
export default {
  mode: {
    wifi: "Wi-Fi",
    url: "URL"
  },
  label: {
    ssid: "SSID",
    password: "パスワード",
    url: "URL"
  },
  // ... 他のキー
};
```

### 使用方法

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  // 翻訳テキスト取得
  const labelText = t('label.ssid');
  
  // 言語切替
  i18n.changeLanguage('en');
  
  // 現在の言語
  const currentLang = i18n.language;
  
  return <div>{labelText}</div>;
}
```

---

## QRコード生成（qrcodeライブラリ）

### インストール

```bash
npm install qrcode
npm install --save-dev @types/qrcode
```

### Canvas APIでの生成

```typescript
import QRCode from 'qrcode';

async function generateQRCode(data: string, size: number) {
  const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
  
  try {
    await QRCode.toCanvas(canvas, data, {
      width: size,           // 256 or 320
      margin: 2,             // 2モジュール
      color: {
        dark: '#000000',     // 前景色（黒）
        light: '#FFFFFF'     // 背景色（白）
      },
      errorCorrectionLevel: 'M'  // エラー訂正レベル（15%）
    });
  } catch (error) {
    console.error('QR generation failed:', error);
  }
}
```

### Wi-Fi QRフォーマット

```typescript
function generateWiFiString(ssid: string, password: string): string {
  const encryption = password ? 'WPA' : 'nopass';
  return `WIFI:T:${encryption};S:${ssid};P:${password};H:false;;`;
}
```

**フォーマット仕様**:
- `T`: 暗号化タイプ（WPA/WEP/nopass）
- `S`: SSID
- `P`: パスワード
- `H`: Hidden SSID（false: 非表示ではない）

### URL QRフォーマット

```typescript
function generateURLString(url: string): string {
  // https://を自動補完
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
```

### PNGダウンロード

```typescript
function downloadQRCode(canvasRef: HTMLCanvasElement, mode: string) {
  const dataUrl = canvasRef.toDataURL('image/png');
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  
  link.download = `qr-${mode}-${timestamp}.png`;
  link.href = dataUrl;
  link.click();
}
```

---

## バリデーション実装

### SSID バリデーション

```typescript
function validateSSID(ssid: string, t: Function): string | null {
  if (!ssid.trim()) {
    return t('error.ssid_required');
  }
  
  // 追加検証（オプション）
  if (ssid.length > 32) {
    return 'SSIDは32文字以内で入力してください';
  }
  
  return null;
}
```

### URL バリデーション

```typescript
function validateURL(url: string, t: Function): string | null {
  if (!url.trim()) {
    return null;  // 空白は許容（QR非表示のみ）
  }
  
  try {
    // https://を自動補完
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    new URL(fullUrl);
    return null;
  } catch {
    return t('error.invalid_url');
  }
}
```

---

## レスポンシブ実装

### 画面幅の監視

```typescript
import { useState, useEffect } from 'react';

function useScreenWidth() {
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );
  
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return screenWidth;
}

// 使用例
function App() {
  const screenWidth = useScreenWidth();
  const isMobile = screenWidth < 768;
  const qrSize = isMobile ? 256 : 320;
  
  return <div>{/* ... */}</div>;
}
```

---

## デバッグ・トラブルシューティング

### よくある問題

#### 1. QRコード生成エラー

**症状**: QRコードが生成されない

**原因**:
- Canvas要素が存在しない
- データが空
- qrcodeライブラリの初期化失敗

**解決方法**:
```typescript
if (canvasRef.current) {
  await QRCode.toCanvas(canvasRef.current, data, options);
} else {
  console.error('Canvas element not found');
}
```

---

#### 2. i18n翻訳が表示されない

**症状**: `t('key')` がキー文字列のまま表示される

**原因**:
- i18nの初期化未完了
- 翻訳ファイルのインポートエラー

**解決方法**:
```typescript
// App.tsxでi18n初期化を確認
import i18n from './lib/i18n';

useEffect(() => {
  i18n.init();
}, []);
```

---

#### 3. レスポンシブ切替が動作しない

**症状**: 画面幅変更時にレイアウトが変わらない

**原因**:
- resizeイベントリスナー未登録
- useEffect依存配列の設定ミス

**解決方法**:
```typescript
useEffect(() => {
  const handleResize = () => setScreenWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);  // 依存配列は空
```

---

#### 4. Docker ビルド失敗

**症状**: `docker build` でエラー

**原因**:
- マルチステージビルドの順序問題
- ファイルコピーパス誤り

**解決方法**:
```dockerfile
# 正しいファイルコピー順序
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```

---

## パフォーマンス最適化

### 1. QRコード生成のデバウンス

```typescript
import { useState, useEffect, useRef } from 'react';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// 使用例
const debouncedSSID = useDebouncedValue(ssid, 300);

useEffect(() => {
  if (debouncedSSID) {
    generateQRCode(debouncedSSID);
  }
}, [debouncedSSID]);
```

### 2. Canvas再利用

```typescript
// 同じCanvas要素を再利用（再生成を避ける）
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  if (canvasRef.current && data) {
    QRCode.toCanvas(canvasRef.current, data, options);
  }
}, [data, qrSize]);
```

---

## セキュリティ

### ブラウザ内完結処理

**重要**: すべての処理がブラウザ内で完結します。

- ✅ QRコード生成: ブラウザ内（qrcodeライブラリ）
- ✅ バリデーション: ブラウザ内（JavaScript）
- ✅ PNGダウンロード: ブラウザ内（Canvas API）
- ✅ 多言語切替: ブラウザ内（i18next）

**データ送信なし**:
- ❌ サーバーへのAPI呼び出し
- ❌ 外部サービス呼び出し
- ❌ トラッキング
- ❌ Cookie/LocalStorage使用

---

## テスト

### ユニットテスト（推奨設定）

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
});
```

#### サンプルテスト

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from './ModeToggle';

describe('ModeToggle', () => {
  it('should switch to URL mode on click', () => {
    const handleChange = vi.fn();
    render(<ModeToggle onChange={handleChange} />);
    
    const urlButton = screen.getByText('URL');
    fireEvent.click(urlButton);
    
    expect(handleChange).toHaveBeenCalledWith('url');
  });
});
```

---

## デプロイ

### 本番環境推奨設定

#### 環境変数

```bash
# .env.production
NODE_ENV=production
VITE_APP_TITLE=Wi-Fi QR Generator
```

#### ビルド最適化

```bash
# 本番ビルド（最適化有効）
npm run build

# ビルドサイズ確認
du -sh dist/
```

#### Nginxリバースプロキシ（オプション）

```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 更新履歴

| 日付 | バージョン | 更新内容 |
|------|-----------|---------|
| 2025-11-30 | 1.0.0 | 初版作成・環境構築ガイド完成 |
