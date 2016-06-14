var ReflectionScopeAbstract = require('../src/ReflectionScopeAbstract');
var Reflection = require('../src/Reflection');

describe('ReflectionScopeAbstract', function () {

  var reflectedScope;

  beforeEach(function () {
    reflectedScope = new ReflectionScopeAbstract({});
  });

  describe('Constructor', function () {

    it('should inherit from the Reflection prototype', function () {
      expect(reflectedScope instanceof Reflection).toBe(true);
    });

    it('should initialize the functions and variables properties', function () {
      expect(reflectedScope._functions).toBeNull();
      expect(reflectedScope._variables).toBeNull();
    });

  });

  describe('Methods', function () {

    it('should throw an error if the method _getBody is not overridden', function () {
      expect(reflectedScope._getBody).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "_getBody"');
    });

    it('should throw an error if the method getFunctionsByType is not overridden', function () {
      expect(reflectedScope.getFunctionsByType).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getFunctionsByType"');
    });

    it('should throw an error if the method getFunctionsByName is not overridden', function () {
      expect(reflectedScope.getFunctionsByName).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getFunctionsByName"');
    });

    it('should throw an error if the method getAnonymousFunctions is not overridden', function () {
      expect(reflectedScope.getAnonymousFunctions).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getAnonymousFunctions"');
    });

    it('should throw an error if the method getFunctionDeclarations is not overridden', function () {
      expect(reflectedScope.getFunctionDeclarations).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getFunctionDeclarations"');
    });

    it('should throw an error if the method getFunctionExpressions is not overridden', function () {
      expect(reflectedScope.getFunctionExpressions).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getFunctionExpressions"');
    });

    it('should throw an error if the method getVariables is not overridden', function () {
      expect(reflectedScope.getVariables).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getVariables"');
    });

    it('should throw an error if the method getStartLine is not overridden', function () {
      expect(reflectedScope.getStartLine).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getStartLine"');
    });

    it('should throw an error if the method getEndLine is not overridden', function () {
      expect(reflectedScope.getEndLine).toThrowError('Implementing interface "ReflectionScopeAbstract" should override the method "getEndLine"');
    });

  });
});
