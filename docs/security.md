# Security

## Overview

md-lv implements multiple security measures to protect against common web vulnerabilities.

## Path Traversal Prevention

### Attack Vector
Attackers may attempt to access files outside the document root:
```
GET /../../../etc/passwd
GET /%2e%2e/%2e%2e/etc/passwd
```

### Protections
1. **Pattern Detection**: Block suspicious patterns (`../`, `%2e%2e`, etc.)
2. **Path Normalization**: Resolve `.` and `..` segments
3. **Symlink Resolution**: Follow symlinks and verify final path
4. **Boundary Check**: Ensure resolved path is within document root
5. **Null Byte Detection**: Block null bytes in paths

## Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | self + CDN | Prevent XSS |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| X-Frame-Options | DENY | Prevent clickjacking |
| X-XSS-Protection | 1; mode=block | XSS filter |
| Referrer-Policy | strict-origin-when-cross-origin | Limit referrer info |

## Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
font-src 'self' https://cdn.jsdelivr.net data:;
img-src 'self' data: https:;
connect-src 'self'
```

## HTML Escaping

All user-provided content is escaped before rendering:
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`
- `"` → `&quot;`
- `'` → `&#039;`

## Best Practices for Deployment

1. **Run as Non-Root**: Don't run the server as root user
2. **Limit Document Root**: Set document root to specific directory
3. **Use HTTPS**: Deploy behind HTTPS-enabled reverse proxy
4. **Set NODE_ENV**: Use `NODE_ENV=production` in production
5. **Monitor Logs**: Watch for suspicious access patterns

## Reporting Vulnerabilities

If you discover a security vulnerability, please:
1. Do NOT create a public issue
2. Email the maintainers directly
3. Allow time for a fix before public disclosure
