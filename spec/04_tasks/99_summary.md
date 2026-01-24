# タスクサマリー

## 工数集計

| Phase | タスク数 | 合計工数 |
|-------|---------|---------|
| Phase 1: 基盤構築 | 6 | 11h |
| Phase 2: コア機能 | 7 | 19h |
| Phase 3: 追加機能 | 6 | 13h |
| Phase 4: 品質保証 | 6 | 18h |
| Phase 5: 公開準備 | 6 | 10h |
| **合計** | **31** | **71h** |

---

## 全タスク一覧

### Phase 1: 基盤構築

| ID | タスク | 予想工数 | 担当ファイル |
|---|--------|---------|-------------|
| 1.1 | package.json と ESM 設定 | 2h | `package.json` |
| 1.2 | ディレクトリ構造作成 | 1h | `src/`, `bin/`, `templates/` |
| 1.3 | Commander.js による CLI 実装 | 3h | `src/cli.ts`, `bin/mdv.js` |
| 1.4 | 基本サーバー起動機能 | 2h | `src/server.ts` |
| 1.5 | ポート指定と起動確認 | 1h | `src/cli.ts`, `src/server.ts` |
| 1.6 | `mdv readme` サブコマンド実装 | 2h | `src/cli.ts`, `src/utils/readme.ts` |

### Phase 2: コア機能

| ID | タスク | 予想工数 | 担当ファイル |
|---|--------|---------|-------------|
| 2.1 | Markdown レンダリング | 4h | `src/routes/markdown.ts` |
| 2.2 | ディレクトリ一覧表示 | 3h | `src/routes/directory.ts` |
| 2.3 | ファイルナビゲーション | 2h | `src/utils/navigation.ts` |
| 2.4 | Mermaid 図サポート | 3h | `public/js/app.js` |
| 2.5 | HTML テンプレート | 3h | `templates/page.html` |
| 2.6 | CSS スタイリング基本 | 2h | `public/styles/base.css` |
| 2.7 | MathJax 数式サポート | 2h | `templates/page.html`, `public/js/app.js` |

### Phase 3: 追加機能

| ID | タスク | 予想工数 | 担当ファイル |
|---|--------|---------|-------------|
| 3.1 | 複数インスタンス対応 | 2h | `src/utils/port.ts` |
| 3.2 | Raw コード表示 | 1h | `src/routes/raw.ts` |
| 3.3 | モダン UI スタイリング | 4h | `public/styles/modern.css` |
| 3.4 | Favicon 追加 | 1h | `public/favicon.ico` |
| 3.5 | ナビゲーション強化 | 2h | `public/js/navigation.js` |
| 3.6 | 検索機能 (opt) | 3h | `src/routes/api.ts`, `public/js/search.js` |

### Phase 4: 品質保証

| ID | タスク | 予想工数 | 担当ファイル |
|---|--------|---------|-------------|
| 4.1 | セキュリティ対策 | 3h | `src/utils/path.ts`, `src/middleware/security.ts` |
| 4.2 | エラーハンドリング | 2h | `src/middleware/error.ts`, `src/utils/logger.ts` |
| 4.3 | ユニットテスト | 5h | `tests/unit/**` |
| 4.4 | 統合テスト | 4h | `tests/integration/**` |
| 4.5 | レビュー体制構築 | 1h | `.github/`, `CONTRIBUTING.md` |
| 4.6 | ドキュメンテーション | 3h | `docs/**` |

### Phase 5: 公開準備

| ID | タスク | 予想工数 | 担当ファイル |
|---|--------|---------|-------------|
| 5.1 | README 作成 | 3h | `README.md` |
| 5.2 | CHANGELOG 作成 | 2h | `CHANGELOG.md` |
| 5.3 | npm パッケージ設定 | 1h | `package.json` |
| 5.4 | ライセンス設定 | 1h | `LICENSE` |
| 5.5 | 最終テスト | 2h | - |
| 5.6 | npm publish | 1h | - |
