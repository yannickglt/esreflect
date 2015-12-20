var _ = require('lodash');
var escodegen = require('escodegen');
var ReflectionScope = require('./ReflectionScope');
var ReflectionMethod = require('./ReflectionMethod');
var ReflectionProperty = require('./ReflectionProperty');

var ReflectionClass = function (name, scope, astNode) {
  this.name = name;
  if (_.isObject(scope) && (!scope instanceof ReflectionScope)) {
    throw new Error('Parameter scope must be an instance of ReflectionScope.');
  }
  this.scope = _.isUndefined(scope) ? null : scope;
  this.scopeName = scope.name;
  this.astNode = astNode;
  this.startLine = astNode.loc.start.line;
  this.endLine = astNode.loc.end.line;

  var scopeBody = Utils.getBody(scope.astNode);
  var classBody = Utils.getBody(astNode);

  this.methods = {};

  getPrivateFunctions.bind(this)(classBody);
  getPrototypeFunctions.bind(this)(scopeBody, name);
  getThisFunctions.bind(this)(classBody);
  getStaticFunctions.bind(this)(scopeBody, name);

  this.properties = {};
  getPrivateProperties.bind(this)(classBody);
  getPrototypeProperties.bind(this)(scopeBody, name);
  getThisProperties.bind(this)(classBody);
  getStaticProperties.bind(this)(classBody);

  this.construct = blockToFunction(classBody);
};

ReflectionClass.prototype.getClass = function (scope) {
  var generatedScope = escodegen.generate(this.astNode);
  eval.call(scope, generatedScope);
};

ReflectionClass.prototype.newInstance = function () {
  var context = {};
  // @todo: wrap the astNode to have something like "context.MyClassName = function () { ... }"
  var generatedScope = escodegen.generate(this.astNode);
  eval(generatedScope);
  return new context[this.name];
};

function getPrototypeFunctions(block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object.object'))) &&
      (_.get(node, 'expression.left.object.property.name') === 'prototype') &&
      (_.get(node, 'expression.left.object.object.name') === className) &&
      (_.get(node, 'expression.right.type') === 'FunctionExpression')) {

      var funtionName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(funtionName) && !_.startsWithUpperCase(funtionName)) {
        self.methods[funtionName] = new ReflectionMethod(funtionName, self, node, true);
      }
    }
  });
}

function getStaticFunctions(block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.name') === className) &&
      (_.get(node, 'expression.left.property.name') !== 'prototype') &&
      (_.get(node, 'expression.right.type') === 'FunctionExpression')) {

      var funtionName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(funtionName) && !_.startsWithUpperCase(funtionName)) {
        self.methods[funtionName] = new ReflectionMethod(funtionName, self, node, true, true);
      }
    }
  });
}

function getThisFunctions(block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.type') === 'ThisExpression') &&
      (_.get(node, 'expression.right.type') === 'FunctionExpression')) {

      var funtionName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(funtionName) && !_.startsWithUpperCase(funtionName)) {
        self.methods[funtionName] = new ReflectionMethod(funtionName, self, node, true);
      }
    }
  });
}

function getPrivateFunctions(block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    // for: var doSomething = function ()
    if ((node.type === 'VariableDeclaration') &&
      (_.get(node, 'declarations.length') === 1) &&
      (_.get(node, 'declarations.0.type') === 'VariableDeclarator') &&
      (_.get(node, 'declarations.0.init.type') === 'FunctionExpression')) {

      // Named function expression
      var namedFunction = _.get(node, 'declarations.0.init.id');
      if (!_.isNull(namedFunction) && !_.startsWithUpperCase(namedFunction.name)) {
        self.methods[namedFunction.name] = new ReflectionMethod(namedFunction.name, self, node);
      }

      var variableName = _.get(node, 'declarations.0.id.name');
      if (!_.isNull(variableName) && !_.startsWithUpperCase(variableName)) {
        self.methods[variableName] = new ReflectionMethod(variableName, self, node);
      }
    }
    // for: function doSomething ()
    else if (node.type === 'FunctionDeclaration') {
      self.methods[node.id.name] = new ReflectionMethod(node.id.name, self, node);
    }
  });
}

function getPrototypeProperties(block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object.object'))) &&
      (_.get(node, 'expression.left.object.property.name') === 'prototype') &&
      (_.get(node, 'expression.left.object.object.name') === className) &&
      (_.get(node, 'expression.right.type') !== 'FunctionExpression')) {

      var propertyName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(propertyName)) {
        var initialValue;
        if (node.expression.right.hasOwnProperty('value')) {
          initialValue = node.expression.right.value;
        } else {
          initialValue = undefined;
        }
        self.properties[propertyName] = new ReflectionProperty(propertyName, self, node, true, false, initialValue);
      }
    }
  });
}

function getStaticProperties(block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.name') === className) &&
      (_.get(node, 'expression.left.property.name') !== 'prototype') &&
      (_.get(node, 'expression.right.type') !== 'FunctionExpression')) {

      var propertyName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(propertyName)) {
        self.properties[propertyName] = new ReflectionProperty(propertyName, self, node, true, true);
      }
    }
  });
}

function getThisProperties(block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.type') === 'ThisExpression') &&
      (_.get(node, 'expression.right.type') !== 'FunctionExpression')) {

      var propertyName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(propertyName)) {
        var initialValue;
        if (node.expression.right.hasOwnProperty('value')) {
          initialValue = node.expression.right.value;
        } else {
          initialValue = undefined;
        }
        self.properties[propertyName] = new ReflectionProperty(propertyName, self, node, true, false, initialValue);
      }
    }
  });
}

function getPrivateProperties(block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    // for: var something = "foo"
    if ((node.type === 'VariableDeclaration') &&
      (_.get(node, 'declarations.length') === 1) &&
      (_.get(node, 'declarations.0.type') === 'VariableDeclarator') &&
      (_.get(node, 'declarations.0.init.type') !== 'FunctionExpression')) {

      var variableName = _.get(node, 'declarations.0.id.name');
      if (!_.isNull(variableName)) {

        var init = _.get(node, 'declarations.0.init');
        var initialValue;
        if (!_.isNull(init) && init.hasOwnProperty('value')) {
          initialValue = init.value;
        } else {
          initialValue = undefined;
        }

        self.properties[variableName] = new ReflectionProperty(variableName, self, node, false, false, initialValue);
      }
    }
  });
}

module.exports = ReflectionClass;
