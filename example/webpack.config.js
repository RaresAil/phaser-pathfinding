const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './main.js'
  },

  module: {},

  resolve: {
    extensions: ['.js']
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  devServer: {
    open: true,
    devMiddleware: {
      writeToDisk: true
    },
    static: {
      directory: path.resolve(__dirname, 'dist')
    }
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'index.html'
        },
        {
          from: 'map.png'
        },
        {
          from: 'source.png'
        }
      ]
    }),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    })
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendors',
          filename: '[name].app.bundle.js'
        }
      }
    }
  }
};
