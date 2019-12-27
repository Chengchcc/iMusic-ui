/* eslint-disable import/no-extraneous-dependencies */

const HtmlPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const packageJson = require('../package.json')
const mode = process.env.NODE_ENV;
const isAnaylize = process.env.ANALYZE;
const isDev = mode === 'development';
const template = path.resolve(__dirname, '../public/index.html');
const { RELEVANT_PATH } = process.env;
const publicPath = RELEVANT_PATH?`/${RELEVANT_PATH}/`:'/';
const analyzerPlugin = isAnaylize ? [new BundleAnalyzerPlugin()] : [];
const cssplugin = !isDev? [new MiniCssExtractPlugin({
  filename: '[name].[hash:8].css',
  chunkFilename: '[name]-[id].[hash:8].css',
})]:[]
module.exports = {
  entry: {
    bundle: './src/rerender/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: isDev?'[name].js':'[name].[hash:8].js',
    chunkFilename: isDev?'[name].js':'[name]-[id].[hash:8].js',
    publicPath,
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: isDev && 'source-map',
  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.json']
    },
  plugins: [
    ...analyzerPlugin,
    ...cssplugin,
    new HtmlPlugin({
      title: packageJson.name,
      filename: 'index.html',
      template,
    }),
    new webpack.DefinePlugin({
      BASENAME: JSON.stringify(RELEVANT_PATH),
    }),
  ],
  module: {
    rules: [
      { test: /\.(js|jsx|ts|tsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      {
        test: [/\.less$/], use: [
          !isDev? MiniCssExtractPlugin.loader:require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true
            }
          },
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: '@svgr/webpack',
            options: { babel: false },
          }
        ],
      },
    ]
  },
  optimization: isDev?{}:{
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: 'all'
    }
  },
  mode, // 'production' or 'development' webpack mode
  devServer: {
    // http2: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    host: '0.0.0.0',
    publicPath,
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
};
