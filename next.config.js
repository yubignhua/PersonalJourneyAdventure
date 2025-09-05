/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    return config;
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  },
}

// Only enable code-inspector-plugin when explicitly requested via environment variable
const { CodeInspectorPlugin } = require('code-inspector-plugin');

module.exports = {
  ...nextConfig,
  webpack: (config, options) => {
    // Only enable code-inspector-plugin if explicitly enabled via environment variable
    if (process.env.ENABLE_CODE_INSPECTOR === 'true' && process.env.NODE_ENV === 'development') {
      console.log('🔍 Code Inspector Plugin enabled');
      config.plugins.push(new CodeInspectorPlugin({
        bundler: 'webpack',
        // Exclude React Three Fiber and other 3D libraries from inspection
        exclude: [
          /node_modules\/@react-three\/fiber/,
          /node_modules\/@react-three\/drei/,
          /node_modules\/three/,
          /node_modules\/three-stdlib/,
          /node_modules\/@react-spring/,
          /node_modules\/framer-motion/,
        ],
        // Only inspect specific file patterns
        include: [/\.js$/, /\.jsx$/],
      }));
    }
    return config;
  },
}