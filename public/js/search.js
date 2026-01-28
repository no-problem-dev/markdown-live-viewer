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
  const sidebarSearch = document.getElementById('sidebar-search');
  if (!sidebarSearch) return;

  // 検索コンテナを作成
  sidebarSearch.innerHTML = `
    <div id="search-container">
      <div class="search-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text"
               id="search-input"
               placeholder="Search files... (/)"
               autocomplete="off"
               aria-label="Search files">
        <div id="search-results" class="search-results" hidden></div>
      </div>
    </div>
  `;
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
