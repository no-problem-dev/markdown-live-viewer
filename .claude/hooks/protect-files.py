#!/usr/bin/env python3
"""Edit/Write ツールによる重要ファイルの変更をブロック"""
import json
import sys
import re

# 保護対象パターン
PROTECTED_PATTERNS = [
    r'^\.env',
    r'^\.env\.',
    r'secrets/',
    r'\.git/',
    r'\.ssh/',
    r'config/.*\.prod',
    r'credentials',
    r'\.pem$',
    r'\.key$',
]

def is_protected(file_path: str) -> tuple[bool, str]:
    for pattern in PROTECTED_PATTERNS:
        if re.search(pattern, file_path, re.IGNORECASE):
            return True, pattern
    return False, ""

try:
    data = json.load(sys.stdin)
    tool_input = data.get("tool_input", {})
    file_path = tool_input.get("file_path", "")

    protected, pattern = is_protected(file_path)
    if protected:
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": f"Protected file pattern: {pattern}"
            }
        }
        print(json.dumps(output))

    sys.exit(0)
except Exception as e:
    sys.exit(1)
