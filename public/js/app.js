/**
 * markdown-viewer Client-side JavaScript
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Markdown レンダリング
  renderMarkdown();

  // シンタックスハイライト
  highlightCode();

  // Mermaid 図のレンダリング
  await renderMermaid();

  // MathJax レンダリング（Mermaid の後）
  await renderMath();
});

/**
 * Markdown をレンダリング
 */
function renderMarkdown() {
  const source = document.getElementById('markdown-source');
  const rendered = document.getElementById('markdown-rendered');

  if (source && rendered && typeof marked !== 'undefined') {
    const markdown = source.textContent;

    // カスタムレンダラーで Mermaid コードブロックを処理
    let mermaidCounter = 0;
    const renderer = {
      code({ text, lang }) {
        if (lang === 'mermaid') {
          const id = `mermaid-diagram-${mermaidCounter++}`;
          return `<div class="mermaid" id="${id}">${escapeHtmlForMermaid(text)}</div>`;
        }
        // デフォルトのコードブロックレンダリング
        const escaped = escapeHtmlForMermaid(text);
        const langClass = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${langClass}>${escaped}</code></pre>`;
      }
    };

    // marked.js の設定とカスタムレンダラーを適用
    marked.use({
      gfm: true,
      breaks: false,
      pedantic: false,
      renderer
    });

    // Markdown をレンダリング
    rendered.innerHTML = marked.parse(markdown);
  }
}

/**
 * Mermaid 図をレンダリング
 */
async function renderMermaid() {
  const mermaidDivs = document.querySelectorAll('.mermaid');

  if (mermaidDivs.length === 0) return;

  // Mermaid がロードされるまで待機（ESM モジュールは window.mermaid に公開される）
  if (typeof window.mermaid === 'undefined') {
    // Mermaid は ESM モジュールとして読み込まれるため、ポーリングで待機
    let attempts = 0;
    while (typeof window.mermaid === 'undefined' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    // 再度チェック
    if (typeof window.mermaid === 'undefined') {
      console.warn('Mermaid library not loaded');
      mermaidDivs.forEach(div => {
        div.innerHTML = `<pre class="mermaid-error">Mermaid library not loaded</pre>`;
      });
      return;
    }
  }

  try {
    // ダークモードを検出してテーマを決定
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mermaidTheme = isDarkMode ? 'dark' : 'default';

    // Mermaid を初期化（まだ初期化されていない場合）
    window.mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme,
      securityLevel: 'loose',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      }
    });

    // 各 Mermaid ブロックをレンダリング
    for (const div of mermaidDivs) {
      const code = div.textContent;
      const id = div.id || `mermaid-${Date.now()}`;

      try {
        const { svg } = await window.mermaid.render(id + '-svg', code);
        div.innerHTML = svg;
        div.classList.add('mermaid-rendered');
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        div.innerHTML = `<pre class="mermaid-error">Mermaid Error: ${escapeHtmlForMermaid(err.message || 'Unknown error')}</pre>`;
        div.classList.add('mermaid-error');
      }
    }
  } catch (err) {
    console.error('Mermaid initialization error:', err);
  }
}

/**
 * シンタックスハイライトを適用
 */
function highlightCode() {
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

/**
 * MathJax で数式をレンダリング
 * @param {Element} container - レンダリング対象のコンテナ要素（省略時は content 全体）
 */
async function renderMath(container) {
  const target = container || document.getElementById('markdown-rendered') || document.getElementById('content');

  if (!target) return;

  // MathJax がロードされるまで待機（最大2秒）
  if (!window.MathJax || !window.MathJax.typesetPromise) {
    let attempts = 0;
    while ((!window.MathJax || !window.MathJax.typesetPromise) && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.MathJax || !window.MathJax.typesetPromise) {
      console.warn('MathJax library not loaded after 2 seconds');
      return;
    }
  }

  try {
    await window.MathJax.typesetPromise([target]);
  } catch (err) {
    console.error('MathJax rendering error:', err);
  }
}

/**
 * Mermaid 用の HTML エスケープ（最小限）
 */
function escapeHtmlForMermaid(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// グローバルに公開
window.mdv = {
  renderMarkdown,
  highlightCode,
  renderMermaid,
  renderMath
};
