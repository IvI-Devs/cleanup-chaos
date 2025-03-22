const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const dev = {
  entry: { playground: "./src/index.ts" },
  mode: 'development',
  optimization: {
    runtimeChunk: 'single'
  },
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    port: 9000,
    hot: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "playground.html",
      template: 'src/playground.html',
      chunks: ['vendors', 'playground', 'style'],
    }),
  ]
};

module.exports = merge(common, dev);