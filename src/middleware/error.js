import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// エラーテンプレートを読み込み
let errorTemplate;
try {
  const templatePath = path.join(__dirname, '../../templates/error.html');
  errorTemplate = fs.readFileSync(templatePath, 'utf-8');
} catch {
  // テンプレートが読み込めない場合のフォールバック
  errorTemplate = `
    <!DOCTYPE html>
    <html>
    <head><title>{{title}}</title></head>
    <body>
      <h1>{{statusCode}} - {{title}}</h1>
      <p>{{message}}</p>
      <a href="/">Go to Home</a>
    </body>
    </html>
  `;
}

/**
 * エラーページをレンダリング
 * @param {object} data - テンプレートデータ
 * @returns {string} - レンダリング済み HTML
 */
function renderErrorPage(data) {
  let html = errorTemplate;

  // {{#if details}} ... {{/if}} の処理
  if (data.details) {
    html = html.replace(/\{\{#if details\}\}([\s\S]*?)\{\{\/if\}\}/g, '$1');
  } else {
    html = html.replace(/\{\{#if details\}\}[\s\S]*?\{\{\/if\}\}/g, '');
  }

  // 変数置換
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, value ?? '');
  }

  return html;
}

/**
 * 404 ハンドラ
 */
export function notFoundHandler(req, res, next) {
  logger.warn(`404 Not Found: ${req.path}`, { method: req.method, ip: req.ip });

  res.status(404);
  const html = renderErrorPage({
    statusCode: '404',
    title: 'Page Not Found',
    message: `The requested path "${req.path}" was not found on this server.`,
    details: null
  });
  res.type('html').send(html);
}

/**
 * グローバルエラーハンドラ
 */
export function errorHandler(err, req, res, next) {
  // ステータスコードを決定
  const statusCode = err.statusCode || err.status || 500;

  // エラーをログに記録
  logger.error(`Error ${statusCode}: ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });

  res.status(statusCode);

  // 本番環境ではスタックトレースを隠す
  const isProduction = process.env.NODE_ENV === 'production';

  const html = renderErrorPage({
    statusCode: String(statusCode),
    title: getErrorTitle(statusCode),
    message: isProduction && statusCode >= 500
      ? 'An internal error occurred. Please try again later.'
      : err.message,
    details: !isProduction && err.stack ? err.stack : null
  });

  res.type('html').send(html);
}

/**
 * ステータスコードからエラータイトルを取得
 */
function getErrorTitle(statusCode) {
  const titles = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    408: 'Request Timeout',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };
  return titles[statusCode] || 'Error';
}
