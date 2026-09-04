/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production';
const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(isDevelopment ? ["'unsafe-eval'"] : []),
  'https://accounts.google.com',
  'https://apis.google.com',
  'https://www.paypal.com',
  'https://*.paypalobjects.com',
].join(' ');
const apiOrigin = (() => { try { return new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').origin; } catch { return 'http://localhost:5000'; } })();
const wsOrigin = apiOrigin.replace(/^http/, 'ws');

const nextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              `default-src 'self'; script-src ${scriptSources}; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' ${apiOrigin} ${wsOrigin} https://accounts.google.com https://apis.google.com https://www.paypal.com https://api-m.sandbox.paypal.com https://api-m.paypal.com; frame-src https://accounts.google.com https://www.sandbox.paypal.com https://www.paypal.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';`,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

