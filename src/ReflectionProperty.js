var _ = require('lodash');

var ReflectionProperty = function (name, declaringClass, astNode, isPublic, isStatic, value) {
  this.name = name;
  if (!_.isObject(declaringClass)) {
    throw new Error('Parameter scope must be a ReflectionClass.');
  }
  this.declaringClass = declaringClass;
  this.astNode = astNode;
  this.isPublic = (isPublic === true);
  this.isPrivate = (isPublic !== true);
  this.isStatic = (isStatic === true);
  this.value = value;
};

ReflectionProperty.prototype.setAccessible = function (accessible) {
  if (accessible) {
    //publicizeProperty(this.name);
    var thisProp = privateToThisProperty(this);
    _.clear(this.astNode);
    _.extend(this.astNode, thisProp);
  } else {
    // @todo: implement publicToPrivate
  }
};

function publicizeProperty(propertyName) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "CallExpression",
      "callee": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
          "type": "Identifier",
          "name": "Object"
        },
        "property": {
          "type": "Identifier",
          "name": "defineProperty"
        }
      },
      "arguments": [
        {
          "type": "ThisExpression"
        },
        {
          "type": "Literal",
          "value": propertyName,
          "raw": "'" + propertyName + "'"
        },
        {
          "type": "ObjectExpression",
          "properties": [
            {
              "type": "Property",
              "key": {
                "type": "Identifier",
                "name": "get"
              },
              "computed": false,
              "value": {
                "type": "FunctionExpression",
                "id": null,
                "params": [],
                "defaults": [],
                "body": {
                  "type": "BlockStatement",
                  "body": [
                    {
                      "type": "ReturnStatement",
                      "argument": {
                        "type": "Identifier",
                        "name": propertyName
                      }
                    }
                  ]
                },
                "generator": false,
                "expression": false
              },
              "kind": "init",
              "method": false,
              "shorthand": false
            },
            {
              "type": "Property",
              "key": {
                "type": "Identifier",
                "name": "set"
              },
              "computed": false,
              "value": {
                "type": "FunctionExpression",
                "id": null,
                "params": [
                  {
                    "type": "Identifier",
                    "name": "v"
                  }
                ],
                "defaults": [],
                "body": {
                  "type": "BlockStatement",
                  "body": [
                    {
                      "type": "ExpressionStatement",
                      "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                          "type": "Identifier",
                          "name": propertyName
                        },
                        "right": {
                          "type": "Identifier",
                          "name": "v"
                        }
                      }
                    }
                  ]
                },
                "generator": false,
                "expression": false
              },
              "kind": "init",
              "method": false,
              "shorthand": false
            }
          ]
        }
      ]
    }
  };
}

function privateToThisProperty(privateProperty) {
  return {
    "type": "ExpressionStatement",
    "expression": {
      "type": "AssignmentExpression",
      "operator": "=",
      "left": {
        "type": "MemberExpression",
        "computed": false,
        "object": {
          "type": "ThisExpression"
        }
        ,
        "property": {
          "type": "Identifier",
          "name": privateProperty.name
        }
      }
      ,
      "right": _.get(privateProperty.astNode, 'declarations.0.init')
    }
  };
}

module.exports = ReflectionProperty;
