---
references:
  - ../02_requirements/
description: "設計仕様書：markdown-viewer のアーキテクチャ、技術スタック、コンポーネント設計、セキュリティ設計を定義"
---

# 03_design_spec（設計仕様書）

**最終更新**: 2026-01-24

---

## 概要

このドキュメントは、markdown-viewer の実装アーキテクチャと技術設計を定義する。
**「どう実現するか（How）」を定義する段階。**

「何を満たすべきか（What）」は [02_requirements](../02_requirements/) を参照。

---

## ドキュメント構成

| ファイル | 内容 |
|---------|------|
| [01_architecture.md](./01_architecture.md) | アーキテクチャ概要 |
| [02_tech_stack.md](./02_tech_stack.md) | 技術スタック |
| [03_components.md](./03_components.md) | コンポーネント設計 |
| [04_security.md](./04_security.md) | セキュリティ設計 |
| [05_api.md](./05_api.md) | APIエンドポイント設計 |
| [06_live_reload.md](./06_live_reload.md) | ライブリロード実装 |
| [07_performance.md](./07_performance.md) | パフォーマンス設計 |
| [08_operation.md](./08_operation.md) | 運用設計 |
| [09_deployment.md](./09_deployment.md) | デプロイメント設計 |
| [10_future.md](./10_future.md) | 今後の拡張ポイント |

---

## 更新履歴

| 日付 | 更新内容 |
|------|----------|
| 2026-01-24 | 初版作成：アーキテクチャ、技術スタック、コンポーネント設計、セキュリティ設計、API エンドポイント を定義 |
| 2026-01-24 | ディレクトリ構造に不足ファイル追加（directory.js, api.js, template.js, html.js, navigation.js, icons.js, language.js, port.js, error.js）、APIエンドポイントに /api/search と /health を追加、スタイルシートパス修正 |
