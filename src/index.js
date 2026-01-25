import { createServer } from './server.js';
import { parseCLI } from './cli.js';

export { createServer, parseCLI };

// CLI から直接実行された場合
if (process.argv[1] && process.argv[1].includes('index.js')) {
  const options = parseCLI(process.argv);
  const app = createServer(options);

  app.listen(parseInt(options.port, 10), options.host, () => {
    console.log(`mdv running at http://${options.host}:${options.port}`);
    console.log(`Document root: ${options.dir}`);
  });
}
