// test cases for edge cases & bug fixes
var transform = require('src')

describe('Misc', function () {
  it('test', function () {
    var program = 'e = 1; f = 2; var h = 1, f; function m() { k = 2; }'
    var res = transform(program)
    expect(res).toBe('__braces__.e = 1; f = 2; var h = 1, f; function m() { __braces__.k = 2; }')
  })
})
