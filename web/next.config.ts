import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Standalone output for Docker deployment
   * Optimized for production with minimal dependencies
   */
  output: "standalone",
  
  /**
   * Image optimization disabled for static serving
   * Images will be served as-is by Go backend
   */
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  /**
   * Compression for better performance
   */
  compress: true,

  /**
   * Enable SWC minification for smaller bundles
   */
  // swcMinify: true, // This is enabled by default in Next.js 13+

  /**
   * Optimize chunks for better caching
   */
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react', 'react-dom', 'next'],
  },

  /**
   * Static generation optimizations
   */
  poweredByHeader: false,
  
  /**
   * Security headers
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  /**
   * Redirects for SEO
   */
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ]
  },

  /**
   * Webpack optimizations
   */
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }

    return config
  },

  /**
   * Turbopack configuration
   */
  turbopack: {
    // Enable Turbopack optimizations
    rules: {
      // Add custom rules if needed
    },
  },
};

export default nextConfig;
