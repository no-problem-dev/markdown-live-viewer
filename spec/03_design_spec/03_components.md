# 3. コンポーネント設計

> **Note**: 各コンポーネントのレイヤー配置については [1.3 レイヤー設計](./01_architecture.md#13-レイヤー設計) を参照。

## 3.1 ディレクトリ構造

```
src/
├── index.ts              # エントリーポイント
├── cli.ts                # CLIパーサー（コマンドライン引数処理）
├── server.ts             # Expressサーバー設定（アプリケーション初期化）
├── routes/
│   ├── markdown.ts       # GET /*.md → Markdownレンダリング
│   ├── directory.ts      # GET / → ディレクトリ一覧
│   ├── static.ts         # GET /static/* → 静的ファイル配信
│   ├── raw.ts            # GET /* → rawコード表示
│   └── api.ts            # GET /api/* → API エンドポイント
├── utils/
│   ├── path.ts           # パス検証・正規化（パストラバーサル防止）
│   ├── logger.ts         # 統一ロガー（デバッグ/エラー出力）
│   ├── template.ts       # テンプレートレンダリング
│   ├── html.ts           # HTMLエスケープ等のユーティリティ
│   ├── navigation.ts     # ブレッドクラム生成等
│   ├── icons.ts          # ファイルアイコンマッピング
│   ├── language.ts       # 拡張子→言語マッピング
│   └── port.ts           # ポート検索ユーティリティ
├── middleware/
│   ├── security.ts       # セキュリティヘッダー設定
│   └── error.ts          # エラーハンドリング
├── types/
│   └── index.ts          # 型定義ファイル
└── templates/
    └── page.html         # HTMLテンプレート（レイアウト）
```

## 3.2 各コンポーネントの責務

### 3.2.1 index.ts（エントリーポイント）

**責務**:
- Node.js プロセスの起動
- CLIパーサーの初期化
- サーバーの起動

```typescript
// 疑似コード
import { createServer } from './server';
import { parseCLI } from './cli';
import type { ServerOptions } from './types';

const options: ServerOptions = parseCLI(process.argv.slice(2));
const server = createServer(options);
server.listen(options.port, options.host);
```

### 3.2.2 cli.ts（CLIパーサー）

**責務**:
- コマンドライン引数の解析
- 設定値の検証
- デフォルト値の適用
- サブコマンドの処理

**サポートオプション**:
```
--port <number>       # サーバーポート（デフォルト: 3000）
--host <string>       # バインドアドレス（デフォルト: localhost）
--dir <path>          # ドキュメントルートディレクトリ
--no-watch            # ファイル監視を無効化
--quiet               # ログ出力を抑制
```

**サブコマンド**（DEC-004）:
```
mdv readme            # カレント/親ディレクトリから README.md を検索して表示
```

**README検索ロジック**:
```typescript
// 疑似コード
const findReadme = (startDir: string): string | null => {
  let currentDir = startDir;
  while (currentDir !== path.dirname(currentDir)) {
    const readmePath = path.join(currentDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      return readmePath;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
};
```

### 3.2.3 server.ts（Expressサーバー設定）

**責務**:
- Express アプリケーションの初期化
- ルートの登録
- ミドルウェアの設定

**初期化フロー**:
1. Express インスタンスの作成
2. セキュリティミドルウェアの適用
3. ルートハンドラーの登録
4. エラーハンドリングミドルウェアの設定

### 3.2.4 routes/markdown.ts（Markdownレンダリング）

**責務**:
- .md ファイルの読込
- HTML テンプレートへの埋め込み
- ブラウザへの配信

**処理フロー**:
1. リクエスト URL から ファイルパスを抽出
2. パス検証（`path.js` を使用）
3. ファイルシステムから .md ファイルを読込
4. `page.html` テンプレートに content を埋め込み
5. `Content-Type: text/html` で レスポンス

### 3.2.5 routes/static.ts（静的ファイル配信）

**責務**:
- CSS、JavaScript、画像等の配信
- MIME タイプの自動判定
- キャッシュヘッダーの設定

**対応ファイルタイプ**:
- text/css (*.css)
- application/javascript (*.js)
- image/* (*.png, *.jpg, *.svg, *.gif)
- application/json (*.json)

### 3.2.6 routes/raw.ts（rawコード表示）

**責務**:
- 非.md ファイルのテキスト表示
- コード表示用の HTML ラッパー

**処理フロー**:
1. ファイルを読込
2. `<pre><code>` タグでラップ
3. シンタックスハイライト対象言語を判定
4. `page.html` にembed

### 3.2.7 utils/path.ts（パス検証・正規化）

**責務**:
- リクエスト URL からファイルパスへの変換
- パストラバーサル攻撃の検出・防止
- シンボリックリンク の検証

**検証ロジック**:
```typescript
// 疑似コード
import path from 'path';
import fs from 'fs';

const validatePath = (requestPath: string, rootDir: string): string => {
  // 1. URL パスをファイルシステムパスに変換
  const normalizedPath = path.normalize(requestPath);

  // 2. ドキュメントルート からの相対パスに統一
  const absolutePath = path.resolve(rootDir, normalizedPath);

  // 3. realpath で シンボリックリンク を解決
  const realPath = fs.realpathSync(absolutePath);

  // 4. rootDir 以下に収まっているか確認
  if (!realPath.startsWith(fs.realpathSync(rootDir))) {
    throw new Error('Path traversal detected');
  }

  return realPath;
};
```

### 3.2.8 utils/logger.ts（統一ロガー）

**責務**:
- 統一的なログ出力
- ログレベルの制御（INFO, WARN, ERROR）

**ログレベル**:
| レベル | 用途 | デフォルト出力 |
|--------|------|----------|
| INFO | サーバー起動、ファイル配信 | ✓ |
| WARN | パス検証失敗、非推奨API | ✓ |
| ERROR | サーバーエラー、ファイル読込失敗 | ✓ |
| DEBUG | リクエスト詳細、メモリ使用量 | - |

### 3.2.9 middleware/security.ts（セキュリティヘッダー）

**責務**:
- HTTP セキュリティヘッダーの設定

**設定ヘッダー**:
```typescript
const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "font-src 'self' https://cdn.jsdelivr.net",  // MathJax フォント
    "img-src 'self' data:"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
```

### 3.2.10 templates/page.html（HTMLテンプレート）

**責務**:
- HTML ページ構造の定義
- クライアント側スクリプトの読込

**構成要素**:
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }}</title>
  <style>
    /* 基本スタイル */
  </style>
  <!-- CDN スクリプトの読込 -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/highlight.js@11/dist/highlight.min.js"></script>
  <!-- MathJax 数式レンダリング (DEC-001) -->
  <script>
    MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
      svg: { fontCache: 'global' }
    };
  </script>
  <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" async></script>
</head>
<body>
  <div id="content">{{ content }}</div>
  <script src="/static/js/app.js"></script>
</body>
</html>
```

## 3.3 データフロー

### 3.3.1 Markdown レンダリング フロー

```
ブラウザ リクエスト (GET /docs/example.md)
  ↓
Express ルーター
  ↓
routes/markdown.js
  ↓
utils/path.js → パス検証・正規化
  ↓
ファイルシステム → .md ファイル読込
  ↓
templates/page.html → コンテンツ埋め込み
  ↓
ブラウザ HTML 受信
  ↓
marked.js (クライアント)
  ↓
mermaid.js (図表レンダリング)
  ↓
highlight.js (コード強調)
  ↓
ブラウザ レンダリング完了
```

### 3.3.2 ファイル監視 フロー

```
chokidar → ファイル変更検知
  ↓
WebSocket または Server-Sent Events (SSE)
  ↓
ブラウザ 受信
  ↓
location.reload() または 差分更新
```
