
# 5. 代码组合（compose）

```javascript
var compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};
```
这就是组合。
`f`  `g` 都是函数，x是它们之间通过管道传输的值。
所谓的管道传输，在这里指的就是 x 会作为函数`g`的参数，而`g(x)`调用的返回值则会作为函数`f`的参数继续传递。

```javascript
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };
var shout = compose(exclaim, toUpperCase);

shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
```

在 `compose` 的定义中， `g` 将先于`f`执行，因此就创建了一个从右到左的数据流。这样的可读性远远高于嵌套一大堆的函数调用。

如果不是用组合，代码的嵌套就会是这样的。

```javascript
var shout = function(x){
  return exclaim(toUpperCase(x));
};
```
使用组合的时候，我们不必去关心代码的内部嵌套关系，组合同样将代码的执行顺序改为了从右向左，而非从内至外。

参考下面的例子，这种顺序大大增强了代码的可读性。
```javascript
var head = function(x) { return x[0]; };
var reverse = reduce(function(acc, x){ return [x].concat(acc); }, []);
var last = compose(head, reverse);

last(['jumpkick', 'roundhouse', 'uppercut']);
//=> 'uppercut'
```
`last(['jumpkick', 'roundhouse', 'uppercut']);` 会先进行 `reverse` ，之后再 `head` ，也就是先进行反转然后取第一个。

如果我们的函数都能保证为“纯函数”，并且保证其“原子性”，那么我们就可以通过 `compose` 组合出满足各种业务逻辑的代码。

## 5.1 compose 中的数学规律

和之前提到的一样，compose 在使用中是能够多层嵌套，并且满足一定的数学规律，比如结合律。

```javascript
// 结合律（associativity）
var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
// true

compose(toUpperCase, compose(head, reverse));
// 或者
compose(compose(toUpperCase, head), reverse);
```

我们可以在最基础的函数组合的基础上，自由地给函数组合。

## 5.2 pointfree

pointfree 这个特性直观来理解，实际上就是抛弃 `.` 语法。
```javascript
// 非 pointfree，因为提到了数据：word
var snakeCase = function (word) {
  return word.toLowerCase().replace(/\s+/ig, '_');
};

// pointfree
var snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

去除点语法的时候，需要为即将调用的函数重新封装一下

```javascript
export const replace = _curry((what, replacement, str) => {
  return str.replace(what, replacement);
});
```

## 5.3 debug

compose 生成的函数调用链，比较难以定位错误。可以使用下面的 `trace` 函数来追踪代码的执行情况。

```javascript
var trace = curry(function(tag, x){
  console.log(tag, x);
  return x;
});

var dasherize = compose(join('-'), toLower, split(' '), replace(/\s{2,}/ig, ' '));

dasherize('The world is a vampire');
// TypeError: Cannot read property 'apply' of undefined

var dasherize = compose(join('-'), toLower, trace("after split"), split(' '), replace(/\s{2,}/ig, ' '));
// after split [ 'The', 'world', 'is', 'a', 'vampire' ]
```

trace 会输出上一个函数的返回值。

## 5.4 范畴学 

这一部分内容书中讲解得更加详细。

感觉这部分内容是在以更加形象的方式理解组合(compose)这以概念，以及组合能够产生的作用。

[函数式编程指北：代码组合-范畴学](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch5.html#%E8%8C%83%E7%95%B4%E5%AD%A6)










