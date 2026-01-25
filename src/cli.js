import { Command } from 'commander';
import path from 'path';
import { createServer } from './server.js';
import { findReadme } from './utils/readme.js';
import { findAvailablePort } from './utils/port.js';

const program = new Command();

/**
 * ポート番号を検証
 * @param {string} value - 入力値
 * @returns {number} - 検証済みポート番号
 */
function validatePort(value) {
  const port = parseInt(value, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid port number: ${value}. Must be between 1 and 65535.`);
  }
  return port;
}

/**
 * CLI オプションをパースする
 * @param {string[]} argv - コマンドライン引数
 * @returns {object} - パースされたオプション
 */
export function parseCLI(argv) {
  // Check if readme subcommand is being used
  const args = argv.slice(2);
  const isReadmeCommand = args[0] === 'readme';

  if (isReadmeCommand) {
    // Parse readme subcommand with its options
    program
      .name('mdv readme')
      .description('Find and display the nearest README.md')
      .option('-p, --port <number>', 'Server port', validatePort, 3000);

    program.parse(argv);
    const cmdOptions = program.opts();

    // Handle readme command
    const readmePath = findReadme(process.cwd());

    if (!readmePath) {
      console.error('Error: README.md not found');
      console.error('Searched from:', process.cwd());
      process.exit(1);
    }

    const dirPath = path.dirname(readmePath);
    const fileName = path.basename(readmePath);
    const port = cmdOptions.port || 3000;

    console.log(`Found: ${readmePath}`);

    const app = createServer({ dir: dirPath });

    app.listen(port, 'localhost', async () => {
      const url = `http://localhost:${port}/${fileName}`;
      console.log(`Opening ${url}`);

      // ブラウザを開く
      try {
        const open = await import('open');
        await open.default(url);
      } catch (err) {
        console.log(`Please open manually: ${url}`);
      }
    });

    // Return empty object since we handled the command
    return {};
  }

  // Default: parse as regular server options
  program
    .name('mdv')
    .description('Serve Markdown files as HTML')
    .version('2.0.0')
    .option('-p, --port <number>', 'Server port', validatePort, 3000)
    .option('-H, --host <string>', 'Bind address', 'localhost')
    .option('-d, --dir <path>', 'Document root directory', '.')
    .option('--no-watch', 'Disable file watching')
    .option('-q, --quiet', 'Suppress log output')
    .option('--debug', 'Enable debug logging')
    .allowUnknownOption();

  program.parse(argv);
  return program.opts();
}

/**
 * CLI を実行し、サーバーを起動する
 * @param {string[]} argv - コマンドライン引数
 */
export async function run(argv) {
  try {
    // サブコマンドがある場合は parseCLI 内で処理される
    const args = argv.slice(2);
    if (args[0] === 'readme') {
      parseCLI(argv);
      return;
    }

    const options = parseCLI(argv);
    const app = createServer(options);

    // 空きポートを検索
    let actualPort;
    try {
      actualPort = await findAvailablePort(options.port, 10, options.quiet);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }

    // 元のポートと異なる場合は通知
    if (actualPort !== options.port && !options.quiet) {
      console.log(`Port ${options.port} is in use.`);
    }

    app.listen(actualPort, options.host, () => {
      if (!options.quiet) {
        console.log(`mdv running at http://${options.host}:${actualPort}`);
        console.log(`Document root: ${options.dir}`);
        if (options.debug) {
          console.log('Debug mode enabled');
          console.log('Options:', { ...options, port: actualPort });
        }
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
