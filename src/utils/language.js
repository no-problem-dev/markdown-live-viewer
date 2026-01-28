/**
 * 拡張子のないファイル名から highlight.js の言語名を取得
 * @param {string} filename - ファイル名
 * @returns {string|null} - highlight.js の言語名、マッチしない場合は null
 */
export function getLanguageFromFilename(filename) {
  const filenameMap = {
    // Build systems
    'Makefile': 'makefile',
    'makefile': 'makefile',
    'GNUmakefile': 'makefile',
    'CMakeLists.txt': 'cmake',

    // Docker
    'Dockerfile': 'dockerfile',
    'dockerfile': 'dockerfile',

    // Git
    '.gitignore': 'plaintext',
    '.gitattributes': 'plaintext',
    '.gitmodules': 'ini',

    // Editor/IDE
    '.editorconfig': 'ini',

    // Shell config
    '.bashrc': 'bash',
    '.bash_profile': 'bash',
    '.zshrc': 'zsh',
    '.profile': 'bash',

    // Node.js
    '.npmrc': 'ini',
    '.nvmrc': 'plaintext',

    // Misc
    'Vagrantfile': 'ruby',
    'Rakefile': 'ruby',
    'Gemfile': 'ruby',
    'Procfile': 'yaml',
    'LICENSE': 'plaintext',
    'CHANGELOG': 'plaintext',
    'AUTHORS': 'plaintext',
    'CONTRIBUTORS': 'plaintext'
  };

  return filenameMap[filename] || null;
}

/**
 * ファイル拡張子から highlight.js の言語名を取得
 * @param {string} ext - ファイル拡張子（.付き）
 * @returns {string} - highlight.js の言語名
 */
export function getLanguageFromExtension(ext) {
  const languageMap = {
    // JavaScript
    '.js': 'javascript',
    '.mjs': 'javascript',
    '.cjs': 'javascript',
    '.jsx': 'javascript',

    // TypeScript
    '.ts': 'typescript',
    '.tsx': 'typescript',

    // Web
    '.html': 'html',
    '.htm': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.less': 'less',

    // Data formats
    '.json': 'json',
    '.xml': 'xml',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.toml': 'toml',

    // Python
    '.py': 'python',
    '.pyw': 'python',

    // Ruby
    '.rb': 'ruby',
    '.erb': 'erb',

    // Go
    '.go': 'go',

    // Rust
    '.rs': 'rust',

    // Java
    '.java': 'java',

    // C/C++
    '.c': 'c',
    '.h': 'c',
    '.cpp': 'cpp',
    '.hpp': 'cpp',
    '.cc': 'cpp',
    '.cxx': 'cpp',

    // Shell
    '.sh': 'bash',
    '.bash': 'bash',
    '.zsh': 'zsh',
    '.fish': 'shell',

    // SQL
    '.sql': 'sql',

    // PHP
    '.php': 'php',

    // Markdown (fallback for non-.md markdown)
    '.markdown': 'markdown',

    // Plain text
    '.txt': 'plaintext',
    '.text': 'plaintext',
    '.log': 'plaintext'
  };

  return languageMap[ext.toLowerCase()] || 'plaintext';
}

/**
 * ファイル拡張子がサポートされているかチェック
 * @param {string} ext - ファイル拡張子（.付き）
 * @returns {boolean}
 */
export function isSupportedExtension(ext) {
  const supportedExtensions = [
    '.js', '.mjs', '.cjs', '.jsx',
    '.ts', '.tsx',
    '.html', '.htm', '.css', '.scss', '.less',
    '.json', '.xml', '.yaml', '.yml', '.toml',
    '.py', '.pyw',
    '.rb', '.erb',
    '.go', '.rs', '.java',
    '.c', '.h', '.cpp', '.hpp', '.cc', '.cxx',
    '.sh', '.bash', '.zsh', '.fish',
    '.sql', '.php',
    '.txt', '.text', '.log'
  ];

  return supportedExtensions.includes(ext.toLowerCase());
}
