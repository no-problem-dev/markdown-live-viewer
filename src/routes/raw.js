import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validatePath } from '../utils/path.js';
import { renderTemplate } from '../utils/template.js';
import { getLanguageFromExtension, getLanguageFromFilename, isSupportedExtension } from '../utils/language.js';
import { escapeHtml } from '../utils/html.js';
import { generateBreadcrumbs } from '../utils/navigation.js';

const router = Router();

/**
 * Raw コード表示ルート
 * 非 Markdown ファイルをシンタックスハイライト付きで表示
 */
router.get(/^\/.*/, async (req, res, next) => {
  try {
    const requestPath = req.path;
    const ext = path.extname(requestPath).toLowerCase();

    // Markdown ファイルは除外（markdown router が処理）
    if (ext === '.md') {
      return next();
    }

    const fileName = path.basename(requestPath);
    const filenameLanguage = getLanguageFromFilename(fileName);

    // サポートされていない拡張子かつファイル名でも判定できない場合は次のハンドラへ
    if (!isSupportedExtension(ext) && !filenameLanguage) {
      return next();
    }

    const docRoot = req.app.get('docRoot');
    let filePath;

    try {
      filePath = validatePath(requestPath, docRoot);
    } catch (error) {
      if (error.code === 'ETRAVERSAL') {
        return res.status(403).send('Access denied');
      }
      throw error;
    }

    // ファイル存在確認
    let stat;
    try {
      stat = await fs.stat(filePath);
    } catch {
      return next(); // 存在しない場合は次のハンドラへ
    }

    // ディレクトリの場合は次のハンドラへ
    if (stat.isDirectory()) {
      return next();
    }

    // ファイル読み込み
    const content = await fs.readFile(filePath, 'utf-8');
    // 拡張子ベースの言語判定を優先し、なければファイル名ベース
    const language = isSupportedExtension(ext) ? getLanguageFromExtension(ext) : (filenameLanguage || 'plaintext');

    const docRootName = req.app.get('docRootName');
    const html = renderTemplate('page', {
      title: `${fileName} - ${docRootName}`,
      content: `<h1>${escapeHtml(fileName)}</h1>
                <pre><code class="language-${language}">${escapeHtml(content)}</code></pre>`,
      breadcrumbs: generateBreadcrumbs(requestPath)
    });

    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
});

export default router;
