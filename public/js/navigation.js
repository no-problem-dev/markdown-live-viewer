/**
 * md-lv Navigation Enhancement
 * Keyboard navigation and UI improvements
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initKeyboardNavigation();
  initDirectoryListNavigation();
  initBackToTop();
  initCopyFilename();
});

/**
 * 展開されたディレクトリのパスをlocalStorageから取得
 */
function getExpandedDirectories() {
  try {
    const saved = localStorage.getItem('expanded-directories');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * 展開されたディレクトリのパスをlocalStorageに保存
 */
function saveExpandedDirectories(paths) {
  try {
    localStorage.setItem('expanded-directories', JSON.stringify(paths));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * ディレクトリの展開状態を追加
 */
function addExpandedDirectory(path) {
  const expanded = getExpandedDirectories();
  if (!expanded.includes(path)) {
    expanded.push(path);
    saveExpandedDirectories(expanded);
  }
}

/**
 * ディレクトリの展開状態を削除
 */
function removeExpandedDirectory(path) {
  const expanded = getExpandedDirectories();
  // 閉じたフォルダとその子孫フォルダを全て削除
  const filtered = expanded.filter(p => !p.startsWith(path));
  saveExpandedDirectories(filtered);
}

/**
 * サイドバーナビゲーションを初期化
 */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const closeBtn = document.getElementById('sidebar-close');
  const fileTree = document.getElementById('file-tree');

  if (!sidebar || !fileTree) return;

  // オーバーレイを作成
  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  document.body.appendChild(overlay);

  // 画面サイズを判定
  const isLargeScreen = () => window.innerWidth >= 1024;

  // 初期状態を設定
  const sidebarState = localStorage.getItem('sidebar-state');

  if (isLargeScreen()) {
    // 大画面: デフォルトで表示、明示的に閉じた場合のみ非表示
    if (sidebarState === 'closed') {
      document.body.classList.add('sidebar-closed');
    }
  } else {
    // 小画面: デフォルトで非表示
    if (sidebarState === 'open') {
      document.body.classList.add('sidebar-open');
    }
  }

  // トグルボタンのクリックイベント（小画面用）
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (isLargeScreen()) {
        // 大画面では closed クラスを解除
        document.body.classList.remove('sidebar-closed');
        localStorage.setItem('sidebar-state', 'open');
      } else {
        toggleSidebar();
      }
    });
  }

  // 閉じるボタンのクリックイベント（大画面用）
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (isLargeScreen()) {
        document.body.classList.add('sidebar-closed');
        localStorage.setItem('sidebar-state', 'closed');
      } else {
        closeSidebar();
      }
    });
  }

  // 一括折りたたみボタンのクリックイベント
  const collapseAllBtn = document.getElementById('collapse-all');
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => {
      collapseAllDirectories(fileTree);
    });
  }

  // オーバーレイのクリックでサイドバーを閉じる（小画面用）
  overlay.addEventListener('click', () => {
    closeSidebar();
  });

  // 画面サイズ変更時の処理
  window.addEventListener('resize', () => {
    if (isLargeScreen()) {
      // 大画面に変わった場合、sidebar-openを解除
      document.body.classList.remove('sidebar-open');
    }
  });

  // 現在のパスを取得
  const currentPath = window.location.pathname;

  // ルートディレクトリを読み込み
  loadDirectory('/', fileTree, 0).then(async () => {
    // 保存された展開状態を復元
    const expandedDirs = getExpandedDirectories();
    for (const dirPath of expandedDirs) {
      await expandToPath(dirPath, fileTree);
    }
  });
}

/**
 * サイドバーをトグル
 */
function toggleSidebar() {
  const isOpen = document.body.classList.toggle('sidebar-open');
  localStorage.setItem('sidebar-open', isOpen);
}

/**
 * サイドバーを閉じる
 */
function closeSidebar() {
  document.body.classList.remove('sidebar-open');
  localStorage.setItem('sidebar-open', 'false');
}

/**
 * ディレクトリを読み込んでツリーに表示
 */
async function loadDirectory(dirPath, container, depth) {
  try {
    const response = await fetch(`/api/tree?dir=${encodeURIComponent(dirPath)}`);
    if (!response.ok) throw new Error('Failed to load directory');

    const data = await response.json();

    // 既存のローディング表示を削除
    const loadingEl = container.querySelector('.loading');
    if (loadingEl) loadingEl.remove();

    // アイテムを表示
    data.items.forEach(item => {
      const li = document.createElement('li');

      if (item.isDirectory) {
        // ディレクトリ
        const itemEl = document.createElement('div');
        itemEl.className = 'tree-item';
        itemEl.setAttribute('data-depth', depth);
        itemEl.setAttribute('data-path', item.path);

        // シェブロン
        const chevron = document.createElement('span');
        chevron.className = 'tree-chevron';
        chevron.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

        // アイコン
        const icon = document.createElement('span');
        icon.className = 'tree-icon';
        icon.textContent = '📁';

        // 名前（リンク）
        const name = document.createElement('a');
        name.className = 'tree-name';
        name.href = item.path;
        name.textContent = item.name;

        itemEl.appendChild(chevron);
        itemEl.appendChild(icon);
        itemEl.appendChild(name);

        // 子要素のコンテナ
        const children = document.createElement('ul');
        children.className = 'tree-children';

        // シェブロンのクリックで展開/折りたたみ
        chevron.addEventListener('click', async (e) => {
          e.stopPropagation();
          e.preventDefault();

          const isExpanded = chevron.classList.toggle('expanded');
          children.classList.toggle('expanded', isExpanded);

          // 展開状態をlocalStorageに保存
          if (isExpanded) {
            addExpandedDirectory(item.path);
          } else {
            removeExpandedDirectory(item.path);
          }

          // まだ読み込まれていない場合は読み込む
          if (isExpanded && children.children.length === 0) {
            const loading = document.createElement('li');
            loading.className = 'loading';
            loading.textContent = 'Loading...';
            children.appendChild(loading);

            await loadDirectory(item.path, children, depth + 1);
          }
        });

        li.appendChild(itemEl);
        li.appendChild(children);
      } else {
        // ファイル
        const itemEl = document.createElement('a');
        itemEl.className = 'tree-item';
        itemEl.setAttribute('data-depth', depth);
        itemEl.setAttribute('data-path', item.path);
        itemEl.href = item.path;

        // プレースホルダー（シェブロンの代わり）
        const placeholder = document.createElement('span');
        placeholder.className = 'tree-chevron placeholder';

        // アイコン
        const icon = document.createElement('span');
        icon.className = 'tree-icon';
        icon.textContent = getFileIcon(item.name, item.iconClass);

        // 名前
        const name = document.createElement('span');
        name.className = 'tree-name';
        name.textContent = item.name;

        itemEl.appendChild(placeholder);
        itemEl.appendChild(icon);
        itemEl.appendChild(name);

        // 現在のファイルをハイライト
        if (window.location.pathname === item.path) {
          itemEl.classList.add('active');
        }

        li.appendChild(itemEl);
      }

      container.appendChild(li);
    });
  } catch (error) {
    console.error('Failed to load directory:', error);
    const errorEl = document.createElement('li');
    errorEl.className = 'loading';
    errorEl.textContent = 'Failed to load';
    container.appendChild(errorEl);
  }
}

/**
 * ファイルアイコンを取得
 */
function getFileIcon(name, iconClass) {
  if (iconClass === 'file-md') return '📝';
  if (iconClass === 'file-code') return '💻';
  if (iconClass === 'file-image') return '🖼️';
  if (iconClass === 'file-data') return '📊';
  return '📄';
}

/**
 * 指定されたパスまでツリーを展開
 */
async function expandToPath(targetPath, container) {
  if (targetPath === '/') return;

  const parts = targetPath.split('/').filter(Boolean);
  let currentPath = '/';

  for (let i = 0; i < parts.length; i++) {
    currentPath += parts[i] + '/';

    // 対応するディレクトリアイテムを探す
    const items = container.querySelectorAll('.tree-item[data-path]');
    for (const item of items) {
      const itemPath = item.getAttribute('data-path');
      if (itemPath === currentPath || itemPath === currentPath.slice(0, -1)) {
        const chevron = item.querySelector('.tree-chevron');
        const children = item.nextElementSibling;

        if (chevron && children && !chevron.classList.contains('expanded')) {
          chevron.classList.add('expanded');
          children.classList.add('expanded');
          // 注: 復元時は中間パスを保存しない（ユーザー操作時のみ保存）

          if (children.children.length === 0) {
            const loading = document.createElement('li');
            loading.className = 'loading';
            loading.textContent = 'Loading...';
            children.appendChild(loading);

            const depth = parseInt(item.getAttribute('data-depth')) + 1;
            await loadDirectory(itemPath, children, depth);
          }

          // 次のレベルを探すためにコンテナを更新
          container = children;
        }
        break;
      }
    }
  }
}

/**
 * すべてのディレクトリを折りたたむ
 */
function collapseAllDirectories(container) {
  // 展開されているすべてのシェブロンを取得
  const expandedChevrons = container.querySelectorAll('.tree-chevron.expanded');

  expandedChevrons.forEach(chevron => {
    chevron.classList.remove('expanded');
    const children = chevron.closest('.tree-item').nextElementSibling;
    if (children && children.classList.contains('tree-children')) {
      children.classList.remove('expanded');
    }
  });

  // 保存された展開状態をクリア
  saveExpandedDirectories([]);
}

/**
 * キーボードナビゲーションを初期化
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Alt + Left Arrow: 親ディレクトリへ
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateToParent();
    }

    // Alt + Home: ルートへ
    if (e.altKey && e.key === 'Home') {
      e.preventDefault();
      navigateToRoot();
    }

    // Alt + Up Arrow: ページ先頭へ
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Alt + Down Arrow: ページ末尾へ
    if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    // "/" キー: 検索フォーカス（検索機能がある場合）
    if (e.key === '/' && !isInputFocused()) {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    }

    // Escape: フォーカス解除 / サイドバーを閉じる
    if (e.key === 'Escape') {
      const isLargeScreen = window.innerWidth >= 1024;
      if (!isLargeScreen && document.body.classList.contains('sidebar-open')) {
        closeSidebar();
      } else {
        document.activeElement.blur();
      }
    }

    // Ctrl + B: サイドバートグル
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      const isLargeScreen = window.innerWidth >= 1024;
      if (isLargeScreen) {
        document.body.classList.toggle('sidebar-closed');
        const isClosed = document.body.classList.contains('sidebar-closed');
        localStorage.setItem('sidebar-state', isClosed ? 'closed' : 'open');
      } else {
        toggleSidebar();
      }
    }
  });
}

/**
 * 親ディレクトリへナビゲート
 */
function navigateToParent() {
  const breadcrumbs = document.querySelectorAll('#breadcrumbs a');
  if (breadcrumbs.length >= 1) {
    // 最後から2番目のリンク（親ディレクトリ）
    const parentLink = breadcrumbs[breadcrumbs.length - 1];
    if (parentLink) {
      window.location.href = parentLink.href;
    }
  }
}

/**
 * ルートディレクトリへナビゲート
 */
function navigateToRoot() {
  window.location.href = '/';
}

/**
 * ディレクトリ一覧のキーボードナビゲーション
 */
function initDirectoryListNavigation() {
  const directoryList = document.querySelector('.directory-listing');
  if (!directoryList) return;

  const items = directoryList.querySelectorAll('li a');
  let currentIndex = -1;

  document.addEventListener('keydown', (e) => {
    if (isInputFocused()) return;

    // j/k または ArrowDown/ArrowUp でリスト内を移動
    if (e.key === 'j' || e.key === 'ArrowDown') {
      e.preventDefault();
      currentIndex = Math.min(currentIndex + 1, items.length - 1);
      focusItem(currentIndex);
    }

    if (e.key === 'k' || e.key === 'ArrowUp') {
      e.preventDefault();
      currentIndex = Math.max(currentIndex - 1, 0);
      focusItem(currentIndex);
    }

    // Enter で選択したアイテムを開く
    if (e.key === 'Enter' && currentIndex >= 0) {
      items[currentIndex].click();
    }

    // g で先頭へ
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
      currentIndex = 0;
      focusItem(currentIndex);
    }

    // G (Shift + g) で末尾へ
    if (e.key === 'G') {
      currentIndex = items.length - 1;
      focusItem(currentIndex);
    }
  });

  function focusItem(index) {
    // 前のフォーカスを解除
    items.forEach(item => item.parentElement.classList.remove('keyboard-focus'));

    if (index >= 0 && index < items.length) {
      items[index].parentElement.classList.add('keyboard-focus');
      items[index].focus();
      items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }
}

/**
 * 「トップへ戻る」ボタンを初期化
 */
function initBackToTop() {
  // ボタンを作成
  const button = document.createElement('button');
  button.id = 'back-to-top';
  button.innerHTML = '↑';
  button.title = 'Back to top (Alt + ↑)';
  button.setAttribute('aria-label', 'Back to top');

  // スタイル設定
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'var(--color-link, #0366d6)',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    opacity: '0',
    visibility: 'hidden',
    transition: 'opacity 0.3s, visibility 0.3s',
    zIndex: '1000',
    boxShadow: 'var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1))'
  });

  document.body.appendChild(button);

  // スクロール時の表示制御
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  });

  // クリックでトップへ
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * ファイル名コピーボタンを初期化
 */
function initCopyFilename() {
  const breadcrumbs = document.getElementById('breadcrumbs');
  if (!breadcrumbs) return;

  const currentSpan = breadcrumbs.querySelector('.current');
  if (!currentSpan) return;

  const filename = currentSpan.textContent.trim();
  if (!filename) return;

  // コピーボタンを作成
  const copyButton = document.createElement('button');
  copyButton.id = 'copy-filename';
  copyButton.type = 'button';
  copyButton.title = 'Copy filename';
  copyButton.setAttribute('aria-label', 'Copy filename');
  copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

  // currentSpanの後にボタンを挿入
  currentSpan.insertAdjacentElement('afterend', copyButton);

  // クリックイベント
  copyButton.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(filename);
      showCopySuccess(copyButton);
    } catch (err) {
      // フォールバック: execCommandを使用
      const textArea = document.createElement('textarea');
      textArea.value = filename;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showCopySuccess(copyButton);
      } catch (e) {
        console.error('Copy failed:', e);
      }
      document.body.removeChild(textArea);
    }
  });
}

/**
 * コピー成功時のフィードバック表示
 */
function showCopySuccess(button) {
  const originalHTML = button.innerHTML;
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  button.classList.add('copied');

  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.classList.remove('copied');
  }, 1500);
}

/**
 * 入力フィールドにフォーカスがあるかチェック
 */
function isInputFocused() {
  const active = document.activeElement;
  return active && (
    active.tagName === 'INPUT' ||
    active.tagName === 'TEXTAREA' ||
    active.isContentEditable
  );
}

// グローバルに公開
window.mdvNav = {
  navigateToParent,
  navigateToRoot,
  isInputFocused,
  toggleSidebar,
  closeSidebar,
  collapseAllDirectories
};
