var ReflectionAssignedFunctionExpression = require('../src/ReflectionAssignedFunctionExpression');
var ReflectionFunctionExpression = require('../src/ReflectionFunctionExpression');

describe('ReflectionAssignedFunctionExpression', function () {

  var node, reflectedFunction;

  beforeEach(function () {
    node = {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "foo"
      },
      "init": {
        "type": "FunctionExpression",
        "id": {
          "type": "Identifier",
          "name": "bar"
        },
        "params": [
          {
            "type": "Identifier",
            "name": "param1"
          },
          {
            "type": "Identifier",
            "name": "param2"
          }
        ],
        "defaults": [],
        "body": {
          "type": "BlockStatement",
          "body": []
        },
        "generator": false,
        "expression": false
      }
    };
    reflectedFunction = new ReflectionAssignedFunctionExpression(node);
  });

  describe('Constructor', function () {
    it('should inherit from the ReflectionFunctionExpression prototype', function () {
      expect(reflectedFunction instanceof ReflectionFunctionExpression).toBe(true);
    });
  });

  describe('Methods', function () {

    it('should return the body of the function node', function () {
      expect(reflectedFunction._getBody()).toBe(node.init.body);
    });

    it('should return the name of the function assignment', function () {
      expect(reflectedFunction.getAssignedName()).toBe('foo');
    });

    it('should return the function name if it is not anonymous', function () {
      expect(reflectedFunction.getName()).toBe('bar');
    });

    it('should return undefined if the function is anonymous', function () {
      node.init.id = null;
      expect(reflectedFunction.getName()).toBeUndefined();
    });

    it('should be marked as assigned', function () {
      expect(reflectedFunction.isAssigned()).toBe(true);
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
        reflectedFunction._node.init.params = { test: 'invalidNode' };
        expect(reflectedFunction.getParameters()).toEqual([]);
      });

    });

  });
});
