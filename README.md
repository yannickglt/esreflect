# ESReflect
[![Build Status](https://img.shields.io/travis/yannickglt/esreflect.svg?style=flat-square)](https://travis-ci.org/yannickglt/esreflect)
[![Coveralls](https://img.shields.io/coveralls/yannickglt/esreflect.svg?branch=master)](https://coveralls.io/github/yannickglt/esreflect)
[![npm version](https://img.shields.io/npm/v/esreflect.svg?style=flat-square)](https://www.npmjs.org/package/esreflect)
[![npm downloads](https://img.shields.io/npm/dm/esreflect.svg?style=flat-square)](http://npm-stat.com/charts.html?package=esreflect&from=2015-08-01)
[![npm dependencies](https://img.shields.io/david/yannickglt/esreflect.svg)](https://david-dm.org/yannickglt/esreflect)
[![npm devDependencies](https://img.shields.io/david/dev/yannickglt/esreflect.svg)](https://david-dm.org/yannickglt/esreflect)
[![npm license](https://img.shields.io/npm/l/esreflect.svg)](https://www.npmjs.org/package/esreflect)

ESReflect is an ECMAScript (also popularly known as [JavaScript](https://en.wikipedia.org/wiki/JavaScript)) library providing a reflection API for [ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm). ESReflect uses [esprima](https://github.com/jquery/esprima) and [escodegen](https://github.com/estools/escodegen) to parse and generate code accodring to the [Mozilla's Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API).

## Install
The easiest way is to install `esreflect` as `dependency`:
```sh
npm install esreflect --save
```

You may also be interested in:
- [karma-reflection](https://github.com/yannickglt/karma-reflection): a [karma preprocessor](http://karma-runner.github.io/0.13/config/preprocessors.html) providing reflection to source files before testing
- [browserify-reflection](https://github.com/yannickglt/browserify-reflection): a [browserify transform](https://github.com/substack/node-browserify#btransformtr-opts) providing reflection to source files before parsing

## Usage

ESReflect uses `browserify-reflection` and `ESReflect` to unit tests private methods.
See the [API](API.md) documentation for an exhaustive list of classes and methods.

## Roadmap
- Improve members extraction performances
- Support of ECMAScript 6 ([EMCMA-262](http://www.ecma-international.org/publications/standards/Ecma-262.htm)) classes
- Automatic accessibility change with ES7 decorators

## License
Code licensed under [MIT License](LICENSE).
