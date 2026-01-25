import { Logger, LOG_LEVELS } from '../../src/utils/logger.js';

describe('Logger', () => {
  let logger;
  let logMock;
  let warnMock;
  let errorMock;
  let originalLog;
  let originalWarn;
  let originalError;

  beforeEach(() => {
    logger = new Logger('DEBUG');

    // コンソールメソッドの保存とモック化
    originalLog = console.log;
    originalWarn = console.warn;
    originalError = console.error;

    logMock = console.log = () => {};
    warnMock = console.warn = () => {};
    errorMock = console.error = () => {};

    // 呼び出し回数をカウント
    let logCallCount = 0;
    let warnCallCount = 0;
    let errorCallCount = 0;
    let lastLogCall = '';

    console.log = (...args) => {
      logCallCount++;
      lastLogCall = args.join(' ');
    };
    console.warn = () => { warnCallCount++; };
    console.error = () => { errorCallCount++; };

    logMock.callCount = () => logCallCount;
    warnMock.callCount = () => warnCallCount;
    errorMock.callCount = () => errorCallCount;
    logMock.getLastCall = () => lastLogCall;

    logMock.reset = () => { logCallCount = 0; lastLogCall = ''; };
    warnMock.reset = () => { warnCallCount = 0; };
    errorMock.reset = () => { errorCallCount = 0; };
  });

  afterEach(() => {
    // コンソールメソッドを復元
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  });

  test('DEBUGレベルで全てのログを出力', () => {
    logger.setLevel('DEBUG');
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    expect(logMock.callCount()).toBe(2);
    expect(warnMock.callCount()).toBe(1);
    expect(errorMock.callCount()).toBe(1);
  });

  test('ERRORレベルでエラーのみ出力', () => {
    logger.setLevel('ERROR');
    logMock.reset();
    warnMock.reset();
    errorMock.reset();

    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    expect(logMock.callCount()).toBe(0);
    expect(warnMock.callCount()).toBe(0);
    expect(errorMock.callCount()).toBe(1);
  });

  test('SILENTレベルで何も出力しない', () => {
    logger.setLevel('SILENT');
    logMock.reset();
    warnMock.reset();
    errorMock.reset();

    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    expect(logMock.callCount()).toBe(0);
    expect(warnMock.callCount()).toBe(0);
    expect(errorMock.callCount()).toBe(0);
  });

  test('メタデータがJSON形式で出力される', () => {
    logMock.reset();
    logger.info('test message', { key: 'value' });

    expect(logMock.getLastCall()).toContain('{"key":"value"}');
  });
});

describe('LOG_LEVELS', () => {
  test('正しい数値順序を持つ', () => {
    expect(LOG_LEVELS.DEBUG).toBeLessThan(LOG_LEVELS.INFO);
    expect(LOG_LEVELS.INFO).toBeLessThan(LOG_LEVELS.WARN);
    expect(LOG_LEVELS.WARN).toBeLessThan(LOG_LEVELS.ERROR);
    expect(LOG_LEVELS.ERROR).toBeLessThan(LOG_LEVELS.SILENT);
  });
});
