# コンポーネントカタログ完全版

**作成日**: 2025-11-30  
**対象**: Wi-Fi/URL QR Generator Web Application  
**コンポーネント数**: 6

---

## 概要

このアプリケーションは6つの再利用可能なUIコンポーネントで構成されています。
すべてのコンポーネントは白黒のミニマルデザインを採用し、WCAG AAA基準を満たしています。

---

## 1. ModeToggle

### 概要
Wi-Fi/URLの2つのモードを切り替えるトグルボタン。

### Props API
```typescript
interface ModeToggleProps {
  defaultMode?: 'wifi' | 'url';  // デフォルトモード（初期値: 'wifi'）
  disabled?: boolean;             // 無効化フラグ（初期値: false）
  onChange?: (mode: 'wifi' | 'url') => void;  // モード変更コールバック
}
```

### 使用例
```tsx
import { ModeToggle } from './components/ui/ModeToggle';

function App() {
  const [mode, setMode] = useState<'wifi' | 'url'>('wifi');
  
  return (
    <ModeToggle 
      defaultMode={mode}
      onChange={(newMode) => setMode(newMode)}
    />
  );
}
```

### ステート

#### Wi-Fi選択時
- 左ボタン: 黒背景（#000000）、白テキスト（#FFFFFF）
- 右ボタン: 白背景（#FFFFFF）、黒テキスト（#000000）
- ボーダー: 2px、黒（#000000）

#### URL選択時
- 左ボタン: 白背景（#FFFFFF）、黒テキスト（#000000）
- 右ボタン: 黒背景（#000000）、白テキスト（#FFFFFF）
- ボーダー: 2px、黒（#000000）

#### Hover時
- 非選択ボタン: 淡グレー背景（#F5F5F5）

#### Disabled時
- カーソル: default
- ホバー効果: なし

### アクセシビリティ
- **ARIA属性**: `aria-label`, `aria-pressed`
- **キーボード操作**: Tab → Enter/Space
- **フォーカス表示**: 3pxアウトライン

### スタイリング
```tsx
// 選択時
className="flex-1 py-3 border-2 border-black bg-black text-white"

// 非選択時
className="flex-1 py-3 border-2 border-black bg-white text-black hover:bg-gray-100"
```

---

## 2. TextInput

### 概要
ラベル、プレースホルダー、エラーメッセージをサポートするテキスト入力フィールド。

### Props API
```typescript
interface TextInputProps {
  label: string;                  // ラベルテキスト（必須）
  placeholder?: string;           // プレースホルダー
  required?: boolean;             // 必須フラグ（*表示）
  error?: string;                 // エラーメッセージ
  value?: string;                 // 制御値
  autoFocus?: boolean;            // 自動フォーカス
  type?: 'text' | 'password';     // 入力タイプ（初期値: 'text'）
  onChange?: (value: string) => void;  // 変更コールバック
}
```

### 使用例
```tsx
import { TextInput } from './components/ui/TextInput';

function WiFiForm() {
  const [ssid, setSsid] = useState('');
  const [error, setError] = useState('');
  
  return (
    <TextInput
      label="SSID"
      placeholder="Enter SSID"
      required
      value={ssid}
      onChange={(value) => {
        setSsid(value);
        if (!value.trim()) {
          setError('SSID is required');
        } else {
          setError('');
        }
      }}
      error={error}
    />
  );
}
```

### ステート

#### Normal（通常）
- ラベル: 14px（text-sm）、黒（#000000）
- 入力欄: 2pxボーダー、黒（#000000）
- プレースホルダー: グレー（#A3A3A3）
- 必須マーク: 赤（※実装では黒）

#### Focus（フォーカス）
- 入力欄ボーダー: 3px、黒（#000000）
- アウトライン: 3px、offset 2px

#### Error（エラー）
- 入力欄ボーダー: 2px、黒（#000000）
- エラーメッセージ: 12px（text-xs）、黒、ErrorTextコンポーネント使用
- ARIA: `aria-invalid="true"`, `aria-describedby="[id]-error"`

#### Password Type
- type="password": マスク表示（●●●●）

### アクセシビリティ
- **label要素**: htmlFor属性で入力欄と関連付け
- **required属性**: 必須フィールドを明示
- **aria-invalid**: エラー時にtrue
- **aria-describedby**: エラーメッセージとの関連付け

### スタイリング
```tsx
// ラベル
<label className="block text-sm mb-2">
  {label}
  {required && <span className="ml-1">*</span>}
</label>

// 入力欄（Normal）
<input
  className="w-full p-3 border-2 border-black focus:border-[3px] transition-all"
  placeholder={placeholder}
/>

// エラーメッセージ
{error && (
  <div className="mt-2">
    <ErrorText>{error}</ErrorText>
  </div>
)}
```

---

## 3. PrimaryButton

### 概要
プライマリアクションを実行するボタン。

### Props API
```typescript
interface PrimaryButtonProps {
  children: React.ReactNode;      // ボタンテキスト
  onClick?: () => void;           // クリックコールバック
  disabled?: boolean;             // 無効化フラグ（初期値: false）
  className?: string;             // 追加CSSクラス
  type?: 'button' | 'submit';     // ボタンタイプ（初期値: 'button'）
}
```

### 使用例
```tsx
import { PrimaryButton } from './components/ui/PrimaryButton';

function QRGenerator() {
  const [hasQR, setHasQR] = useState(false);
  
  const handleDownload = () => {
    // ダウンロード処理
    console.log('Downloading QR code...');
  };
  
  return (
    <PrimaryButton 
      onClick={handleDownload}
      disabled={!hasQR}
    >
      Download PNG
    </PrimaryButton>
  );
}
```

### ステート

#### Normal（通常）
- 背景: 黒（#000000）
- テキスト: 白（#FFFFFF）
- ボーダー: 2px、黒（#000000）
- パディング: py-3、px-6

#### Hover（ホバー）
- 背景: 白（#FFFFFF）
- テキスト: 黒（#000000）
- ボーダー: 2px、黒（#000000）
- トランジション: colors

#### Disabled（無効）
- 透明度: 0.5
- カーソル: not-allowed
- ホバー効果: なし

#### Focus（フォーカス）
- アウトライン: 3px、黒（#000000）、offset 2px

### アクセシビリティ
- **disabled属性**: 無効時にキーボード操作を防止
- **キーボード操作**: Tab → Enter/Space
- **フォーカス表示**: 3pxアウトライン

### スタイリング
```tsx
// Normal + Hover
<button
  className="w-full py-3 px-6 border-2 border-black bg-black text-white 
             hover:bg-white hover:text-black transition-colors 
             disabled:opacity-50 disabled:cursor-not-allowed 
             disabled:hover:bg-black disabled:hover:text-white"
  onClick={onClick}
  disabled={disabled}
  type={type}
>
  {children}
</button>
```

---

## 4. QRPreview

### 概要
QRコードのプレビュー表示領域。Empty状態とQR表示状態を持つ。

### Props API
```typescript
interface QRPreviewProps {
  size?: 'mobile' | 'desktop';    // サイズ（mobile: 256px, desktop: 320px）
  hasQR?: boolean;                // QR表示フラグ（初期値: false）
  qrDataUrl?: string;             // QR画像データURL
}
```

### 使用例
```tsx
import { QRPreview } from './components/ui/QRPreview';

function QRDisplay() {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // QR生成後
  useEffect(() => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setQrDataUrl(dataUrl);
    }
  }, [/* dependencies */]);
  
  return (
    <QRPreview 
      size="desktop"
      qrDataUrl={qrDataUrl}
    />
  );
}
```

### ステート

#### Empty（QR未生成）
- 中央アイコン: ⊞（四角形アイコン）、4xl
- テキスト1: "QR Code Preview"、12px
- テキスト2: "256×256px" または "320×320px"、12px、opacity 70%
- 背景: 白（#FFFFFF）
- ボーダー: 2px、黒（#000000）

#### With QR（QR表示）
- QRコード画像: Canvas要素
- パディング: 4（p-4）
- 背景: 白（#FFFFFF）
- ボーダー: 2px、黒（#000000）

### サイズ

#### Mobile（モバイル）
- 幅×高さ: 256×256px（w-64 h-64）
- QRコード描画: 256×256px

#### Desktop（デスクトップ）
- 幅×高さ: 320×320px（w-80 h-80）
- QRコード描画: 320×320px

### アクセシビリティ
- **aria-label**: "QR Code Preview"
- **Empty状態**: 視覚的フィードバック（アイコン+テキスト）

### スタイリング
```tsx
// コンテナ
<div className="p-6 border-2 border-black bg-white">
  {/* Empty状態 */}
  <div className="border-2 border-black bg-white w-64 h-64 flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl mb-2">⊞</div>
      <div className="text-xs">QR Code Preview</div>
      <div className="text-xs opacity-70">256×256px</div>
    </div>
  </div>
  
  {/* QR表示状態 */}
  <div className="border-2 border-black bg-white w-64 h-64">
    <canvas ref={canvasRef} className="w-full h-full p-4" />
  </div>
</div>
```

---

## 5. NoticeText

### 概要
情報アイコン（ⓘ）付きの注意書きテキスト。

### Props API
```typescript
interface NoticeTextProps {
  children: React.ReactNode;      // テキスト内容
  icon?: boolean;                 // アイコン表示（初期値: true）
}
```

### 使用例
```tsx
import { NoticeText } from './components/ui/NoticeText';

function WiFiForm() {
  return (
    <div className="pt-2 border-t-2 border-black">
      <NoticeText>
        SSID is required. Password is optional for open networks.
      </NoticeText>
    </div>
  );
}
```

### ステート

#### Default（デフォルト）
- アイコン: ⓘ、12px（text-xs）
- テキスト: 12px（text-xs）、黒（#000000）
- レイアウト: flexbox、gap-2（8px）

#### Without Icon（アイコンなし）
```tsx
<NoticeText icon={false}>
  テキストのみ
</NoticeText>
```

### アクセシビリティ
- **セマンティック**: テキストコンテンツとして適切
- **コントラスト**: 21:1（黒/白）

### スタイリング
```tsx
<div className="flex items-start gap-2 text-xs">
  {icon && <span>ⓘ</span>}
  <span>{children}</span>
</div>
```

---

## 6. ErrorText

### 概要
警告アイコン（⚠）付きのエラーメッセージテキスト。

### Props API
```typescript
interface ErrorTextProps {
  children: React.ReactNode;      // エラーメッセージ
  icon?: boolean;                 // アイコン表示（初期値: true）
}
```

### 使用例
```tsx
import { ErrorText } from './components/ui/ErrorText';

function ValidationMessage({ error }: { error: string }) {
  if (!error) return null;
  
  return (
    <div className="mt-2">
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
```

### ステート

#### Default（デフォルト）
- アイコン: ⚠、12px（text-xs）
- テキスト: 12px（text-xs）、黒（#000000）
- レイアウト: flexbox、gap-2（8px）

#### Without Icon（アイコンなし）
```tsx
<ErrorText icon={false}>
  エラーメッセージのみ
</ErrorText>
```

### アクセシビリティ
- **役割**: aria-describedbyで入力欄と関連付け
- **コントラスト**: 21:1（黒/白）

### スタイリング
```tsx
<div className="flex items-start gap-2 text-xs">
  {icon && <span>⚠</span>}
  <span>{children}</span>
</div>
```

---

## コンポーネント使用パターン

### フォームバリデーション
```tsx
function WiFiForm() {
  const [ssid, setSsid] = useState('');
  const [error, setError] = useState('');
  
  const validate = (value: string) => {
    if (!value.trim()) {
      setError('SSID is required');
    } else {
      setError('');
    }
  };
  
  return (
    <div className="space-y-4">
      <TextInput
        label="SSID"
        placeholder="Enter SSID"
        required
        value={ssid}
        onChange={(value) => {
          setSsid(value);
          validate(value);
        }}
        error={error}
      />
      
      <div className="pt-2 border-t-2 border-black">
        <NoticeText>
          SSID is required. Password is optional for open networks.
        </NoticeText>
      </div>
    </div>
  );
}
```

### モード切替とフォーム
```tsx
function QRGeneratorForm() {
  const [mode, setMode] = useState<'wifi' | 'url'>('wifi');
  
  return (
    <div className="space-y-8">
      <ModeToggle 
        defaultMode={mode}
        onChange={setMode}
      />
      
      {mode === 'wifi' ? (
        <WiFiForm />
      ) : (
        <URLForm />
      )}
    </div>
  );
}
```

### QRプレビューとダウンロード
```tsx
function QRSection() {
  const [hasQR, setHasQR] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const downloadQR = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = dataUrl;
      link.click();
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="p-6 border-2 border-black">
        <canvas ref={canvasRef} className="w-64 h-64 mx-auto" />
      </div>
      
      <PrimaryButton onClick={downloadQR} disabled={!hasQR}>
        Download PNG
      </PrimaryButton>
    </div>
  );
}
```

---

## ファイル構成

```
/components/ui/
├── ModeToggle.tsx        # モード切替トグル
├── TextInput.tsx         # テキスト入力
├── PrimaryButton.tsx     # プライマリボタン
├── QRPreview.tsx         # QRプレビュー
├── NoticeText.tsx        # 注意書き
└── ErrorText.tsx         # エラーメッセージ
```

---

## 共通スタイル原則

### カラー
- 背景: #FFFFFF（白）
- テキスト: #000000（黒）
- ボーダー: #000000（黒）
- ホバー背景: #F5F5F5（淡グレー）
- プレースホルダー: #A3A3A3（中グレー）

### タイポグラフィ
- ラベル: 14px (text-sm)
- ボディ: 16px (デフォルト)
- 小テキスト: 12px (text-xs)
- 行間: 1.5

### スペーシング
- gap-2: 8px（インライン要素間）
- space-y-4: 16px（フォーム要素間）
- space-y-8: 32px（セクション間）
- p-4: 16px（モバイルパディング）
- p-6: 24px（デスクトップパディング）

### ボーダー
- 通常: 2px
- フォーカス: 3px
- セクション: 4px

### トランジション
- colors: 色変化（150ms）
- all: 全プロパティ（150ms）

---

## テスト推奨事項

### ユニットテスト
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from './ModeToggle';

test('ModeToggle changes mode on click', () => {
  const handleChange = jest.fn();
  render(<ModeToggle onChange={handleChange} />);
  
  const urlButton = screen.getByText('URL');
  fireEvent.click(urlButton);
  
  expect(handleChange).toHaveBeenCalledWith('url');
});
```

### アクセシビリティテスト
```typescript
import { axe } from 'jest-axe';

test('TextInput has no accessibility violations', async () => {
  const { container } = render(
    <TextInput label="Test" value="" onChange={() => {}} />
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 更新履歴

| 日付 | バージョン | 更新内容 |
|------|-----------|---------|
| 2025-11-30 | 1.0.0 | 初版作成・全6コンポーネント定義 |
