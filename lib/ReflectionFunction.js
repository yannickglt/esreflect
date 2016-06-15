var _ = require('lodash');
var escodegen = require('escodegen');
var ReflectionScopeAbstract = require('./ReflectionScopeAbstract');

var ReflectionFunction = function (node) {
  ReflectionScopeAbstract.call(this, node);
  _.extend(this, require('./ReflectionScopeTrait'));
};

ReflectionFunction.TYPE = {
  DECLARATION: 'declaration',
  EXPRESSION: 'expression'
};

ReflectionFunction.prototype = Object.create(ReflectionScopeAbstract.prototype);

ReflectionFunction.prototype._getBody = function () {
  return _.get(this._node, 'body');
};

ReflectionFunction.prototype.getName = function () {
  return _.get(this._node, 'id.name');
};

ReflectionFunction.prototype.getType = function () {
  return this._type;
};

ReflectionFunction.prototype.getClosure = function (context) {
  var funcAsString = this.toString();
  var res;
  context = context || {};
  with (context) {
    eval('res = ' + funcAsString);
  }
  return res;
};

ReflectionFunction.prototype.invoke = function (context, thisArg) {
  var closure = this.getClosure(context);
  return closure.apply(thisArg, _.drop(arguments, 2));
};

ReflectionFunction.prototype.invokeArgs = function (context, thisArg, argsAsArray) {
  var closure = this.getClosure(context);
  return closure.apply(thisArg, argsAsArray);
};

ReflectionFunction.prototype.getParameters = function () {
  return _(this._node)
    .chain()
    .get('params')
    .map('name')
    .compact()
    .value();
};

ReflectionFunction.prototype.toString = function () {
  var funcBody;
  try {
    funcBody = escodegen.generate(this._getBody());
  } catch (e) {
    funcBody = '{}';
  }
  var name = this.getName() || '';
  var params = this.getParameters();
  return 'function ' + name + '(' + params.join(', ') + ')' + funcBody;
};

module.exports = ReflectionFunction;
