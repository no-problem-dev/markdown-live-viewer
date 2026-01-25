# Architecture

This document describes the architecture of markdown-viewer.

## Overview

markdown-viewer is a Node.js application that serves Markdown files as HTML with live features like syntax highlighting, Mermaid diagrams, and MathJax formulas.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  marked.js  │  highlight.js  │  Mermaid  │  MathJax         │
│  (Markdown) │  (Syntax)      │  (Diagrams)│ (Math)          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP
┌──────────────────────────▼──────────────────────────────────┐
│                     Express Server                           │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer                                            │
│  ┌─────────────┬─────────────┬─────────────┐                │
│  │  Security   │    Error    │   Static    │                │
│  │  Headers    │   Handler   │   Files     │                │
│  └─────────────┴─────────────┴─────────────┘                │
├─────────────────────────────────────────────────────────────┤
│  Route Layer                                                 │
│  ┌─────────────┬─────────────┬─────────────┬───────────┐    │
│  │  Markdown   │  Directory  │    Raw      │   API     │    │
│  │  Router     │  Router     │   Router    │  Router   │    │
│  └─────────────┴─────────────┴─────────────┴───────────┘    │
├─────────────────────────────────────────────────────────────┤
│  Utility Layer                                               │
│  ┌─────────────┬─────────────┬─────────────┬───────────┐    │
│  │    Path     │  Template   │    HTML     │  Logger   │    │
│  │  Validator  │  Renderer   │   Escape    │           │    │
│  └─────────────┴─────────────┴─────────────┴───────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                    File System
```

## Directory Structure

```
markdown-viewer/
├── bin/
│   └── mdv.js              # CLI entry point
├── src/
│   ├── index.js            # Application entry
│   ├── cli.js              # CLI parser (Commander.js)
│   ├── server.js           # Express server setup
│   ├── routes/
│   │   ├── markdown.js     # .md file handler
│   │   ├── directory.js    # Directory listing
│   │   ├── raw.js          # Code file display
│   │   └── api.js          # Search API
│   ├── middleware/
│   │   ├── security.js     # Security headers
│   │   └── error.js        # Error handling
│   └── utils/
│       ├── path.js         # Path validation
│       ├── template.js     # HTML templating
│       ├── html.js         # HTML escaping
│       ├── navigation.js   # Breadcrumbs
│       ├── icons.js        # File icons
│       ├── language.js     # Language detection
│       ├── logger.js       # Logging
│       ├── port.js         # Port management
│       └── readme.js       # README finder
├── templates/
│   ├── page.html           # Main template
│   └── error.html          # Error template
├── public/
│   ├── styles/
│   │   ├── base.css        # Base styles
│   │   └── modern.css      # Modern theme
│   ├── js/
│   │   ├── app.js          # Client app
│   │   ├── navigation.js   # Navigation
│   │   └── search.js       # Search
│   └── favicon.svg         # Favicon
└── tests/
    ├── unit/               # Unit tests
    ├── integration/        # Integration tests
    └── fixtures/           # Test data
```

## Request Flow

1. **Request Arrival**: Client sends HTTP request
2. **Security Middleware**: Apply security headers, check for suspicious patterns
3. **Route Matching**: Match request to appropriate router
4. **Path Validation**: Validate and sanitize file paths
5. **Content Processing**: Read and process file content
6. **Template Rendering**: Embed content in HTML template
7. **Response**: Send HTML response to client
8. **Client Rendering**: Browser renders Markdown using client-side libraries

## Security Architecture

### Path Traversal Prevention
- URL decoding and normalization
- Symlink resolution with `fs.realpathSync()`
- Document root boundary enforcement

### Security Headers
- Content-Security-Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 18+ | Server execution |
| Framework | Express 5.x | HTTP server |
| CLI | Commander.js | Command-line parsing |
| Markdown | marked.js | Client-side rendering |
| Syntax | highlight.js | Code highlighting |
| Diagrams | Mermaid | Diagram rendering |
| Math | MathJax | LaTeX formulas |
| Testing | Jest | Unit/integration tests |
