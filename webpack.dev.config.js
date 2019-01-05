const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  eslint: {
    quiet: true,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 7000,
        proxy: 'http://localhost:5000/',
        open: false,
      }
    ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        API_URL: JSON.stringify('http://api.photoandgo.local'),
      },
    }),
  ],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel'],
        include: __dirname,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
        loader: 'url?prefix=font/&limit=10000',
      },
      {
        test: /\.s?css$/,
        loader: 'style!css!sass',
      },
      {
        test: /\.png/,
        loader: 'url-loader?limit=100000&minetype=image/png',
      },
      {
        test: /\.jpg/,
        loader: 'file-loader',
      },
    ],
  },
  sassLoader: {
    includePaths: __dirname,
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  devServer: {
    contentBase: path.join(__dirname, './dist/'),
    historyApiFallback: true,
    hot: false,
    watchOptions: {
      poll: 300, // polling since inotify doesn't work well in Docker OSX http://bit.ly/2gddx8M,
      aggregateTimeout: 1000,
    },
  },
  externals: {
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
