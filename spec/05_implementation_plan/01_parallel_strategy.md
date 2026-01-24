# 並列処理戦略概要

## 並列処理可能なタスクグループ

```mermaid
flowchart TB
    subgraph Legend["凡例"]
        direction LR
        SEQ["順次処理"]
        PAR["並列処理可能"]
        style SEQ fill:#ffcccc
        style PAR fill:#ccffcc
    end
```

各フェーズ内で並列処理可能なタスクを識別し、開発効率を最大化します。

| フェーズ | 並列グループ | タスク | コンフリクトリスク |
|---------|-------------|--------|------------------|
| Phase 1 | Group A | 1.3, 1.4 | 低（異なるファイル） |
| Phase 2 | Group B | 2.5, 2.6 | なし（異なるディレクトリ） |
| Phase 2 | Group C | 2.1, 2.2 | 低（独立モジュール） |
| Phase 3 | Group D | 3.1, 3.2, 3.4 | なし（完全独立） |
| Phase 3 | Group E | 3.3, 3.5 | 低（UI関連だが異なるファイル） |
| Phase 4 | Group F | 4.1, 4.2 | なし（独立モジュール） |
| Phase 5 | Group G | 5.1, 5.2, 5.3, 5.4 | なし（独立ファイル） |

---

## タスク実行順序サマリー

### 全体実行フロー

```mermaid
gantt
    title markdown-viewer 開発タイムライン（並列処理考慮）
    dateFormat  YYYY-MM-DD

    section Phase 1
    1.1 package.json          :p1_1, 2026-01-25, 1d
    1.2 ディレクトリ構造      :p1_2, after p1_1, 1d
    1.3 CLI実装               :p1_3, after p1_2, 2d
    1.4 サーバー起動          :p1_4, after p1_2, 1d
    1.5 統合確認              :p1_5, after p1_3 p1_4, 1d

    section Phase 2
    2.5 HTMLテンプレート      :p2_5, after p1_5, 2d
    2.6 CSS基本               :p2_6, after p1_5, 1d
    2.1 MDレンダリング        :p2_1, after p2_5 p2_6, 2d
    2.2 ディレクトリ一覧      :p2_2, after p2_5 p2_6, 2d
    2.4 Mermaid               :p2_4, after p2_1, 2d
    2.3 ナビゲーション        :p2_3, after p2_2, 1d

    section Phase 3
    3.1 ポート自動選択        :p3_1, after p2_3 p2_4, 1d
    3.2 Raw表示               :p3_2, after p2_3 p2_4, 1d
    3.4 Favicon               :p3_4, after p2_3 p2_4, 1d
    3.3 モダンUI              :p3_3, after p2_3 p2_4, 2d
    3.5 ブレッドクラム        :p3_5, after p2_3 p2_4, 1d
    3.6 検索機能              :p3_6, after p3_3, 2d

    section Phase 4
    4.1 セキュリティ          :p4_1, after p3_6, 2d
    4.2 エラーハンドリング    :p4_2, after p3_6, 1d
    4.3 ユニットテスト        :p4_3, after p4_1 p4_2, 3d
    4.4 統合テスト            :p4_4, after p4_3, 2d
    4.5 レビュー体制          :p4_5, after p4_4, 1d
    4.6 ドキュメント          :p4_6, after p4_5, 2d

    section Phase 5
    5.1 README                :p5_1, after p4_6, 2d
    5.2 CHANGELOG             :p5_2, after p4_6, 1d
    5.3 npm設定               :p5_3, after p4_6, 1d
    5.4 ライセンス            :p5_4, after p4_6, 1d
    5.5 最終テスト            :p5_5, after p5_1 p5_2 p5_3 p5_4, 1d
    5.6 npm publish           :p5_6, after p5_5, 1d
```

### 並列実行可能タスク一覧

| フェーズ | 並列グループ | タスク | 最大並列数 | 効率化 |
|---------|-------------|--------|-----------|--------|
| Phase 1 | A | 1.3 + 1.4 | 2 | 5h → 3h |
| Phase 2 | B | 2.5 + 2.6 | 2 | 5h → 3h |
| Phase 2 | C | 2.1 + 2.2 | 2 | 7h → 4h |
| Phase 2 | D | 2.3 + 2.4 | 2 | 5h → 3h |
| Phase 3 | E | 3.1 + 3.2 + 3.4 | 3 | 4h → 2h |
| Phase 3 | F | 3.3 + 3.5 | 2 | 6h → 4h |
| Phase 4 | G | 4.1 + 4.2 | 2 | 5h → 3h |
| Phase 5 | H | 5.1 + 5.2 + 5.3 + 5.4 | 4 | 7h → 3h |

**合計工数**: 67h（順次） → **約 45h**（並列最適化時）
