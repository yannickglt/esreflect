var _ = require('lodash');
var path = require('path');
var JSONSelect = require('JSONSelect');
var ReflectionScopeTrait = require('../lib/ReflectionScopeTrait');
var ReflectionAssignedFunctionExpression = require('../lib/ReflectionAssignedFunctionExpression');
var ReflectionFunctionExpression = require('../lib/ReflectionFunctionExpression');
var ReflectionFunctionDeclaration = require('../lib/ReflectionFunctionDeclaration');
var ReflectionFunction = require('../lib/ReflectionFunction');
var ReflectionVariable = require('../lib/ReflectionVariable');

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
    var context;

    beforeEach(function () {
      scopeTraitReflection = new ReflectionFile('lib/ReflectionScopeTrait');
      context = {
        __cov_: __coverage__[scopeTraitReflection.getFilePath()]
      };
    });

    describe('getFunctions method', function () {
      it('should build the functions of the scope', function () {
        expect(reflectedScope._functions).toBeNull();
        var getFunctionsReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getFunctions'));

        _.extend(context, {
          _: _,
          getAssignedFunctionExpressions: _.noop,
          getNonAssignedFunctionExpressions: _.noop,
          getFunctionDeclarations: _.noop
        });
        spyOn(context, 'getAssignedFunctionExpressions');
        spyOn(context, 'getNonAssignedFunctionExpressions');
        spyOn(context, 'getFunctionDeclarations');
        spyOn(reflectedScope, '_getBody').and.callThrough();
        var functions = getFunctionsReflection.invoke(context, reflectedScope);

        expect(reflectedScope._functions).toBe(functions);
        expect(reflectedScope._functions).not.toBeNull();
        expect(reflectedScope._getBody).toHaveBeenCalled();
        expect(context.getAssignedFunctionExpressions).toHaveBeenCalledWith(reflectedScope._node.body);
        expect(context.getNonAssignedFunctionExpressions).toHaveBeenCalledWith(reflectedScope._node.body);
        expect(context.getFunctionDeclarations).toHaveBeenCalledWith(reflectedScope._node.body);
      });
    });

    describe('getVariables method', function () {
      it('should build the variables of the scope', function () {
        expect(reflectedScope._variables).toBeNull();

        var getVariablesReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getVariables'));

        _.extend(context, {
          getVars: _.noop
        });
        spyOn(context, 'getVars');
        spyOn(reflectedScope, '_getBody').and.callThrough();
        var variables = getVariablesReflection.invoke(context, reflectedScope);

        expect(reflectedScope._variables).toBe(variables);
        expect(reflectedScope._variables).not.toBeNull();
        expect(reflectedScope._getBody).toHaveBeenCalled();
        expect(context.getVars).toHaveBeenCalledWith(reflectedScope._node.body);
      });
    });

    describe('getVars method', function () {
      var getVarsReflection;
      beforeEach(function () {
        getVarsReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getVars'));
        _.extend(context, {
          _: _,
          JSONSelect: JSONSelect,
          ReflectionVariable: ReflectionVariable
        });
      });

      it('should return the top level variables', function () {
        // e.g.: var foo = 2;
        node = {"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"foo"},"init":{"type":"Literal","value":2,"raw":"2"}}],"kind":"var"}],"sourceType":"script"};
        var vars = getVarsReflection.invoke(context, null, node);
        expect(_.size(vars)).toBe(1);
        expect(vars[0] instanceof ReflectionVariable).toBe(true);
        expect(vars[0].getValue()).toBe(2);
        expect(vars[0].getName()).toBe('foo');
      });

      it('should not return variables embedded in child function expressions', function () {
        // e.g.: (function () { var foo = 2; })();
        node = {"range":[0,33],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":33}},"type":"Program","body":[{"range":[0,33],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":33}},"type":"ExpressionStatement","expression":{"range":[0,32],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":32}},"type":"CallExpression","callee":{"range":[1,29],"loc":{"start":{"line":1,"column":1},"end":{"line":1,"column":29}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[13,29],"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":29}},"type":"BlockStatement","body":[{"range":[15,27],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":27}},"type":"VariableDeclaration","declarations":[{"range":[19,26],"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":26}},"type":"VariableDeclarator","id":{"range":[19,22],"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":22}},"type":"Identifier","name":"foo"},"init":{"range":[25,26],"loc":{"start":{"line":1,"column":25},"end":{"line":1,"column":26}},"type":"Literal","value":2,"raw":"2"}}],"kind":"var"}]},"generator":false,"expression":false},"arguments":[]}}],"sourceType":"script","comments":[]};
        var vars = getVarsReflection.invoke(context, null, node);
        expect(_.size(vars)).toBe(0);
      });

      it('should not return variables embedded in child function declarations', function () {
        // e.g.: function bar() { var foo = 2; }
        node = {"range":[0,31],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":31}},"type":"Program","body":[{"range":[0,31],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":31}},"type":"FunctionDeclaration","id":{"range":[9,12],"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}},"type":"Identifier","name":"bar"},"params":[],"defaults":[],"body":{"range":[15,31],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":31}},"type":"BlockStatement","body":[{"range":[17,29],"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":29}},"type":"VariableDeclaration","declarations":[{"range":[21,28],"loc":{"start":{"line":1,"column":21},"end":{"line":1,"column":28}},"type":"VariableDeclarator","id":{"range":[21,24],"loc":{"start":{"line":1,"column":21},"end":{"line":1,"column":24}},"type":"Identifier","name":"foo"},"init":{"range":[27,28],"loc":{"start":{"line":1,"column":27},"end":{"line":1,"column":28}},"type":"Literal","value":2,"raw":"2"}}],"kind":"var"}]},"generator":false,"expression":false}],"sourceType":"script","comments":[]};
        var vars = getVarsReflection.invoke(context, null, node);
        expect(_.size(vars)).toBe(0);
      });
    });

    describe('getFunctionDeclarations method', function () {

      var getFunctionDeclarationsReflection;
      beforeEach(function () {
        getFunctionDeclarationsReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getFunctionDeclarations'));
        _.extend(context, {
          _: _,
          JSONSelect: JSONSelect,
          ReflectionFunctionDeclaration: ReflectionFunctionDeclaration
        });
      });

      it('should return the top level function declarations', function () {
        // e.g.: function foo() {}
        node = {"range":[0,17],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":17}},"type":"Program","body":[{"range":[0,17],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":17}},"type":"FunctionDeclaration","id":{"range":[9,12],"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}},"type":"Identifier","name":"foo"},"params":[],"defaults":[],"body":{"range":[15,17],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":17}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}],"sourceType":"script","comments":[]};
        var fn = getFunctionDeclarationsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(1);
        expect(fn[0] instanceof ReflectionFunctionDeclaration).toBe(true);
        expect(fn[0].getName()).toBe('foo');
      });

      it('should not return function declarations embedded in child function expressions', function () {
        // e.g.: (function () { function foo() {} })();
        node = {"range":[0,38],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":38}},"type":"Program","body":[{"range":[0,38],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":38}},"type":"ExpressionStatement","expression":{"range":[0,37],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":37}},"type":"CallExpression","callee":{"range":[1,34],"loc":{"start":{"line":1,"column":1},"end":{"line":1,"column":34}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[13,34],"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":34}},"type":"BlockStatement","body":[{"range":[15,32],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":32}},"type":"FunctionDeclaration","id":{"range":[24,27],"loc":{"start":{"line":1,"column":24},"end":{"line":1,"column":27}},"type":"Identifier","name":"foo"},"params":[],"defaults":[],"body":{"range":[29,32],"loc":{"start":{"line":1,"column":29},"end":{"line":1,"column":32}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}]},"generator":false,"expression":false},"arguments":[]}}],"sourceType":"script","comments":[]};
        var fn = getFunctionDeclarationsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(0);
      });

      it('should not return function declarations embedded in child function declarations', function () {
        // e.g.: function bar() { function foo() {} }
        node = {"range":[0,36],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":36}},"type":"Program","body":[{"range":[0,36],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":36}},"type":"FunctionDeclaration","id":{"range":[9,12],"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}},"type":"Identifier","name":"bar"},"params":[],"defaults":[],"body":{"range":[15,36],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":36}},"type":"BlockStatement","body":[{"range":[17,34],"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":34}},"type":"FunctionDeclaration","id":{"range":[26,29],"loc":{"start":{"line":1,"column":26},"end":{"line":1,"column":29}},"type":"Identifier","name":"foo"},"params":[],"defaults":[],"body":{"range":[32,34],"loc":{"start":{"line":1,"column":32},"end":{"line":1,"column":34}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}]},"generator":false,"expression":false}],"sourceType":"script","comments":[]};
        var fn = getFunctionDeclarationsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(1);
        expect(fn[0].getName()).toBe('bar');
      });
    });

    describe('getAssignedFunctionExpressions method', function () {
      var getFunctionExpressionsReflection;
      beforeEach(function () {
        getFunctionExpressionsReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getAssignedFunctionExpressions'));
        _.extend(context, {
          _: _,
          JSONSelect: JSONSelect,
          ReflectionAssignedFunctionExpression: ReflectionAssignedFunctionExpression
        });
      });

      it('should return the top level assigned function expressions', function () {
        // e.g.: var foo = function () {};
        node = {"range":[0,25],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":25}},"type":"Program","body":[{"range":[0,25],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":25}},"type":"VariableDeclaration","declarations":[{"range":[4,24],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":24}},"type":"VariableDeclarator","id":{"range":[4,7],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}},"type":"Identifier","name":"foo"},"init":{"range":[10,24],"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":24}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[22,24],"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":24}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}}],"kind":"var"}],"sourceType":"script","comments":[]};
        var fn = getFunctionExpressionsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(1);
        expect(fn[0] instanceof ReflectionFunctionExpression).toBe(true);
        expect(fn[0].getAssignedName()).toBe('foo');
      });

      it('should return the several assigned function expressions even if declared in one declarator', function () {
        // e.g.: var foo = function () {}, bar = function () {};
        node = {"range":[0,47],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":47}},"type":"Program","body":[{"range":[0,47],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":47}},"type":"VariableDeclaration","declarations":[{"range":[4,24],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":24}},"type":"VariableDeclarator","id":{"range":[4,7],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":7}},"type":"Identifier","name":"foo"},"init":{"range":[10,24],"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":24}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[22,24],"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":24}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}},{"range":[26,46],"loc":{"start":{"line":1,"column":26},"end":{"line":1,"column":46}},"type":"VariableDeclarator","id":{"range":[26,29],"loc":{"start":{"line":1,"column":26},"end":{"line":1,"column":29}},"type":"Identifier","name":"bar"},"init":{"range":[32,46],"loc":{"start":{"line":1,"column":32},"end":{"line":1,"column":46}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[44,46],"loc":{"start":{"line":1,"column":44},"end":{"line":1,"column":46}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}}],"kind":"var"}],"sourceType":"script","comments":[]};
        var fn = getFunctionExpressionsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(2);
        expect(fn[0] instanceof ReflectionAssignedFunctionExpression).toBe(true);
        expect(fn[0].getAssignedName()).toBe('foo');
        expect(fn[1] instanceof ReflectionAssignedFunctionExpression).toBe(true);
        expect(fn[1].getAssignedName()).toBe('bar');
      });

      it('should not return assigned function expressions embedded in child function expressions', function () {
        // e.g.: (function () { var foo = function () {}; })();
        node = {"range":[0,46],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":46}},"type":"Program","body":[{"range":[0,46],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":46}},"type":"ExpressionStatement","expression":{"range":[0,45],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":45}},"type":"CallExpression","callee":{"range":[1,42],"loc":{"start":{"line":1,"column":1},"end":{"line":1,"column":42}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[13,42],"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":42}},"type":"BlockStatement","body":[{"range":[15,40],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":40}},"type":"VariableDeclaration","declarations":[{"range":[19,39],"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":39}},"type":"VariableDeclarator","id":{"range":[19,22],"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":22}},"type":"Identifier","name":"foo"},"init":{"range":[25,39],"loc":{"start":{"line":1,"column":25},"end":{"line":1,"column":39}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[37,39],"loc":{"start":{"line":1,"column":37},"end":{"line":1,"column":39}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}}],"kind":"var"}]},"generator":false,"expression":false},"arguments":[]}}],"sourceType":"script","comments":[]};
        var fn = getFunctionExpressionsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(0);
      });

      it('should not return assigned function expressions embedded in child function declarations', function () {
        // e.g.: function bar() { var foo = function () {}; }
        node = {"range":[0,44],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":44}},"type":"Program","body":[{"range":[0,44],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":44}},"type":"FunctionDeclaration","id":{"range":[9,12],"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}},"type":"Identifier","name":"bar"},"params":[],"defaults":[],"body":{"range":[15,44],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":44}},"type":"BlockStatement","body":[{"range":[17,42],"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":42}},"type":"VariableDeclaration","declarations":[{"range":[21,41],"loc":{"start":{"line":1,"column":21},"end":{"line":1,"column":41}},"type":"VariableDeclarator","id":{"range":[21,24],"loc":{"start":{"line":1,"column":21},"end":{"line":1,"column":24}},"type":"Identifier","name":"foo"},"init":{"range":[27,41],"loc":{"start":{"line":1,"column":27},"end":{"line":1,"column":41}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[39,41],"loc":{"start":{"line":1,"column":39},"end":{"line":1,"column":41}},"type":"BlockStatement","body":[]},"generator":false,"expression":false}}],"kind":"var"}]},"generator":false,"expression":false}],"sourceType":"script","comments":[]};
        var fn = getFunctionExpressionsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(0);
      });
    });

    describe('getNonAssignedFunctionExpressions method', function () {
      var getFunctionExpressionsReflection;
      beforeEach(function () {
        getFunctionExpressionsReflection = _.first(scopeTraitReflection.getFunctionDeclarations('getNonAssignedFunctionExpressions'));
        _.extend(context, {
          _: _,
          JSONSelect: JSONSelect,
          ReflectionFunctionExpression: ReflectionFunctionExpression
        });
      });

      it('should return the top level assigned function expressions', function () {
        // e.g.: (function foo() {})();
        node = {"range":[0,22],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":22}},"type":"Program","body":[{"range":[0,22],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":22}},"type":"ExpressionStatement","expression":{"range":[0,21],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":21}},"type":"CallExpression","callee":{"range":[1,18],"loc":{"start":{"line":1,"column":1},"end":{"line":1,"column":18}},"type":"FunctionExpression","id":{"range":[10,13],"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":13}},"type":"Identifier","name":"foo"},"params":[],"defaults":[],"body":{"range":[16,18],"loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":18}},"type":"BlockStatement","body":[]},"generator":false,"expression":false},"arguments":[]}}],"sourceType":"script","comments":[]};
        var fn = getFunctionExpressionsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(1);
        expect(fn[0] instanceof ReflectionFunctionExpression).toBe(true);
        expect(fn[0].getName()).toBe('foo');
      });

      it('should not return assigned function expressions embedded in child function expressions', function () {
        // e.g.: (function () { (function foo() {})(); })();
        node = {"range":[0,43],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":43}},"type":"Program","body":[{"range":[0,43],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":43}},"type":"ExpressionStatement","expression":{"range":[0,42],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":42}},"type":"CallExpression","callee":{"range":[1,39],"loc":{"start":{"line":1,"column":1},"end":{"line":1,"column":39}},"type":"FunctionExpression","id":{},"params":[],"defaults":[],"body":{"range":[13,39],"loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":39}},"type":"BlockStatement","body":[{"range":[15,37],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":37}},"type":"ExpressionStatement","expression":{"range":[15,36],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":36}},"type":"CallExpression","callee":{"range":[16,33],"loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":33}},"type":"FunctionExpression","id":{"range":[25,28],"loc":{"start":{"line":1,"column":25},"end":{"line":1,"column":28}},"type":"Identifier","name":"foo"},"params":[],"defaults":[],"body":{"range":[31,33],"loc":{"start":{"line":1,"column":31},"end":{"line":1,"column":33}},"type":"BlockStatement","body":[]},"generator":false,"expression":false},"arguments":[]}}]},"generator":false,"expression":false},"arguments":[]}}],"sourceType":"script","comments":[]};
        var fn = getFunctionExpressionsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(1);
        expect(fn[0].isAnonymous()).toBe(true);
        expect(fn[0].getName()).toBeUndefined();
      });

      it('should not return assigned function expressions embedded in child function declarations', function () {
        // e.g.: function bar() { (function foo() {})(); }
        node = {"range":[0,41],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":41}},"type":"Program","body":[{"range":[0,41],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":41}},"type":"FunctionDeclaration","id":{"range":[9,12],"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}},"type":"Identifier","name":"bar"},"params":[],"defaults":[],"body":{"range":[15,41],"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":41}},"type":"BlockStatement","body":[{"range":[17,39],"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":39}},"type":"ExpressionStatement","expression":{"range":[17,38],"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":38}},"type":"CallExpression","callee":{"range":[18,35],"loc":{"start":{"line":1,"column":18},"end":{"line":1,"column":35}},"type":"FunctionExpression","id":{"range":[27,30],"loc":{"start":{"line":1,"column":27},"end":{"line":1,"column":30}},"type":"Identifier","name":"foo"},"params":[],"defaults":[],"body":{"range":[33,35],"loc":{"start":{"line":1,"column":33},"end":{"line":1,"column":35}},"type":"BlockStatement","body":[]},"generator":false,"expression":false},"arguments":[]}}]},"generator":false,"expression":false}],"sourceType":"script","comments":[]};
        var fn = getFunctionExpressionsReflection.invoke(context, null, node);
        expect(_.size(fn)).toBe(0);
      });
    });

    describe('checkFunctionType method', function () {
      it('should throw an error if the type is not a valid function type', function () {
        var checkFunctionTypeReflection = _.first(scopeTraitReflection.getFunctionDeclarations('checkFunctionType'));

        _.extend(context, {
          _: _,
          ReflectionFunction: require('../lib/ReflectionFunction')
        });

        function invoke(type) {
          checkFunctionTypeReflection.invoke(context, null, type);
        }

        expect(_.partial(invoke, 'expression')).not.toThrowError();
        expect(_.partial(invoke, 'declaration')).not.toThrowError();
        expect(_.partial(invoke, 'notAValidType')).toThrowError();
      });
    });
  });
});
