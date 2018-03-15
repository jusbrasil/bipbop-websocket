module.exports = function runTests(config) {
  config.set({
    basePath: '',
    frameworks: [
      'mocha',
      //  'chai'
    ],
    files: [
      './tests/coverage/index.js',
      './tests/**/*.spec.js',
    ],
    exclude: [],
    // preprocessors: {
    //   './tests/**/*.spec.js': ['istanbul'],
    // },
    reporters: [
      'progress',
      // 'coverage',
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [
      'PhantomJS2',
    ],
    singleRun: true,
    concurrency: Infinity,
  });
};
