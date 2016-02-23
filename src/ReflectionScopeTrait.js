var _ = require('lodash');
var JSONSelect = require('JSONSelect');
var ReflectionFunction = require('./ReflectionFunction');
var ReflectionFunctionDeclaration = require('./ReflectionFunctionDeclaration');
var ReflectionFunctionExpression = require('./ReflectionFunctionExpression');
var ReflectionAssignedFunctionExpression = require('./ReflectionAssignedFunctionExpression');
var ReflectionVariable = require('./ReflectionVariable');

var ReflectionScopeTrait = {
  getFunctionsByType: function (type) {
    checkFunctionType(type);
    return _.filter(getFunctions.call(this), function (fn) {
      return fn.getType() === type;
    });
  },
  getFunctionsByName: function (name, type) {
    if (_.isObject(name)) {
      type = name.type;
      name = name.name;
    }
    checkFunctionType(type);
    return _.filter(getFunctions.call(this), function (fn) {
      return (fn.getType() === type) && (fn.getName() === name);
    });
  },
  getFunctionDeclarations: function (name) {
    return _.filter(getFunctions.call(this), function (fn) {
      return (fn.getType() === ReflectionFunction.TYPE.DECLARATION) && (_.isUndefined(name) || fn.getName() === name);
    });
  },
  getFunctionExpressions: function (name) {
    return _.filter(getFunctions.call(this), function (fn) {
      return (fn.getType() === ReflectionFunction.TYPE.EXPRESSION) && (_.isUndefined(name) || fn.getName() === name || (fn.isAssigned() && fn.getAssignedName() === name));
    });
  },
  getAnonymousFunctions: function () {
    return _.filter(getFunctions.call(this), function (fn) {
      return (fn.getType() === ReflectionFunction.TYPE.EXPRESSION) && fn.isAnonymous();
    });
  },
  getVariables: function (name) {
    if (_.isUndefined(name)) {
      return _.clone(getVariables.call(this));
    } else {
      return _.filter(getVariables.call(this), function (variable) {
        return variable.getName() === name;
      });
    }
  },
  getStartLine: function () {
    return _.get(this._node, 'loc.start.line');
  },
  getEndLine: function () {
    return _.get(this._node, 'loc.end.line');
  }
};

function getFunctions() {
  if (_.isNull(this._functions)) {
    var body = this._getBody();
    this._functions = _.union(
      getAssignedFunctionExpressions(body),
      getNonAssignedFunctionExpressions(body),
      getFunctionDeclarations(body)
    );
  }
  return this._functions;
}

function getVariables() {
  if (_.isNull(this._variables)) {
    var body = this._getBody();
    this._variables = getVars(body);
  }
  return this._variables;
}

function getVars(json) {
  return _(JSONSelect.match(':has(:root > .type:val("VariableDeclarator")):has(:root > .init > number.value, :root > .init > string.value, :root > .init > boolean.value)', json))
    .difference(JSONSelect.match(':has(:root > .type:val("FunctionExpression"),:root > .type:val("FunctionDeclaration")) :has(:root > .type:val("VariableDeclarator")):has(:root > .init > number.value, :root > .init > string.value, :root > .init > boolean.value)', json))
    .map(function (node) {
      return new ReflectionVariable(node);
    })
    .value();
}

function getNonAssignedFunctionExpressions(json) {
  return _(JSONSelect.match(':has(:root > .type:val("FunctionExpression"))', json))
    .difference(JSONSelect.match(':has(:root > .type:val("FunctionExpression"),:root > .type:val("FunctionDeclaration")) :has(:root > .type:val("FunctionExpression"))', json))
    .map(function (node) {
      return new ReflectionFunctionExpression(node);
    })
    .value();
}

function getFunctionDeclarations(json) {
  return _(JSONSelect.match(':has(:root > .type:val("FunctionDeclaration"))', json))
    .difference(JSONSelect.match(':has(:root > .type:val("FunctionExpression"),:root > .type:val("FunctionDeclaration")) :has(:root > .type:val("FunctionDeclaration"))', json))
    .map(function (node) {
      return new ReflectionFunctionDeclaration(node);
    })
    .value();
}

function getAssignedFunctionExpressions(json) {
  return _(JSONSelect.match(':has(:root > .type:val("VariableDeclarator")):has(:root > .init > .type:val("FunctionExpression"))', json))
    .difference(JSONSelect.match(':has(:root > .type:val("FunctionExpression"),:root > .type:val("FunctionDeclaration")) :has(:root > .init > .type:val("FunctionExpression"))', json))
    .map(function (node) {
      return new ReflectionAssignedFunctionExpression(node);
    })
    .value();
}

function checkFunctionType(type) {
  if (!_.contains(_.values(ReflectionFunction.TYPE), type)) {
    throw new Error('Unknown function type "' + type + '"');
  }
}

module.exports = ReflectionScopeTrait;
