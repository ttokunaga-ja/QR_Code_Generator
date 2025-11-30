# Phase 4 プロンプト（最新状況調整版）

**更新日**: 2025-11-30  
**前提**: Phase 3 ビジュアルデザイン完成済み

---

## Phase 4: ハンドオフ準備

```
Phase 3 で完成したアプリケーションを基に、開発チームへのハンドオフ資料を整備する。

実装要件:
1. **最終成果物の整理**:
   - モバイル版（375px〜767px）のスクリーンショット/デモ
   - デスクトップ版（768px以上）のスクリーンショット/デモ
   - 両モードの動作確認（Wi-Fi / URL）
   - 日英両言語での動作確認

2. **コンポーネントバリアント一覧**:
   - 全6コンポーネントの完全版
   - 各コンポーネントのステート（Normal/Focus/Error/Active等）
   - props API仕様
   - 使用例コード

3. **スタイルガイド**:
   - カラーパレット（#FFFFFF / #000000 / gray-*）
   - タイポグラフィ（フォント、サイズ、ウェイト、行間）
   - スペーシングシステム（2, 4, 6, 8）
   - ボーダーシステム（2px, 3px, 4px）
   - グリッドシステム（レスポンシブブレークポイント）

4. **機能確認**:
   - QRコード生成（Wi-Fi形式、URL形式）
   - バリデーション（SSID必須、URL形式）
   - PNGダウンロード（ファイル名、サイズ）
   - i18n切替（JA ⇄ EN）
   - レスポンシブ動作（画面幅変更時）

5. **アクセシビリティ確認結果**:
   - WCAG 2.1 Level AAA適合確認
   - コントラスト比21:1
   - キーボード操作テスト結果
   - ARIA属性実装確認
   - フォーカス表示確認

6. **開発ノート**:
   - Docker/Go同居構成の説明
   - ブラウザ内処理の技術詳細
   - i18next統合方法
   - qrcodeライブラリ使用方法
   - 環境構築手順
   - ビルド・デプロイ手順

7. **残課題・TODO**:
   - 優先度別の改善項目
   - 将来の拡張案（暗号化タイプ選択、QRデザインカスタマイズ等）
   - パフォーマンス最適化案

ノートに「ハンドオフ準備完了後も docs/dev_log.md へ反映内容を記録すること」を記載。

出力:
- コンポーネント完全版カタログ
- スタイルガイド完全版
- 機能動作確認レポート
- アクセシビリティ確認レポート
- 開発ノート（環境構築、ビルド、デプロイ）
- 残課題・TODO一覧
- dev_log 記録指示
- 最後に「Phase 4 完了」と書く
```

---

## Phase 3 からの引継ぎ事項

### 完成実装一覧
1. **i18nリソース**:
   - `/public/i18n/ja.json`: 日本語（20+キー）
   - `/public/i18n/en.json`: 英語（20+キー）
   - `/lib/i18n.ts`: i18next設定

2. **コンポーネント**:
   - `/components/ui/ModeToggle.tsx`: Wi-Fi/URL切替
   - `/components/ui/TextInput.tsx`: 3ステート入力
   - `/components/ui/PrimaryButton.tsx`: アクションボタン
   - `/components/ui/QRPreview.tsx`: QRプレビュー枠
   - `/components/ui/NoticeText.tsx`: 注意書き
   - `/components/ui/ErrorText.tsx`: エラーメッセージ

3. **メインアプリ**:
   - `/App.tsx`: i18nextプロバイダー
   - `/components/QRGeneratorApp.tsx`: メインロジック

4. **スタイル**:
   - `/styles/globals.css`: CSSカスタムプロパティ

5. **ドキュメント**:
   - `/docs/component-specifications.md`: コンポーネント仕様
   - `/docs/accessibility-checklist.md`: アクセシビリティ確認
   - `/docs/dev_log.md`: 開発ログ

### 技術スタック
- React (hooks)
- TypeScript
- Tailwind CSS v4.0
- i18next + react-i18next
- qrcode (QR生成)

### 機能実装状況
- ✅ Wi-Fi QRコード生成（WIFI:T:...形式）
- ✅ URL QRコード生成（https://自動補完）
- ✅ リアルタイムバリデーション
- ✅ PNGダウンロード（Canvas API）
- ✅ 日英言語切替（i18next）
- ✅ レスポンシブ対応（768px境界）
- ✅ アクセシビリティ対応（WCAG AAA）

---

## Phase 4 で実施する内容

### 1. コンポーネントカタログ完全版

#### ModeToggle
**用途**: Wi-Fi/URLモード切替  
**Props API**:
```typescript
interface ModeToggleProps {
  defaultMode?: 'wifi' | 'url';  // デフォルトモード（初期値: 'wifi'）
  disabled?: boolean;             // 無効化フラグ（初期値: false）
  onChange?: (mode: 'wifi' | 'url') => void;  // モード変更コールバック
}
```

**使用例**:
```tsx
<ModeToggle 
  defaultMode="wifi"
  onChange={(mode) => console.log(mode)}
/>
```

**ステート**:
- Wi-Fi選択: 左ボタン黒背景・白テキスト
- URL選択: 右ボタン黒背景・白テキスト

---

#### TextInput
**用途**: テキスト入力フィールド  
**Props API**:
```typescript
interface TextInputProps {
  label: string;                  // ラベルテキスト
  placeholder?: string;           // プレースホルダー
  required?: boolean;             // 必須フラグ（*表示）
  error?: string;                 // エラーメッセージ
  value?: string;                 // 制御値
  autoFocus?: boolean;            // 自動フォーカス
  type?: 'text' | 'password';     // 入力タイプ
  onChange?: (value: string) => void;  // 変更コールバック
}
```

**使用例**:
```tsx
<TextInput
  label="SSID"
  placeholder="Enter SSID"
  required
  value={ssid}
  onChange={setSsid}
  error={ssidError}
/>
```

**ステート**:
- Normal: 2pxボーダー
- Focus: 3pxボーダー（太くなる）
- Error: 2pxボーダー + エラーメッセージ表示

---

#### PrimaryButton
**用途**: プライマリアクションボタン  
**Props API**:
```typescript
interface PrimaryButtonProps {
  children: React.ReactNode;      // ボタンテキスト
  onClick?: () => void;           // クリックコールバック
  disabled?: boolean;             // 無効化フラグ
  className?: string;             // 追加CSSクラス
  type?: 'button' | 'submit';     // ボタンタイプ
}
```

**使用例**:
```tsx
<PrimaryButton 
  onClick={downloadQR}
  disabled={!hasQR}
>
  Download PNG
</PrimaryButton>
```

**ステート**:
- Normal: 黒背景・白テキスト
- Hover: 白背景・黒テキスト（色反転）
- Disabled: 透明度0.5、ホバー無効

---

#### QRPreview
**用途**: QRコードプレビュー表示  
**Props API**:
```typescript
interface QRPreviewProps {
  size?: 'mobile' | 'desktop';    // サイズ（mobile: 256px, desktop: 320px）
  hasQR?: boolean;                // QR表示フラグ
  qrDataUrl?: string;             // QR画像データURL
}
```

**使用例**:
```tsx
<QRPreview 
  size="desktop"
  qrDataUrl={canvasDataUrl}
/>
```

**ステート**:
- Empty: プレースホルダー（⊞アイコン + テキスト）
- With QR: QRコード画像表示

---

#### NoticeText
**用途**: 注意書きテキスト  
**Props API**:
```typescript
interface NoticeTextProps {
  children: React.ReactNode;      // テキスト内容
  icon?: boolean;                 // アイコン表示（初期値: true）
}
```

**使用例**:
```tsx
<NoticeText>
  SSID is required. Password is optional for open networks.
</NoticeText>
```

---

#### ErrorText
**用途**: エラーメッセージテキスト  
**Props API**:
```typescript
interface ErrorTextProps {
  children: React.ReactNode;      // エラーメッセージ
  icon?: boolean;                 // アイコン表示（初期値: true）
}
```

**使用例**:
```tsx
<ErrorText>
  SSID is required
</ErrorText>
```

---

### 2. スタイルガイド完全版

#### カラーパレット
```css
:root {
  --color-bg: #FFFFFF;          /* 背景白 */
  --color-text: #000000;        /* テキスト黒 */
  --color-border: #000000;      /* ボーダー黒 */
  --color-gray-50: #FAFAFA;     /* 極淡グレー */
  --color-gray-100: #F5F5F5;    /* 淡グレー */
  --color-gray-400: #A3A3A3;    /* 中グレー（プレースホルダー） */
}
```

#### タイポグラフィ
```css
:root {
  --font-family: system-ui, 'Segoe UI', 'Noto Sans JP', sans-serif;
  --font-size-xs: 12px;         /* 小テキスト */
  --font-size-sm: 14px;         /* ラベル */
  --font-size-base: 16px;       /* ボディ */
  --line-height-normal: 1.5;    /* 行間 */
}
```

**適用例**:
- h1: 2rem (32px), 700 weight
- h2: 1.5rem (24px), 700 weight
- h3: 1.25rem (20px), 600 weight
- body: 16px, normal weight
- label: 14px, normal weight
- small: 12px, normal weight

#### スペーシング
```css
:root {
  --spacing-2: 8px;             /* gap-2 */
  --spacing-4: 16px;            /* mb-4, space-y-4 */
  --spacing-6: 24px;            /* p-6 */
  --spacing-8: 32px;            /* mb-8, space-y-8 */
}
```

**使用ガイド**:
- インライン要素間: 8px (gap-2)
- フォーム要素間: 16px (space-y-4)
- コンテナパディング（モバイル）: 16px (p-4)
- コンテナパディング（デスクトップ）: 24px (p-6)
- セクション間: 32px (space-y-8)

#### ボーダー
```css
:root {
  --border-width-normal: 2px;   /* 通常ボーダー */
  --border-width-focus: 3px;    /* フォーカスボーダー */
  --border-width-section: 4px;  /* セクション区切り */
}
```

#### グリッドシステム
- **ブレークポイント**: 768px
- **最大幅（モバイル）**: 28rem (448px)
- **最大幅（デスクトップ）**: 42rem (672px)
- **QRサイズ（モバイル）**: 256×256px
- **QRサイズ（デスクトップ）**: 320×320px

---

### 3. 機能動作確認レポート

#### QRコード生成
- [x] Wi-Fiモード: WIFI:T:WPA;S:OfficeWiFi;P:password;H:false;;
- [x] Wi-Fiモード（パスワードなし）: WIFI:T:nopass;S:GuestWiFi;P:;H:false;;
- [x] URLモード: https://example.com
- [x] URLモード（自動補完）: example.com → https://example.com
- [x] QRサイズ（モバイル）: 256×256px
- [x] QRサイズ（デスクトップ）: 320×320px
- [x] QR色: 黒（#000000）/白（#FFFFFF）

#### バリデーション
- [x] SSID空白時: エラーメッセージ表示、QR非表示
- [x] URL無効形式時: エラーメッセージ表示、QR非表示
- [x] リアルタイム検証: 入力変更時に即座に実行

#### PNGダウンロード
- [x] Canvas → Data URL変換
- [x] ファイル名: qr-wifi-2025-11-30.png / qr-url-2025-11-30.png
- [x] QR未生成時: ボタン無効化

#### i18n切替
- [x] 日本語（ja）→ 英語（en）切替
- [x] すべてのラベル・プレースホルダー・エラー・注意書きが切替
- [x] 文言長変化でもレイアウト崩れなし

#### レスポンシブ動作
- [x] 768px未満: モバイルレイアウト
- [x] 768px以上: デスクトップレイアウト
- [x] リサイズ時: リアルタイムで切替

---

### 4. 開発ノート

#### 環境構築
```bash
# 依存関係インストール
npm install

# 必要なライブラリ
npm install react react-dom
npm install i18next react-i18next
npm install qrcode
npm install @types/qrcode --save-dev
```

#### 開発サーバー起動
```bash
npm run dev
```

#### ビルド
```bash
npm run build
```

#### Docker構成（Go同居）
```dockerfile
FROM golang:1.21 AS go-builder
WORKDIR /app
COPY . .
RUN go build -o server main.go

FROM node:20 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM alpine:latest
WORKDIR /app
COPY --from=go-builder /app/server .
COPY --from=frontend-builder /app/dist ./public
EXPOSE 8080
CMD ["./server"]
```

#### Go静的配信サーバー（例）
```go
package main

import (
    "log"
    "net/http"
)

func main() {
    fs := http.FileServer(http.Dir("./public"))
    http.Handle("/", fs)
    
    log.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

---

### 5. 残課題・TODO

#### 優先度: 高
- [ ] スクリーンリーダー対応強化（aria-live通知）
- [ ] QRコード生成失敗時のエラーハンドリング強化
- [ ] ダウンロード完了通知（toast等）

#### 優先度: 中
- [ ] 暗号化タイプ選択機能（WPA/WPA2/WEP/nopass）
- [ ] SSIDの隠し（Hidden）オプション追加
- [ ] QRコードのエラー訂正レベル選択（L/M/Q/H）

#### 優先度: 低
- [ ] QRデザインカスタマイズ（色変更、ロゴ埋め込み）
- [ ] 履歴機能（LocalStorage）
- [ ] 一括生成・エクスポート機能

#### パフォーマンス最適化
- [ ] QRコード生成のデバウンス（入力中の連続生成を抑制）
- [ ] Canvas再利用（不要な再生成を防止）
- [ ] i18nリソースの動的ロード（初期バンドルサイズ削減）

---

## dev_log 記録指示

**重要**: ハンドオフ準備完了後も `docs/dev_log.md` へ反映内容を記録すること:

1. **実装日時**: YYYY-MM-DD HH:MM
2. **ハンドオフ内容**: カタログ、スタイルガイド、動作確認レポート等
3. **ドキュメント整備状況**: 各種ドキュメントの完成度
4. **残課題**: TODO一覧の優先度別整理
5. **引継ぎ事項**: 開発チームへの連絡事項

---

## Phase 4 完了

すべてのフェーズが完了し、開発チームへのハンドオフ準備が整いました。
