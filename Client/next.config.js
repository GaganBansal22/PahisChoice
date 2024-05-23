// next.config.js
const { createProxyMiddleware } = require('http-proxy-middleware');

let serverAddress = process.env.NEXT_PUBLIC_SERVER_ADDRESS

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${serverAddress}/:path*`
      }
    ]
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      const proxy = {
        '/api': {
          target: serverAddress,
          changeOrigin: true,
        },
      };

      config.devServer = {
        ...config.devServer,
        proxy,
      };
    }
    return config;
  },
};
