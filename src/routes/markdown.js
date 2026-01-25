import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validatePath } from '../utils/path.js';
import { renderTemplate } from '../utils/template.js';
import { escapeHtml } from '../utils/html.js';
import { generateBreadcrumbs } from '../utils/navigation.js';

const router = Router();

/**
 * Markdown ファイルのレンダリングルート
 * .md ファイルへのリクエストを処理
 */
router.get(/.*\.md$/i, async (req, res, next) => {
  try {
    const requestPath = req.path;
    const docRoot = req.app.get('docRoot');

    // パス検証（パストラバーサル防止）
    const filePath = validatePath(requestPath, docRoot);

    // ファイル存在確認
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).send('File not found');
    }

    // ファイル読み込み
    const content = await fs.readFile(filePath, 'utf-8');

    // テンプレートにMarkdownを埋め込み（クライアント側でレンダリング）
    const html = renderTemplate('page', {
      title: path.basename(filePath),
      content: `<div id="markdown-source" style="display:none">${escapeHtml(content)}</div>
                <div id="markdown-rendered"></div>`,
      breadcrumbs: generateBreadcrumbs(requestPath)
    });

    res.type('html').send(html);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).send('File not found');
    } else if (error.code === 'ETRAVERSAL') {
      res.status(403).send('Access denied');
    } else {
      next(error);
    }
  }
});

export default router;
