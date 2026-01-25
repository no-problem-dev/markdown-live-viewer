/**
 * パスからブレッドクラム HTML を生成
 * @param {string} requestPath - リクエストパス
 * @returns {string} - ブレッドクラム HTML
 */
export function generateBreadcrumbs(requestPath) {
  const parts = requestPath.split('/').filter(Boolean);
  const breadcrumbs = [{ href: '/', text: 'Home' }];

  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    breadcrumbs.push({ href: currentPath, text: decodeURIComponent(part) });
  }

  return breadcrumbs
    .map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      if (isLast) {
        return `<span class="current">${escapeHtml(crumb.text)}</span>`;
      }
      return `<a href="${crumb.href}">${escapeHtml(crumb.text)}</a>`;
    })
    .join(' / ');
}

/**
 * HTML 特殊文字をエスケープ
 * @param {string} str - エスケープ対象文字列
 * @returns {string} - エスケープ済み文字列
 */
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, c => map[c]);
}
