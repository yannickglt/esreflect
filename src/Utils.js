var _ = require('lodash');
var escodegen = require('escodegen');

var Utils = {
  getBody: function (node) {
    if (node.type === 'Program') {
      return _.get(node, 'body.0.body');
    }
    else if (node.type === 'VariableDeclaration') {
      return _.get(node, 'declarations.0.init.body');
    }
  },
  getFunctionName: function (node) {
    return _.get(node, 'body[0].id.name');
  },
  blockToFunction: function (block) {
    if (!block) {
      return {};
    }
    block = _.cloneDeep(block);
    block.type = 'Program';
    return Function(escodegen.generate(block, {
      format: {
        indent: {
          base: 1
        }
      }
    }));
  }
};

_.mixin({
  'startsWithUpperCase': function (str) {
    if (!_.isString(str)) {
      return false;
    } else {
      return /^[A-Z]/.test(str);
    }
  },
  'clear': function (obj) {
    if (_.isArray(obj)) {
      obj.splice(0, obj.length);
    } else if (_.isObject(obj)) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          delete obj[i];
        }
      }
    }
  }
});

module.exports = Utils;
