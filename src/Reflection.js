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

String.prototype.startsWithUpperCase = function () {
  return /^[A-Z]/.test(this);
};

var getPrototypeFunctions = function (block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object.object'))) &&
      (_.get(node, 'expression.left.object.property.name') === 'prototype') &&
      (_.get(node, 'expression.left.object.object.name') === className) &&
      (_.get(node, 'expression.right.type') === 'FunctionExpression')) {

      var funtionName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(funtionName) && !funtionName.startsWithUpperCase()) {
        self.methods[funtionName] = new ReflectionMethod(funtionName, self, node, true);
      }
    }
  });
};

var getStaticFunctions = function (block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.name') === className) &&
      (_.get(node, 'expression.left.property.name') !== 'prototype') &&
      (_.get(node, 'expression.right.type') === 'FunctionExpression')) {

      var funtionName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(funtionName) && !funtionName.startsWithUpperCase()) {
        self.methods[funtionName] = new ReflectionMethod(funtionName, self, node, true, true);
      }
    }
  });
};

var getThisFunctions = function (block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.type') === 'ThisExpression') &&
      (_.get(node, 'expression.right.type') === 'FunctionExpression')) {

      var funtionName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(funtionName) && !funtionName.startsWithUpperCase()) {
        self.methods[funtionName] = new ReflectionMethod(funtionName, self, node, true);
      }
    }
  });
};

var getPrivateFunctions = function (block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    // for: var doSomething = function ()
    if ((node.type === 'VariableDeclaration') &&
      (_.get(node, 'declarations.length') === 1) &&
      (_.get(node, 'declarations.0.type') === 'VariableDeclarator') &&
      (_.get(node, 'declarations.0.init.type') === 'FunctionExpression')) {

      // Named function expression
      var namedFunction = _.get(node, 'declarations.0.init.id');
      if (!_.isNull(namedFunction) && !namedFunction.name.startsWithUpperCase()) {
        self.methods[namedFunction.name] = new ReflectionMethod(namedFunction.name, self, node);
      }

      var variableName = _.get(node, 'declarations.0.id.name');
      if (!_.isNull(variableName) && !variableName.startsWithUpperCase()) {
        self.methods[variableName] = new ReflectionMethod(variableName, self, node);
      }
    }
    // for: function doSomething ()
    else if (node.type === 'FunctionDeclaration') {
      self.methods[node.id.name] = new ReflectionMethod(node.id.name, self, node);
    }
  });
};

var getPrototypeProperties = function (block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object.object'))) &&
      (_.get(node, 'expression.left.object.property.name') === 'prototype') &&
      (_.get(node, 'expression.left.object.object.name') === className) &&
      (_.get(node, 'expression.right.type') !== 'FunctionExpression')) {

      var propertyName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(propertyName)) {
        var initialValue;
        if (node.expression.right.hasOwnProperty('value')) {
          initialValue = node.expression.right.value;
        } else {
          initialValue = undefined;
        }
        self.properties[propertyName] = new ReflectionProperty(propertyName, self, node, true, false, initialValue);
      }
    }
  });
};

var getStaticProperties = function (block, className) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.name') === className) &&
      (_.get(node, 'expression.left.property.name') !== 'prototype') &&
      (_.get(node, 'expression.right.type') !== 'FunctionExpression')) {

      var propertyName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(propertyName)) {
        self.properties[propertyName] = new ReflectionProperty(propertyName, self, node, true, true);
      }
    }
  });
};

var getThisProperties = function (block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {
    if ((node.type === 'ExpressionStatement') &&
      (_.get(node, 'expression.type') === 'AssignmentExpression') &&
      (_.get(node, 'expression.operator') === '=') &&
      (_.isUndefined(_.get(node, 'expression.left.object.object'))) &&
      (_.get(node, 'expression.left.object.type') === 'ThisExpression') &&
      (_.get(node, 'expression.right.type') !== 'FunctionExpression')) {

      var propertyName = _.get(node, 'expression.left.property.name');
      if (!_.isNull(propertyName)) {
        var initialValue;
        if (node.expression.right.hasOwnProperty('value')) {
          initialValue = node.expression.right.value;
        } else {
          initialValue = undefined;
        }
        self.properties[propertyName] = new ReflectionProperty(propertyName, self, node, true, false, initialValue);
      }
    }
  });
};

var getPrivateProperties = function (block) {
  if (!block) {
    return {};
  }
  var self = this;
  _.forEach(block.body, function (node) {

    // for: var something = "foo"
    if ((node.type === 'VariableDeclaration') &&
      (_.get(node, 'declarations.length') === 1) &&
      (_.get(node, 'declarations.0.type') === 'VariableDeclarator') &&
      (_.get(node, 'declarations.0.init.type') !== 'FunctionExpression')) {

      var variableName = _.get(node, 'declarations.0.id.name');
      if (!_.isNull(variableName)) {

        var init = _.get(node, 'declarations.0.init');
        var initialValue;
        if (!_.isNull(init) && init.hasOwnProperty('value')) {
          initialValue = init.value;
        } else {
          initialValue = undefined;
        }

        self.properties[variableName] = new ReflectionProperty(variableName, self, node, false, false, initialValue);
      }
    }
  });
};

var getClasses = function (block) {
  var self = this;
  _.forEach(block.body, function (node) {

    // for: var doSomething = function ()
    if ((node.type === 'VariableDeclaration') &&
      (_.get(node, 'declarations.length') === 1) &&
      (_.get(node, 'declarations.0.type') === 'VariableDeclarator') &&
      (_.get(node, 'declarations.0.init.type') === 'FunctionExpression')) {

      // Named function expression
      var namedClass = _.get(node, 'declarations.0.init.id');
      if (!_.isNull(namedClass) && namedClass.name.startsWithUpperCase()) {
        self.classes[namedClass.name] = new ReflectionClass(namedClass.name, self, node);
      }

      var variableName = _.get(node, 'declarations.0.id.name');
      if (!_.isNull(variableName) && variableName.startsWithUpperCase()) {
        self.classes[variableName] = new ReflectionClass(variableName, self, node);
      }
    }
    // for: function doSomething ()
    else if ((node.type === 'FunctionDeclaration') && node.id.name.startsWithUpperCase()) {
      self.classes[node.id.name] = new ReflectionClass(node.id.name, self, node);
    }
  });
};

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

var getBody = function (node) {
  if (node.type === 'Program') {
    return _.get(node, 'body.0.body');
  }
  else if (node.type === 'VariableDeclaration') {
    return _.get(node, 'declarations.0.init.body');
  }
};

var getFunctionName = function () {
  return this.astNode.body[0].id.name;
};

var blockToFunction = function (block) {
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
};

var ReflectionScope = function (fn) {
  if (!_.isFunction(fn)) {
    throw new Error('Expect a function, ' + typeof fn + ' given.');
  }
  this.astNode = esprima.parse(String(fn), {
    loc: true
  });
  this.name = getFunctionName.bind(this)();

  var body = getBody(this.astNode);

  this.classes = {};
  getClasses.bind(this)(body);
};

var ReflectionClass = function (name, scope, astNode) {
  this.name = name;
  if (_.isObject(scope) && (!scope instanceof ReflectionScope)) {
    throw new Error('Parameter scope must be an instance of ReflectionScope.');
  }
  this.scope = _.isUndefined(scope) ? null : scope;
  this.scopeName = scope.name;
  this.astNode = astNode;
  this.startLine = astNode.loc.start.line;
  this.endLine = astNode.loc.end.line;

  var scopeBody = getBody(scope.astNode);
  var classBody = getBody(astNode);

  this.methods = {};

  getPrivateFunctions.bind(this)(classBody);
  getPrototypeFunctions.bind(this)(scopeBody, name);
  getThisFunctions.bind(this)(classBody);
  getStaticFunctions.bind(this)(scopeBody, name);

  this.properties = {};
  getPrivateProperties.bind(this)(classBody);
  getPrototypeProperties.bind(this)(scopeBody, name);
  getThisProperties.bind(this)(classBody);
  getStaticProperties.bind(this)(classBody);

  this.construct = blockToFunction(classBody);
};

var ReflectionProperty = function (name, declaringClass, astNode, isPublic, isStatic, value) {
  this.name = name;
  if (_.isObject(declaringClass) && (!declaringClass instanceof ReflectionClass)) {
    throw new Error('Parameter scope must be an instance of ReflectionClass.');
  }
  this.declaringClass = declaringClass;
  this.astNode = astNode;
  this.isPublic = (isPublic === true);
  this.isPrivate = (isPublic !== true);
  this.isStatic = (isStatic === true);
  this.value = value;
};

var ReflectionMethod = function (name, declaringClass, astNode, isPublic, isStatic) {
  this.name = name;
  if (_.isObject(declaringClass) && (!declaringClass instanceof ReflectionClass)) {
    throw new Error('Parameter scope must be an instance of ReflectionClass.');
  }
  this.declaringClass = declaringClass;
  this.astNode = astNode;
  this.isPublic = (isPublic === true);
  this.isPrivate = (isPublic !== true);
  this.isStatic = (isStatic === true);
};

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

var scope = new ReflectionScope(Controller);
console.log(scope);
console.log(escodegen.generate(scope.astNode));

/*
    this.$$toto; // Object.defineProperty(this, '$$toto', { ... });
    this.$$_privateConstructorFunction = _privateConstructorFunction;
*/
