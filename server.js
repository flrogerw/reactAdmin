/* eslint-disable global-require, no-console */
const express = require('express');
const path = require('path');
const app = new express();  // eslint-disable-line new-cap
const port = process.env.PORT || 5000;

console.log('NODE_ENV', app.get('env'));

if (app.get('env') === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  // webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.dev.config');
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, config.devServer));
  // app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => res.sendFile(path.join(__dirname, '/dist/index.html')));

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  }
});
