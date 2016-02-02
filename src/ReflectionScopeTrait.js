var _ = require('lodash');
var ReflectionFunction = require('./ReflectionFunction');

var ReflectionScopeTrait = {
  _extractFunctionAndVariables: function (node) {
    this._body = getBody(node);
    this._functions = getFunctions(this._body);
    this._variables = getVariables(this._body);
  },
  getFunctionsByType: function (type) {
    checkFunctionType(type);
    return _.filter(this._functions, { '_type': type });
  },
  getFunctionsByName: function (name, type) {
    if (_.isObject(name)) {
      type = name.type;
      name = name.name;
    }
    checkFunctionType(type);
    return _.filter(this._functions, { '_name': name, '_type': type });
  },
  getAnonymousFunctions: function (name) {
    var predicate = { '_type': ReflectionFunction.TYPE.ANONYMOUS };
    if (!_.isUndefined(name)) {
      predicate._name = name;
    }
    return _.filter(this._functions, predicate);
  },
  getFunctionDeclarations: function (name) {
    var predicate = { '_type': ReflectionFunction.TYPE.DECLARATION };
    if (!_.isUndefined(name)) {
      predicate._name = name;
    }
    return _.filter(this._functions, predicate);
  },
  getFunctionExpressions: function (name) {
    var predicate = { '_type': ReflectionFunction().TYPE.EXPRESSION };
    if (!_.isUndefined(name)) {
      predicate._name = name;
    }
    return _.filter(this._functions, predicate);
  },
  getVariables: function (name) {
    if (_.isUndefined(name)) {
      return _.clone(this._variables);
    } else {
      return _.filter(this._variables, { '_name': name });
    }
  },
  getStartLine: function () {
    return _.get(this._node, 'loc.start.line');
  },
  getEndLine: function () {
    return _.get(this._node, 'loc.end.line');
  }
};

function getBody(node) {
  if (node.type === 'Program') {
    return _.get(node, 'body.0.body');
  }
  else if (node.type === 'VariableDeclaration') {
    return _.get(node, 'declarations.0.init.body');
  }
  else if (node.type === 'FunctionDeclaration') {
    return _.get(node, 'body');
  }
}

function getFunctions(block) {
  var functions = [];
  if (block) {
    _.forEach(block.body, function (node) {

      // for: var doSomething = function ()
      if ((node.type === 'VariableDeclaration') &&
        (_.get(node, 'declarations.length') === 1) &&
        (_.get(node, 'declarations.0.type') === 'VariableDeclarator') &&
        (_.get(node, 'declarations.0.init.type') === 'FunctionExpression')) {

        var variableName = _.get(node, 'declarations.0.id.name');
        if (!_.isNull(variableName)) {
          functions.push(_.assign(new ReflectionFunction(variableName), { '_node': node, '_type': ReflectionFunction.TYPE.EXPRESSION }));
        }

        // Named function expression
        var namedFunction = _.get(node, 'declarations.0.init.id');
        if (!_.isNull(namedFunction)) {
          functions.push(_.assign(new ReflectionFunction(namedFunction.name), { '_node': node, '_type': ReflectionFunction.TYPE.DECLARATION }));
        }
      }
      // for: function doSomething ()
      else if (node.type === 'FunctionDeclaration') {
        functions.push(_.assign(new ReflectionFunction(node.id.name), { '_node': node, '_type': ReflectionFunction.TYPE.DECLARATION }));
      }
    });
  }
  return functions;
}

function getVariables(block) {
  var variables = [];
  if (block) {
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
          variables.push(_.assign(new ReflectionVariable(variableName), { '_node': node }));
        }
      }
    });
  }
  return variables;
}

function checkFunctionType(type) {
  if (!_.contains(_.values(ReflectionFunction.TYPE), type)) {
    throw new Error('Unknown function type "' + type + '"');
  }
}

module.exports = ReflectionScopeTrait;
