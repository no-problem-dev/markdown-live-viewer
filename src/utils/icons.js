/**
 * ファイル名から適切なアイコンクラスを取得
 * @param {string} fileName - ファイル名
 * @param {boolean} isDirectory - ディレクトリかどうか
 * @returns {string} - CSS クラス名
 */
export function getIconClass(fileName, isDirectory) {
  if (isDirectory) {
    return 'folder';
  }

  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  // 拡張子に基づくアイコンクラス
  const iconMap = {
    // Markdown
    'md': 'file-md',
    'markdown': 'file-md',

    // Code
    'js': 'file-code',
    'ts': 'file-code',
    'jsx': 'file-code',
    'tsx': 'file-code',
    'py': 'file-code',
    'rb': 'file-code',
    'java': 'file-code',
    'c': 'file-code',
    'cpp': 'file-code',
    'h': 'file-code',
    'go': 'file-code',
    'rs': 'file-code',

    // Web
    'html': 'file-web',
    'htm': 'file-web',
    'css': 'file-web',
    'scss': 'file-web',
    'less': 'file-web',

    // Data
    'json': 'file-data',
    'xml': 'file-data',
    'yaml': 'file-data',
    'yml': 'file-data',
    'toml': 'file-data',

    // Images
    'png': 'file-image',
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'gif': 'file-image',
    'svg': 'file-image',
    'webp': 'file-image',

    // Documents
    'pdf': 'file-doc',
    'doc': 'file-doc',
    'docx': 'file-doc',
    'txt': 'file-text'
  };

  return iconMap[ext] || 'file';
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 * @param {number} bytes - バイト数
 * @returns {string} - フォーマット済みサイズ
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i];
}
