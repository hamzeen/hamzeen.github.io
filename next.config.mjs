const repoBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: repoBasePath,
  assetPrefix: repoBasePath || undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
