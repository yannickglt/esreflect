var ReflectionFunctionDeclaration = require('../src/ReflectionFunctionDeclaration');
var ReflectionFunction = require('../src/ReflectionFunction');

describe('ReflectionFunctionDeclaration', function () {

  var node, reflectedFunction;

  beforeEach(function () {
    node = {};
    reflectedFunction = new ReflectionFunctionDeclaration(node);
  });

  describe('Constructor', function () {
    it('should inherit from the ReflectionFunction prototype', function () {
      expect(reflectedFunction instanceof ReflectionFunction).toBe(true);
    });
  });

  describe('Methods', function () {
    it('should set the function type to "declaration"', function () {
      expect(reflectedFunction.getType()).toBe(ReflectionFunction.TYPE.DECLARATION);
      expect(reflectedFunction.getType()).toBe('declaration');
    });
  });

});
