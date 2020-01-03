/* eslint-disable import/no-extraneous-dependencies */

const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const packageJson = require('../package.json')
const template = path.resolve(__dirname, '../public/index.html');
const cssplugin = [new MiniCssExtractPlugin({
  filename: '[name].[hash:8].css',
  chunkFilename: '[name]-[id].[hash:8].css',
})]
module.exports = {
  entry: {
    bundle: './src/rerender/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash:8].js',
    chunkFilename: [name]-[id].[hash:8].js',
  },
  // Enable sourcemaps for debugging webpack's output.
  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.json']
    },
  plugins: [
    ...cssplugin,
    new HtmlPlugin({
      title: packageJson.name,
      filename: 'index.html',
      template,
    }),
    new webpack.DefinePlugin({
    }),
  ],
  module: {
    rules: [
      { test: /\.(js|jsx|ts|tsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      {
        test: [/\.less$/], use: [
          MiniCssExtractPlugin.loader,
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
        test: /\.(png|jpg|ttf|woff2)$/,
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
  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: 'all'
    }
  },
  mode:'production'
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  }
};
