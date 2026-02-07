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
      form-action 'self' https://sep.shaparak.ir;
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://www.googletagmanager.com;
      script-src-elem 'self' 'unsafe-inline' https://unpkg.com https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline' https://unpkg.com;
      style-src-attr 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://trustseal.enamad.ir;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://sep.shaparak.ir;
      worker-src 'self' blob:;
    `
      .replace(/\s+/g, " ")
      .trim(),
  },
];

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trustseal.enamad.ir",
      },
    ],
    qualities: [40, 50, 70, 75, 80, 90],
  },
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
