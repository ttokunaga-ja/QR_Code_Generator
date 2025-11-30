# Phase 2: コンポーネント仕様書

**作成日**: 2025-11-30  
**参照**: `docs/requirements.md`, `docs/wireframe-requirements-memo.md`

---

## コンポーネント一覧

### 1. Toggle/WifiUrl - モード切替トグル

**用途**: Wi-Fi モードと URL モードの切り替え

**ステート**:
- **Wi-Fi Selected**: 左ボタン黒背景・白テキスト、右ボタン白背景・黒テキスト
- **URL Selected**: 左ボタン白背景・黒テキスト、右ボタン黒背景・白テキスト

**仕様**:
| プロパティ | 値 |
|-----------|-----|
| 幅 | 100% (各ボタン flex-1) |
| 高さ | py-3 (~48px) |
| ボーダー | 2px solid #000000 |
| アクティブ背景 | #000000 (黒) |
| アクティブテキスト | #FFFFFF (白) |
| 非アクティブ背景 | #FFFFFF (白) |
| 非アクティブテキスト | #000000 (黒) |
| ホバー効果 | bg-gray-100 (非アクティブ時) |
| トランジション | colors (滑らかな色変化) |

**i18n キー**:
- `mode.wifi` → "Wi-Fi" (JA), "Wi-Fi" (EN)
- `mode.url` → "URL" (JA), "URL" (EN)

**アクセシビリティ**:
- `aria-label`: "Wi-Fi mode" / "URL mode"
- `aria-pressed`: true/false でアクティブ状態を示す

---

### 2. Input/Text - テキスト入力フィールド

**用途**: SSID、パスワード、URL の入力

**ステート**:
- **Normal**: 白背景、黒ボーダー 2px
- **Focus**: 白背景、黒ボーダー 3px（太くなる）
- **Error**: 白背景、黒ボーダー 2px、下部にエラーメッセージ表示

**仕様**:
| プロパティ | 値 |
|-----------|-----|
| 幅 | 100% |
| パディング | 12px (p-3) |
| ボーダー (Normal) | 2px solid #000000 |
| ボーダー (Focus) | 3px solid #000000 |
| ボーダー (Error) | 2px solid #000000 |
| フォント | system-ui, Segoe UI, Noto Sans JP |
| フォントサイズ | 14px |
| ラベルサイズ | 14px (text-sm) |
| プレースホルダー色 | gray-400 |
| トランジション | all (滑らかなボーダー変化) |

**i18n キー**:
- `label.ssid` → "SSID" (JA), "SSID" (EN)
- `label.password` → "パスワード" (JA), "Password" (EN)
- `label.url` → "URL" (JA), "URL" (EN)
- `placeholder.ssid` → "SSID を入力" (JA), "Enter SSID" (EN)
- `placeholder.password` → "パスワードを入力" (JA), "Enter password" (EN)
- `placeholder.url` → "https://example.com" (JA), "https://example.com" (EN)

**アクセシビリティ**:
- `aria-invalid`: エラー時に true
- `aria-describedby`: エラーメッセージの ID を指定
- `required` 属性でラベルに * を表示

---

### 3. Button/Primary - プライマリアクションボタン

**用途**: PNG ダウンロード、QR コード生成

**ステート**:
- **Normal**: 黒背景、白テキスト
- **Hover**: 白背景、黒テキスト（色反転）
- **Disabled**: 透明度 0.5、ホバー効果なし

**仕様**:
| プロパティ | 値 |
|-----------|-----|
| 幅 | 100% |
| パディング | 16px vertical (py-4) |
| ボーダー | 2px solid #000000 |
| 背景 (Normal) | #000000 (黒) |
| テキスト (Normal) | #FFFFFF (白) |
| 背景 (Hover) | #FFFFFF (白) |
| テキスト (Hover) | #000000 (黒) |
| Disabled 透明度 | 0.5 |
| トランジション | colors (滑らかな色変化) |
| フォント | system-ui, Segoe UI, Noto Sans JP |

**i18n キー**:
- `action.download` → "PNG ダウンロード" (JA), "Download PNG" (EN)
- `action.generate` → "QR コード生成" (JA), "Generate QR Code" (EN)

**アクセシビリティ**:
- `disabled` 属性で無効化時にカーソルを not-allowed に
- ホバー効果を無効化時に抑制

---

### 4. QRPreview - QR コードプレビュー枠

**用途**: 生成された QR コードの表示

**ステート**:
- **Empty**: プレースホルダーアイコンとテキスト表示
- **With QR Code**: QR コード画像を表示

**仕様**:
| プロパティ | 値 |
|-----------|-----|
| サイズ (Mobile) | 256×256px (w-64 h-64) |
| サイズ (Desktop) | 320×320px (w-80 h-80) |
| ボーダー | 2px solid #000000 |
| 背景 | #FFFFFF (白) |
| パディング | 24px (p-6) |
| 配置 | 中央揃え (mx-auto) |
| プレースホルダー | ⊞ アイコン + "QR Code Preview" |

**i18n キー**:
- `qr.preview` → "QR コードプレビュー" (JA), "QR Code Preview" (EN)
- `qr.scanning_instruction` → "コードをスキャンして接続" (JA), "Scan code to connect" (EN)

**レスポンシブ**:
- 768px 未満: 256×256px
- 768px 以上: 320×320px

---

### 5. NoticeText - 注意書きテキスト

**用途**: フォーム下部の補足説明、セキュリティ情報

**仕様**:
| プロパティ | 値 |
|-----------|-----|
| フォントサイズ | 12px (text-xs) |
| 色 | #000000 (黒) |
| 透明度 | 0.7 |
| アイコン | ⓘ (先頭に配置) |
| 行間 | 1.5 |

**i18n キー**:
- `notice.wifi` → "SSID は必須です。パスワードはオープンネットワークの場合は省略可能です。" (JA), "SSID is required. Password is optional for open networks." (EN)
- `notice.url` → "URL に https:// を含めてください。省略時は自動で追加されます。" (JA), "Include https:// in your URL. It will be added automatically if missing." (EN)
- `notice.security` → "すべての QR 生成はブラウザ内で行われます。データはサーバーに送信されません。" (JA), "All QR generation happens in your browser. No data is sent to servers." (EN)

---

### 6. ErrorText - エラーメッセージテキスト

**用途**: バリデーションエラーの表示

**仕様**:
| プロパティ | 値 |
|-----------|-----|
| フォントサイズ | 12px (text-xs) |
| 色 | #000000 (黒) |
| スタイル | 太字 (font-bold) |
| アイコン | ⚠ (先頭に配置) |
| 行間 | 1.5 |

**i18n キー**:
- `error.ssid_required` → "SSID は必須です" (JA), "SSID is required" (EN)
- `error.invalid_url` → "無効な URL 形式です" (JA), "Invalid URL format" (EN)

---

## ステート差分一覧

### Toggle/WifiUrl
```
[Wi-Fi Selected]              [URL Selected]
┌────────────┬────────────┐   ┌────────────┬────────────┐
│ █ Wi-Fi █  │   URL      │   │   Wi-Fi    │  █ URL █   │
│  (black)   │  (white)   │   │  (white)   │  (black)   │
└────────────┴────────────┘   └────────────┴────────────┘
```

### Input/Text
```
[Normal]                   [Focus]                    [Error]
┌──────────────────┐      ┌═══════════════════┐      ┌──────────────────┐
│ Example text     │      ║ Example text      ║      │ Invalid text     │
│ (2px border)     │      ║ (3px border)      ║      │ (2px border)     │
└──────────────────┘      └═══════════════════┘      └──────────────────┘
                                                      ⚠ Error message
```

### Button/Primary
```
[Normal]                   [Hover]                    [Disabled]
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ █████████████████ │      │                  │      │ ░░░░░░░░░░░░░░░░ │
│ █ Download PNG █ │      │  Download PNG    │      │ ░ Download PNG ░ │
│ █████████████████ │      │                  │      │ ░░░░░░░░░░░░░░░░ │
└──────────────────┘      └──────────────────┘      └──────────────────┘
(black bg)                (white bg)                 (50% opacity)
```

### QRPreview
```
[Empty - Mobile]           [Empty - Desktop]          [With QR Code]
┌────────────┐            ┌──────────────────┐        ┌──────────────────┐
│            │            │                  │        │ ████  ██  ██████ │
│     ⊞      │            │       ⊞          │        │ ██  ████  ██  ██ │
│ QR Preview │            │   QR Preview     │        │ ████████████████ │
│ 256×256px  │            │   320×320px      │        │ ██  ██████  ████ │
│            │            │                  │        │ ████  ██  ██████ │
└────────────┘            └──────────────────┘        └──────────────────┘
```

---

## i18next キーマッピング完全版

### JSON リソースファイル構造

**public/i18n/ja.json**:
```json
{
  "mode": {
    "wifi": "Wi-Fi",
    "url": "URL"
  },
  "label": {
    "ssid": "SSID",
    "password": "パスワード",
    "url": "URL"
  },
  "placeholder": {
    "ssid": "SSID を入力",
    "password": "パスワードを入力",
    "url": "https://example.com"
  },
  "action": {
    "download": "PNG ダウンロード",
    "generate": "QR コード生成"
  },
  "error": {
    "ssid_required": "SSID は必須です",
    "invalid_url": "無効な URL 形式です"
  },
  "notice": {
    "wifi": "SSID は必須です。パスワードはオープンネットワークの場合は省略可能です。",
    "url": "URL に https:// を含めてください。省略時は自動で追加されます。",
    "security": "すべての QR 生成はブラウザ内で行われます。データはサーバーに送信されません。"
  },
  "qr": {
    "preview": "QR コードプレビュー",
    "scanning_instruction": "コードをスキャンして接続"
  }
}
```

**public/i18n/en.json**:
```json
{
  "mode": {
    "wifi": "Wi-Fi",
    "url": "URL"
  },
  "label": {
    "ssid": "SSID",
    "password": "Password",
    "url": "URL"
  },
  "placeholder": {
    "ssid": "Enter SSID",
    "password": "Enter password",
    "url": "https://example.com"
  },
  "action": {
    "download": "Download PNG",
    "generate": "Generate QR Code"
  },
  "error": {
    "ssid_required": "SSID is required",
    "invalid_url": "Invalid URL format"
  },
  "notice": {
    "wifi": "SSID is required. Password is optional for open networks.",
    "url": "Include https:// in your URL. It will be added automatically if missing.",
    "security": "All QR generation happens in your browser. No data is sent to servers."
  },
  "qr": {
    "preview": "QR Code Preview",
    "scanning_instruction": "Scan code to connect"
  }
}
```

---

## 実装ファイル一覧

| コンポーネント | ファイルパス | 説明 |
|--------------|-------------|------|
| ModeToggle | `/components/ui/ModeToggle.tsx` | Wi-Fi/URL 切替トグル |
| TextInput | `/components/ui/TextInput.tsx` | テキスト入力フィールド（3ステート） |
| PrimaryButton | `/components/ui/PrimaryButton.tsx` | プライマリアクションボタン |
| QRPreview | `/components/ui/QRPreview.tsx` | QR コードプレビュー枠 |
| NoticeText | `/components/ui/NoticeText.tsx` | 注意書きテキスト |
| ErrorText | `/components/ui/ErrorText.tsx` | エラーメッセージテキスト |

---

## デザイン原則確認

### ✅ カラーパレット
- 背景: #FFFFFF（白）
- テキスト・ボーダー: #000000（黒）
- グレースケール: gray-50, gray-100, gray-400（最小限使用）

### ✅ タイポグラフィ
- システムフォント: `system-ui, Segoe UI, Noto Sans JP, sans-serif`
- サイズ: 12px (text-xs), 14px (text-sm), デフォルト
- 行間: 1.5（読みやすさ確保）

### ✅ スペーシング
- パディング: 12px (p-3), 16px (p-4), 24px (p-6)
- マージン: 8px (mb-2), 16px (mb-4), 32px (mb-8)
- ギャップ: 8px (gap-2), 16px (gap-4)

### ✅ ボーダー
- 通常: 2px solid #000000
- 強調: 3px solid #000000（フォーカス時）
- 外枠: 4px solid #000000（セクション区切り）

### ✅ アクセシビリティ
- コントラスト比: 黒/白で 21:1（WCAG AAA レベル）
- フォーカス表示: ボーダー太さ変更で明示
- ARIA 属性: aria-label, aria-pressed, aria-invalid 使用

---

## dev_log 記録指示

**重要**: コンポーネント実装時は必ず `docs/dev_log.md` に以下を記録すること:

1. **実装日時**: YYYY-MM-DD HH:MM
2. **実装コンポーネント**: ModeToggle, TextInput 等
3. **ステート実装状況**: Normal/Focus/Error 等の実装完了確認
4. **i18n 対応状況**: キーの配置と JSON ファイル作成確認
5. **アクセシビリティ対応**: ARIA 属性、フォーカス管理の確認
6. **課題・TODO**: 残タスクや改善点

---

## 次のアクション

**Phase 3 プロンプトを最新状況で調整する**

コンポーネント定義が完了しました。次のフェーズでは以下を実施:
- ビジュアルデザインの最終調整
- タイポグラフィの詳細設定（フォントサイズ、ウェイト、行間）
- スペーシングシステムの確定
- アクセシビリティの最終確認（コントラスト比 4.5:1 以上）
- レスポンシブブレークポイントの微調整
- 日英両言語での表示確認
