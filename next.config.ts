const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), camera=(), microphone=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: `
    default-src 'self';
    base-uri 'self';
    form-action 'self';
    script-src 'self' https://static.neshan.org https://unpkg.com;
    script-src-attr 'none';
    style-src 'self' https://unpkg.com 'unsafe-inline';
    style-src-attr 'none';
    img-src 'self' blob: data: https://*.neshan.org https://*.tiles.mapbox.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://static.neshan.org https://vts.neshan.org https://api.neshan.org;
    worker-src 'self' blob:;
    child-src 'self' blob:;
    frame-src 'self' https://*.neshan.org;
  `
      .replace(/\n\s+/g, " ")
      .trim(),
  },
];

const nextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
