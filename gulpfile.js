const path = require('path');
const gulp = require('gulp');
const { rollup } = require('rollup');
const { Server } = require('karma');

const rollupGenerator = require('./utils/rollup-generator');
const pkg = require('./package.json');

/* eslint import/no-extraneous-dependencies: 0 */

function bundler(format, file) {
  return bundle => bundle.write({
    format,
    exports: 'default',
    name: 'BipbopWebSocket',
    extend: true,
    file,
  });
}

gulp.task('pack:test', () => rollup(rollupGenerator({ istanbul: true }))
  .then(bundler('umd', path.join(__dirname, 'tests', 'coverage', 'index.js'))));

gulp.task('pack:cjs', () => rollup(rollupGenerator())
  .then(bundler('cjs', path.join(__dirname, pkg.main))));

gulp.task('pack:umd', () => rollup(rollupGenerator())
  .then(bundler('umd', path.join(__dirname, pkg.browser))));

gulp.task('pack:dist', ['pack:umd', 'pack:cjs']);

gulp.task('server', ['default'], cb => new Server({
  configFile: `${__dirname}/karma.conf.js`,
  singleRun: false,
  autoWatch: true,
}, cb).start());

gulp.task('listener', () => gulp.watch('lib/**/*.js', ['default']));
gulp.task('watch', ['server', 'listener']);
gulp.task('default', ['pack:test', 'pack:dist']);
