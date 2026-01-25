/**
 * HTML 特殊文字をエスケープ
 * @param {string} str - エスケープ対象文字列
 * @returns {string} - エスケープ済み文字列
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') {
    return '';
  }
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, c => map[c]);
}

/**
 * HTML エスケープを解除
 * @param {string} str - エスケープ解除対象文字列
 * @returns {string} - エスケープ解除済み文字列
 */
export function unescapeHtml(str) {
  if (typeof str !== 'string') {
    return '';
  }
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
}
