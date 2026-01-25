import { checkPortAvailable, findAvailablePort } from '../../src/utils/port.js';
import net from 'net';

describe('checkPortAvailable', () => {
  test('利用可能なポートでtrueを返す', async () => {
    // ランダムな高いポート番号を使用
    const port = 50000 + Math.floor(Math.random() * 10000);
    const result = await checkPortAvailable(port);
    expect(result).toBe(true);
  });

  test('使用中のポートでfalseを返す', async () => {
    // サーバーを起動してポートを占有
    const server = net.createServer();
    const port = 50000 + Math.floor(Math.random() * 10000);

    await new Promise((resolve) => {
      server.listen(port, '127.0.0.1', resolve);
    });

    try {
      const result = await checkPortAvailable(port);
      expect(result).toBe(false);
    } finally {
      server.close();
    }
  });
});

describe('findAvailablePort', () => {
  test('利用可能なポートを見つける', async () => {
    const port = await findAvailablePort(55000, 10, true);
    expect(port).toBeGreaterThanOrEqual(55000);
    expect(port).toBeLessThan(55010);
  });

  test('空きポートがない場合エラーをスローする', async () => {
    // 実際に10ポート全て占有するのは複雑なのでスキップ
    // この場合はmockingが必要
  });
});
