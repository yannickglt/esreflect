var _ = require('lodash');

var ReflectionMethod = function (name, declaringClass, astNode, isPublic, isStatic) {
  this.name = name;
  if (!_.isObject(declaringClass)) {
    throw new Error('Parameter scope must be a ReflectionClass.');
  }
  this.declaringClass = declaringClass;
  this.astNode = astNode;
  this.isPublic = (isPublic === true);
  this.isPrivate = (isPublic !== true);
  this.isStatic = (isStatic === true);
};

module.exports = ReflectionMethod;
