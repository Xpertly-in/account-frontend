/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com", "www.google.com"],
  },
};

module.exports = nextConfig;
