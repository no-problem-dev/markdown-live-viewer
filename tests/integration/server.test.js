import request from 'supertest';
import { createServer } from '../../src/server.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, '../fixtures');

describe('Server Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = createServer({ dir: fixturesDir });
  });

  describe('Health Check', () => {
    test('GET /health returns 200 with status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.docRoot).toBeDefined();
    });
  });

  describe('Directory Listing', () => {
    test('GET / returns directory listing', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/html/);
      expect(res.text).toContain('Index of');
    });

    test('GET /subdir/ returns subdirectory listing', async () => {
      const res = await request(app).get('/subdir/');
      expect(res.status).toBe(200);
      expect(res.text).toContain('nested.md');
    });
  });

  describe('Markdown Rendering', () => {
    test('GET /test.md returns rendered HTML', async () => {
      const res = await request(app).get('/test.md');
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/html/);
      expect(res.text).toContain('markdown-source');
      expect(res.text).toContain('Test Document');
    });

    test('GET /subdir/nested.md returns nested markdown', async () => {
      const res = await request(app).get('/subdir/nested.md');
      expect(res.status).toBe(200);
      expect(res.text).toContain('Nested Document');
    });

    test('GET /nonexistent.md returns 404', async () => {
      const res = await request(app).get('/nonexistent.md');
      expect(res.status).toBe(404);
    });
  });

  describe('Raw File Display', () => {
    test('GET /script.js returns syntax highlighted HTML', async () => {
      const res = await request(app).get('/script.js');
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/html/);
      expect(res.text).toContain('language-javascript');
    });

    test('GET /data.json returns JSON display', async () => {
      const res = await request(app).get('/data.json');
      expect(res.status).toBe(200);
      expect(res.text).toContain('language-json');
    });
  });

  describe('Static Files', () => {
    test('GET /static/styles/base.css returns CSS', async () => {
      const res = await request(app).get('/static/styles/base.css');
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/css/);
    });

    test('GET /static/js/app.js returns JavaScript', async () => {
      const res = await request(app).get('/static/js/app.js');
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/javascript/);
    });

    test('GET /static/favicon.svg returns SVG', async () => {
      const res = await request(app).get('/static/favicon.svg');
      expect(res.status).toBe(200);
      expect(res.type).toMatch(/svg/);
    });
  });

  describe('Search API', () => {
    test('GET /api/search?q=test returns matching files', async () => {
      const res = await request(app).get('/api/search?q=test');
      expect(res.status).toBe(200);
      expect(res.body.results).toBeDefined();
      expect(Array.isArray(res.body.results)).toBe(true);
    });

    test('GET /api/search with empty query returns empty results', async () => {
      const res = await request(app).get('/api/search?q=');
      expect(res.status).toBe(200);
      expect(res.body.results).toEqual([]);
    });
  });
});
