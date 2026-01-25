import fs from 'fs';
import path from 'path';

/**
 * 上位ディレクトリを遡って README.md を検索
 * @param {string} startDir - 検索開始ディレクトリ
 * @returns {string | null} - README.md の絶対パス、見つからない場合は null
 */
export function findReadme(startDir) {
  let currentDir = path.resolve(startDir);
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    // 大文字の README.md を優先
    const readmePath = path.join(currentDir, 'README.md');
    if (fs.existsSync(readmePath)) {
      return readmePath;
    }

    // 小文字の readme.md もチェック
    const readmePathLower = path.join(currentDir, 'readme.md');
    if (fs.existsSync(readmePathLower)) {
      return readmePathLower;
    }

    // Readme.md（キャメルケース）もチェック
    const readmePathCamel = path.join(currentDir, 'Readme.md');
    if (fs.existsSync(readmePathCamel)) {
      return readmePathCamel;
    }

    currentDir = path.dirname(currentDir);
  }

  return null;
}
