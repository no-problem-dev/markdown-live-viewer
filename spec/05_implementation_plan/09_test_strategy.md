# テスト戦略

## ユニットテスト

**フレームワーク**: Jest
**実行コマンド**: `npm test:unit`

対象モジュール:
- `src/renderer.js` - Markdown レンダリング
- `src/fileHandler.js` - ファイル操作
- `src/security.js` - セキュリティ関数
- `src/portFinder.js` - ポート検索

**目標カバレッジ**: 80% 以上

## 統合テスト

**フレームワーク**: Jest + Supertest
**実行コマンド**: `npm test:integration`

対象シナリオ:
- サーバー起動と停止
- ファイルの取得と表示
- ディレクトリナビゲーション
- エラーハンドリング
- セキュリティ検証

## E2E テスト

**ツール**: Playwright（オプション）
**実行コマンド**: `npm test:e2e`

対象操作:
- ブラウザからのファイル閲覧
- 複数ファイル間のナビゲーション
- 検索機能の動作

## テスト実行フロー

```bash
# ローカル開発時
npm test                # すべてのテスト実行

# PR 前に必須
npm test:unit          # ユニットテスト
npm test:integration   # 統合テスト
npm run lint           # リント
npm run format:check   # コードフォーマット確認

# CI/CD パイプラインで自動実行
```
