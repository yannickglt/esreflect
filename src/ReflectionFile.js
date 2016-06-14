var _ = require('lodash');
var Reflection = require('./Reflection');
var ReflectionScopeAbstract = require('./ReflectionScopeAbstract');

var ReflectionFile = function (name, node) {

  if (_.isUndefined(node)) {
    if (typeof Reflection.__files[name] === 'undefined') {
      throw new Error('File declaration of "' + name + '" could not be found');
    }
    if (Reflection.__files[name].instance) {
      return Reflection.__files[name].instance;
    } else {
      node = Reflection.__files[name].node;
      this._filePath = Reflection.__files[name].path;
      Reflection.__files[name].instance = this;
    }
  }

  this._name = name;
  ReflectionScopeAbstract.call(this, node);
  _.extend(this, require('./ReflectionScopeTrait'));
};

ReflectionFile.prototype = Object.create(ReflectionScopeAbstract.prototype);

ReflectionFile.prototype._getBody = function () {
  return _.get(this._node, 'body');
};

ReflectionFile.prototype.getName = function () {
  return this._name;
};

ReflectionFile.prototype.getFilePath = function () {
  return this._filePath;
};

ReflectionFile.prototype.getFileName = function () {
  var fileNameParts = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(this._name);
  fileNameParts.shift();
  return fileNameParts[2].slice(0, fileNameParts[2].length - fileNameParts[3].length);
};

module.exports = ReflectionFile;
