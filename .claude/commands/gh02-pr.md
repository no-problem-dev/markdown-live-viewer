---
name: gh02-pr
description: 変更内容を分析し、適切なPRを作成する
---

# Role（役割）

Pull Request 作成担当として振る舞え。変更内容を分析し、適切なPRを作成する。

---

# Request（依頼）

現在のブランチの変更内容に基づき、`develop` ブランチへのPull Requestを作成せよ。

## 実行内容

1. **現状確認**
   - 現在のブランチ名を確認
   - `develop` ブランチとの差分を確認
   - コミット履歴を確認

2. **変更内容の分析**
   - ブランチの分岐点を特定（`git merge-base`）
   - 分岐点からの変更ファイル一覧を取得
   - 変更の種類（新機能/修正/リファクタ等）を判断
   - 主要な変更点を特定
   - **レビュー対象ファイルを明確化**（このブランチで実際に変更したファイルのみ）

3. **PR内容の生成**
   - タイトル: ブランチ種別に応じたプレフィックス + 変更概要
   - 本文: Summary（変更概要）+ Files to Review（レビュー対象）+ Body（詳細）

4. **PR作成**
   - `gh pr create` コマンドでPRを作成
   - Assignee を `rikuProgramer` に設定
   - 作成後、PR URLを報告

---

# Route（実行順序）

```
1. git status / git branch で現在のブランチを確認
2. git merge-base HEAD develop でブランチ分岐点を特定
3. git diff <分岐点>..HEAD --name-status でレビュー対象ファイルを取得
4. git diff develop...HEAD で develop との全差分を確認（参考情報）
5. git log <分岐点>..HEAD でこのブランチのコミット履歴を確認
6. PRタイトル・本文を生成（レビュー対象ファイルを明記）
7. gh pr create --assignee rikuProgramer で PR を作成
8. PR URL を報告
```

---

# Rule（制約・禁止事項）

## PRタイトル規則

| ブランチ種別 | タイトルプレフィックス | 例                                      |
| ------------ | ---------------------- | --------------------------------------- |
| `feat/*`     | `feat:`                | `feat: ユーザープロフィール画面を追加`  |
| `fix/*`      | `fix:`                 | `fix: ログインリダイレクトエラーを修正` |
| `doc/*`      | `docs:`                | `docs: READMEを更新`                    |
| `ref/*`      | `refactor:`            | `refactor: 認証ロジックを分離`          |

## PR本文フォーマット

```markdown
## Summary

- [変更点1]
- [変更点2]
- [変更点3]

## Files to Review

このブランチで実際に変更したファイル（分岐点からの差分）：

- `[ファイルパス1]` - [変更概要]
- `[ファイルパス2]` - [変更概要]
- `[ファイルパス3]` - [変更概要]

> **Note**: developブランチが進んでいる場合、このリストがレビュー対象です。

## Body

- [A:追加, M:修正, D:削除]: [変更ファイル名]
    - [変更内容の詳細]
    - [レビュアーに確認してほしいポイント]
```

## 禁止事項

- `main` ブランチへの直接PR（`develop` 経由必須）
- 空のPR（変更がない状態でのPR作成）
- 曖昧なタイトル（「修正」「更新」のみは不可）
- テスト計画なしのPR

## 運用ルール

- `develop` → `main` のPRは必ずレビュー必須
- 作業ブランチ（feat/fix/doc/ref）は完了後削除
- PRはマージ前にCIチェックをパスすること
- **Assignee は常に `rikuProgramer` に設定すること**

---

# Representation（出力形式）

## 成功時の出力例

```
## PR作成完了

**タイトル**: feat: ユーザープロフィール画面を追加

**URL**: https://github.com/owner/repo/pull/123

**Assignee**: rikuProgramer

**レビュー対象ファイル** (このブランチの変更):
- src/pages/ProfilePage.tsx (新規)
- src/components/UserAvatar.tsx (新規)
- src/hooks/useUserProfile.ts (新規)

**分岐点**: abc1234 (コミットハッシュ)

**次のステップ**:
1. CIチェックの完了を待つ
2. レビュアーにレビューを依頼
3. 承認後、マージ
```

---

# 入力例

```
# 引数なし（自動で現在のブランチからPR作成）
/gh02-pr

# タイトルを指定
/gh02-pr ログイン画面のバリデーション追加

# ドラフトPRとして作成
/gh02-pr --draft
```
