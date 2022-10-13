
# 4. 柯里化（curry）

curry 的概念：只传递函数的一部分参数来调用它，让它返回一个函数去处理剩下的参数。
可以一次性地调用curry函数，也可以每次只传递一个参数分多次调用。

```javascript
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = add(1);
var addTen = add(10);

increment(2);
// 3

addTen(2);
// 12
```

之前有说过，如果一个函数中需要用到环境中的变量，就需要将这部分的变量放到参数中传递。
通过 curry ，我们可以将这部分环境参数与其他的参数分开，在第一次调用的时候传递。
这样生成的函数就是一个完全依赖于环境变量的新的函数。
关键是这个函数还是纯的。并且在返回函数的时候，我们可以获取一个重命名的机会，能够更加精确的描述环境参数造成的影响。
甚至于第一个参数还可以作为一个条件分支来使用。


书中将 curry 的能力描述为一种“预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。

用于实现 curry 的工具，可以选择 `lodash` 或者 `ramda`。

```javascript
var curry = require('lodash').curry;

var match = curry(function(what, str) {
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var map = curry(function(f, ary) {
  return ary.map(f);
});

match(/\s+/g, "hello world");
// [ ' ' ]

match(/\s+/g)("hello world");
// [ ' ' ]

var hasSpaces = match(/\s+/g);
// function(x) { return x.match(/\s+/g) }

hasSpaces("hello world");
// [ ' ' ]

hasSpaces("spaceless");
// null

filter(hasSpaces, ["tori_spelling", "tori amos"]);
// ["tori amos"]

var findSpaces = filter(hasSpaces);
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findSpaces(["tori_spelling", "tori amos"]);
// ["tori amos"]

var noVowels = replace(/[aeiou]/ig);
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }

var censored = noVowels("*");
// function(x) { return x.replace(/[aeiou]/ig, "*") }

censored("Chocolate Rain");
// 'Ch*c*l*t* R**n'
```

函数的 curry 化，最大的作用应当是能够减少很多不必要的样板代码的产生；并且为之后的“链式调用”形成更清晰的语意理解。


