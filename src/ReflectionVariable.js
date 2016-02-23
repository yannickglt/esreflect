var Reflection = require('./Reflection');

var ReflectionVariable = function (node) {
  Reflection.call(this, node);
};

ReflectionVariable.prototype = Object.create(Reflection.prototype);

ReflectionVariable.prototype.getName = function () {
  return _.get(this._node, 'id.name');
};

ReflectionVariable.prototype.getValue = function () {
  return _.get(this._node, 'init.value');
};

ReflectionVariable.prototype.setValue = function (value) {
  if (_.isObject(value)) {
    throw new Error('Given value can only be a primitive value');
  }
  return _.set(this._node, 'init.value', value);
};

module.exports = ReflectionVariable;
