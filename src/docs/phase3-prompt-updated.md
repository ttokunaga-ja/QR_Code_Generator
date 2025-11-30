# Phase 3 プロンプト（最新状況調整版）

**更新日**: 2025-11-30  
**前提**: Phase 2 コンポーネント定義完了済み

---

## Phase 3: ビジュアルデザイン

```
docs/requirements.md の非機能要件に従い、白黒のみの洗練されたビジュアルを適用する。フォントは system-ui / Segoe UI / Noto Sans JP を想定し、コントラスト比 4.5:1 以上を満たす（実際は黒/白で 21:1）。背景は余白と細線で構成し、色要素は最小限にする。

Phase 2 で定義した 6 コンポーネント（ModeToggle, TextInput, PrimaryButton, QRPreview, NoticeText, ErrorText）を統合し、実際のアプリケーション画面としてビジュアルを完成させる。

実装要件:
1. **モバイル版（375px〜767px）**:
   - 縦スタックレイアウト
   - パディング: 16px（p-4）
   - QR プレビュー: 256×256px
   - 最大幅: 28rem (448px)

2. **デスクトップ版（768px以上）**:
   - 中央寄せレイアウト
   - パディング: 24px（p-6）
   - QR プレビュー: 320×320px
   - 最大幅: 42rem (672px)

3. **タイポグラフィ**:
   - ヘッダー（あれば）: デフォルトサイズ
   - ラベル: 14px (text-sm)
   - ボディテキスト: デフォルト
   - 小テキスト: 12px (text-xs)
   - 行間: 1.5（読みやすさ確保）

4. **スペーシング**:
   - セクション間: 32px (space-y-8)
   - フォーム要素間: 16px (space-y-4)
   - インライン要素: 8px (gap-2)

5. **i18next 対応**:
   - JA/EN のサンプル文言を双方表示（切替機能実装）
   - 文言長の違いによるレイアウト崩れがないことを確認
   - JSON リソースファイル（public/i18n/ja.json, en.json）を作成

6. **アクセシビリティ確認**:
   - コントラスト比: 黒/白で 21:1（WCAG AAA）
   - フォーカスリング: ボーダー太さで明示（3px）
   - キーボード操作: Tab で全要素にアクセス可能
   - スクリーンリーダー: ARIA 属性の確認

7. **Docker/Go 同居前提の再確認**:
   - 静的ファイル配信のみ（API なし）
   - ブラウザ内 QR 生成（qrcode.js 等のライブラリ想定）
   - Canvas API で PNG 出力
   - 資産は public/ ディレクトリに配置

ノートに「ビジュアル実装時も docs/dev_log.md へ反映内容を記録すること」を記載。

出力: 
- モバイル＋デスクトップのビジュアルアートボード（実装版）
- スタイルトークン（色、フォント、スペーシング）
- i18n 切替機能を含む実装
- アクセシビリティ確認結果
- 注記: Docker/Go 同居、ブラウザ内処理
- dev_log 記録指示
- 最後に「Phase 4 プロンプトを最新状況で調整する」と書く
```

---

## Phase 2 からの引継ぎ事項

### 完成コンポーネント一覧
1. **ModeToggle**: Wi-Fi/URL 2状態トグル
2. **TextInput**: Normal/Focus/Error 3ステート
3. **PrimaryButton**: Normal/Hover/Disabled
4. **QRPreview**: Empty/With QR Code（256×256px / 320×320px）
5. **NoticeText**: ⓘ アイコン付き注意書き
6. **ErrorText**: ⚠ アイコン付きエラーメッセージ

### i18n キー一覧（20+ キー）
- **mode**: wifi, url
- **label**: ssid, password, url
- **placeholder**: ssid, password, url
- **action**: download, generate
- **error**: ssid_required, invalid_url
- **notice**: wifi, url, security
- **qr**: preview, scanning_instruction

### デザイン確定事項
- **カラー**: #FFFFFF（白）/ #000000（黒）のみ
- **フォント**: system-ui, Segoe UI, Noto Sans JP
- **ボーダー**: 2px（通常）/ 3px（フォーカス）/ 4px（セクション）
- **トランジション**: colors（滑らかな色変化）
- **コントラスト比**: 21:1（黒/白）

---

## Phase 3 で実装する内容

### 1. 実際のアプリケーション画面

#### Wi-Fi モード
```
┌────────────────────────────────┐
│  [Wi-Fi Selected] [URL]        │  ← ModeToggle
├────────────────────────────────┤
│  SSID *                        │
│  [OfficeWiFi_____________]     │  ← TextInput
│                                │
│  Password                      │
│  [********************]        │  ← TextInput (type=password)
│                                │
│  ⓘ SSID is required...         │  ← NoticeText
├────────────────────────────────┤
│        ┌──────────┐            │
│        │ QR Code  │            │  ← QRPreview
│        │ Pattern  │            │
│        └──────────┘            │
├────────────────────────────────┤
│  [Download PNG]                │  ← PrimaryButton
├────────────────────────────────┤
│  ⓘ All QR generation...        │  ← NoticeText (footer)
└────────────────────────────────┘
```

#### URL モード
```
┌────────────────────────────────┐
│  [Wi-Fi] [URL Selected]        │  ← ModeToggle
├────────────────────────────────┤
│  URL                           │
│  [https://example.com____]     │  ← TextInput
│                                │
│  ⓘ Include https://...         │  ← NoticeText
├────────────────────────────────┤
│        ┌──────────┐            │
│        │ QR Code  │            │  ← QRPreview
│        │ Pattern  │            │
│        └──────────┘            │
├────────────────────────────────┤
│  [Download PNG]                │  ← PrimaryButton
├────────────────────────────────┤
│  ⓘ All QR generation...        │  ← NoticeText (footer)
└────────────────────────────────┘
```

### 2. i18next 統合

#### 言語切替トグル（画面右上等）
```typescript
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ja' ? 'en' : 'ja');
  };
  
  return (
    <div>
      <button onClick={toggleLanguage}>
        {i18n.language === 'ja' ? 'EN' : 'JA'}
      </button>
      <h1>{t('app.title')}</h1>
    </div>
  );
}
```

#### JSON リソースファイル作成
`/public/i18n/ja.json` および `/public/i18n/en.json` を作成し、Phase 2 で定義した全キーを配置。

### 3. QR コード生成ライブラリ統合

#### ライブラリ選定
- `qrcode` (推奨): シンプルで軽量、Canvas/SVG 出力対応
- `qr-code-styling`: デザインカスタマイズ可能（今回は白黒のみなので不要）

#### 実装例
```typescript
import QRCode from 'qrcode';

async function generateQRCode(data: string) {
  try {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    await QRCode.toCanvas(canvas, data, {
      width: 320,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error(err);
  }
}
```

#### Wi-Fi QR フォーマット
```
WIFI:T:<encryption>;S:<SSID>;P:<password>;H:false;;
例: WIFI:T:WPA;S:OfficeWiFi;P:password123;H:false;;
```

### 4. PNG ダウンロード機能

```typescript
function downloadQRCode() {
  const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
  const dataUrl = canvas.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = `wifi-qr-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = dataUrl;
  link.click();
}
```

### 5. バリデーション実装

#### SSID バリデーション
```typescript
function validateSSID(ssid: string): string | null {
  if (!ssid.trim()) {
    return t('error.ssid_required');
  }
  return null;
}
```

#### URL バリデーション
```typescript
function validateURL(url: string): string | null {
  try {
    // https:// を自動補完
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    new URL(fullUrl);
    return null;
  } catch {
    return t('error.invalid_url');
  }
}
```

---

## スタイルトークン

### カラーパレット
```css
:root {
  --color-bg: #FFFFFF;
  --color-text: #000000;
  --color-border: #000000;
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-400: #A3A3A3;
}
```

### タイポグラフィ
```css
:root {
  --font-family: system-ui, 'Segoe UI', 'Noto Sans JP', sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --line-height-normal: 1.5;
}
```

### スペーシング
```css
:root {
  --spacing-2: 8px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
}
```

### ボーダー
```css
:root {
  --border-width-normal: 2px;
  --border-width-focus: 3px;
  --border-width-section: 4px;
}
```

---

## アクセシビリティチェックリスト

- [ ] コントラスト比 4.5:1 以上（実際は 21:1）
- [ ] フォーカス表示が明確（ボーダー 3px）
- [ ] キーボード操作可能（Tab でナビゲート）
- [ ] ARIA 属性が適切（aria-label, aria-pressed, aria-invalid）
- [ ] エラーメッセージが関連付けられている（aria-describedby）
- [ ] 必須フィールドが明示（* マーク、required 属性）

---

## 技術スタック確認

### フロントエンド
- React (hooks)
- TypeScript
- Tailwind CSS v4.0
- i18next
- qrcode (QR 生成ライブラリ)

### バックエンド
- Go (静的ファイル配信のみ)
- Docker コンテナ内で同居

### デプロイ構成
```
Docker Container
├── Go Binary (http.FileServer)
└── public/
    ├── index.html
    ├── app.js (React ビルド成果物)
    ├── app.css (Tailwind ビルド成果物)
    └── i18n/
        ├── ja.json
        └── en.json
```

---

## dev_log 記録指示

**重要**: ビジュアル実装時も `docs/dev_log.md` へ反映内容を記録すること:

1. **実装日時**: YYYY-MM-DD HH:MM
2. **実装内容**: アプリケーション画面統合、i18n 実装、QR 生成機能等
3. **ライブラリ導入**: qrcode, i18next の導入経緯
4. **バリデーション実装**: SSID/URL の検証ロジック
5. **PNG ダウンロード実装**: Canvas API 使用方法
6. **アクセシビリティ確認**: チェックリスト結果
7. **課題・TODO**: 残タスク

---

## 次のアクション

**Phase 4 プロンプトを最新状況で調整する**

ビジュアルデザイン完成後、Phase 4（ハンドオフ準備）へ移行:
- 最終成果物の整理（モバイル/デスクトップアートボード）
- コンポーネントバリアント一覧
- スタイルガイドの完成版
- エクスポート指示（PNG ダウンロード機能の動作確認）
- 開発ノート（Docker/Go 同居、ブラウザ内処理、i18n）の最終化
