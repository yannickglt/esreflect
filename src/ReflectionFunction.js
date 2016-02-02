var escodegen = require('escodegen');
var ReflectionScopeAbstract = require('./ReflectionScopeAbstract');

var ReflectionFunction = function (node) {
  ReflectionScopeAbstract.call(this, node);
  _.extend(this, require('./ReflectionScopeTrait'));
  this._extractFunctionAndVariables();
};

ReflectionFunction.TYPE = {
  DECLARATION: 'declaration',
  ANONYMOUS: 'anonymous',
  EXPRESSION: 'expression'
};

ReflectionFunction.prototype = Object.create(ReflectionScopeAbstract.prototype);

ReflectionFunction.prototype.getType = function () {
  return this._type;
};

ReflectionFunction.prototype.getClosure = function () {
  var funcAsString = this.toString();
  var res;
  eval('res = ' + funcAsString);
  return res;
};

ReflectionFunction.prototype.invoke = function (thisArg) {
  var closure = this.getClosure();
  return closure.apply(thisArg, _.rest(arguments));
};

ReflectionFunction.prototype.invokeArgs = function (thisArg, argsAsArray) {
  var closure = this.getClosure();
  return closure.apply(thisArg, argsAsArray);
};

ReflectionFunction.prototype.toString = function () {
  var funcBody;
  try {
    funcBody = escodegen.generate(this._body);
  } catch (e) {
    funcBody = '{}';
  }
  return 'function ' + this.name + ' ()' + funcBody + ';';
};

module.exports = ReflectionFunction;
