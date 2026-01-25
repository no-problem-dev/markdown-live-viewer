# API Reference

## Endpoints

### GET /

Returns directory listing for the document root.

**Response**: HTML page with file/directory list

### GET /{path}

Returns content based on file type:
- `.md` files: Rendered Markdown page
- Code files: Syntax-highlighted display
- Directories: Directory listing

**Parameters**:
- `path` - File or directory path relative to document root

**Response Codes**:
- `200` - Success
- `403` - Access denied (path traversal attempt)
- `404` - File not found

### GET /health

Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-25T00:00:00.000Z",
  "docRoot": "/path/to/documents"
}
```

### GET /api/search

Search for files.

**Query Parameters**:
- `q` (required) - Search query string
- `dir` (optional) - Directory to search in (default: `/`)

**Response**:
```json
{
  "results": ["/path/to/file.md", "/path/to/another.md"],
  "total": 2,
  "query": "search term"
}
```

### GET /static/*

Serves static assets (CSS, JavaScript, favicon).

## Supported File Types

### Markdown Files (.md)
Rendered with:
- GitHub Flavored Markdown
- Syntax highlighting (highlight.js)
- Mermaid diagrams
- MathJax formulas

### Code Files
Displayed with syntax highlighting:
- JavaScript: `.js`, `.mjs`, `.jsx`
- TypeScript: `.ts`, `.tsx`
- Python: `.py`
- Ruby: `.rb`
- Go: `.go`
- Rust: `.rs`
- And many more...

## Error Responses

### 403 Forbidden
```html
<h1>403 - Forbidden</h1>
<p>Access denied: Path traversal detected</p>
```

### 404 Not Found
```html
<h1>404 - Not Found</h1>
<p>The requested file was not found</p>
```

### 500 Internal Server Error
```html
<h1>500 - Internal Server Error</h1>
<p>An unexpected error occurred</p>
```
