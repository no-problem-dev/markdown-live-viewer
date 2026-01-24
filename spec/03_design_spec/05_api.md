# 5. APIエンドポイント設計

## 5.1 エンドポイント一覧

| メソッド | パス | 説明 | レスポンス | ステータス |
|----------|------|------|-----------|----------|
| GET | / | ルートディレクトリ一覧 | HTML(ディレクトリ一覧) | 200 |
| GET | /*.md | Markdown レンダリング | HTML(レンダリング済み) | 200 |
| GET | /* | 非MD ファイルのraw表示 | HTML(コード表示) | 200 |
| GET | /static/* | 静的ファイル配信 | ファイルコンテンツ | 200 |
| GET | /api/search | ファイル検索API | JSON(検索結果) | 200 |
| GET | /health | ヘルスチェック | JSON(status) | 200 |

## 5.2 エンドポイント詳細

### 5.2.1 GET / - ルートディレクトリ一覧

**リクエスト例**:
```
GET / HTTP/1.1
Host: localhost:3000
```

**レスポンス例** (200 OK):
```html
<!DOCTYPE html>
<html>
<head><title>Directory Listing</title></head>
<body>
  <h1>Folder: /</h1>
  <ul>
    <li><a href="/docs/">docs/</a></li>
    <li><a href="/README.md">README.md</a></li>
  </ul>
</body>
</html>
```

**エラーレスポンス**:
```html
<!-- 404 Not Found -->
<h1>404 - Directory not found</h1>
```

### 5.2.2 GET /*.md - Markdownレンダリング

**リクエスト例**:
```
GET /README.md HTTP/1.1
Host: localhost:3000
```

**レスポンス例** (200 OK):
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>README.md</title>
  <link rel="stylesheet" href="/static/styles/base.css">
</head>
<body>
  <div id="content">
    <!-- Markdown HTML が埋め込まれる -->
    <h1>プロジェクト概要</h1>
    <p>このプロジェクトは...</p>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="/static/js/app.js"></script>
</body>
</html>
```

**エラーレスポンス**:
```html
<!-- 404 Not Found -->
<h1>404 - File not found</h1>

<!-- 403 Forbidden (パストラバーサル検出時) -->
<h1>403 - Access Denied</h1>
```

### 5.2.3 GET /* - 非MDファイルのraw表示

**リクエスト例**:
```
GET /src/index.js HTTP/1.1
Host: localhost:3000
```

**レスポンス例** (200 OK):
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>index.js</title>
  <link rel="stylesheet" href="/static/styles/base.css">
</head>
<body>
  <pre><code class="language-javascript">
import express from 'express';

const app = express();
...
  </code></pre>
  <script src="https://cdn.jsdelivr.net/npm/highlight.js@11/dist/highlight.min.js"></script>
  <script src="/static/js/app.js"></script>
</body>
</html>
```

**対応ファイル拡張子**:
- `.js`, `.ts`, `.jsx`, `.tsx`
- `.html`, `.css`, `.scss`
- `.json`, `.yaml`, `.yml`
- `.py`, `.rb`, `.go`, `.rs`, `.java`, `.cpp`, `.c`, `.h`
- `.sh`, `.bash`, `.zsh`
- `.md`, `.txt`

### 5.2.4 GET /static/* - 静的ファイル配信

**リクエスト例**:
```
GET /static/style.css HTTP/1.1
Host: localhost:3000
```

**レスポンス例** (200 OK):
```
Content-Type: text/css
Cache-Control: public, max-age=86400

body { font-family: sans-serif; }
...
```

**キャッシュ戦略**:
| ファイルタイプ | キャッシュ期間 | 理由 |
|----------|----------|------|
| CSS, JS | 1日（86400秒） | 変更頻度低 |
| 画像 | 7日 | 変更頻度低 |
| HTML | キャッシュなし | ライブリロード対応 |
