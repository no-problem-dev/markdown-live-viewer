import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { validatePath } from '../utils/path.js';

const router = Router();

/**
 * 画像ファイルの MIME タイプマップ
 */
const IMAGE_MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.avif': 'image/avif'
};

/**
 * 画像ファイル配信ルート
 * Markdownから相対パスで参照される画像を配信
 */
router.get(/^\/.*/, async (req, res, next) => {
  try {
    const requestPath = req.path;
    const ext = path.extname(requestPath).toLowerCase();

    // 画像ファイル以外は次のハンドラへ
    const mimeType = IMAGE_MIME_TYPES[ext];
    if (!mimeType) {
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
    try {
      await fs.access(filePath);
    } catch {
      return next(); // 存在しない場合は次のハンドラへ
    }

    // 画像ファイルを配信
    const imageData = await fs.readFile(filePath);
    res.type(mimeType).send(imageData);
  } catch (error) {
    next(error);
  }
});

export default router;
