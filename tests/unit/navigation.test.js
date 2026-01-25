import { generateBreadcrumbs } from '../../src/utils/navigation.js';

describe('generateBreadcrumbs', () => {
  test('ルートパスでHomeのみ表示', () => {
    const result = generateBreadcrumbs('/');
    expect(result).toContain('Home');
    expect(result).toContain('class="current"');
  });

  test('1階層のパスでブレッドクラム生成', () => {
    const result = generateBreadcrumbs('/docs');
    expect(result).toContain('<a href="/">Home</a>');
    expect(result).toContain('docs');
  });

  test('深いネストのパスでブレッドクラム生成', () => {
    const result = generateBreadcrumbs('/docs/api/README.md');
    expect(result).toContain('<a href="/">Home</a>');
    expect(result).toContain('<a href="/docs">docs</a>');
    expect(result).toContain('<a href="/docs/api">api</a>');
    expect(result).toContain('README.md');
    expect(result).toContain('class="current"');
  });

  test('URLエンコードされたパスをデコード', () => {
    const result = generateBreadcrumbs('/my%20folder/test%20file.md');
    expect(result).toContain('my folder');
    expect(result).toContain('test file.md');
  });
});
