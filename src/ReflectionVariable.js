var Reflection = require('./Reflection');

var ReflectionVariable = function (node) {
  Reflection.call(node);
};

ReflectionVariable.prototype = Object.create(Reflection.prototype);

ReflectionVariable.prototype.getValue = function () {

};

module.exports = ReflectionVariable;
