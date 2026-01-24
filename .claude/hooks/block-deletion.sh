#!/bin/bash
# ファイル削除コマンドを完全にブロック

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# 削除コマンドのパターン（正規表現で網羅的にチェック）
DANGEROUS_PATTERNS=(
    '\brm\b'
    '\bunlink\b'
    '\bshred\b'
    '\btruncate\b'
    '\bdd\b.*of='
    '>\s*/dev/null'
    '>\s*[^|]'
    '\bmv\b.*\s/dev/null'
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if echo "$COMMAND" | grep -qiE "$pattern"; then
        echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Deletion command blocked: '"$pattern"'"}}'
        exit 0
    fi
done

# 複合コマンド内の削除チェック
if echo "$COMMAND" | grep -qE '(&&|;|\||\|\|)' && echo "$COMMAND" | grep -qiE '(rm|unlink|shred|dd|truncate)'; then
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Deletion in compound command blocked"}}'
    exit 0
fi

exit 0
