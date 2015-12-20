var options = {
  format: {
    compact: false
  }
};
if (options.format.compact) {
  newline = space = indent = base = '';
} else {
  newline = '\n';
  space = ' ';
}


var getFunctions = function (block) {
  var namedFunction;
  var functions = {};
  block.body.forEach(function (node) {
    // for: var doSomething = function ()
    if ((node.type === 'VariableDeclaration') &&
      (node.declarations.length === 1) &&
      (node.declarations[0].type === 'VariableDeclarator') &&
      (node.declarations[0].init.type === 'FunctionExpression')) {

      // Named function expression
      namedFunction = _.get(node, 'declarations.0.init.id');
      if (namedFunction !== null) {
        functions[namedFunction.name] = node;
      }

      functions[node.declarations[0].id.name] = node;

    }
    // for: function doSomething ()
    else if (node.type === 'FunctionDeclaration') {
      functions[node.id.name] = node;
    }
    // for: Function.prototype.doSomething = function ()
    else if ((node.type === 'ExpressionStatement') &&
      (node.expression.type === 'AssignmentExpression') &&
      (node.expression.operator === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object.object'))) &&
      (_.get(node, 'expression.left.object.property.name') === 'prototype') &&
      (node.expression.right.type === 'FunctionExpression')) {

      // Named function expression
      namedFunction = _.get(node, 'expression.right.id');
      if (namedFunction !== null) {
        functions[namedFunction.name] = node;
      }

      functions[node.expression.left.property.name] = node;
    }
    // for: this.doSomething = function ()
    else if ((node.type === 'ExpressionStatement') &&
      (node.expression.type === 'AssignmentExpression') &&
      (node.expression.operator === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.type') === 'ThisExpression') &&
      (node.expression.right.type === 'FunctionExpression')) {

      // Named function expression
      namedFunction = _.get(node, 'expression.right.id');
      if (namedFunction !== null) {
        functions[namedFunction.name] = node;
      }

      functions[node.expression.left.property.name] = node;
    } else {
      console.log('No matcher found', node);
    }
  });
  /*
   var functions = [];
   block.body.forEach(function (node) {
   var parent;
   if (node.type === 'FunctionDeclaration') {
   functions.push({
   name: node.id.name,
   params: node.params,
   range: node.range,
   blockStart: node.body.range[0],
   end: node.body.range[1],
   loc: node.loc.start,
   node: node
   });
   }
   else if ((node.type === 'VariableDeclaration') &&
   (node.declarations.length === 1) &&
   (node.declarations[0].init.type === 'FunctionExpression')) {

   var variableNode = node;
   var parent = node.declarations[0];
   node = node.declarations[0].init;

   if (parent.type === 'AssignmentExpression') {
   if (typeof parent.left.range !== 'undefined') {
   if (parent.left.type === "MemberExpression") {

   // for: foo.doSomething = function
   if (parent.left.object.name !== undefined) {
   var namespace = parent.left.object.name;

   if (parent.left.property.name !== undefined) {
   var memberName = parent.left.property.name;
   matched = true;
   }

   // for: foo["doSomething"] = function()
   else if (parent.left.property && parent.left.property.type === "Literal") {
   var namespace = parent.left.object.name;
   var memberName = parent.left.property.value;
   matched = true;
   }
   }

   // for: this.doSomething = function
   else if (parent.left.object.type === "ThisExpression") {
   var namespace = "thiz";
   if (parent.left.property.name !== undefined) {
   var memberName = parent.left.property.name;
   matched = true;
   }

   // for this[variable] = function()
   else if (parent.left.property.type === "CallExpression") {
   // no op
   matched = true;
   }
   }

   // for: Function.prototype.doSomething = function()
   else if (parent.left.object.object !== undefined && parent.left.object.object.type === "Identifier") {
   var namespace = parent.left.object.object.type;
   var memberName = parent.left.property.name;
   var isPrototype = true;
   var prototyping = "prototype";
   matched = true;
   }

   // for: this.htmlElement.onmouseover = function()
   else if (parent.left.type === "MemberExpression" && parent.left.object.type === "MemberExpression") {
   var namespace ="thiz";
   var memberName = parent.left.property.name;

   var isPrototype = true;
   var prototyping = parent.left.object.property.name;
   matched = true;
   }

   // for: (boolType ? "name" : "name2").doSomething = function()
   else if (parent.left.object !== undefined && parent.left.object.type === "ConditionalExpression") {
   // no op
   matched = true;
   }
   }
   else if (parent.left.type === "Identifier") {
   var memberName = parent.left.name;
   matched = true;
   }

   if (!matched) {
   }
   else {
   functions.push({
   namespace: namespace,
   name: memberName,
   isPrototype: isPrototype,
   prototyping: prototyping,
   params: node.params,
   range: node.range,
   blockStart: _.get(node, 'body.range.0'),
   end: node.body.range[1],
   loc: node.loc.start
   });
   }
   }
   } else if (parent.type === 'VariableDeclarator') {
   functions.push({
   name: parent.id.name,
   params: node.params,
   range: node.range,
   blockStart: _.get(node, 'body.range.0'),
   end: _.get(node, 'body.range.1'),
   loc: _.get(node, 'loc.start')
   });
   } else if (parent.type === 'CallExpression') {
   functions.push({
   name: parent.id ? parent.id.name : '[Anonymous]',
   params: node.params,
   range: node.range,
   blockStart: node.body.range[0],
   end: node.body.range[1],
   loc: node.loc.start
   });
   } else if (typeof parent.length === 'number') {
   functions.push({
   name: parent.id ? parent.id.name : '[Anonymous]',
   params: node.params,
   range: node.range,
   blockStart: node.body.range[0],
   end: node.body.range[1],
   loc: node.loc.start
   });
   } else if (typeof parent.key !== 'undefined') {
   if (parent.key.type === 'Identifier') {
   if (parent.value === node && parent.key.name) {
   functions.push({
   name: parent.key.name,
   params: node.params,
   range: node.range,
   blockStart: node.body.range[0],
   end: node.body.range[1],
   loc: node.loc.start
   });
   }
   }
   }
   }
   });
   */
  return functions;
};


/**
 Object.defineProperty(this, '__privateProperty__', {
  get: function () {
    return __privateProperty__;
  },
  set: function (v) {
    __privateProperty__ = v;
  }
});
 */
function Controller () {
  var TestClass = function () {
    this.publicThisProperty = "publicThisProperty";
    this.publicThisMethod = function () {

    };

    var privateConstructorMethod = function () {

    };
    var privateProperty = "privateProperty";
  };

  var privateStaticProperty = "privateStaticProperty";
  var privateStaticMethod = function () {

  };

  TestClass.prototype.publicProtoProperty = "publicProtoProperty";
  TestClass.prototype.publicProtoMethod = function () {

  };

  TestClass.publicStaticProperty = "publicStaticProperty";
  TestClass.publicStaticMethod = function () {

  };

  return TestClass;
}
/*
var scope = new ReflectionScope(Controller);
console.log(scope);
//scope.classes.TestClass.properties.privateProperty.setAccessible(true);
scope.classes.TestClass.getClass();
console.log(escodegen.generate(scope.astNode));
*/
/*
 this.$$toto; // Object.defineProperty(this, '$$toto', { ... });
 this.$$_privateConstructorFunction = _privateConstructorFunction;
 */
