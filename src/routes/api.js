import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validatePath } from '../utils/path.js';

const router = Router();

/**
 * 再帰的にファイル一覧を取得
 * @param {string} dir - ディレクトリパス
 * @param {string} baseDir - ベースディレクトリ（相対パス計算用）
 * @param {number} maxDepth - 最大深度
 * @param {number} currentDepth - 現在の深度
 * @returns {Promise<string[]>} - ファイルパスの配列
 */
async function getAllFiles(dir, baseDir, maxDepth = 5, currentDepth = 0) {
  if (currentDepth >= maxDepth) return [];

  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      // node_modules をスキップ
      if (entry.name === 'node_modules') continue;

      const fullPath = path.join(dir, entry.name);
      const relativePath = '/' + path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath, baseDir, maxDepth, currentDepth + 1);
        files.push(...subFiles);
      } else {
        files.push(relativePath);
      }
    }
  } catch (error) {
    // ディレクトリ読み取りエラーは無視
  }

  return files;
}

/**
 * 検索 API エンドポイント
 * GET /api/search?q=query&dir=/path
 */
router.get('/api/search', async (req, res) => {
  try {
    const { q, dir = '/' } = req.query;

    if (!q || typeof q !== 'string' || q.length < 1) {
      return res.json({ results: [], total: 0 });
    }

    const docRoot = req.app.get('docRoot');

    let searchDir;
    try {
      searchDir = validatePath(dir, docRoot);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid directory path' });
    }

    // ファイル一覧を取得
    const files = await getAllFiles(searchDir, docRoot);

    // クエリでフィルタ（大文字小文字を区別しない）
    const query = q.toLowerCase();
    const results = files.filter(f => {
      const fileName = path.basename(f).toLowerCase();
      const filePath = f.toLowerCase();
      return fileName.includes(query) || filePath.includes(query);
    });

    // 結果を制限（最大50件）
    res.json({
      results: results.slice(0, 50),
      total: results.length,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
