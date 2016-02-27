var Reflection = require('../src/Reflection');

describe('Reflection', function () {

  describe('Constructor', function () {
    it('should set the node on instantiation', function () {
      var node = {};
      var reflect = new Reflection(node);
      expect(reflect._node).toBe(node);
    });
  });

  describe('Methods', function () {
    it('should throw an error if the method getName is not overridden', function () {
      var reflect = new Reflection({});
      expect(reflect.getName).toThrowError('Implementing interface "Reflection" should override the method "getName"');
    });
  });
});
