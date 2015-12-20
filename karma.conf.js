module.exports = function (karma) {
  karma.set({

    frameworks: ['jasmine', 'browserify'],

    files: [
      'vendor/external.js',
      'test/**/*.spec.js'
    ],

    preprocessors: {
      'test/**/*.js': ['browserify']
    },

    browsers: ['PhantomJS'],

    logLevel: 'LOG_DEBUG',

    singleRun: true,

    autoWatch: true,

    browserify: {
      debug: true,
      transform: ['brfs', 'browserify-shim']
    }
  });
};
