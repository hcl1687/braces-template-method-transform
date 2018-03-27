# Braces-template-method-transform

Braces-template-method-transform is a toolkit for v-method directive in Braces-template. it can add " \_\_braces\_\_." to the global identifies in the v-mehtod's code.

## Installation

npm install braces-template-method-transform --save

## Example

```javascript
import transform from 'braces-template-method-transform'

var program = 'e = 1; f = 2; var h = 1, f; function m() { k = 2; }'
var res = transform(program)
expect(res).toBe('__braces__.e = 1; f = 2; var h = 1, f; function m() { __braces__.k = 2; }')
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present Chunlin He