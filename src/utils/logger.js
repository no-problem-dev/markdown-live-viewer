/**
 * ログレベル
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4
};

/**
 * 統一ロガークラス
 */
class Logger {
  constructor(level = 'INFO') {
    this.level = LOG_LEVELS[level.toUpperCase()] ?? LOG_LEVELS.INFO;
    this.prefix = '[mdv]';
  }

  /**
   * ログレベルを設定
   * @param {string} level - ログレベル名
   */
  setLevel(level) {
    this.level = LOG_LEVELS[level.toUpperCase()] ?? LOG_LEVELS.INFO;
  }

  /**
   * タイムスタンプを生成
   * @returns {string}
   */
  _timestamp() {
    return new Date().toISOString();
  }

  /**
   * ログ出力の共通処理
   * @param {string} levelName - レベル名
   * @param {string} message - メッセージ
   * @param {object} meta - メタデータ
   * @param {function} outputFn - 出力関数
   */
  _log(levelName, message, meta, outputFn) {
    const timestamp = this._timestamp();
    const metaStr = meta && Object.keys(meta).length > 0
      ? ' ' + JSON.stringify(meta)
      : '';
    outputFn(`${timestamp} ${this.prefix} [${levelName}] ${message}${metaStr}`);
  }

  debug(message, meta = {}) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      this._log('DEBUG', message, meta, console.log);
    }
  }

  info(message, meta = {}) {
    if (this.level <= LOG_LEVELS.INFO) {
      this._log('INFO', message, meta, console.log);
    }
  }

  warn(message, meta = {}) {
    if (this.level <= LOG_LEVELS.WARN) {
      this._log('WARN', message, meta, console.warn);
    }
  }

  error(message, meta = {}) {
    if (this.level <= LOG_LEVELS.ERROR) {
      this._log('ERROR', message, meta, console.error);
    }
  }
}

// シングルトンインスタンスをエクスポート
export const logger = new Logger(process.env.LOG_LEVEL || 'INFO');

// クラスもエクスポート（テスト用）
export { Logger, LOG_LEVELS };
