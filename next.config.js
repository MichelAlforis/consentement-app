/** @type {import('next').NextConfig} */
const isMobileBuild = process.env.NEXT_PUBLIC_MOBILE === 'true';

const nextConfig = {
  reactStrictMode: true,
  ...(isMobileBuild && {
    output: 'export',
    images: { unoptimized: true },
  }),
};

module.exports = nextConfig;
