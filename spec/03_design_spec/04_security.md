# 4. セキュリティ設計

## 4.1 パストラバーサル攻撃防止

**脅威**: 攻撃者が `/../../../etc/passwd` のようなパスでアクセス権限外のファイルにアクセスする

**対策**:
1. **realpath 検証**: すべてのファイルパスを `fs.realpathSync()` で解決
2. **ルート範囲確認**: 解決済みパスがドキュメントルート以下に収まっているか確認
3. **シンボリックリンク 検証**: シンボリックリンクを自動解決し、対象ファイルの位置を確認

```javascript
// 疑似コード
const docRoot = fs.realpathSync('/home/user/docs');
const requestPath = '/../../../etc/passwd';
const absolutePath = path.resolve(docRoot, requestPath);
const realPath = fs.realpathSync(absolutePath);

if (!realPath.startsWith(docRoot)) {
  // ❌ 拒否
  throw new Error('Access denied');
}
```

## 4.2 Content-Security-Policy (CSP)

**目的**: XSS 攻撃から保護

**実装**:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net https://cdn.skypack.dev;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:
```

## 4.3 HTTP セキュリティヘッダー

| ヘッダー | 値 | 効果 |
|---------|-----|------|
| X-Content-Type-Options | nosniff | MIME タイプスニッフィング防止 |
| X-Frame-Options | DENY | クリックジャッキング防止 |
| X-XSS-Protection | 1; mode=block | XSS 保護（レガシーブラウザ対応） |
| Strict-Transport-Security | max-age=31536000 | HTTPS 強制 |

## 4.4 入力検証

- **ファイルパス**: 全パスを正規化 + realpath 検証
- **クエリパラメータ**: URLデコード + XSS エスケープ
- **ファイルタイプ**: MIME タイプ検証（拡張子のみでなく）

## 4.5 ファイルアクセス制限

**許可対象**:
- ドキュメントルート配下のファイル
- `.md`、`.txt`、`.json`、`.html` 等のテキストファイル
- 静的アセット（CSS、画像、JavaScript）

**拒否対象**:
- バイナリファイル（`.bin`、`.exe` 等）
- システムファイル（`.env`、`.git` 等）
- ドキュメントルート外のファイル
