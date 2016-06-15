var _ = require('lodash');
var ReflectionFunctionExpression = require('./ReflectionFunctionExpression');

  var ReflectionAssignedFunctionExpression = function (node) {
  ReflectionFunctionExpression.call(this, node);
};

ReflectionAssignedFunctionExpression.prototype = Object.create(ReflectionFunctionExpression.prototype);

ReflectionAssignedFunctionExpression.prototype._getBody = function () {
  return _.get(this._node, 'init.body');
};

ReflectionAssignedFunctionExpression.prototype.isAnonymous = function () {
  return _.isNull(_.get(this._node, 'init.id', null));
};

ReflectionAssignedFunctionExpression.prototype.isAssigned = function () {
  return true;
};

ReflectionAssignedFunctionExpression.prototype.getName = function () {
  return _.get(this._node, 'init.id.name');
};

ReflectionAssignedFunctionExpression.prototype.getAssignedName = function () {
  return _.get(this._node, 'id.name');
};

ReflectionAssignedFunctionExpression.prototype.getParameters = function () {
  return _(this._node)
    .chain()
    .get('init.params')
    .map('name')
    .compact()
    .value();
};

module.exports = ReflectionAssignedFunctionExpression;
