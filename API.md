# Reflection API docs

#### Table of contents

- [Reflection](#reflection) - The Reflection class
  - [Reflection.getName](#reflectiongetname) - Gets member name
- [ReflectionScope](#reflectionscope) - The ReflectionScope class
  - [ReflectionScope.getAnonymousFunctions](#reflectionscopegetanonymousfunctions) - Gets anonymous functions
  - [ReflectionScope.getFunctionDeclarations](#reflectionscopegetfunctiondeclarations) - Gets function declarations
  - [ReflectionScope.getFunctionExpressions](#reflectionscopegetfunctionexpressions) - Gets function expressions
  - [ReflectionScope.getFunctionsByName](#reflectionscopegetstartline) - Gets functions from given name
  - [ReflectionScope.getFunctionsByType](#reflectionscopegetfunctionsbytype) - Gets functions from given type
  - [ReflectionScope.getStartLine](#reflectionscopegetstartline) - Gets starting line number
  - [ReflectionScope.getEndLine](#reflectionscopegetendline) - Gets ending line number
  - [ReflectionScope.getStartColumn](#reflectionscopegetstartcolumn) - Gets starting column number
  - [ReflectionScope.getEndColumn](#reflectionscopegetendcolumn) - Gets ending column number
  - [ReflectionScope.getVariables](#reflectionscopegetvariables) - Gets variables
- [ReflectionFile](#reflectionfile) - The ReflectionFile class
  - [ReflectionFile.constructor](#reflectionfileconstructor) - Constructs a ReflectionFile
  - [ReflectionFile.getFileName](#reflectionfilegetfilename) - Gets file name
  - [ReflectionFile.getFilePath](#reflectionfilegetfilepath) - Gets file path
- [ReflectionFunction](#reflectionfunction) - The ReflectionFunction class
  - [ReflectionFunction.getClosure](#reflectionfunctiongetclosure) - Returns a dynamically created closure for the function
  - [ReflectionFunction.getParameters](#reflectionfunctiongetparameters) - Gets parameters
  - [ReflectionFunction.getType](#reflectionfunctiongettype) - Gets function type
  - [ReflectionFunction.invoke](#reflectionfunctioninvoke) - Invokes function
  - [ReflectionFunction.invokeArgs](#reflectionfunctioninvokeargs) - Invokes function with args
  - [ReflectionFunction.toString](#reflectionfunctiontostring) - Returns the string representation of the function
- [ReflectionFunctionDeclaration](#reflectionfunctiondeclaration) - The ReflectionFunctionDeclaration class
  - [ReflectionFunctionDeclaration.constructor](#reflectionfunctiondeclarationconstructor) - Constructs a ReflectionFunctionDeclaration
- [ReflectionFunctionExpression](#reflectionfunctionexpression) - The ReflectionFunctionExpression class
  - [ReflectionFunctionExpression.constructor](#reflectionfunctionexpressionconstructor) - Constructs a ReflectionFunctionExpression
  - [ReflectionFunctionExpression.isAnonymous](#reflectionfunctionexpressionisanonymous) - Checks if function is anonymous
  - [ReflectionFunctionExpression.isAssigned](#reflectionfunctionexpressionisassigned) - Checks if function is assigned
- [ReflectionAssignedFunctionExpression](#reflectionassignedfunctionexpression) - The ReflectionAssignedFunctionExpression class
  - [ReflectionAssignedFunctionExpression.constructor](#reflectionassignedfunctionexpressionconstructor) - Constructs a ReflectionAssignedFunctionExpression
  - [ReflectionAssignedFunctionExpression.getAssignedName](#reflectionassignedfunctionexpressiongetassignedname) - Gets assigned name
- [ReflectionVariable](#reflectionvariable) - The ReflectionVariable class
  - [ReflectionVariable.constructor](#reflectionvariableconstructor) - Constructs a ReflectionVariable
  - [ReflectionVariable.getValue](#reflectionvariablegetvalue) - Gets value
  - [ReflectionVariable.setValue](#reflectionvariablesetvalue) - Set variable value

---

## Reflection
The reflection class

#### Reflection.getName()
Gets member name

##### Parameters
This function has no parameters

##### Return value
**String** The member name

##### Examples
```javascript
// ./path/to/file.js
function foo() { }

var file = new ReflectionFile('path/to/file.js');
console.log(file.getName());
// outputs "path/to/file"

var fn = file.getFunctionDeclarations()[0];
console.log(fn.getName());
// outputs "foo"
```

## ReflectionScope
`extends Reflection`

The **ReflectionScope** class

#### ReflectionScope.getAnonymousFunctions()
Gets anonymous functions

##### Parameters
This function has no parameters

##### Return value
**Array\<ReflectionFunctionExpression>** The anonymous functions

##### Examples
```javascript
// ./path/to/file.js
(function (foo, bar) { })();

var file = new ReflectionFile('path/to/file.js');
var fn = file.getAnonymousFunctions()[0];
console.log(fn.getParameters());
// outputs ["foo", "bar"]
```

#### ReflectionScope.getFunctionDeclarations([name])
Gets function declarations

##### Parameters
- `name` **String** The function name

##### Return value
**Array\<ReflectionFunctionDeclaration>** The function declarations

##### Examples
```javascript
// ./path/to/file.js
function foo() { }
function bar() { }

var fn = file.getFunctionDeclarations()[0];
console.log(fn.getName());
// outputs "foo"

fn = file.getFunctionDeclarations('bar')[0];
console.log(fn.getName());
// outputs "bar"
```

#### ReflectionScope.getFunctionExpressions([name])
Gets function expressions

##### Parameters
- `name` **String** The function name

##### Return value
**Array\<ReflectionFunctionExpression>** The function expressions

##### Examples
```javascript
// ./path/to/file.js
(function foo() { })();
var baz = function bar() { };

var fn = file.getFunctionExpressions()[0];
console.log(fn.getName());
// outputs "foo"

fn = file.getFunctionExpressions('bar')[0];
console.log(fn.getName());
// outputs "bar"
```

#### ReflectionScope.getFunctionsByName(name[, type])
Gets functions from given name

##### Parameters
- `name` **String|Object** The function name or an object like `{ name: String, type: String }`

##### Return value
**Array\<ReflectionFunction>** The functions

##### Examples
```javascript
// ./path/to/file.js
(function foo() { })();
function bar() { }
baz(function bar() { });

var fn = file.getFunctionsByName('foo')[0];
console.log(fn.getName() + ':' + fn.getType());
console.log();
// outputs "foo:expression"

fn = file.getFunctionsByName('bar')[0];
console.log(fn.getName() + ':' + fn.getType());
// outputs "bar:declaration"

fn = file.getFunctionsByName('bar', 'expression')[0];
// or
fn = file.getFunctionsByName({ name: 'bar', type: 'expression' })[0];
console.log(fn.getName() + ':' + fn.getType());
// outputs "bar:expression"
```

#### ReflectionScope.getFunctionsByType(type)
Gets functions from given type

##### Parameters
- `name` **String|Object** The function type

##### Return value
**Array\<ReflectionFunction>** The functions

##### Examples
```javascript
// ./path/to/file.js
(function foo() { })();
function bar() { }

var fn = file.getFunctionsByType('expression')[0];
console.log(fn.getName() + ':' + fn.getType());
console.log();
// outputs "foo:expression"

fn = file.getFunctionsByType('declaration')[0];
console.log(fn.getName() + ':' + fn.getType());
// outputs "bar:declaration"
```

#### ReflectionScope.getStartLine()
Get the starting line number

##### Parameters
This function has no parameters

##### Return value
**Number** The starting line number

##### Examples
```javascript
// ./path/to/file.js
function foo(param) {
  console.log("helloworld");
}

var startLine = file.getStartLine();
console.log(startLine);
// outputs "1"
````

#### ReflectionScope.getEndLine()
Get the ending line number

##### Parameters
This function has no parameters

##### Return value
**Number** The starting line number

##### Examples
```javascript
// ./path/to/file.js
function foo(param) {
  console.log("helloworld");
}

var endLine = file.getEndLine();
console.log(endLine);
// outputs "3"
````

#### ReflectionScope.getStartColumn()
Get the starting column number

##### Parameters
This function has no parameters

##### Return value
**Number** The starting column number

##### Examples
```javascript
// ./path/to/file.js
function foo(param) {
  console.log("helloworld");
}

var startColumn = file.getStartColumn();
console.log(startColumn);
// outputs "0"
````

#### ReflectionScope.getEndColumn()
Get the ending column number

##### Parameters
This function has no parameters

##### Return value
**Number** The starting column number

##### Examples
```javascript
// ./path/to/file.js
function foo(param) {
  console.log("helloworld");
}

var endColumn = file.getEndColumn();
console.log(endColumn);
// outputs "1"
````

#### ReflectionScope.getVariables([name])
Get the variables

##### Parameters
- `name` **String** The variable name

##### Return value
**Array\<ReflectionVariable>** The variables

##### Examples
```javascript
// ./path/to/file.js
var foo;
var bar;

var variable = file.getVariables()[0];
console.log(variable.getName());
// outputs "foo"

variable = file.getVariables('bar')[0];
console.log(variable.getName());
// outputs "bar"
```

## ReflectionFile
`extends ReflectionScope`

The **ReflectionFile** class reports information about a file

#### ReflectionFile.constructor(name[, node])
Constructs a ReflectionFile

##### Parameters
- `name` **String** The file name
- `node` **Object** The AST node. Optional if the node is cached in the static object `Reflection.__files`.

##### Examples
```javascript
// ./path/to/file.js
function foo() { }

var file = new ReflectionFile('path/to/file.js');
// or
var file = new ReflectionFile('path/to/file.js', {
  "range": [ 0, 18 ],
  "type": "Program",
  "body": [
    {
      "range": [ 0, 18 ],
      "type": "FunctionDeclaration",
      "id": {
        "range": [ 9, 12 ],
        "type": "Identifier",
        "name": "foo"
      },
      "params": [],
      "defaults": [],
      "body": {
        "range": [ 15, 18 ],
        "type": "BlockStatement",
        "body": []
      },
      "generator": false,
      "expression": false
    }
  ],
  "sourceType": "script",
  "comments": []
});
```

#### ReflectionFile.getFileName()
Gets file name without the directory neither the file extension

##### Parameters
This function has no parameters

##### Return value
**String** The file name

##### Examples
```javascript
// ./path/to/file.js

var file = new ReflectionFile('path/to/file.js');
console.log(file.getFileName());
// outputs "file"
```

#### ReflectionFile.getFilePath()
Gets file path. The file path should be filled during the node caching

##### Parameters
This function has no parameters

##### Return value
**String** The file path or `undefined` if the node is not cached in the static object `Reflection.__files`

##### Examples
```javascript
// ./path/to/file.js

var file = new ReflectionFile('path/to/file.js');
console.log(file.getFilePath());
// outputs "/absolute/path/to/file.js"
```

## ReflectionFunction
`extends ReflectionScope`

The **ReflectionFunction** class reports information about a function

#### ReflectionFunction.getClosure([context])
Returns a dynamically created closure for the function

##### Parameters
- `context` **Object** The execution context associated with the closure

##### Return value
**Function** The closure

##### Examples
```javascript
// ./path/to/file.js
function foo(param) {
  console.log(param + globalVar);
}

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionDeclarations('foo')[0];
var fn = foo.getClosure({ globalVar: 'world' });
fn('hello');
// outputs "helloworld"
```

#### ReflectionFunction.getParameters()
Gets parameters

##### Parameters
This function has no parameters

##### Return value
**Array\<String>** The parameters

##### Examples
```javascript
// ./path/to/file.js
function foo(param) { }

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionDeclarations('foo')[0];
var params = foo.getParameters();
console.log(params);
// outputs ["param"]
```

#### ReflectionFunction.getType()
Gets function type

##### Parameters
This function has no parameters

##### Return value
**String** The type

##### Examples
```javascript
// ./path/to/file.js
function foo() { }

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionDeclarations('foo')[0];
console.log(foo.getType());
// outputs "declaration"
```

#### ReflectionFunction.invoke(context, this[, arg1[, arg2[, ...]]])
Invokes function

##### Parameters
- `context` **Object** The execution context associated with the closure
- `thisArg` **Object** The value to be passed as the `this` parameter. `this` refers to the current object, the calling object.
- `arg1`, `arg2`, `...` **Any** The passed arguments to the function

##### Return value
**Any** The result of the invoked function

##### Examples
```javascript
// ./path/to/file.js
function foo(param) {
  console.log(param + globalVar);
}

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionDeclarations('foo')[0];
foo.invoke({ globalVar: 'world' }, null, 'hello');
// outputs "helloworld"
```

#### ReflectionFunction.invokeArgs(context, this[, args])
Invokes function args

##### Parameters
- `context` **Object** The execution context associated with the closure
- `thisArg` **Object** The value to be passed as the `this` parameter. `this` refers to the current object, the calling object.
- `args` **Array** The passed arguments to the function as array

##### Return value
**Any** The result of the invoked function

##### Examples
```javascript
// ./path/to/file.js
function foo(param) {
  console.log(param + globalVar);
}

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionDeclarations('foo')[0];
foo.invoke({ globalVar: 'world' }, null, ['hello']);
// outputs "helloworld"
```

#### ReflectionFunction.toString()
Returns the string representation of the function

##### Parameters
This function has no parameters

##### Return value
**String** The function as string

##### Examples
```javascript
// ./path/to/file.js
function foo(param) { console.log(param + globalVar); }

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionDeclarations('foo')[0];
var fnAsString = foo.toString();
console.log(fnAsString);
// outputs "function foo(param) { console.log(param + globalVar); }"
```

## ReflectionFunctionDeclaration
`extends ReflectionFunction`

The **ReflectionFunctionDeclaration** class

#### ReflectionFunctionDeclaration.constructor(node)
Constructs a ReflectionFunctionDeclaration

##### Parameters
- `node` **Object** The AST node

##### Examples
```javascript
var func = new ReflectionFunctionDeclaration({
  "range": [ 0, 18 ],
  "type": "FunctionDeclaration",
  "id": {
    "range": [ 9, 12 ],
    "type": "Identifier",
    "name": "foo"
  },
  "params": [],
  "defaults": [],
  "body": {
    "range": [ 15, 18 ],
    "type": "BlockStatement",
    "body": []
  },
  "generator": false,
  "expression": false
});
console.log(func.getName());
// outputs "foo"
```

## ReflectionFunctionExpression
`extends ReflectionFunction`

The **ReflectionFunctionExpression** class

#### ReflectionFunctionExpression.constructor(node)
Constructs a ReflectionFunctionExpression

##### Parameters
- `node` **Object** The AST node

##### Examples
```javascript
var func = new ReflectionFunctionExpression({
  "type": "FunctionExpression",
  "id": {
    "type": "Identifier",
    "name": "foo"
  },
  "params": [],
  "defaults": [],
  "body": {
    "type": "BlockStatement",
    "body": []
  },
  "generator": false,
  "expression": false
});
console.log(func.getName());
// outputs "foo"
```

#### ReflectionFunctionExpression.isAnonymous()
Checks if function is anonymous

##### Parameters
This function has no parameters

##### Return value
**Boolean** True if it is an anonymous function, otherwise false

##### Examples
```javascript
// ./path/to/file.js
(function foo() { })();
bar(function () { });

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionExpressions('foo')[0];
// or
var foo = file.getFunctionExpressions()[0];
console.log(foo.isAnonymous());
// outputs "false"

var anonymousFn = file.getAnonymousFunction()[0];
// or
var anonymousFn = file.getFunctionExpressions()[1];
console.log(anonymousFn.isAnonymous());
// outputs "true"
```

#### ReflectionFunctionExpression.isAssigned()
Checks if function is assigned

##### Parameters
This function has no parameters

##### Return value
**Boolean** True if it is an assigned function expression, otherwise false

##### Examples
```javascript
// ./path/to/file.js
(function foo() { })();
var bar = function () { };

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionExpressions('foo')[0];
console.log(foo.isAssigned());
// outputs "false"

var bar = file.getFunctionExpressions('bar')[0];
console.log(bar.isAssigned());
// outputs "true"
```

## ReflectionAssignedFunctionExpression
`extends ReflectionFunctionExpression`

The **ReflectionAssignedFunctionExpression** class

#### ReflectionAssignedFunctionExpression.constructor(node)
Constructs a ReflectionAssignedFunctionExpression

##### Parameters
- `node` **Object** The AST node

##### Examples
```javascript
var func = new ReflectionAssignedFunctionExpression({
  "type": "VariableDeclaration",
  "declarations": [
    {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "foo"
      },
      "init": {
        "type": "FunctionExpression",
        "id": {},
        "params": [],
        "defaults": [],
        "body": {
          "type": "BlockStatement",
          "body": []
        },
        "generator": false,
        "expression": false
      }
    }
  ],
  "kind": "var"
});
console.log(func.getAssignedName());
// outputs "foo"
```

#### ReflectionAssignedFunctionExpression.getAssignedName()
Gets assigned name

##### Parameters
This function has no parameters

##### Return value
**String** The name of the variable containing the function assignment

##### Examples
```javascript
// ./path/to/file.js
var foo = function bar() { };

var file = new ReflectionFile('path/to/file.js');
var foo = file.getFunctionExpressions('foo')[0];
// or
var foo = file.getFunctionExpressions('bar')[0];
console.log(foo.getAssignedName());
// outputs "foo"
```

## ReflectionVariable
`extends Reflection`

The **ReflectionVariable** class

#### ReflectionVariable.constructor(node)
Constructs a ReflectionVariable

##### Parameters
- `node` **Object** The AST node

##### Examples
```javascript
var variable = new ReflectionVariable({
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
        "value": 2,
        "raw": "2"
      }
    }
  ],
  "kind": "var"
});
console.log(variable.getName());
// outputs "foo"
```

#### ReflectionVariable.getValue()
Gets the variable value

##### Parameters
This function has no parameters

##### Return value
**Any** The value of the variable

##### Examples
```javascript
// ./path/to/file.js
var foo = 2;

var file = new ReflectionFile('path/to/file.js');
var foo = file.getVariables('foo')[0];
console.log(foo.getValue());
// outputs "2"
```

#### ReflectionVariable.setValue()
Sets the variable value

##### Parameters
- `value` **String|Number|Boolean** The new value

##### Return value
No value is returned

##### Examples
```javascript
// ./path/to/file.js
var foo = 2;

var file = new ReflectionFile('path/to/file.js');
var foo = file.getVariables('foo')[0];
foo.setValue(5);
console.log(foo.getValue());
// outputs "5"
```
