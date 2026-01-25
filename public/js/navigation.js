/**
 * md-lv Navigation Enhancement
 * Keyboard navigation and UI improvements
 */

document.addEventListener('DOMContentLoaded', () => {
  initKeyboardNavigation();
  initDirectoryListNavigation();
  initBackToTop();
  initCopyFilename();
});

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

    // Escape: フォーカス解除
    if (e.key === 'Escape') {
      document.activeElement.blur();
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
  isInputFocused
};
