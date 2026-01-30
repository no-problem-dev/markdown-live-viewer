# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.3] - 2026-01-31

### Fixed

- **Sidebar Folder State**: Fixed issue where folders would stay open after navigating to other files

## [1.2.0] - 2026-01-25

### Added

- **Copy Filename Button**: Added a button next to the current filename in breadcrumbs to copy the filename to clipboard

## [2.0.0] - 2026-01-25

### Added

- **ESM Support**: Full ECMAScript Modules support with `"type": "module"`
- **Express 5.x**: Upgraded from Connect to Express 5.x framework
- **Mermaid Diagrams**: Render flowcharts, sequence diagrams, and more
- **MathJax Support**: LaTeX math formula rendering with `$...$` and `$$...$$`
- **Dark Mode**: Automatic theme switching based on system preferences
- **Search Functionality**: Client-side file search with real-time results
- **Keyboard Navigation**: Vim-style navigation (j/k) and shortcuts
- **Security Headers**: CSP, X-Content-Type-Options, X-Frame-Options, etc.
- **Path Traversal Protection**: Enhanced security against directory traversal attacks
- **Modern UI**: Improved styling with CSS custom properties
- **README Command**: `mdv readme` to find and open nearest README.md
- **Port Auto-Selection**: Automatically find available port if specified port is in use
- **Integration Tests**: Comprehensive test suite with Jest and Supertest
- **GitHub Actions CI**: Automated testing on Node.js 18, 20, and 22

### Changed

- **CLI Parser**: Migrated from meow to Commander.js
- **Directory Structure**: Reorganized to `src/`, `routes/`, `middleware/`, `utils/`
- **Template System**: Simplified HTML templating with mustache-style variables
- **Logging**: Unified logger with configurable log levels
- **Error Handling**: Centralized error handling with custom error pages
- **Node.js Requirement**: Minimum version is now Node.js 18.0.0

### Removed

- **CommonJS Support**: No longer supports `require()` imports
- **Connect Framework**: Replaced with Express 5.x
- **Bluebird**: Using native Promises
- **meow**: Replaced with Commander.js
- **markdown-it**: Moved to client-side marked.js rendering
- **LiveReload**: Removed in favor of manual refresh (may be re-added)

### Security

- Path traversal prevention with symlink resolution
- Null byte injection protection
- Security headers (CSP, X-Frame-Options, etc.)
- Input validation and HTML escaping

### Fixed

- Unicode file name handling
- URL encoding in breadcrumbs
- Memory leaks in template caching

## [1.x.x] - Previous Versions

See the [archived markserv changelog](archived-markserv/CHANGELOG.md) for previous version history.
