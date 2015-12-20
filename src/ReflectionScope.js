var _ = require('lodash');
var esprima = require('esprima');
var Utils = require('./Utils');
var ReflectionClass = require('./ReflectionClass');

var ReflectionScope = function (fn) {
  if (!_.isFunction(fn)) {
    throw new Error('Expect a function, ' + typeof fn + ' given.');
  }
  this.astNode = esprima.parse(String(fn), {
    loc: true
  });
  this.name = Utils.getFunctionName(this.astNode);

  var body = Utils.getBody(this.astNode);

  this.classes = {};

  this._getClasses(body);
};

ReflectionScope.prototype._getClasses = function (block) {
  var self = this;
  _.forEach(block.body, function (node) {

    // for: var doSomething = function ()
    if ((node.type === 'VariableDeclaration') &&
      (_.get(node, 'declarations.length') === 1) &&
      (_.get(node, 'declarations.0.type') === 'VariableDeclarator') &&
      (_.get(node, 'declarations.0.init.type') === 'FunctionExpression')) {

      // Named function expression
      var namedClass = _.get(node, 'declarations.0.init.id');
      if (!_.isNull(namedClass) && _.startsWithUpperCase(namedClass.name)) {
        self.classes[namedClass.name] = new ReflectionClass(namedClass.name, self, node);
      }

      var variableName = _.get(node, 'declarations.0.id.name');
      if (!_.isNull(variableName) && _.startsWithUpperCase(variableName)) {
        self.classes[variableName] = new ReflectionClass(variableName, self, node);
      }
    }
    // for: function doSomething ()
    else if ((node.type === 'FunctionDeclaration') && _.startsWithUpperCase(node.id.name)) {
      self.classes[node.id.name] = new ReflectionClass(node.id.name, self, node);
    }
  });
};

module.exports = ReflectionScope;
