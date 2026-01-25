import path from 'path';
import fs from 'fs';

/**
 * パストラバーサル攻撃を防止するパス検証
 * @param {string} requestPath - リクエストパス
 * @param {string} rootDir - ドキュメントルート
 * @returns {string} - 検証済み絶対パス
 * @throws {Error} - パストラバーサル検出時またはファイル不在時
 */
export function validatePath(requestPath, rootDir) {
  // 1. URL デコード
  const decodedPath = decodeURIComponent(requestPath);

  // 2. null バイトのチェック
  if (decodedPath.includes('\0')) {
    const error = new Error('Null byte detected in path');
    error.code = 'ETRAVERSAL';
    throw error;
  }

  // 3. パス正規化
  const normalizedPath = path.normalize(decodedPath);

  // 4. 絶対パスに変換
  const absolutePath = path.resolve(rootDir, '.' + normalizedPath);

  // 5. realpath でドキュメントルートを解決
  let realRootDir;
  try {
    realRootDir = fs.realpathSync(rootDir);
  } catch (e) {
    realRootDir = path.resolve(rootDir);
  }

  // 6. ファイル/ディレクトリが存在する場合は realpath でシンボリックリンク解決
  let realPath;
  try {
    realPath = fs.realpathSync(absolutePath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // ファイルが存在しない場合は親ディレクトリで検証
      const parentDir = path.dirname(absolutePath);
      let realParent;
      try {
        realParent = fs.realpathSync(parentDir);
      } catch {
        realParent = parentDir;
      }

      if (!realParent.startsWith(realRootDir)) {
        const error = new Error('Path traversal detected');
        error.code = 'ETRAVERSAL';
        throw error;
      }

      // 元のエラーを再スロー（ファイルが存在しない）
      throw e;
    }
    throw e;
  }

  // 7. ドキュメントルート以下か確認
  if (!realPath.startsWith(realRootDir)) {
    const error = new Error('Path traversal detected');
    error.code = 'ETRAVERSAL';
    throw error;
  }

  return realPath;
}

/**
 * パスが安全かどうかをチェック（例外を投げない版）
 * @param {string} requestPath - リクエストパス
 * @param {string} rootDir - ドキュメントルート
 * @returns {{ valid: boolean, path?: string, error?: string }}
 */
export function isPathSafe(requestPath, rootDir) {
  try {
    const safePath = validatePath(requestPath, rootDir);
    return { valid: true, path: safePath };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
