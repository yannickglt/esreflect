var _ = require('lodash');
var ReflectionClass = require('./ReflectionClass');

var ReflectionMethod = function (name, declaringClass, astNode, isPublic, isStatic) {
  this.name = name;
  if (_.isObject(declaringClass) && (!declaringClass instanceof ReflectionClass)) {
    throw new Error('Parameter scope must be an instance of ReflectionClass.');
  }
  this.declaringClass = declaringClass;
  this.astNode = astNode;
  this.isPublic = (isPublic === true);
  this.isPrivate = (isPublic !== true);
  this.isStatic = (isStatic === true);
};

module.exports = ReflectionMethod;
