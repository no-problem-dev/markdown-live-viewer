# 6. ライブリロード実装

## 6.1 概要

ファイルシステムの変更を監視し、ブラウザを自動リロードする。

## 6.2 実装方式

**選択肢の検討**:

| 方式 | 長所 | 短所 | 採用 |
|------|------|------|------|
| WebSocket | リアルタイム、双方向通信 | ポーラーフロー追加 | ✓ |
| Server-Sent Events (SSE) | 単方向、シンプル | 接続数制限あり | - |
| ポーリング | 古いブラウザ対応 | リソース消費多 | - |

**採用**: **WebSocket** による push 型通知

## 6.3 実装フロー

```javascript
// サーバー側：chokidar で ファイル監視
import chokidar from 'chokidar';

const watcher = chokidar.watch(docDir, { ignored: /(^|[\/\\])\.|node_modules/ });

watcher.on('change', (filePath) => {
  // WebSocket で クライアント に通知
  broadcastToClients({ type: 'reload', path: filePath });
});
```

```javascript
// クライアント側：WebSocket で 通知受信
const ws = new WebSocket('ws://localhost:3000');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'reload') {
    location.reload();
  }
};
```
