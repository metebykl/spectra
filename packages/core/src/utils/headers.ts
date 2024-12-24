export type IncomingHttpHeaders =
  | "accept"
  | "accept-language"
  | "accept-patch"
  | "accept-ranges"
  | "access-control-allow-credentials"
  | "access-control-allow-headers"
  | "access-control-allow-methods"
  | "access-control-allow-origin"
  | "access-control-expose-headers"
  | "access-control-max-age"
  | "access-control-request-headers"
  | "access-control-request-method"
  | "age"
  | "allow"
  | "alt-svc"
  | "authorization"
  | "cache-control"
  | "connection"
  | "content-disposition"
  | "content-encoding"
  | "content-language"
  | "content-length"
  | "content-location"
  | "content-range"
  | "content-type"
  | "cookie"
  | "date"
  | "etag"
  | "expect"
  | "expires"
  | "forwarded"
  | "from"
  | "host"
  | "if-match"
  | "if-modified-since"
  | "if-none-match"
  | "if-unmodified-since"
  | "last-modified"
  | "location"
  | "origin"
  | "pragma"
  | "proxy-authenticate"
  | "proxy-authorization"
  | "public-key-pins"
  | "range"
  | "referer"
  | "retry-after"
  | "sec-websocket-accept"
  | "sec-websocket-extensions"
  | "sec-websocket-key"
  | "sec-websocket-protocol"
  | "sec-websocket-version"
  | "set-cookie"
  | "strict-transport-security"
  | "tk"
  | "trailer"
  | "transfer-encoding"
  | "upgrade"
  | "user-agent"
  | "vary"
  | "via"
  | "warning"
  | "www-authenticate";

export type OutgoingHttpHeaders =
  | "accept"
  | "accept-charset"
  | "accept-encoding"
  | "accept-language"
  | "accept-ranges"
  | "access-control-allow-credentials"
  | "access-control-allow-headers"
  | "access-control-allow-methods"
  | "access-control-allow-origin"
  | "access-control-expose-headers"
  | "access-control-max-age"
  | "access-control-request-headers"
  | "access-control-request-method"
  | "age"
  | "allow"
  | "authorization"
  | "cache-control"
  | "cdn-cache-control"
  | "connection"
  | "content-disposition"
  | "content-encoding"
  | "content-language"
  | "content-length"
  | "content-location"
  | "content-range"
  | "content-security-policy"
  | "content-security-policy-report-only"
  | "cookie"
  | "dav"
  | "dnt"
  | "date"
  | "etag"
  | "expect"
  | "expires"
  | "forwarded"
  | "from"
  | "host"
  | "if-match"
  | "if-modified-since"
  | "if-none-match"
  | "if-range"
  | "if-unmodified-since"
  | "last-modified"
  | "link"
  | "location"
  | "max-forwards"
  | "origin"
  | "pragma"
  | "proxy-authenticate"
  | "proxy-authorization"
  | "public-key-pins"
  | "public-key-pins-report-only"
  | "range"
  | "referer"
  | "referrer-policy"
  | "refresh"
  | "retry-after"
  | "sec-websocket-accept"
  | "sec-websocket-extensions"
  | "sec-websocket-key"
  | "sec-websocket-protocol"
  | "sec-websocket-version"
  | "server"
  | "set-cookie"
  | "strict-transport-security"
  | "te"
  | "trailer"
  | "transfer-encoding"
  | "user-agent"
  | "upgrade"
  | "upgrade-insecure-requests"
  | "vary"
  | "via"
  | "warning"
  | "www-authenticate"
  | "x-content-type-options"
  | "x-dns-prefetch-control"
  | "x-frame-options"
  | "x-xss-protection";