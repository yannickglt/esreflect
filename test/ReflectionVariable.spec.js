var _ = require('lodash');
var ReflectionVariable = require('../lib/ReflectionVariable');
var Reflection = require('../lib/Reflection');

describe('ReflectionVariable', function () {

  var node, reflectedVariable;

  beforeEach(function () {
    node = {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "foo"
      },
      "init": {
        "type": "Literal",
        "value": 2,
        "raw": "2"
      }
    };
    reflectedVariable = new ReflectionVariable(node);
  });

  describe('Constructor', function () {
    it('should inherit from the Reflection prototype', function () {
      expect(reflectedVariable instanceof Reflection).toBe(true);
    });
  });

  describe('Methods', function () {

    it('should return the variable name', function () {
      expect(reflectedVariable.getName()).toBe('foo');
    });

    it('should return the initial value', function () {
      expect(reflectedVariable.getValue()).toBe(2);
    });

    describe('setValue method', function () {

      it('should set the initial value if the given value is valid', function () {
        reflectedVariable.setValue(3);
        expect(reflectedVariable.getValue()).toBe(3);
        reflectedVariable.setValue('bar');
        expect(reflectedVariable.getValue()).toBe('bar');
        reflectedVariable.setValue();
        expect(reflectedVariable.getValue()).toBeUndefined();
        reflectedVariable.setValue(null);
        expect(reflectedVariable.getValue()).toBeNull();
      });

      it('should throw an error if value to set is not valid', function () {
        var setValue = function (value) {
          reflectedVariable.setValue(value);
        };
        expect(_.partial(setValue, {})).toThrowError('Given value can only be a primitive value');
        expect(_.partial(setValue, [])).toThrowError('Given value can only be a primitive value');
      });

    });
  });
});
