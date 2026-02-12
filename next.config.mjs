/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["https://dj-college.vercel.app"],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://dj-college.vercel.app',
      },
    ],
  },
};

export default nextConfig;
