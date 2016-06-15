var Reflection = function (node) {
  this._node = node;
};

Reflection.__files = {};

Reflection.prototype = Object.create(null);

Reflection.prototype.getName = function () {
  throw new Error('Implementing interface "Reflection" should override the method "getName"');
};

module.exports = Reflection;
