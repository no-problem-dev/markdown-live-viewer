# Development Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

## Setup

```bash
# Clone repository
git clone https://github.com/no-problem-dev/markdown-live-viewer.git
cd markdown-live-viewer

# Install dependencies
npm install

# Start development server
npm start
```

## Project Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start the server |
| `npm test` | Run all tests |
| `npm run test:unit` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:coverage` | Run tests with coverage |

## Development Server

```bash
# Start with default settings
npm start

# Start with custom port
npm start -- --port 8080

# Start with debug logging
npm start -- --debug

# Start with specific directory
npm start -- --dir /path/to/docs
```

## Testing

### Unit Tests
Located in `tests/unit/`. Test individual modules:
- `path.test.js` - Path validation
- `html.test.js` - HTML escaping
- `navigation.test.js` - Breadcrumbs
- `logger.test.js` - Logging
- `port.test.js` - Port utilities

### Integration Tests
Located in `tests/integration/`. Test full request/response:
- `server.test.js` - Server endpoints
- `security.test.js` - Security features
- `error.test.js` - Error handling

### Writing Tests

```javascript
// Unit test example
import { escapeHtml } from '../../src/utils/html.js';

describe('escapeHtml', () => {
  test('escapes special characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });
});
```

```javascript
// Integration test example
import request from 'supertest';
import { createServer } from '../../src/server.js';

describe('Server', () => {
  test('GET /health returns 200', async () => {
    const app = createServer({ dir: './tests/fixtures' });
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});
```

## Code Style

- ES Modules (`import`/`export`)
- No semicolons
- 2-space indentation
- Single quotes for strings
- `const` by default, `let` when needed

## Adding New Features

1. Create feature branch: `git checkout -b feat/feature-name`
2. Implement feature in `src/`
3. Add tests in `tests/`
4. Update documentation if needed
5. Submit pull request

## Debugging

### Enable Debug Logging
```bash
npm start -- --debug
```

### Environment Variables
- `LOG_LEVEL` - Set logging level (DEBUG, INFO, WARN, ERROR, SILENT)
- `NODE_ENV` - Set environment (development, production)

### VS Code Debug Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Server",
  "program": "${workspaceFolder}/bin/mdv.js",
  "args": ["--debug"]
}
```
