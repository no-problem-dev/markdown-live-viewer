/**
 * md-lv Client-side JavaScript
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
 * frontmatter をパースして本文と分離
 * @param {string} markdown - Markdown テキスト
 * @returns {{ frontmatter: Object|null, body: string }}
 */
function parseFrontmatter(markdown) {
  // より柔軟な正規表現: 先頭の---から次の---までをマッチ
  const frontmatterRegex = /^---[ \t]*[\r\n]+([\s\S]*?)[\r\n]+---[ \t]*(?:[\r\n]+|$)/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: null, body: markdown };
  }

  const yamlContent = match[1].trim();
  const body = markdown.slice(match[0].length);

  // frontmatterが空の場合
  if (!yamlContent) {
    return { frontmatter: null, body };
  }

  // YAML パース（key: value 形式、配列形式、複数行文字列に対応）
  const frontmatter = {};
  const lines = yamlContent.split('\n');
  let currentKey = null;
  let multilineMode = null; // 'folded' (>) or 'literal' (|)
  let multilineBuffer = [];
  let multilineStripTrailing = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 複数行モード中の処理
    if (multilineMode && currentKey) {
      // インデントされた行は複数行コンテンツの一部
      if (line.match(/^[ \t]+\S/) || line.trim() === '') {
        // インデントを除去して保存
        const indentMatch = line.match(/^([ \t]+)(.*)$/);
        if (indentMatch) {
          multilineBuffer.push(indentMatch[2]);
        } else if (line.trim() === '') {
          multilineBuffer.push('');
        }
        continue;
      } else {
        // インデントされていない行は複数行モードの終了
        let result = multilineBuffer.join('\n');

        if (multilineMode === 'folded') {
          // 改行を空白に置き換え（空行は段落区切りとして保持）
          result = result.replace(/\n(?!\n)/g, ' ').replace(/\n\n+/g, '\n\n');
        }

        // 末尾の改行を処理
        if (multilineStripTrailing) {
          result = result.replace(/\n+$/, '');
        }

        frontmatter[currentKey] = result.trim();
        multilineMode = null;
        multilineBuffer = [];
        multilineStripTrailing = false;
        // 現在の行を再処理するためにインデックスを戻す
        i--;
        continue;
      }
    }

    // 配列アイテム（- value）のチェック
    const arrayItemMatch = line.match(/^[ \t]+-[ \t]+(.*)$/);
    if (arrayItemMatch && currentKey && !multilineMode) {
      const itemValue = parseYamlValue(arrayItemMatch[1]);
      if (!Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(itemValue);
      continue;
    }

    // key: value 形式のチェック
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0 && !line.match(/^[ \t]/)) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (key) {
        currentKey = key;

        // 複数行文字列の開始記号をチェック
        if (value === '>' || value === '>-' || value === '|' || value === '|-') {
          multilineMode = (value.startsWith('>') ? 'folded' : 'literal');
          multilineStripTrailing = value.endsWith('-');
          multilineBuffer = [];
        } else if (value) {
          // 同じ行に値がある場合
          frontmatter[key] = parseYamlValue(value);
          currentKey = key; // 配列の可能性のためにキーを保持
        }
        // 値が空の場合は次の行で配列または複数行として処理される
      }
    }
  }

  // ファイル終端で複数行モードが残っている場合
  if (multilineMode && currentKey && multilineBuffer.length > 0) {
    let result = multilineBuffer.join('\n');

    if (multilineMode === 'folded') {
      result = result.replace(/\n(?!\n)/g, ' ').replace(/\n\n+/g, '\n\n');
    }

    if (multilineStripTrailing) {
      result = result.replace(/\n+$/, '');
    }

    frontmatter[currentKey] = result.trim();
  }

  return { frontmatter, body };
}

/**
 * YAML の値をパース（クォート除去など）
 */
function parseYamlValue(value) {
  value = value.trim();
  // クォートを除去
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

/**
 * frontmatter をテーブル形式の HTML に変換
 * @param {Object} frontmatter - パースされた frontmatter オブジェクト
 * @returns {string} HTML 文字列
 */
function renderFrontmatterTable(frontmatter) {
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return '';
  }

  const rows = Object.entries(frontmatter)
    .map(([key, value]) => {
      const escapedKey = escapeHtmlForMermaid(key);
      let valueHtml;
      if (Array.isArray(value)) {
        // 配列の場合はリストとして表示
        const items = value.map(item => `<li>${escapeHtmlForMermaid(item)}</li>`).join('');
        valueHtml = `<ul class="frontmatter-list">${items}</ul>`;
      } else {
        valueHtml = escapeHtmlForMermaid(value);
      }
      return `<tr><th>${escapedKey}</th><td>${valueHtml}</td></tr>`;
    })
    .join('');

  return `<div class="frontmatter-container">
    <table class="frontmatter-table">
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}

/**
 * Markdown をレンダリング
 */
function renderMarkdown() {
  const source = document.getElementById('markdown-source');
  const rendered = document.getElementById('markdown-rendered');

  if (source && rendered && typeof marked !== 'undefined') {
    const rawMarkdown = source.textContent;

    // frontmatter をパース
    const { frontmatter, body: markdown } = parseFrontmatter(rawMarkdown);

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

    // frontmatter と Markdown をレンダリング
    const frontmatterHtml = renderFrontmatterTable(frontmatter);
    rendered.innerHTML = frontmatterHtml + marked.parse(markdown);
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
