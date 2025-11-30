# Phase 2 プロンプト（最新状況調整版）

**更新日**: 2025-11-30  
**前提**: Phase 1 ワイヤーフレーム完了済み

---

## Phase 2: コンポーネント定義

```
Phase 1 のワイヤーフレームを基に、再利用可能なコンポーネントを定義する。参照資料は docs/requirements.md および docs/wireframe-requirements-memo.md。コンポーネント名は英語（例: Toggle/WifiUrl, Input/Text, Button/Primary）。

対象コンポーネント:
1. **Toggle/WifiUrl**: 2状態トグルスイッチ
   - State 1: Wi-Fi（黒背景 + 白テキスト）
   - State 2: URL（白背景 + 黒テキスト）
   - ボーダー: 2px solid #000000
   - 幅: 各50%（親要素に対して flex で均等配置）

2. **Input/Text**: テキスト入力フィールド
   - State 1: Normal（白背景 + 黒ボーダー 2px）
   - State 2: Focus（黒ボーダー 3px または太字ボーダー）
   - State 3: Error（赤色は使わず、黒で下線または太字テキストで表現）
   - パディング: 12px
   - フォント: system-ui, Segoe UI, Noto Sans JP

3. **Button/Primary**: プライマリアクションボタン
   - スタイル: 黒背景（#000000）+ 白テキスト（#FFFFFF）
   - ボーダー: 2px solid #000000
   - パディング: 16px（py-4）
   - 幅: 全幅（w-full）
   - ホバー: 背景を白、テキストを黒に反転（または軽微なスケール変化）

4. **QRPreview**: QR コードプレビュー枠
   - サイズ: モバイル 256×256px / デスクトップ 320×320px
   - ボーダー: 2px solid #000000
   - 背景: 白（#FFFFFF）
   - 中央配置
   - プレースホルダー: "QR Code Preview" テキストまたはアイコン

5. **ErrorText**: エラーメッセージテキスト
   - フォントサイズ: 12px（text-xs）
   - 色: 黒（#000000）
   - スタイル: 太字または下線で強調
   - 配置: フォーム要素直下

6. **NoticeText**: 注意書きテキスト
   - フォントサイズ: 12px（text-xs）
   - 色: 黒（#000000）
   - 透明度: opacity-70 程度
   - アイコン: ⓘ を先頭に配置

各コンポーネントに i18next のキーを注記:
- mode.wifi → "Wi-Fi"
- mode.url → "URL"
- label.ssid → "SSID"
- label.password → "Password"
- label.url → "URL"
- action.download → "Download PNG"
- error.ssid_required → "SSID is required"
- error.invalid_url → "Invalid URL format"
- notice.wifi → "SSID is required. Password is optional for open networks."
- notice.url → "Include https:// in your URL. It will be added automatically if missing."
- footer.security → "All QR generation happens in your browser. No data is sent to servers."

ノートで「コンポーネント実装時は docs/dev_log.md に反映内容を記録」と明示する。

出力: 
- コンポーネント一覧（各ステート別に表現）
- ステート差分の視覚的な表示
- i18n キー指定の一覧表
- dev_log 記録指示を含むボード
- 最後に「Phase 3 プロンプトを最新状況で調整する」と記載
```

---

## Phase 1 からの引継ぎ事項

### 確定したレイアウト仕様
- **モバイル**: 375px 幅、縦スタック、16px パディング
- **デスクトップ**: 1440px 幅、コンテンツ中央寄せ（max-width ~600px）、24px パディング
- **QR サイズ**: モバイル 256×256px / デスクトップ 320×320px

### 確定したカラースキーム
- **背景**: #FFFFFF（白）
- **テキスト・線・ボーダー**: #000000（黒）
- **強調**: 太字、下線、ボーダー太さ変更（色は黒のまま）

### 確定した視覚階層
1. モード切替トグル
2. 入力フォーム
3. QR プレビュー
4. ダウンロードボタン
5. フッター注意書き

### 技術的制約
- Go バックエンド: 静的配信のみ
- QR 生成: ブラウザ内完結
- i18next: 日英切替
- PNG ダウンロード: Canvas API

---

## コンポーネント命名規則

**パターン**: `[カテゴリ]/[名称]`

例:
- `Toggle/WifiUrl` - Wi-Fi/URL 切替トグル
- `Input/Text` - テキスト入力フィールド
- `Button/Primary` - プライマリボタン
- `QRPreview` - QR プレビュー枠（単独カテゴリ）
- `ErrorText` - エラーメッセージ
- `NoticeText` - 注意書きテキスト

すべて英語で命名し、開発連携を容易にする。

---

## i18next 実装方針

### リソースファイル構成
```
public/
└── i18n/
    ├── ja.json  (日本語)
    └── en.json  (英語)
```

### キーの構造
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
  "action": {
    "download": "Download PNG"
  },
  "error": {
    "ssid_required": "SSID is required",
    "invalid_url": "Invalid URL format"
  },
  "notice": {
    "wifi": "SSID is required. Password is optional for open networks.",
    "url": "Include https:// in your URL. It will be added automatically if missing."
  },
  "footer": {
    "security": "All QR generation happens in your browser. No data is sent to servers."
  }
}
```

---

## Phase 2 で作成するアウトプット

1. **コンポーネント仕様書**:
   - 各コンポーネントの名称、ステート、サイズ、色、ボーダー仕様
   - インタラクション定義（ホバー、フォーカス、クリック）

2. **ステート差分表**:
   - Normal / Focus / Error の視覚的差分
   - Active / Inactive の切替表現

3. **i18n キーマッピング表**:
   - UI 要素と i18next キーの対応表
   - 日本語・英語サンプル文言

4. **実装メモ**:
   - Docker/Go 同居前提の再確認
   - ブラウザ内 QR 生成の技術スタック（qrcode.js 等）
   - Canvas API による PNG 出力の仕様

5. **dev_log 記録指示**:
   - `docs/dev_log.md` に Phase 2 の作業内容を記録するよう明示

---

## 次フェーズへの準備

Phase 2 完了後、Phase 3（ビジュアルデザイン）へ進む。
その際、以下を Phase 3 プロンプトに反映:
- コンポーネントの完成形スタイル
- タイポグラフィ設定（フォントサイズ、行間、ウェイト）
- アクセシビリティ確認（コントラスト比 4.5:1 以上）
- レスポンシブブレークポイントの最終調整
