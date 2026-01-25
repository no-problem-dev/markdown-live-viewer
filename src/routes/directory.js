import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validatePath } from '../utils/path.js';
import { getIconClass, formatFileSize } from '../utils/icons.js';
import { renderTemplate } from '../utils/template.js';
import { generateBreadcrumbs } from '../utils/navigation.js';
import { escapeHtml } from '../utils/html.js';

const router = Router();

/**
 * ディレクトリ一覧表示ルート
 */
router.get(/^\/.*/, async (req, res, next) => {
  try {
    const requestPath = req.path;
    const docRoot = req.app.get('docRoot');

    let dirPath;
    try {
      dirPath = validatePath(requestPath, docRoot);
    } catch (error) {
      if (error.code === 'ETRAVERSAL') {
        return res.status(403).send('Access denied');
      }
      throw error;
    }

    // ディレクトリ存在確認
    let stat;
    try {
      stat = await fs.stat(dirPath);
    } catch {
      return next(); // 存在しない場合は次のハンドラへ
    }

    if (!stat.isDirectory()) {
      return next(); // ディレクトリでなければ次のハンドラへ
    }

    // ディレクトリ内容を取得
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // エントリー情報を取得（サイズなど）
    const entriesWithInfo = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        let size = 0;
        let mtime = new Date();

        try {
          const entryStat = await fs.stat(fullPath);
          size = entryStat.size;
          mtime = entryStat.mtime;
        } catch {
          // エラーは無視
        }

        return {
          name: entry.name,
          isDirectory: entry.isDirectory(),
          size,
          mtime
        };
      })
    );

    // ソート（ディレクトリ優先、アルファベット順）
    const sorted = entriesWithInfo.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    // 隠しファイルをフィルタ（オプション）
    const visible = sorted.filter(entry => !entry.name.startsWith('.'));

    // HTML リスト生成
    const listHtml = visible.map(entry => {
      const isDir = entry.isDirectory;
      const href = path.join(requestPath, entry.name) + (isDir ? '/' : '');
      const iconClass = getIconClass(entry.name, isDir);
      const sizeText = isDir ? '-' : formatFileSize(entry.size);

      return `<li class="${iconClass}">
        <a href="${escapeHtml(href)}">${escapeHtml(entry.name)}${isDir ? '/' : ''}</a>
        <span class="size">${sizeText}</span>
      </li>`;
    }).join('\n');

    // 親ディレクトリへのリンク（ルート以外）
    const parentLink = requestPath !== '/'
      ? `<li class="folder parent"><a href="${path.dirname(requestPath)}/">..</a><span class="size">-</span></li>\n`
      : '';

    const html = renderTemplate('page', {
      title: `Index of ${requestPath}`,
      content: `<h1>Index of ${escapeHtml(requestPath)}</h1>
                <ul class="directory-listing">${parentLink}${listHtml}</ul>`,
      breadcrumbs: generateBreadcrumbs(requestPath)
    });

    res.type('html').send(html);
  } catch (error) {
    next(error);
  }
});

export default router;
