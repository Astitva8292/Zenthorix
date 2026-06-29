/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@zenthorix/core', '@zenthorix/ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
