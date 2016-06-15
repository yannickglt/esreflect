var ReflectionFunctionExpression = require('../lib/ReflectionFunctionExpression');
var ReflectionFunction = require('../lib/ReflectionFunction');

describe('ReflectionFunctionExpression', function () {

  var node, reflectedFunction;

  beforeEach(function () {
    node = {};
    reflectedFunction = new ReflectionFunctionExpression(node);
  });

  describe('Constructor', function () {

    it('should inherit from the ReflectionFunction prototype', function () {
      expect(reflectedFunction instanceof ReflectionFunction).toBe(true);
    });
  });

  describe('Methods', function () {
    it('should set the function type to "expression"', function () {
      expect(reflectedFunction.getType()).toBe(ReflectionFunction.TYPE.EXPRESSION);
      expect(reflectedFunction.getType()).toBe('expression');
    });

    it('should be not marked as not assigned by default', function () {
      expect(reflectedFunction.isAssigned()).toBe(false);
    });

    describe('isAnonymous method', function () {
      it('should return true if the function is anonymous', function () {
        reflectedFunction._node.id = null;
        expect(reflectedFunction.isAnonymous()).toBe(true);
      });

      it('should return false if the function is named', function () {
        reflectedFunction._node.id = 'foo';
        expect(reflectedFunction.isAnonymous()).toBe(false);
      });
    });
  });

});
