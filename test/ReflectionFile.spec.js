var _ = require('lodash');
var ReflectionFile = require('../src/ReflectionFile');
var ReflectionScopeAbstract = require('../src/ReflectionScopeAbstract');
var ReflectionScopeTrait = require('../src/ReflectionScopeTrait');
var Reflection = require('../src/Reflection');

describe('ReflectionFile', function () {

  beforeEach(function () {
    Reflection.__files = {};
  });

  describe('Constructor', function () {
    it('should set the name on instantiation', function () {
      var node = {};
      var reflectedFile = new ReflectionFile('dir/file.js', node);
      expect(reflectedFile.getName()).toBe('dir/file.js');
    });

    it('should set the node if given as parameter', function () {
      var node = {};
      var reflectedFile = new ReflectionFile('dir/file.js', node);
      expect(reflectedFile._node).toBe(node);
    });

    it('should retrieve the node from the registry if not given as parameter', function () {
      var node = {};
      Reflection.__files['dir/file.js'] = { node: node, path: '/full/file/path/dir/file.js' };
      var reflectedFile = new ReflectionFile('dir/file.js');
      expect(reflectedFile._node).toBe(node);
    });

    it('should store a file instance into the cache like singletons', function () {
      var node = {};
      Reflection.__files['dir/file.js'] = { node: node, path: '/full/file/path/dir/file.js' };
      var reflectedFile = new ReflectionFile('dir/file.js');
      expect(Reflection.__files['dir/file.js'].instance).toBe(reflectedFile);
      var reflectedFile2 = new ReflectionFile('dir/file.js');
      expect(reflectedFile).toBe(reflectedFile2);
    });

    it('should throw an error if no node is given and the name does not refer to a registered file', function () {
      expect(Reflection.__files).toEqual({});
      var instantiate = function () {
        new ReflectionFile('path/not/registered');
      };
      expect(instantiate).toThrowError('File declaration of "path/not/registered" could not be found');
    });

    it('should inherit from the ReflectionScopeAbstract prototype', function () {
      var node = {};
      var reflectedFile = new ReflectionFile('dir/file.js', node);
      expect(reflectedFile instanceof ReflectionScopeAbstract).toBe(true);
    });

    it('should use the ReflectionScopeTrait', function () {
      var node = {};
      var reflectedFile = new ReflectionFile('dir/file.js', node);

      var traitMethods = _.functions(ReflectionScopeTrait);
      expect(_.size(traitMethods)).not.toBe(0);

      _.every(traitMethods, function (fn) {
        expect(reflectedFile[fn]).toBe(ReflectionScopeTrait[fn]);
      });
    });

  });

  describe('Methods', function () {

    var node, reflectedFile;

    beforeEach(function () {
      node = {
        "type": "Program",
        "body": [
          {
            "type": "VariableDeclaration",
            "declarations": [
              {
                "type": "VariableDeclarator",
                "id": {
                  "type": "Identifier",
                  "name": "foo"
                },
                "init": {
                  "type": "Literal",
                  "value": "helloworld",
                  "raw": "'helloworld'"
                }
              }
            ],
            "kind": "var"
          }
        ],
        "sourceType": "script"
      };
      reflectedFile = new ReflectionFile('dir/file.js', node);
    });

    it('should return the body of the file node', function () {
      expect(reflectedFile._getBody()).toBe(node.body);
    });

    it('should return the file name', function () {
      expect(reflectedFile.getFileName()).toBe('file');
    });

    it('should return the file path', function () {
      var node = {};
      Reflection.__files['dir/file.js'] = { node: node, path: '/full/file/path/dir/file.js' };
      var reflectedFile = new ReflectionFile('dir/file.js');
      expect(reflectedFile.getFilePath()).toBe('/full/file/path/dir/file.js');
    });
  });

});
