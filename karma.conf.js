const webpackConfig = require('./webpack.dev.config.js');
webpackConfig.entry = {};

module.exports = function karmaConfig(config) {
  config.set({
    basePath: '',
    browserNoActivityTimeout: 20000,
    frameworks: ['mocha'],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      './test/tests.webpack.js',
    ],

    preprocessors: {
      './test/tests.webpack.js': ['webpack'],
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true,
    },
  });
};
