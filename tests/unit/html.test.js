import { escapeHtml, unescapeHtml } from '../../src/utils/html.js';

describe('escapeHtml', () => {
  test('特殊文字をエスケープする', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
    expect(escapeHtml("'test'")).toBe('&#039;test&#039;');
    expect(escapeHtml('&')).toBe('&amp;');
  });

  test('複数の特殊文字を含む文字列', () => {
    expect(escapeHtml('<a href="test">link</a>'))
      .toBe('&lt;a href=&quot;test&quot;&gt;link&lt;/a&gt;');
  });

  test('非文字列入力で空文字列を返す', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml(123)).toBe('');
  });

  test('通常の文字列はそのまま返す', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });
});

describe('unescapeHtml', () => {
  test('エスケープを解除する', () => {
    expect(unescapeHtml('&lt;script&gt;')).toBe('<script>');
    expect(unescapeHtml('&quot;test&quot;')).toBe('"test"');
    expect(unescapeHtml('&#039;test&#039;')).toBe("'test'");
    expect(unescapeHtml('&amp;')).toBe('&');
  });

  test('エスケープ→アンエスケープの往復', () => {
    const original = '<a href="test">link</a>';
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });
});
