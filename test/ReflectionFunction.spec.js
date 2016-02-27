var _ = require('lodash');
var ReflectionFunction = require('../src/ReflectionFunction');
var ReflectionScopeAbstract = require('../src/ReflectionScopeAbstract');
var ReflectionScopeTrait = require('../src/ReflectionScopeTrait');

describe('ReflectionFunction', function () {

  describe('Constructor', function () {

    it('should inherit from the ReflectionScopeAbstract prototype', function () {
      var node = {};
      var reflectedFunction = new ReflectionFunction(node);
      expect(reflectedFunction instanceof ReflectionScopeAbstract).toBe(true);
    });

    it('should use the ReflectionScopeTrait', function () {
      var node = {};
      var reflectedFunction = new ReflectionFunction(node);

      var traitMethods = _.functions(ReflectionScopeTrait);
      expect(_.size(traitMethods)).not.toBe(0);

      _.every(traitMethods, function (fn) {
        expect(reflectedFunction[fn]).toBe(ReflectionScopeTrait[fn]);
      });
    });

    it('should have the function types as static properties', function () {
      expect(_.size(ReflectionFunction.TYPE)).toBe(2);
      expect(ReflectionFunction.TYPE.DECLARATION).not.toBeUndefined();
      expect(ReflectionFunction.TYPE.EXPRESSION).not.toBeUndefined();
    });

  });

  describe('Methods', function () {

    var node, reflectedFunction;

    beforeEach(function () {
      node = {"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo"},"params":[{"type":"Identifier","name":"param1"},{"type":"Identifier","name":"param2"}],"defaults":[],"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"CallExpression","callee":{"type":"MemberExpression","computed":false,"object":{"type":"Identifier","name":"console"},"property":{"type":"Identifier","name":"log"}},"arguments":[{"type":"Literal","value":"bar","raw":"'bar'"}]}}]},"generator":false,"expression":false};
      reflectedFunction = new ReflectionFunction(node);
    });

    it('should return the body of the function node', function () {
      expect(reflectedFunction._getBody()).toBe(node.body);
    });

    it('should return the function name', function () {
      expect(reflectedFunction.getName()).toBe('foo');
    });

    it('should set the function type to "undefined"', function () {
      expect(reflectedFunction.getType()).toBeUndefined();
    });

    describe('getParameters method', function () {

      it('should return the function parameters', function () {
        expect(reflectedFunction.getParameters()).toEqual(['param1', 'param2']);
      });

      it('should sort the parameters in the order they are declared', function () {
        var parameters = reflectedFunction.getParameters();
        expect(parameters[0]).toBe('param1');
        expect(parameters[1]).toBe('param2');
      });

      it('should return an empty array if the node is invalid', function () {
        reflectedFunction._node.params = { test: 'invalidNode' };
        expect(reflectedFunction.getParameters()).toEqual([]);
      });

    });

    describe('toString method', function () {

      it('should return the function as a string if the node is valid', function () {
        var fnAsString = "function foo(param1, param2){\n    console.log('bar');\n}";
        expect(reflectedFunction.toString()).toBe(fnAsString);
        expect(reflectedFunction + '').toBe(fnAsString);
      });

      it('should return an empty function if the node is invalid', function () {
        var fnAsString = 'function foo(param1, param2){}';
        reflectedFunction._node.body = 'invalidNode';
        expect(reflectedFunction.toString()).toBe(fnAsString);
        expect(reflectedFunction + '').toBe(fnAsString);
      });
    });

    describe('getClosure method', function () {

      it('should return the function closure and execute with an empty execution context if not specified', function () {
        spyOn(console, 'log');
        var closure = reflectedFunction.getClosure();
        closure();
        expect(console.log).toHaveBeenCalledWith('bar');
      });

      it('should consider the execution context given to the function closure', function () {
        var context = {
          console: {
            log: _.noop
          }
        };
        spyOn(context.console, 'log');
        var closure = reflectedFunction.getClosure(context);
        closure();
        expect(context.console.log).toHaveBeenCalledWith('bar');
      });

    });

    describe('invoke and invokeArgs methods', function () {

      it('should invoke the function with parameters provided individually', function () {
        reflectedFunction._node = {"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo"},"params":[{"type":"Identifier","name":"param1"},{"type":"Identifier","name":"param2"}],"defaults":[],"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"CallExpression","callee":{"type":"MemberExpression","computed":false,"object":{"type":"Identifier","name":"console"},"property":{"type":"Identifier","name":"log"}},"arguments":[{"type":"Literal","value":"bar","raw":"'bar'"},{"type":"Identifier","name":"param1"},{"type":"Identifier","name":"param2"}]}}]},"generator":false,"expression":false};
        var fnAsString = "function foo(param1, param2){\n    console.log('bar', param1, param2);\n}";
        expect(reflectedFunction.toString()).toBe(fnAsString);

        spyOn(console, 'log');
        reflectedFunction.invoke(null, null, 'firstParam', 'secondParam');
        expect(console.log).toHaveBeenCalledWith('bar', 'firstParam', 'secondParam');

        reflectedFunction.invokeArgs(null, null, ['hello', 'world']);
        expect(console.log).toHaveBeenCalledWith('bar', 'hello', 'world');
      });

      it('should invoke the function within the given "this" context', function () {
        reflectedFunction._node = {"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo"},"params":[{"type":"Identifier","name":"param1"},{"type":"Identifier","name":"param2"}],"defaults":[],"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"CallExpression","callee":{"type":"MemberExpression","computed":false,"object":{"type":"ThisExpression"},"property":{"type":"Identifier","name":"dump"}},"arguments":[{"type":"Literal","value":"bar","raw":"'bar'"},{"type":"Identifier","name":"param1"},{"type":"Identifier","name":"param2"}]}}]},"generator":false,"expression":false};
        var fnAsString = "function foo(param1, param2){\n    this.dump('bar', param1, param2);\n}";
        expect(reflectedFunction.toString()).toBe(fnAsString);

        var obj = {
          dump: _.noop
        };
        spyOn(obj, 'dump');
        reflectedFunction.invoke({}, obj, 'firstParam', 'secondParam');
        expect(obj.dump).toHaveBeenCalledWith('bar', 'firstParam', 'secondParam');

        reflectedFunction.invokeArgs(null, obj, ['hello', 'world']);
        expect(obj.dump).toHaveBeenCalledWith('bar', 'hello', 'world');
      });

    });

  });

});
