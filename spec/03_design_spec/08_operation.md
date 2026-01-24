# 8. 運用設計

## 8.1 ロギング

**ログレベルと出力先**:

| レベル | 出力先 | ログ例 |
|--------|--------|--------|
| INFO | stdout | `[INFO] Server started on http://localhost:3000` |
| WARN | stdout | `[WARN] Path traversal attempt detected: /../etc/passwd` |
| ERROR | stderr | `[ERROR] Failed to read file: ENOENT /docs/missing.md` |
| DEBUG | stdout (--debug flag時) | `[DEBUG] Request: GET /README.md` |

## 8.2 エラーハンドリング

**エラー種別と対応**:

| エラー | 対応 | HTTPステータス |
|--------|------|---------|
| ファイル不在 | エラーページ表示 | 404 |
| パストラバーサル | アクセス拒否 | 403 |
| サーバーエラー | スタックトレース記録 | 500 |
| 不正なリクエスト | BAD REQUEST | 400 |

## 8.3 ヘルスチェック

**エンドポイント** (Phase 1 で実装):
```
GET /health HTTP/1.1

レスポンス:
{
  "status": "ok",
  "timestamp": "2026-01-24T10:00:00Z"
}
```
