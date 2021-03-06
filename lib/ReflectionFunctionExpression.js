var _ = require('lodash');
var ReflectionFunction = require('./ReflectionFunction');

var ReflectionFunctionExpression = function (node) {
  ReflectionFunction.call(this, node);
  this._type = ReflectionFunction.TYPE.EXPRESSION;
};

ReflectionFunctionExpression.prototype = Object.create(ReflectionFunction.prototype);

ReflectionFunctionExpression.prototype.isAnonymous = function () {
  return _.isEmpty(_.get(this._node, 'id', null));
};

ReflectionFunctionExpression.prototype.isAssigned = function () {
  return false;
};

module.exports = ReflectionFunctionExpression;
