/* eslint-disable import/no-extraneous-dependencies */

const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
const packageJson = require('../package.json')
const template = path.resolve(__dirname, '../public/index.html');
const { spawn } = require('child_process');
module.exports = {
  entry: {
    bundle: './src/rerender/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  resolve: {
    extensions: [ '.ts', '.tsx', '.js', '.json']
    },
  plugins: [
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
          require.resolve('style-loader'),
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
  mode: 'development',
  devServer: {
    // http2: true,
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, '../dist'),
    stats: {
      colors: true,
      chunks: false,
      children: false
    },
    after() {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' }
      )
      .on('close', code => process.exit(0))
      .on('error', spawnError => console.error(spawnError));
    }
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
};
