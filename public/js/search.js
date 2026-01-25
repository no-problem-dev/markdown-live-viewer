/**
 * md-lv Search Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
});

/**
 * 検索機能を初期化
 */
function initSearch() {
  // 検索 UI を作成
  createSearchUI();

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;

  let debounceTimer;

  // 入力時に検索
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // デバウンス処理（300ms）
    clearTimeout(debounceTimer);

    if (query.length < 1) {
      hideResults();
      return;
    }

    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  });

  // フォーカス時に結果を表示
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 1) {
      showResults();
    }
  });

  // クリック外で結果を非表示
  document.addEventListener('click', (e) => {
    const searchContainer = document.getElementById('search-container');
    if (searchContainer && !searchContainer.contains(e.target)) {
      hideResults();
    }
  });

  // Escape で結果を非表示
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideResults();
      searchInput.blur();
    }

    // Arrow Down で結果にフォーカス
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstResult = searchResults.querySelector('a');
      if (firstResult) firstResult.focus();
    }
  });
}

/**
 * 検索 UI を作成
 */
function createSearchUI() {
  const breadcrumbs = document.getElementById('breadcrumbs');
  if (!breadcrumbs) return;

  // 検索コンテナを作成
  const container = document.createElement('div');
  container.id = 'search-container';
  container.innerHTML = `
    <div class="search-wrapper">
      <input type="text"
             id="search-input"
             placeholder="Search files... (press /)"
             autocomplete="off"
             aria-label="Search files">
      <div id="search-results" class="search-results" hidden></div>
    </div>
  `;

  // スタイルを追加
  const style = document.createElement('style');
  style.textContent = `
    #search-container {
      margin-bottom: 16px;
    }

    .search-wrapper {
      position: relative;
    }

    #search-input {
      width: 100%;
      max-width: 400px;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid var(--color-border, #e1e4e8);
      border-radius: 6px;
      background-color: var(--color-bg, #ffffff);
      color: var(--color-text, #24292e);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    #search-input:focus {
      outline: none;
      border-color: var(--color-link, #0366d6);
      box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.1);
    }

    #search-input::placeholder {
      color: var(--color-text-muted, #6a737d);
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-width: 400px;
      max-height: 300px;
      overflow-y: auto;
      background-color: var(--color-bg, #ffffff);
      border: 1px solid var(--color-border, #e1e4e8);
      border-radius: 6px;
      box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
      z-index: 100;
      margin-top: 4px;
    }

    .search-results[hidden] {
      display: none;
    }

    .search-result-item {
      display: block;
      padding: 8px 12px;
      color: var(--color-text, #24292e);
      text-decoration: none;
      border-bottom: 1px solid var(--color-border, #e1e4e8);
      font-size: 14px;
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .search-result-item:hover,
    .search-result-item:focus {
      background-color: var(--color-bg-secondary, #f6f8fa);
      outline: none;
    }

    .search-result-item .file-name {
      font-weight: 500;
    }

    .search-result-item .file-path {
      color: var(--color-text-muted, #6a737d);
      font-size: 12px;
      margin-top: 2px;
    }

    .search-no-results {
      padding: 12px;
      color: var(--color-text-muted, #6a737d);
      text-align: center;
    }

    .search-loading {
      padding: 12px;
      text-align: center;
      color: var(--color-text-muted, #6a737d);
    }
  `;

  document.head.appendChild(style);

  // ブレッドクラムの後に挿入
  breadcrumbs.parentNode.insertBefore(container, breadcrumbs.nextSibling);
}

/**
 * 検索を実行
 */
async function performSearch(query) {
  const searchResults = document.getElementById('search-results');
  if (!searchResults) return;

  // ローディング表示
  searchResults.innerHTML = '<div class="search-loading">Searching...</div>';
  showResults();

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
      return;
    }

    // 結果を表示
    const html = data.results.map(filePath => {
      const fileName = filePath.split('/').pop();
      const dirPath = filePath.substring(0, filePath.lastIndexOf('/')) || '/';

      return `
        <a href="${escapeHtml(filePath)}" class="search-result-item">
          <div class="file-name">${escapeHtml(fileName)}</div>
          <div class="file-path">${escapeHtml(dirPath)}</div>
        </a>
      `;
    }).join('');

    searchResults.innerHTML = html;

    // キーボードナビゲーション
    const items = searchResults.querySelectorAll('a');
    items.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && index < items.length - 1) {
          e.preventDefault();
          items[index + 1].focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (index > 0) {
            items[index - 1].focus();
          } else {
            document.getElementById('search-input').focus();
          }
        }
      });
    });

  } catch (error) {
    console.error('Search error:', error);
    searchResults.innerHTML = '<div class="search-no-results">Search failed</div>';
  }
}

/**
 * 結果を表示
 */
function showResults() {
  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.hidden = false;
  }
}

/**
 * 結果を非表示
 */
function hideResults() {
  const searchResults = document.getElementById('search-results');
  if (searchResults) {
    searchResults.hidden = true;
  }
}

/**
 * HTML エスケープ
 */
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return str.replace(/[&<>"']/g, c => map[c]);
}

// グローバルに公開
window.mdvSearch = {
  performSearch,
  showResults,
  hideResults
};
