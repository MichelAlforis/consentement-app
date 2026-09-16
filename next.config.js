/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  // lint + typecheck sont déjà faits explicitement par .githooks/pre-push avant le build —
  // les refaire ici double le temps de build pour rien.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
