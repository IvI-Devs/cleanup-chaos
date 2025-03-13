const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

const dev = {
  entry: { playground: "./src/playground.ts" },
  mode: 'development',
  optimization: {
    runtimeChunk: 'single'
  },
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    port: 9000, hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "playground.html",
      template: 'src/playground.html',
      chunks: ['vendors', 'playground','style'],
    }),
  ]
}


module.exports = merge(common, dev)