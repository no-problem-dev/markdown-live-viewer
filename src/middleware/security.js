/**
 * セキュリティヘッダーミドルウェア
 */
export function securityHeaders(req, res, next) {
  // Content Security Policy
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "font-src 'self' https://cdn.jsdelivr.net data:",
    "img-src 'self' data: https:",
    "connect-src 'self'"
  ].join('; '));

  // その他のセキュリティヘッダー
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // キャッシュ制御（開発向けに無効化）
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');

  next();
}

/**
 * パストラバーサル検出ミドルウェア
 */
export function pathTraversalGuard(req, res, next) {
  const suspiciousPatterns = [
    /\.\.\//,           // ../
    /\.\.\\/,           // ..\
    /%2e%2e[\/\\]/i,    // URL encoded ../
    /%252e%252e/i,      // Double URL encoded
    /\0/,               // Null byte
  ];

  const path = req.path;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(path)) {
      return res.status(403).send('Access denied: Suspicious path pattern detected');
    }
  }

  next();
}
