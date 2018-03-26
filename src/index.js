var esprima = require('esprima')
var estraverse = require('./estraverse')
var prefix = '__braces__.'

function createNewScope (node) {
  return node.type === 'FunctionDeclaration' ||
    node.type === 'FunctionExpression' ||
    node.type === 'Program'
}

function isVarDefined (varname, scopeChain) {
  for (var i = 0; i < scopeChain.length; i++) {
    var scope = scopeChain[i]
    if (scope.indexOf(varname) !== -1) {
      return true
    }
  }

  return false
}

function checkForLeaks (identifiers, scopeChain) {
  var res = []
  for (var i = 0; i < identifiers.length; i++) {
    if (!isVarDefined(identifiers[i].name, scopeChain)) {
      res.push(identifiers[i])
      // console.log('Detected leaked global varible: ', identifiers[i])
    }
  }

  return res
}

function transformGlobalIdentifiers (program, identifiers) {
  identifiers.sort(function (a, b) {
    return b.range[0] - a.range[0]
  })

  identifiers.forEach(function (identifier) {
    program = program.slice(0, identifier.range[0]) + prefix + identifier.name + program.slice(identifier.range[1])
  })

  return program
}

export default function (program) {
  var ast = esprima.parseScript(program, {
    range: true
  })

  // collect global identifiers
  var scopeChain = []
  var identifiers = []
  var globalIdentifiers = []
  estraverse.traverse(ast, {
    enter: function (node) {
      if (createNewScope(node)) {
        scopeChain.push([])
        identifiers.push([])
      }

      var currentScope = scopeChain[scopeChain.length - 1]
      if (node.type === 'VariableDeclarator') {
        currentScope.push(node.id.name)
      }

      if (node.type === 'FunctionDeclaration') {
        var parentScope = scopeChain[scopeChain.length - 2]
        parentScope.push(node.id.name)
      }

      var currentIdentifiers = identifiers[identifiers.length - 1]
      if (node.type === 'MemberExpression') {
        currentIdentifiers.push({
          name: node.object.name,
          range: node.range
        })
        this.skip()
      }

      if (node.type === 'Identifier') {
        currentIdentifiers.push({
          name: node.name,
          range: node.range
        })
      }
    },
    leave: function (node) {
      if (createNewScope(node)) {
        var currentIdentifiers = identifiers.pop()
        globalIdentifiers = globalIdentifiers.concat(checkForLeaks(currentIdentifiers, scopeChain))
        scopeChain.pop()
      }
    }
  })

  // add prefix scope for global identifiers
  program = transformGlobalIdentifiers(program, globalIdentifiers)
  return program
}
