var ReflectionFunction = require('./ReflectionFunction');

var ReflectionFunctionDeclaration = function (node) {
  ReflectionFunction.call(this, node);
  this._type = ReflectionFunction.TYPE.DECLARATION;
};

ReflectionFunctionDeclaration.prototype = Object.create(ReflectionFunction.prototype);

module.exports = ReflectionFunctionDeclaration;
