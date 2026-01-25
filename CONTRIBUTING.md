# Contributing to markdown-viewer

Thank you for your interest in contributing to markdown-viewer! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/markdown-viewer.git
   cd markdown-viewer
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run tests to ensure everything works:
   ```bash
   npm test
   ```

## Development Workflow

### Branch Naming

- `feat/` - New features (e.g., `feat/dark-mode`)
- `fix/` - Bug fixes (e.g., `fix/path-traversal`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/server-structure`)
- `test/` - Test additions or fixes (e.g., `test/security-tests`)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Example:
```
feat: add dark mode support

- Add CSS variables for theming
- Implement prefers-color-scheme media query
- Update documentation

Closes #123
```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage
```

### Code Style

- Use ES modules (ESM) with `import`/`export`
- Use `const` by default, `let` when reassignment is needed
- No semicolons (unless required for ASI issues)
- 2 spaces for indentation
- Single quotes for strings

## Pull Request Process

1. Create a new branch from `develop`
2. Make your changes
3. Write or update tests as needed
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request to `develop`
7. Wait for review and address any feedback

## Reporting Issues

- Use the issue templates provided
- Include as much detail as possible
- For security vulnerabilities, please email directly instead of creating a public issue

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
