// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static optimization for dynamic routes
  output: "standalone",
  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Ensure proper navigation
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
