var ReflectionVariable = require('./lib/ReflectionVariable');
var ReflectionAssignedFunctionExpression = require('./lib/ReflectionAssignedFunctionExpression');
var ReflectionFunctionExpression = require('./lib/ReflectionFunctionExpression');
var ReflectionFunctionDeclaration = require('./lib/ReflectionFunctionDeclaration');
var ReflectionFunction = require('./lib/ReflectionFunction');
var ReflectionScopeAbstract = require('./lib/ReflectionScopeAbstract');
var ReflectionFile = require('./lib/ReflectionFile');
var Reflection = require('./lib/Reflection');

global.ReflectionVariable = ReflectionVariable;
global.ReflectionAssignedFunctionExpression = ReflectionAssignedFunctionExpression;
global.ReflectionFunctionExpression = ReflectionFunctionExpression;
global.ReflectionFunctionDeclaration = ReflectionFunctionDeclaration;
global.ReflectionFunction = ReflectionFunction;
global.ReflectionScopeAbstract = ReflectionScopeAbstract;
global.ReflectionFile = ReflectionFile;
global.Reflection = Reflection;

module.exports = {
  ReflectionVariable: ReflectionVariable,
  ReflectionAssignedFunctionExpression: ReflectionAssignedFunctionExpression,
  ReflectionFunctionExpression: ReflectionFunctionExpression,
  ReflectionFunctionDeclaration: ReflectionFunctionDeclaration,
  ReflectionFunction: ReflectionFunction,
  ReflectionScopeAbstract: ReflectionScopeAbstract,
  ReflectionFile: ReflectionFile,
  Reflection: Reflection
};
