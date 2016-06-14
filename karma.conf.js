var istanbul = require('browserify-istanbul');

module.exports = function (karma) {
  karma.set({

    files: [
      'vendor/external.js',
      'test/**/*.spec.js'
    ],

    preprocessors: {
      'src/**/Reflection*.js': ['coverage', 'reflection'],
      'test/**/*.spec.js': 'browserify'
    },

    frameworks: ['jasmine', 'browserify', 'reflection'],

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type: 'cobertura',
      dir: 'reports/coverage/',
      file: 'coverage.xml'
    },

    browsers: ['PhantomJS'],

    logLevel: 'LOG_DEBUG',

    singleRun: true,

    autoWatch: true,

    //browserNoActivityTimeout: 20000,

    browserify: {
      debug: false,
      transform: ['brfs', 'browserify-shim', istanbul({
        ignore: ['**/node_modules/**', '**/test/**'],
        instrumenterConfig: {
          backdoor: {
            omitTrackerSuffix: true
          }
        }
      }), 'browserify-reflection']
    }
  });
};
