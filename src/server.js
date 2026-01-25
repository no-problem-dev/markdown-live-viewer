import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import markdownRouter from './routes/markdown.js';
import rawRouter from './routes/raw.js';
import assetsRouter from './routes/assets.js';
import directoryRouter from './routes/directory.js';
import apiRouter from './routes/api.js';
import { securityHeaders, pathTraversalGuard } from './middleware/security.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Express サーバーを作成
 * @param {object} options - サーバーオプション
 * @param {string} options.dir - ドキュメントルート
 * @returns {express.Application} - Express アプリケーション
 */
export function createServer(options = {}) {
  const app = express();

  // ドキュメントルートの設定
  const docRoot = path.resolve(options.dir || '.');
  app.set('docRoot', docRoot);
  app.set('docRootName', path.basename(docRoot));

  // セキュリティミドルウェア（最初に登録）
  app.use(securityHeaders);
  app.use(pathTraversalGuard);

  // 静的ファイル配信（public ディレクトリ）
  const publicDir = path.join(__dirname, '..', 'public');
  app.use('/static', express.static(publicDir));

  // ヘルスチェック
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      docRoot: docRoot
    });
  });

  // API ルート
  app.use(apiRouter);

  // Markdown ルート（.md ファイル）
  app.use(markdownRouter);

  // Raw コード表示ルート（.js, .py 等）
  app.use(rawRouter);

  // 画像ファイル配信ルート
  app.use(assetsRouter);

  // ディレクトリ一覧ルート
  app.use(directoryRouter);

  // エラーハンドラ（最後に登録）
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
