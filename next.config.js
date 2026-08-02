/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.thesitebase.net',
      },
      {
        protocol: 'https',
        hostname: 'e-assets.beeketing.net',
      },
    ],
  },
};

module.exports = nextConfig;
