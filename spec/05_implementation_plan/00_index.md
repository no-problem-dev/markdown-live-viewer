---
title: 実装計画書
version: 1.3.0
date: 2026-01-24
status: active
references:
  - document: ../02_requirements/index.md
    section: 機能要件
  - document: ../03_design_spec/00_index.md
    section: システム設計
  - document: ../04_tasks/00_index.md
    section: タスク定義と依存関係
---

# 05. 実装計画書

## 実装フェーズ概要

markdown-viewer プロジェクトの実装を 5 つのフェーズに分割し、段階的に開発を進めます。各フェーズは明確な目標と成果物を定義します。

> **Note**: タスクの詳細定義と依存関係図は [04_tasks](../04_tasks/) を参照してください。
> 本ドキュメントでは実行順序、並列処理戦略、コンフリクト防止策に焦点を当てます。

---

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| [01_parallel_strategy.md](./01_parallel_strategy.md) | 並列処理戦略概要 |
| [02_phase1.md](./02_phase1.md) | Phase 1: 基盤構築 |
| [03_phase2.md](./03_phase2.md) | Phase 2: コア機能 |
| [04_phase3.md](./04_phase3.md) | Phase 3: 追加機能 |
| [05_phase4.md](./05_phase4.md) | Phase 4: 品質保証 |
| [06_phase5.md](./06_phase5.md) | Phase 5: 公開準備 |
| [07_branch_strategy.md](./07_branch_strategy.md) | ブランチ戦略 |
| [08_conflict_prevention.md](./08_conflict_prevention.md) | コンフリクト防止戦略 |
| [09_test_strategy.md](./09_test_strategy.md) | テスト戦略 |

---

## 更新履歴

| バージョン | 日付 | 変更内容 | 作成者 |
|-----------|------|---------|--------|
| 1.0.0 | 2026-01-24 | 初版作成 - 5フェーズの実装計画を定義 | System |
| 1.1.0 | 2026-01-24 | 並列処理戦略、詳細ブランチ戦略、コンフリクト防止策を追加 | Claude Code |
| 1.2.0 | 2026-01-24 | 04_tasks.mdとの整合性確保（ファイル名・依存関係・所有権マップ修正）、bin/mdv.js拡張子統一 | Claude Code |
| 1.3.0 | 2026-01-24 | doc/*ブランチ（ドキュメント用）を追加、ブランチ命名規則に派生元を明記 | Claude Code |

---

## 参考資料

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Jest ドキュメント](https://jestjs.io/)
- [Marked.js](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
- [Mermaid.js](https://mermaid.js.org/)
