# Reflection API docs

## Table of contents

- [Reflection](#Reflection) - The Reflection class
  - [Reflection.getName](#Reflection.getName) - Gets member name
- [ReflectionScope](#ReflectionScope) - The ReflectionScope class
  - [ReflectionScope.getAnonymousFunctions](#ReflectionScope.getAnonymousFunctions) - Gets anonymous functions
  - [ReflectionScope.getFunctionDeclarations](#ReflectionScope.getFunctionDeclarations) - Gets function declarations
  - [ReflectionScope.getFunctionExpressions](#ReflectionScope.getFunctionExpressions) - Gets function expressions
  - [ReflectionScope.getFunctionsByName](#ReflectionScope.getFunctionsByName) - Gets functions from given name
  - [ReflectionScope.getFunctionsByType](#ReflectionScope.getFunctionsByType) - Gets functions from given type
  - [ReflectionScope.getStartLine](#ReflectionScope.getStartLine) - Gets starting line number
  - [ReflectionScope.getEndLine](#ReflectionScope.getEndLine) - Gets ending line number
  - [ReflectionScope.getVariables](#ReflectionScope.getVariables) - Gets variables
- [ReflectionFile](#ReflectionFile) - The ReflectionFile class
  - [ReflectionFile.constructor](#ReflectionFile.constructor) - Constructs a ReflectionFile
  - [ReflectionFile.getFileName](#ReflectionFile.getFileName) - Gets file name
  - [ReflectionFile.getFilePath](#ReflectionFile.getFilePath) - Gets file path
- [ReflectionFunction](#ReflectionFunction) - The ReflectionFunction class
  - [ReflectionFunction.getClosure](#ReflectionFunction.getClosure) - Returns a dynamically created closure for the function
  - [ReflectionFunction.getParameters](#ReflectionFunction.getParameters) - Gets parameters
  - [ReflectionFunction.getType](#ReflectionFunction.getType) - Gets function type
  - [ReflectionFunction.invoke](#ReflectionFunction.invoke) - Invokes function
  - [ReflectionFunction.invokeArgs](#ReflectionFunction.invokeArgs) - Invokes function with args
  - [ReflectionFunction.toString](#ReflectionFunction.toString) - Returns the string representation of the function
- [ReflectionFunctionDeclaration](#ReflectionFunctionDeclaration) - The ReflectionFunctionDeclaration class
  - [ReflectionFunctionDeclaration.constructor](#ReflectionFunctionDeclaration.constructor) - Constructs a ReflectionFunctionDeclaration
- [ReflectionFunctionExpression](#ReflectionFunctionExpression) - The ReflectionFunctionExpression class
  - [ReflectionFunctionExpression.constructor](#ReflectionFunctionExpression.constructor) - Constructs a ReflectionFunctionExpression
  - [ReflectionFunctionExpression.isAnonymous](#ReflectionFunctionExpression.isAnonymous) - Checks if function is anonymous
  - [ReflectionFunctionExpression.isAssigned](#ReflectionFunctionExpression.isAssigned) - Checks if function is assigned
- [ReflectionAssignedFunctionExpression](#ReflectionAssignedFunctionExpression) - The ReflectionAssignedFunctionExpression class
  - [ReflectionAssignedFunctionExpression.constructor](#ReflectionAssignedFunctionExpression.constructor) - Constructs a ReflectionAssignedFunctionExpression
  - [ReflectionAssignedFunctionExpression.getAssignedName](#ReflectionAssignedFunctionExpression.getAssignedName) - Gets assigned name
- [ReflectionVariable](#ReflectionVariable) - The ReflectionVariable class
  - [ReflectionVariable.constructor](#ReflectionVariable.constructor) - Constructs a ReflectionVariable
  - [ReflectionVariable.getValue](#ReflectionVariable.getValue) - Gets value
  - [ReflectionVariable.setValue](#ReflectionVariable.setValue) - Set variable value



## <a name="Reflection"></a>The Reflection class
The reflection class

### reflection.getName()
Gets member name

#### Parameters
This function has no parameters

#### Return value
**String** The member name

#### Examples
```javascript
// ./path/to/file.js
function foo() { }

var file = new ReflectionFile('path/to/file');
console.log(file.getName());
// outputs "path/to/file"

var fn = file.getFunctionDeclarations()[0];
console.log(fn.getName());
// outputs "foo"
```

## <a name="ReflectionScope"></a> ReflectionScope
The ReflectionScope class

### reflectionScope.getAnonymousFunctions()
Gets anonymous functions

#### Parameters
This function has no parameters

#### Return value
**Array<ReflectionFunctionExpression>** The anonymous functions

#### Examples
```javascript
// ./path/to/file.js
(function (foo, bar) { })();

var file = new ReflectionFile('path/to/file');
var fn = file.getAnonymousFunctions()[0];
console.log(fn.getParameters());
// outputs ["foo", "bar"]
```

### reflectionScope.getFunctionDeclarations([name])
Gets function declarations

#### Parameters
`name` **String** The function name

#### Return value
**Array<ReflectionFunctionDeclaration>** The function declarations

#### Examples
```javascript
// ./path/to/file.js
function foo() { }
function bar() { }

var fn = file.getFunctionDeclarations()[0];
console.log(fn.getName());
// outputs "foo"

var fn = file.getFunctionDeclarations('bar')[0];
console.log(fn.getName());
// outputs "bar"
```

## ReflectionFile

## ReflectionFunction

## ReflectionFunctionDeclaration

## ReflectionFunctionExpression

## ReflectionAssignedFunctionExpression

## ReflectionVariable
