var _ = require('lodash');
var JSONSelect = require('JSONSelect');
var ReflectionScopeTrait = require('../src/ReflectionScopeTrait');
var ReflectionAssignedFunctionExpression = require('../src/ReflectionAssignedFunctionExpression');
var ReflectionFunction = require('../src/ReflectionFunction');
var ReflectionVariable = require('../src/ReflectionVariable');

describe('ReflectionScopeTrait', function () {

  var node, reflectedScope;

  beforeEach(function () {
    node = {"loc":{"start":{"line":1,"column":0},"end":{"line":2,"column":33}},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":42}},"type":"VariableDeclaration","declarations":[{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":42}},"type":"VariableDeclarator","id":{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}},"type":"Identifier","name":"foo"},"init":{"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":42}},"type":"FunctionExpression","id":{"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":37}},"type":"Identifier","name":"functionExpression"},"params":[],"defaults":[],"body":{"loc":{"start":{"line":1,"column":40},"end":{"line":1,"column":42}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}}],"kind":"var"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":33}},"type":"FunctionDeclaration","id":{"loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":28}},"type":"Identifier","name":"functionDeclaration"},"params":[],"defaults":[],"body":{"loc":{"start":{"line":2,"column":31},"end":{"line":2,"column":33}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}],"sourceType":"script"};
    reflectedScope = Object.create(ReflectionScopeTrait);
    reflectedScope._functions = null;
    reflectedScope._variables = null;
    reflectedScope._node = node;
    reflectedScope._getBody = function () {
      return this._node.body;
    };
  });

  describe('Public methods', function () {

    describe('getFunctionExpressions method', function () {
      it('should return the function expressions present in the scope', function () {
        var functionExpressions = reflectedScope.getFunctionExpressions();
        expect(_.size(functionExpressions)).toBe(1);
        expect(functionExpressions[0].getName()).toBe('functionExpression');
      });

      it('should return the function expressions filtered by name or assigned name', function () {
        var functionExpressions;
        functionExpressions = reflectedScope.getFunctionExpressions('functionExpression');
        expect(_.size(functionExpressions)).toBe(1);
        expect(functionExpressions[0].getName()).toBe('functionExpression');
        functionExpressions = reflectedScope.getFunctionExpressions('foo');
        expect(_.size(functionExpressions)).toBe(1);
        expect(functionExpressions[0].getName()).toBe('functionExpression');
        expect(functionExpressions[0].getAssignedName()).toBe('foo');
      });

      it('should not return a same function as both an assigned and a non assigned function expression', function () {
        reflectedScope._node = {"loc":{"start":{"line":1,"column":0},"end":{"line":2,"column":49}},"type":"Program","body":[{"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":51}},"type":"VariableDeclaration","declarations":[{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":50}},"type":"VariableDeclarator","id":{"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}},"type":"Identifier","name":"foo"},"init":{"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":50}},"type":"FunctionExpression","id":{"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":45}},"type":"Identifier","name":"assignedFunctionExpression"},"params":[],"defaults":[],"body":{"loc":{"start":{"line":1,"column":48},"end":{"line":1,"column":50}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}}],"kind":"var"},{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":49}},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":48}},"type":"CallExpression","callee":{"loc":{"start":{"line":2,"column":0},"end":{"line":2,"column":3}},"type":"Identifier","name":"foo"},"arguments":[{"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":47}},"type":"FunctionExpression","id":{"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":42}},"type":"Identifier","name":"nonAssignedFunctionExpression"},"params":[],"defaults":[],"body":{"loc":{"start":{"line":2,"column":45},"end":{"line":2,"column":47}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}]}}],"sourceType":"script"};
        var functionExpressions = reflectedScope.getFunctionExpressions();
        expect(_.size(functionExpressions)).toBe(2);
        expect(functionExpressions[0].getName()).toBe('assignedFunctionExpression');
        expect(functionExpressions[0] instanceof ReflectionAssignedFunctionExpression).toBe(true);
        expect(functionExpressions[1].getName()).toBe('nonAssignedFunctionExpression');
        expect(functionExpressions[1] instanceof ReflectionAssignedFunctionExpression).toBe(false);
      })
    });

    describe('getFunctionDeclarations method', function () {
      it('should return the function declarations present in the scope', function () {
        var functionDeclarations = reflectedScope.getFunctionDeclarations();
        expect(_.size(functionDeclarations)).toBe(1);
        expect(functionDeclarations[0].getName()).toBe('functionDeclaration');
      });
      it('should return the function declarations filtered by name', function () {
        var functionDeclarations = reflectedScope.getFunctionDeclarations('functionDeclaration');
        expect(_.size(functionDeclarations)).toBe(1);
        expect(functionDeclarations[0].getName()).toBe('functionDeclaration');
      });
    });

    describe('getAnonymousFunctions method', function () {
      it('should return the anonymous functions present in the scope', function () {
        reflectedScope._node = {"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"anonymousFunction"},"init":{"type":"FunctionExpression","id":null,"params":[],"defaults":[],"body":{"type":"BlockStatement","body":[]},"generator":false,"expression":false}}],"kind":"var"}],"sourceType":"script"};
        var anonymousFunctions = reflectedScope.getAnonymousFunctions();
        expect(_.size(anonymousFunctions)).toBe(1);
        expect(anonymousFunctions[0].isAnonymous()).toBe(true);
        expect(anonymousFunctions[0].getType()).toBe(ReflectionFunction.TYPE.EXPRESSION);
        expect(anonymousFunctions[0].getAssignedName()).toBe('anonymousFunction');
        expect(anonymousFunctions[0].getName()).toBeUndefined();
      });
    });

    describe('getFunctionsByType method', function () {
      it('should return the function expressions if the given type equals "expression"', function () {
        var functionExpressions;

        functionExpressions = reflectedScope.getFunctionsByType(ReflectionFunction.TYPE.EXPRESSION);
        expect(_.size(functionExpressions)).toBe(1);
        expect(functionExpressions[0].getName()).toBe('functionExpression');

        functionExpressions = reflectedScope.getFunctionsByType('expression');
        expect(_.size(functionExpressions)).toBe(1);
        expect(functionExpressions[0].getName()).toBe('functionExpression');
      });

      it('should return the function declarations if the given type equals "declarations"', function () {
        var functionDeclarations;

        functionDeclarations = reflectedScope.getFunctionsByType(ReflectionFunction.TYPE.DECLARATION);
        expect(_.size(functionDeclarations)).toBe(1);
        expect(functionDeclarations[0].getName()).toBe('functionDeclaration');

        functionDeclarations = reflectedScope.getFunctionsByType('declaration');
        expect(_.size(functionDeclarations)).toBe(1);
        expect(functionDeclarations[0].getName()).toBe('functionDeclaration');
      });

      it('should throw an error if the given type is not a valid function type', function () {
        expect(_.partial(reflectedScope.getFunctionsByType, 'notAValidType')).toThrowError('Unknown function type "notAValidType"');
      });
    });

    describe('getFunctionsByName method', function () {
      it('should return the functions filtering on their name', function () {
        var functions;

        functions = reflectedScope.getFunctionsByName('functionExpression');
        expect(_.size(functions)).toBe(1);
        expect(functions[0].getName()).toBe('functionExpression');

        functions = reflectedScope.getFunctionsByName('functionDeclaration');
        expect(_.size(functions)).toBe(1);
        expect(functions[0].getName()).toBe('functionDeclaration');
      });

      it('should return the functions filtering on their name and type', function () {
        var functions;

        functions = reflectedScope.getFunctionsByName('functionExpression', ReflectionFunction.TYPE.EXPRESSION);
        expect(_.size(functions)).toBe(1);
        expect(functions[0].getName()).toBe('functionExpression');

        functions = reflectedScope.getFunctionsByName('functionDeclaration', ReflectionFunction.TYPE.DECLARATION);
        expect(_.size(functions)).toBe(1);
        expect(functions[0].getName()).toBe('functionDeclaration');
      });

      it('should return the functions filtering on their name and type given as object', function () {
        var functions;

        functions = reflectedScope.getFunctionsByName({ name: 'functionExpression', type: ReflectionFunction.TYPE.EXPRESSION });
        expect(_.size(functions)).toBe(1);
        expect(functions[0].getName()).toBe('functionExpression');

        functions = reflectedScope.getFunctionsByName({ name: 'functionDeclaration', type: ReflectionFunction.TYPE.DECLARATION });
        expect(_.size(functions)).toBe(1);
        expect(functions[0].getName()).toBe('functionDeclaration');
      });

      it('should return an empty array if no function match the given name and type', function () {
        var functions;

        functions = reflectedScope.getFunctionsByName('functionExpression', ReflectionFunction.TYPE.DECLARATION);
        expect(_.size(functions)).toBe(0);

        functions = reflectedScope.getFunctionsByName('functionDeclaration', ReflectionFunction.TYPE.EXPRESSION);
        expect(_.size(functions)).toBe(0);
      });

      it('should throw an error if the given type is not a valid function type', function () {
        expect(_.partial(reflectedScope.getFunctionsByName, 'functionExpression', 'notAValidType')).toThrowError('Unknown function type "notAValidType"');
        expect(_.partial(reflectedScope.getFunctionsByName, 'functionDeclaration', 'notAValidType')).toThrowError('Unknown function type "notAValidType"');
        expect(_.partial(reflectedScope.getFunctionsByName, 'evenIfFunctionNameDoesNotExist', 'notAValidType')).toThrowError('Unknown function type "notAValidType"');
      });
    });

    describe('getVariables method', function () {
      beforeEach(function () {
        reflectedScope._node = {"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"foo"},"init":{"type":"Literal","value":2,"raw":"2"}}],"kind":"var"}],"sourceType":"script"};
      });
      it('should return the variables present in the scope', function () {
        var variables = reflectedScope.getVariables();
        expect(_.size(variables)).toBe(1);
        expect(variables[0].getName()).toBe('foo');
        expect(variables[0].getValue()).toBe(2);
      });
      it('should return the variables filtered by name', function () {
        var variables = reflectedScope.getVariables('foo');
        expect(_.size(variables)).toBe(1);
        expect(variables[0].getName()).toBe('foo');
        expect(variables[0].getValue()).toBe(2);
      });
    });

    describe('getStartLine method', function () {
      it('should return the start line of the scope', function () {
        expect(reflectedScope.getStartLine()).toBe(1);
      });
      it('should return undefined if the start line could not be retrieved', function () {
        reflectedScope._node = {};
        expect(reflectedScope.getStartLine()).toBeUndefined();
      });
    });

    describe('getEndLine method', function () {
      it('should return the end line of the scope', function () {
        expect(reflectedScope.getEndLine()).toBe(2);
      });
      it('should return undefined if the end line could not be retrieved', function () {
        reflectedScope._node = {};
        expect(reflectedScope.getEndLine()).toBeUndefined();
      });
    });

    describe('getStartColumn method', function () {
      it('should return the start column of the scope', function () {
        expect(reflectedScope.getStartColumn()).toBe(0);
      });
      it('should return undefined if the start column could not be retrieved', function () {
        reflectedScope._node = {};
        expect(reflectedScope.getStartColumn()).toBeUndefined();
      });
    });

    describe('getEndColumn method', function () {
      it('should return the end column of the scope', function () {
        expect(reflectedScope.getEndColumn()).toBe(33);
      });
      it('should return undefined if the end column could not be retrieved', function () {
        reflectedScope._node = {};
        expect(reflectedScope.getEndColumn()).toBeUndefined();
      });
    });
  });

  describe('Private methods', function () {
    var scopeTraitReflection;

    beforeEach(function () {
      scopeTraitReflection = new ReflectionFile('src/ReflectionScopeTrait.js');
    });

    describe('getFunctions method', function () {
      it('should ', function () {
        var getFunctionsReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getFunctions'));
        //getFunctionsReflection.invoke()
        expect(true).toBe(false);
      });
    });

    describe('getVariables method', function () {
      it('should ', function () {
        expect(true).toBe(false);
      });
    });

    fdescribe('getVars method', function () {
      it('should ', function () {
        var getVarsReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getFunctions'));
        var context = {
          _: _,
          JSONSelect: JSONSelect,
          ReflectionVariable: ReflectionVariable
        };
        var res = getVarsReflection.invoke(context, reflectedScope, node);
        expect(res).toBe(false);
      });
    });

    describe('getNonAssignedFunctionExpressions method', function () {
      it('should ', function () {
        expect(true).toBe(false);
      });
    });

    describe('getFunctionDeclarations method', function () {
      it('should ', function () {
        expect(true).toBe(false);
      });
    });

    describe('getAssignedFunctionExpressions method', function () {
      it('should ', function () {
        expect(true).toBe(false);
      });
    });

    describe('checkFunctionType method', function () {
      it('should ', function () {
        expect(true).toBe(false);
      });
    });
  });
});
