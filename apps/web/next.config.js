/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@zenthorix/core', '@zenthorix/ui'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.symlinks = true
    return config
  },
}

export default nextConfig
