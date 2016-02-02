var _ = require('lodash');
var Reflection = require('./Reflection');

var ReflectionScopeAbstract = function (node) {
  Reflection.call(this, node);

  this._body = null;
  this._functions = [];
  this._variables = [];
};

ReflectionScopeAbstract.prototype = Object.create(Reflection.prototype);

ReflectionScopeAbstract.prototype._extractFunctionAndVariables = function () {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "_extractFunctionAndVariables"');
};

ReflectionScopeAbstract.prototype.getFunctionsByType = function (type) {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "ReflectionScopeAbstract"');
};

ReflectionScopeAbstract.prototype.getFunctionsByName = function (name, type) {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "getFunctionsByName"');
};

ReflectionScopeAbstract.prototype.getAnonymousFunctions = function (name) {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "getAnonymousFunctions"');
};

ReflectionScopeAbstract.prototype.getFunctionDeclarations = function (name) {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "getFunctionDeclarations"');
};

ReflectionScopeAbstract.prototype.getFunctionExpressions = function (name) {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "getFunctionExpressions"');
};

ReflectionScopeAbstract.prototype.getVariables = function (name) {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "getVariables"');
};

ReflectionScopeAbstract.prototype.getStartLine = function () {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "getStartLine"');
};

ReflectionScopeAbstract.prototype.getEndLine = function () {
  throw new Error('Implementing interface "ReflectionScopeAbstract" should override the method "getEndLine"');
};

module.exports = ReflectionScopeAbstract;
