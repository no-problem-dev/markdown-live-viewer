# 9. デプロイメント設計

## 9.1 デプロイ方式

| 環境 | 実行方式 | ノート |
|------|--------|--------|
| **ローカル開発** | `npm start` または `node src/index.js` | ライブリロード有効 |
| **本番環境** | Docker コンテナ または systemd サービス | - |

## 9.2 環境変数

| 変数 | デフォルト | 説明 |
|------|---------|------|
| NODE_ENV | development | 実行環境 |
| PORT | 3000 | バインドポート |
| HOST | localhost | バインドアドレス |
| DOC_DIR | ./ | ドキュメントルート |
| WATCH | true | ファイル監視有効 |

## 9.3 Dockerfile (参考)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]
```
