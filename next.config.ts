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
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.neshan.org https://unpkg.com;
      script-src-elem 'self' 'unsafe-inline' https://static.neshan.org https://unpkg.com;
      style-src 'self' 'unsafe-inline' https://unpkg.com;
      style-src-attr 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.neshan.org https://*.tiles.mapbox.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://static.neshan.org https://vts.neshan.org https://api.neshan.org;
      worker-src 'self' blob:;
      frame-src 'self' https://*.neshan.org;
    `
      .replace(/\s+/g, " ")
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
