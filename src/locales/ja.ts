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
  placeholder: {
    ssid: "SSIDを入力",
    password: "パスワードを入力",
    url: "https://example.com"
  },
  action: {
    download: "PNGダウンロード",
    generate: "QRコード生成"
  },
  error: {
    ssid_required: "SSIDは必須です",
    invalid_url: "無効なURL形式です"
  },
  notice: {
    wifi: "SSIDは必須です。パスワードはオープンネットワークの場合は省略可能です。",
    url: "URLにhttps://を含めてください。省略時は自動で追加されます。",
    security: "すべてのQR生成はブラウザ内で行われます。データはサーバーに送信されません。"
  },
  qr: {
    preview: "QRコードプレビュー",
    scanning_instruction: "コードをスキャンして接続"
  }
};
