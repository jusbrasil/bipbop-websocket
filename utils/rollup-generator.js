const path = require('path');
const buble = require('rollup-plugin-buble');
const license = require('rollup-plugin-license');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');

const pkg = require('../package.json');

/* eslint import/no-extraneous-dependencies: 0 */
module.exports = function configuration(confs = {}) {
  const plugins = [
    commonjs(),
    resolve(),
    buble(),
    license(),
  ];

  if (confs.istanbul) {
    plugins.push(istanbul({ exclude: ['tests/**/*', 'node_modules/**/*'] }));
  }

  return {
    external: Object.keys(pkg.dependencies),
    input: 'lib/index.js',
    plugins,
  };
};
