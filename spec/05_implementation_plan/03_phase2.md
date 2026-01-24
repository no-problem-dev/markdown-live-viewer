# Phase 2: コア機能

**目標**: Markdown ファイルの描画と基本的なナビゲーション機能の実装

## 実行順序と並列処理

```mermaid
flowchart LR
    subgraph Step1["Step 1 (並列可)"]
        T2_5["2.5 HTMLテンプレート"]
        T2_6["2.6 CSS基本"]
    end
    subgraph Step2["Step 2 (順次)"]
        T2_3["2.3 ナビゲーション"]
    end
    subgraph Step3["Step 3 (並列可)"]
        T2_1["2.1 MDレンダリング"]
        T2_2["2.2 ディレクトリ一覧"]
    end
    subgraph Step4["Step 4 (順次)"]
        T2_4["2.4 Mermaid"]
    end

    T2_5 --> T2_3
    T2_6 --> T2_3
    T2_3 --> T2_1
    T2_3 --> T2_2
    T2_1 --> T2_4

    style Step1 fill:#ccffcc
    style Step3 fill:#ccffcc
```

| ステップ | タスク | 並列 | ブランチ |
|---------|--------|------|---------|
| 1 | 2.5, 2.6 | **可能** | `feature/p2-templates`, `feature/p2-styles` |
| 2 | 2.3 | - | `feature/p2-navigation` |
| 3 | 2.1, 2.2 | **可能** | `feature/p2-renderer`, `feature/p2-directory` |
| 4 | 2.4 | - | `feature/p2-mermaid` |

## タスク一覧

| # | タスク | 予想工数 | 担当ファイル | 状態 |
|---|--------|---------|-------------|------|
| 2.1 | Markdown レンダリング | 4h | `src/routes/markdown.js` | pending |
| 2.2 | ディレクトリ一覧表示 | 3h | `src/routes/directory.js` | pending |
| 2.3 | ファイルナビゲーション | 2h | `src/utils/navigation.js` | pending |
| 2.4 | Mermaid 図サポート | 3h | `public/js/app.js` | pending |
| 2.5 | HTML テンプレート | 3h | `templates/page.html` | pending |
| 2.6 | CSS スタイリング基本 | 2h | `public/styles/base.css` | pending |

## 成果物

- `src/routes/markdown.js`: Markdown レンダリングルート
- `src/routes/directory.js`: ディレクトリ一覧ルート
- `src/utils/navigation.js`: ナビゲーションユーティリティ
- `public/js/app.js`: クライアントサイドJS（Mermaid処理含む）
- `templates/page.html`: メインテンプレート
- `public/styles/base.css`: 基本スタイルシート

## 確認項目

- [ ] Markdown ファイルが正しく HTML にレンダリングされること
- [ ] コード行番号が表示されること
- [ ] ディレクトリ一覧が表示されること
- [ ] Mermaid 図が正しく表示されること
- [ ] ファイル間のナビゲーションが機能すること
