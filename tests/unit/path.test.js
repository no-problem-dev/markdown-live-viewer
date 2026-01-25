import { validatePath, isPathSafe } from '../../src/utils/path.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

describe('validatePath', () => {
  const testRoot = path.join(os.tmpdir(), 'mdv-test-' + Date.now());

  beforeAll(() => {
    // テスト用ディレクトリ作成
    fs.mkdirSync(testRoot, { recursive: true });
    fs.mkdirSync(path.join(testRoot, 'subdir'), { recursive: true });
    fs.writeFileSync(path.join(testRoot, 'test.md'), '# Test');
    fs.writeFileSync(path.join(testRoot, 'subdir', 'nested.md'), '# Nested');
  });

  afterAll(() => {
    // クリーンアップ
    fs.rmSync(testRoot, { recursive: true, force: true });
  });

  test('正常なパスを検証する', () => {
    const result = validatePath('/test.md', testRoot);
    expect(result).toBe(path.join(testRoot, 'test.md'));
  });

  test('ネストしたパスを検証する', () => {
    const result = validatePath('/subdir/nested.md', testRoot);
    expect(result).toBe(path.join(testRoot, 'subdir', 'nested.md'));
  });

  test('パストラバーサルを検出する', () => {
    expect(() => {
      validatePath('/../../../etc/passwd', testRoot);
    }).toThrow();
  });

  test('存在しないファイルでENOENTエラー', () => {
    expect(() => {
      validatePath('/nonexistent.md', testRoot);
    }).toThrow();
  });

  test('null バイトを検出する', () => {
    expect(() => {
      validatePath('/test.md\0.txt', testRoot);
    }).toThrow('Null byte detected');
  });
});

describe('isPathSafe', () => {
  const testRoot = path.join(os.tmpdir(), 'mdv-safe-test-' + Date.now());

  beforeAll(() => {
    fs.mkdirSync(testRoot, { recursive: true });
    fs.writeFileSync(path.join(testRoot, 'safe.md'), '# Safe');
  });

  afterAll(() => {
    fs.rmSync(testRoot, { recursive: true, force: true });
  });

  test('安全なパスで valid: true を返す', () => {
    const result = isPathSafe('/safe.md', testRoot);
    expect(result.valid).toBe(true);
    expect(result.path).toBeDefined();
  });

  test('危険なパスで valid: false を返す', () => {
    const result = isPathSafe('/../../../etc/passwd', testRoot);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
