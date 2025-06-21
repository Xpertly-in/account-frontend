/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com", "www.google.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
