import net from 'net';

/**
 * 指定ポートが利用可能かチェック
 * @param {number} port - チェックするポート
 * @returns {Promise<boolean>} - 利用可能なら true
 */
export function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port, '127.0.0.1');
  });
}

/**
 * 空きポートを検索
 * @param {number} preferredPort - 優先ポート
 * @param {number} maxAttempts - 最大試行回数（デフォルト: 10）
 * @param {boolean} quiet - ログ出力を抑制するか（デフォルト: false）
 * @returns {Promise<number>} - 利用可能なポート
 * @throws {Error} - 空きポートが見つからない場合
 */
export async function findAvailablePort(preferredPort = 3000, maxAttempts = 10, quiet = false) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = preferredPort + i;
    const isAvailable = await checkPortAvailable(port);
    if (isAvailable) {
      return port;
    }
    if (!quiet) {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
    }
  }
  throw new Error(`No available port found in range ${preferredPort}-${preferredPort + maxAttempts - 1}`);
}
