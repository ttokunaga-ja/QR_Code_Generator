# スタイルガイド完全版

**作成日**: 2025-11-30  
**対象**: Wi-Fi/URL QR Generator Web Application  
**デザインシステム**: ミニマル白黒デザイン

---

## デザイン原則

### 1. ミニマリズム
- 色は白（#FFFFFF）と黒（#000000）のみを使用
- 装飾的要素を最小限に抑える
- 余白と線で構成を明確化

### 2. アクセシビリティ優先
- コントラスト比21:1（WCAG AAA）
- フォーカス表示を明確に（3pxボーダー）
- キーボード操作完全対応

### 3. レスポンシブ
- モバイルファースト設計
- 768px境界で自動切替
- コンテンツ優先のブレークポイント

---

## カラーパレット

### プライマリカラー

| 名称 | HEX | RGB | 用途 |
|------|-----|-----|------|
| 白 | `#FFFFFF` | `rgb(255, 255, 255)` | 背景、非選択ボタン、QR背景 |
| 黒 | `#000000` | `rgb(0, 0, 0)` | テキスト、ボーダー、選択ボタン、QR前景 |

### グレースケール

| 名称 | HEX | RGB | 用途 | CSSカスタムプロパティ |
|------|-----|-----|------|---------------------|
| 極淡グレー | `#FAFAFA` | `rgb(250, 250, 250)` | - | `--color-gray-50` |
| 淡グレー | `#F5F5F5` | `rgb(245, 245, 245)` | ホバー背景 | `--color-gray-100` |
| 中グレー | `#A3A3A3` | `rgb(163, 163, 163)` | プレースホルダー | `--color-gray-400` |

### CSSカスタムプロパティ

```css
:root {
  /* プライマリカラー */
  --color-bg: #FFFFFF;
  --color-text: #000000;
  --color-border: #000000;
  
  /* グレースケール */
  --color-gray-50: #FAFAFA;
  --color-gray-100: #F5F5F5;
  --color-gray-400: #A3A3A3;
}
```

### コントラスト比

| 組み合わせ | コントラスト比 | WCAG評価 |
|-----------|--------------|---------|
| 黒テキスト / 白背景 | 21:1 | AAA ✅ |
| 白テキスト / 黒背景 | 21:1 | AAA ✅ |
| 中グレー / 白背景 | 3.5:1 | AA (Large) ✅ |

---

## タイポグラフィ

### フォントファミリー

```css
:root {
  --font-family: system-ui, 'Segoe UI', 'Noto Sans JP', sans-serif;
}
```

**優先順位**:
1. `system-ui`: システムデフォルトフォント
2. `Segoe UI`: Windows標準
3. `Noto Sans JP`: 日本語対応

### フォントサイズ

| 名称 | サイズ | rem | Tailwind | 用途 |
|------|--------|-----|----------|------|
| Extra Small | 12px | 0.75rem | `text-xs` | 注意書き、エラーメッセージ |
| Small | 14px | 0.875rem | `text-sm` | ラベル、小見出し |
| Base | 16px | 1rem | `text-base` | ボディテキスト、ボタン |
| Large | 18px | 1.125rem | `text-lg` | - |
| Extra Large | 20px | 1.25rem | `text-xl` | h3 |
| 2XL | 24px | 1.5rem | `text-2xl` | h2 |
| 3XL | 32px | 2rem | - | h1 |
| 4XL | 36px | 2.25rem | `text-4xl` | アイコン |

### CSSカスタムプロパティ

```css
:root {
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --line-height-normal: 1.5;
}
```

### フォントウェイト

| 名称 | 値 | Tailwind | 用途 |
|------|---|----------|------|
| Normal | 400 | `font-normal` | ボディテキスト、ラベル |
| Medium | 500 | `font-medium` | - |
| Semibold | 600 | `font-semibold` | h3 |
| Bold | 700 | `font-bold` | h1, h2 |

### 行間（Line Height）

| 名称 | 値 | Tailwind | 用途 |
|------|---|----------|------|
| Tight | 1.2 | `leading-tight` | 見出し（h1） |
| Snug | 1.3 | `leading-snug` | 見出し（h2） |
| Normal | 1.5 | `leading-normal` | ボディテキスト |
| Relaxed | 1.625 | `leading-relaxed` | - |

### 見出しスタイル

```css
h1 {
  font-size: 2rem;        /* 32px */
  font-weight: 700;
  line-height: 1.2;
}

h2 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 700;
  line-height: 1.3;
}

h3 {
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;
  line-height: 1.4;
}
```

---

## スペーシング

### スペーシングスケール

| 名称 | 値 | Tailwind | 用途 |
|------|---|----------|------|
| 1 | 4px | `1` | - |
| 2 | 8px | `2` | gap-2（インライン要素間） |
| 3 | 12px | `3` | - |
| 4 | 16px | `4` | space-y-4（フォーム要素間）、p-4（モバイル） |
| 6 | 24px | `6` | p-6（デスクトップ） |
| 8 | 32px | `8` | space-y-8（セクション間） |

### CSSカスタムプロパティ

```css
:root {
  --spacing-2: 8px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
}
```

### スペーシング使用ガイド

#### インライン要素間（アイコン+テキスト）
```tsx
<div className="flex items-start gap-2">
  <span>ⓘ</span>
  <span>Notice text</span>
</div>
```

#### フォーム要素間
```tsx
<div className="space-y-4">
  <TextInput label="SSID" />
  <TextInput label="Password" />
</div>
```

#### セクション間
```tsx
<div className="space-y-8">
  <ModeToggle />
  <FormSection />
  <QRPreview />
</div>
```

#### コンテナパディング（モバイル）
```tsx
<div className="p-4 md:p-6">
  {/* Content */}
</div>
```

---

## ボーダー

### ボーダー幅

| 名称 | 値 | Tailwind | 用途 |
|------|---|----------|------|
| Normal | 2px | `border-2` | 通常のボーダー |
| Focus | 3px | `border-[3px]` | フォーカス時のボーダー |
| Section | 4px | `border-4` | セクション区切り |

### CSSカスタムプロパティ

```css
:root {
  --border-width-normal: 2px;
  --border-width-focus: 3px;
  --border-width-section: 4px;
}
```

### ボーダースタイル

```css
/* 通常ボーダー */
.border-normal {
  border: 2px solid #000000;
}

/* フォーカスボーダー */
.border-focus {
  border: 3px solid #000000;
}

/* セクションボーダー */
.border-section {
  border: 4px solid #000000;
}
```

### ボーダー使用例

```tsx
// 入力フィールド（通常）
<input className="border-2 border-black" />

// 入力フィールド（フォーカス）
<input className="border-2 border-black focus:border-[3px]" />

// メインコンテナ
<div className="border-4 border-black">
  {/* Content */}
</div>
```

---

## グリッドシステム

### ブレークポイント

| 名称 | 値 | メディアクエリ | 対象デバイス |
|------|---|--------------|-------------|
| Mobile | < 768px | - | スマートフォン |
| Desktop | ≥ 768px | `@media (min-width: 768px)` | タブレット、PC |

### コンテナ最大幅

| デバイス | 最大幅 | Tailwind |
|---------|--------|----------|
| Mobile | 28rem (448px) | `max-w-md` |
| Desktop | 42rem (672px) | `max-w-2xl` |

### レイアウト例

```tsx
// モバイル＋デスクトップ対応コンテナ
<div className="w-full max-w-md md:max-w-2xl">
  {/* Content */}
</div>

// レスポンシブパディング
<div className="p-4 md:p-6">
  {/* Content */}
</div>

// レスポンシブQRサイズ
<div className={`${isMobile ? 'w-64 h-64' : 'w-80 h-80'}`}>
  <canvas ref={canvasRef} />
</div>
```

---

## QRコード仕様

### サイズ

| デバイス | Canvas幅×高さ | コンテナ幅×高さ | Tailwind |
|---------|--------------|----------------|----------|
| Mobile | 256×256px | 256×256px | `w-64 h-64` |
| Desktop | 320×320px | 320×320px | `w-80 h-80` |

### カラー

```javascript
QRCode.toCanvas(canvas, data, {
  width: qrSize,
  margin: 2,
  color: {
    dark: '#000000',   // QR前景色（黒）
    light: '#FFFFFF'   // QR背景色（白）
  }
});
```

### マージン

- **値**: 2（QRコードの周囲に2モジュール分の余白）
- **理由**: スキャン性能向上、視認性確保

### エラー訂正レベル

- **現在**: デフォルト（M: 15%）
- **推奨**: L（7%）〜 H（30%）の選択機能追加（Phase 4 TODO）

---

## トランジション

### トランジションプロパティ

| 名称 | プロパティ | 時間 | Tailwind |
|------|-----------|------|----------|
| Colors | color, background-color, border-color | 150ms | `transition-colors` |
| All | all | 150ms | `transition-all` |

### 使用例

```tsx
// ボタンホバー
<button className="bg-black text-white hover:bg-white hover:text-black transition-colors">
  Click me
</button>

// 入力フォーカス
<input className="border-2 focus:border-[3px] transition-all" />
```

---

## アクセシビリティスタイル

### フォーカス表示

```css
*:focus {
  outline: none;
}

button:focus-visible,
input:focus-visible {
  outline: var(--border-width-focus) solid var(--color-border);
  outline-offset: 2px;
}
```

### スクリーンリーダー専用クラス

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## コンポーネント固有スタイル

### ModeToggle

```tsx
<div className="flex gap-2">
  <button className="flex-1 py-3 border-2 border-black 
                     bg-black text-white">
    Wi-Fi
  </button>
  <button className="flex-1 py-3 border-2 border-black 
                     bg-white text-black hover:bg-gray-100">
    URL
  </button>
</div>
```

### TextInput

```tsx
<div>
  <label className="block text-sm mb-2">
    SSID <span className="ml-1">*</span>
  </label>
  <input 
    className="w-full p-3 border-2 border-black 
               focus:border-[3px] transition-all
               placeholder:text-gray-400"
    placeholder="Enter SSID"
  />
</div>
```

### PrimaryButton

```tsx
<button className="w-full py-3 px-6 border-2 border-black 
                   bg-black text-white 
                   hover:bg-white hover:text-black 
                   transition-colors
                   disabled:opacity-50 
                   disabled:cursor-not-allowed 
                   disabled:hover:bg-black 
                   disabled:hover:text-white">
  Download PNG
</button>
```

### NoticeText / ErrorText

```tsx
<div className="flex items-start gap-2 text-xs">
  <span>ⓘ</span>
  <span>Notice message</span>
</div>
```

---

## レスポンシブデザインパターン

### モバイルファースト

```tsx
// モバイル基準で記述し、デスクトップで上書き
<div className="p-4 md:p-6">           {/* パディング */}
<div className="max-w-md md:max-w-2xl"> {/* 最大幅 */}
<div className="w-64 md:w-80">         {/* QRサイズ */}
```

### ブレークポイント使用例

```tsx
// ページ全体レイアウト
<div className="min-h-screen bg-white flex items-center justify-center 
                p-4 md:p-8">
  <div className="w-full max-w-md md:max-w-2xl">
    {/* Content */}
  </div>
</div>
```

---

## アイコン

### 使用アイコン

| アイコン | Unicode | 用途 | コンポーネント |
|---------|---------|------|--------------|
| ⓘ | U+24D8 | 情報 | NoticeText |
| ⚠ | U+26A0 | 警告 | ErrorText |
| ⊞ | U+229E | プレースホルダー | QRPreview (Empty) |

### サイズ

- **小**: 12px (text-xs) - NoticeText, ErrorText
- **大**: 36px (text-4xl) - QRPreview Empty状態

---

## 印刷スタイル（将来的な拡張）

```css
@media print {
  /* QRコード印刷最適化 */
  canvas {
    page-break-inside: avoid;
  }
  
  /* 不要な要素を非表示 */
  button {
    display: none;
  }
}
```

---

## ダークモード（非対応）

現在のバージョンではダークモードは非対応です。
理由: 白黒ミニマルデザインがすでに高コントラストで、ダークモード不要。

---

## ブラウザ対応

### 対象ブラウザ

| ブラウザ | バージョン |
|---------|-----------|
| Chrome | 最新2バージョン |
| Firefox | 最新2バージョン |
| Safari | 最新2バージョン |
| Edge | 最新2バージョン |

### ベンダープレフィックス

Tailwind CSS v4.0が自動的に付与するため、手動での追加不要。

---

## パフォーマンス最適化

### Canvas最適化

```css
canvas {
  display: block;
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}
```

### フォント最適化

```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## スタイルチェックリスト

開発時に確認すべき項目:

- [ ] コントラスト比が4.5:1以上（通常テキスト）
- [ ] フォーカス表示が明確（3pxアウトライン）
- [ ] レスポンシブ対応（モバイル/デスクトップ）
- [ ] ボーダー幅の一貫性（2px/3px/4px）
- [ ] スペーシングの一貫性（2/4/6/8）
- [ ] トランジションの適用（colors/all）
- [ ] タイポグラフィの一貫性（xs/sm/base）

---

## 更新履歴

| 日付 | バージョン | 更新内容 |
|------|-----------|---------|
| 2025-11-30 | 1.0.0 | 初版作成・完全版スタイルガイド |
