# 残課題・TODO一覧

**作成日**: 2025-11-30  
**最終更新**: 2025-11-30  
**ステータス**: Phase 3 完了、Phase 4 ハンドオフ準備中

---

## 概要

このドキュメントは、現在のバージョン（v1.0.0）で未実装の機能や改善項目を優先度別に整理したものです。

---

## 優先度: 高（Critical）

### 1. スクリーンリーダー対応強化

**現状**:
- 基本的なARIA属性は実装済み（aria-label, aria-pressed, aria-invalid等）
- しかし、動的な状態変更（QR生成完了、エラー発生）の通知が不足

**実装内容**:
```typescript
// aria-live領域の追加
<div 
  aria-live="polite" 
  aria-atomic="true" 
  className="sr-only"
>
  {qrGenerated && t('qr.generated_success')}
  {error && t('error.occurred', { message: error })}
</div>
```

**翻訳キー追加**:
```json
{
  "qr": {
    "generated_success": "QRコードが生成されました",
    "download_success": "QRコードをダウンロードしました"
  }
}
```

**見積もり**: 2〜4時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 5

---

### 2. QRコード生成失敗時のエラーハンドリング強化

**現状**:
- `try-catch` でエラーキャッチはしているが、ユーザーへのフィードバックがconsole.errorのみ

**実装内容**:
```typescript
try {
  await QRCode.toCanvas(canvasRef.current, data, options);
  setHasQR(true);
  setQRError(null);
} catch (err) {
  console.error('QR generation failed:', err);
  setHasQR(false);
  setQRError(t('error.qr_generation_failed'));
}

// エラー表示
{qrError && (
  <div className="mt-4">
    <ErrorText>{qrError}</ErrorText>
  </div>
)}
```

**翻訳キー追加**:
```json
{
  "error": {
    "qr_generation_failed": "QRコードの生成に失敗しました。入力内容を確認してください。"
  }
}
```

**見積もり**: 2〜3時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 5

---

### 3. ダウンロード完了通知（Toast）

**現状**:
- ダウンロードボタンをクリックしても、成功したかどうかのフィードバックがない

**実装内容**:
```bash
npm install sonner@2.0.3
```

```typescript
import { toast } from 'sonner@2.0.3';

const downloadQR = () => {
  if (!canvasRef.current || !hasQR) return;
  
  try {
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `qr-${mode}-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
    
    // 成功通知
    toast.success(t('qr.download_success'));
  } catch (error) {
    // エラー通知
    toast.error(t('error.download_failed'));
  }
};
```

**Toastコンテナ追加**:
```typescript
import { Toaster } from 'sonner@2.0.3';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      {/* ... */}
    </>
  );
}
```

**見積もり**: 3〜4時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 5

---

## 優先度: 中（Important）

### 4. 暗号化タイプ選択機能（Wi-Fiモード）

**現状**:
- パスワードありの場合は自動的にWPA
- パスワードなしの場合は自動的にnopass

**実装内容**:
```typescript
type EncryptionType = 'WPA' | 'WPA2' | 'WEP' | 'nopass';

// UIに選択ドロップダウン追加
<select 
  value={encryptionType}
  onChange={(e) => setEncryptionType(e.target.value)}
  className="w-full p-3 border-2 border-black"
>
  <option value="WPA">WPA/WPA2</option>
  <option value="WEP">WEP</option>
  <option value="nopass">オープン（パスワードなし）</option>
</select>

// QR生成時に使用
const wifiString = `WIFI:T:${encryptionType};S:${ssid};P:${password};H:false;;`;
```

**見積もり**: 4〜6時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 6

---

### 5. SSIDの隠し（Hidden）オプション追加

**現状**:
- `H:false` で固定（非表示SSIDではない）

**実装内容**:
```typescript
const [isHiddenSSID, setIsHiddenSSID] = useState(false);

// UIにチェックボックス追加
<label className="flex items-center gap-2 text-sm">
  <input
    type="checkbox"
    checked={isHiddenSSID}
    onChange={(e) => setIsHiddenSSID(e.target.checked)}
    className="w-4 h-4 border-2 border-black"
  />
  {t('label.hidden_ssid')}
</label>

// QR生成時に使用
const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:${isHiddenSSID};;`;
```

**翻訳キー追加**:
```json
{
  "label": {
    "hidden_ssid": "非表示SSID（Hidden）"
  }
}
```

**見積もり**: 2〜3時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 6

---

### 6. QRコードのエラー訂正レベル選択

**現状**:
- エラー訂正レベルはデフォルト（M: 15%）固定

**実装内容**:
```typescript
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// UIに選択ラジオボタン追加
<div className="space-y-2">
  <label className="text-sm">{t('label.error_correction')}</label>
  <div className="flex gap-4">
    {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((level) => (
      <label key={level} className="flex items-center gap-2">
        <input
          type="radio"
          value={level}
          checked={errorCorrection === level}
          onChange={() => setErrorCorrection(level)}
        />
        {level} ({errorCorrectionPercent[level]})
      </label>
    ))}
  </div>
</div>

// QRコード生成時に使用
await QRCode.toCanvas(canvas, data, {
  errorCorrectionLevel: errorCorrection,
  // ...
});
```

**エラー訂正率**:
- L: 7%
- M: 15%（デフォルト）
- Q: 25%
- H: 30%

**見積もり**: 4〜5時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 6

---

## 優先度: 低（Nice to Have）

### 7. QRデザインカスタマイズ（色変更、ロゴ埋め込み）

**現状**:
- 白黒固定デザイン

**実装内容**:
```bash
# qr-code-stylingライブラリ導入
npm install qr-code-styling
```

```typescript
import QRCodeStyling from 'qr-code-styling';

const qrCode = new QRCodeStyling({
  width: qrSize,
  height: qrSize,
  data: wifiString,
  dotsOptions: {
    color: "#000000",
    type: "rounded"  // "square", "dots", "rounded", "classy", "classy-rounded"
  },
  backgroundOptions: {
    color: "#FFFFFF"
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10
  },
  image: logoUrl  // ロゴ画像URL
});

qrCode.append(document.getElementById("canvas-container"));
```

**注意**: 白黒ミニマルデザインの原則と矛盾する可能性あり。慎重に検討。

**見積もり**: 8〜12時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 7（要検討）

---

### 8. 履歴機能（LocalStorage）

**現状**:
- 過去に生成したQRコードの履歴なし

**実装内容**:
```typescript
interface QRHistory {
  id: string;
  mode: 'wifi' | 'url';
  data: {
    ssid?: string;
    url?: string;
  };
  createdAt: string;
}

// 履歴保存
const saveToHistory = (mode: string, data: any) => {
  const history: QRHistory[] = JSON.parse(
    localStorage.getItem('qr-history') || '[]'
  );
  
  history.unshift({
    id: Date.now().toString(),
    mode,
    data,
    createdAt: new Date().toISOString()
  });
  
  // 最大20件まで保持
  localStorage.setItem('qr-history', JSON.stringify(history.slice(0, 20)));
};

// 履歴表示UI
<div className="mt-8 border-t-4 border-black pt-8">
  <h2 className="mb-4">履歴</h2>
  <div className="space-y-2">
    {history.map((item) => (
      <button
        key={item.id}
        onClick={() => loadFromHistory(item)}
        className="w-full p-3 border-2 border-black text-left hover:bg-gray-100"
      >
        {item.mode === 'wifi' ? item.data.ssid : item.data.url}
        <span className="text-xs opacity-70 ml-2">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </button>
    ))}
  </div>
</div>
```

**見積もり**: 6〜8時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 7

---

### 9. 一括生成・エクスポート機能

**現状**:
- 1つずつQRコードを生成・ダウンロード

**実装内容**:
```typescript
// CSVインポート
import Papa from 'papaparse';

const handleCSVUpload = (file: File) => {
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      results.data.forEach((row: any) => {
        generateAndDownloadQR(row.ssid, row.password);
      });
    }
  });
};

// 一括ダウンロード（ZIP）
import JSZip from 'jszip';

const downloadBulkQR = async (qrDataList: Array<{data: string, filename: string}>) => {
  const zip = new JSZip();
  
  for (const qr of qrDataList) {
    const canvas = await generateQRCanvas(qr.data);
    const blob = await canvasToBlob(canvas);
    zip.file(`${qr.filename}.png`, blob);
  }
  
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.download = `qr-codes-${Date.now()}.zip`;
  link.href = URL.createObjectURL(content);
  link.click();
};
```

**見積もり**: 12〜16時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 8（要検討）

---

## 優先度: パフォーマンス最適化

### 10. QRコード生成のデバウンス

**現状**:
- 入力1文字ごとにQRコード再生成（パフォーマンス懸念）

**実装内容**:
```typescript
import { useDebouncedValue } from './hooks/useDebouncedValue';

// 300msデバウンス
const debouncedSSID = useDebouncedValue(ssid, 300);
const debouncedPassword = useDebouncedValue(password, 300);
const debouncedURL = useDebouncedValue(url, 300);

useEffect(() => {
  if (mode === 'wifi' && debouncedSSID) {
    generateWiFiQR(debouncedSSID, debouncedPassword);
  }
}, [debouncedSSID, debouncedPassword]);
```

**見積もり**: 2〜3時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 5

---

### 11. Canvas再利用（不要な再生成を防止）

**現状**:
- 毎回Canvasを再生成

**実装内容**:
```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  // Canvasが既に存在する場合は再利用
  if (canvasRef.current && data && qrSize) {
    QRCode.toCanvas(canvasRef.current, data, {
      width: qrSize,
      // ...
    });
  }
}, [data, qrSize]);  // 依存配列を最小限に
```

**見積もり**: 1〜2時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 5

---

### 12. i18nリソースの動的ロード

**現状**:
- すべての翻訳ファイルを最初にバンドル（初期バンドルサイズ増加）

**実装内容**:
```typescript
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}.json'
    },
    lng: 'ja',
    fallbackLng: 'en',
    // ...
  });
```

**注意**: 静的配信のみのため、localesファイルを`public/`に配置する必要あり。

**見積もり**: 3〜4時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 6

---

## 技術負債

### 13. ユニットテスト追加

**現状**:
- テストコードなし

**実装内容**:
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

**テストカバレッジ目標**: 80%以上

**見積もり**: 16〜24時間  
**担当者**: フロントエンド開発者  
**期限**: Phase 6

---

### 14. E2Eテスト追加

**現状**:
- E2Eテストなし

**実装内容**:
```bash
npm install --save-dev playwright
```

**テストシナリオ**:
- Wi-Fiモードでの QRコード生成・ダウンロード
- URLモードでの QRコード生成・ダウンロード
- 言語切替
- レスポンシブ動作

**見積もり**: 12〜16時間  
**担当者**: QAエンジニア  
**期限**: Phase 7

---

### 15. CI/CDパイプライン構築

**現状**:
- 手動ビルド・デプロイ

**実装内容**:
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t wifi-qr-generator:${{ github.sha }} .
      - name: Push to registry
        run: docker push wifi-qr-generator:${{ github.sha }}
```

**見積もり**: 8〜12時間  
**担当者**: DevOpsエンジニア  
**期限**: Phase 6

---

## 将来的な拡張案

### 16. モバイルアプリ版（React Native）

**実装内容**:
- React Nativeでモバイルアプリ化
- カメラ機能でQRスキャン
- オフライン動作

**見積もり**: 80〜120時間  
**期限**: Phase 9（要検討）

---

### 17. PWA対応

**実装内容**:
```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Wi-Fi QR Generator',
        short_name: 'QR Gen',
        description: 'Generate Wi-Fi and URL QR codes',
        theme_color: '#000000',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

**見積もり**: 12〜16時間  
**期限**: Phase 7

---

### 18. QRコードスキャン機能

**実装内容**:
```bash
npm install html5-qrcode
```

```typescript
import { Html5QrcodeScanner } from 'html5-qrcode';

const scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: 250 });

scanner.render((decodedText) => {
  console.log('Scanned:', decodedText);
  // Wi-Fi自動接続または URL自動遷移
});
```

**見積もり**: 8〜12時間  
**期限**: Phase 8

---

## 優先順位まとめ

| 優先度 | タスク数 | 合計見積もり（時間） |
|--------|---------|-------------------|
| 高 | 3 | 7〜11 |
| 中 | 3 | 10〜14 |
| 低 | 3 | 26〜36 |
| パフォーマンス | 3 | 6〜9 |
| 技術負債 | 3 | 36〜52 |
| 将来的拡張 | 3 | 100〜148 |
| **合計** | **18** | **185〜270** |

---

## 次のステップ（推奨）

### Phase 5（優先度: 高）
1. スクリーンリーダー対応強化
2. QRコード生成失敗時のエラーハンドリング
3. ダウンロード完了通知（Toast）
4. QRコード生成のデバウンス（パフォーマンス）
5. Canvas再利用（パフォーマンス）

**見積もり**: 10〜17時間

---

### Phase 6（優先度: 中 + 技術負債）
1. 暗号化タイプ選択機能
2. SSIDの隠し（Hidden）オプション
3. QRコードのエラー訂正レベル選択
4. i18nリソースの動的ロード
5. ユニットテスト追加
6. CI/CDパイプライン構築

**見積もり**: 34〜49時間

---

### Phase 7以降
- 優先度: 低のタスク
- 将来的な拡張案（PWA、モバイルアプリ等）

---

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2025-11-30 | 初版作成・18タスク定義 |
