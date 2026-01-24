# 2. 技術スタック

## 2.1 実行環境

| 項目 | 選定技術 | バージョン | 理由 |
|------|---------|----------|------|
| **Runtime** | Node.js | 18+ | 標準的で安定した環境。ESM対応。 |
| **Package Manager** | npm | 最新 | Node.js標準。 |
| **Module Format** | ESM | - | 最新のJavaScript標準。CommonJSとの混在を回避。 |

## 2.2 HTTP サーバー

| コンポーネント | 技術 | バージョン | 用途 |
|----------|-----|----------|------|
| **HTTP Framework** | Express | 5.x | 標準的でシンプルなルーティングとミドルウェア |
| **Server Port** | 3000（デフォルト） | - | ローカル開発向けのデフォルトポート |

## 2.3 Markdown 処理

| コンポーネント | 技術 | 実行位置 | 理由 |
|----------|-----|--------|------|
| **MD Parser** | marked | クライアント(CDN) | サーバー側処理を最小化。キャッシュ効率良好。 |
| **Mermaid 図表** | mermaid.js | クライアント(CDN) | インタラクティブな図表レンダリング |
| **Syntax Highlighting** | highlight.js | クライアント(CDN) | 軽量で多言語対応 |
| **数式レンダリング** | MathJax | クライアント(CDN) | LaTeX記法の数式をレンダリング（DEC-001）|

## 2.4 ファイル操作

| コンポーネント | 技術 | 用途 |
|----------|-----|------|
| **File Watcher** | chokidar | ファイル変更検知によるライブリロード |
| **Path Handling** | Node.js path module | パス正規化とセキュリティ検証 |

## 2.5 CSP（Content Security Policy）

| ディレクティブ | 設定値 | 理由 |
|----------|-------|------|
| **default-src** | 'self' | 同一オリジンのみ許可 |
| **script-src** | 'self' https://cdn.jsdelivr.net https://cdn.skypack.dev | CDN経由のライブラリ許可（marked, mermaid, highlight.js, MathJax）|
| **style-src** | 'self' 'unsafe-inline' | インラインスタイルを許可（テンプレート側で使用） |
| **img-src** | 'self' data: | 自オリジンと base64画像 |
| **font-src** | 'self' https://cdn.jsdelivr.net | MathJax フォント読み込み許可 |
