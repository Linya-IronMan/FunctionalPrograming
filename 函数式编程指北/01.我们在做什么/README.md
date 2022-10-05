
# 01. 我们在做什么

1. 了解使用函数式编程的原因，不问青红皂白就完全避免使用对象，这是糟糕的。
2. 写代码需要遵循一定的原则指导，我们平时的编程大多是面向过程的硬编码
  硬编码：将步骤中的每一步要做什么都写出来，在函数封装、代码复用方面并没有发挥出完全的优势。

## 一个例子

这是书中提到的一个海鸥的例子

> 下面是一个海鸥程序，鸟群合并则变成了一个更大的鸟群，繁殖则增加了鸟群的数量，增加的数量就是它们繁殖出来的海鸥的数量。注意这个程序并不是面向对象的良好实践，它只是强调当前这种变量赋值方式的一些弊端。

```javascript
var Flock = function(n) {
  this.seagulls = n;
};

Flock.prototype.conjoin = function(other) {
  this.seagulls += other.seagulls;
  return this;
};

Flock.prototype.breed = function(other) {
  this.seagulls = this.seagulls * other.seagulls;
  return this;
};

var flock_a = new Flock(4);
var flock_b = new Flock(2);
var flock_c = new Flock(0);

var result = flock_a.conjoin(flock_c).breed(flock_b).conjoin(flock_a.breed(flock_b)).seagulls;
//=> 32
```

**存在的问题:这会让程序的状态和变得难以追踪。**

所谓难以追踪的状态，在这里指的是海鸥的数量。从获取 resut 这个最终的调用链上无法直观得出海鸥的数量是如何进行变化的。

我们可以知道，上面代码做的操作无非是简单的加法(conjoin)与乘法(bread)而难以理解的原因大概有两个:
- 方法的命名并不直观
- 调用链较长
- 逻辑较为简单的时候，使用面向对象的写法，会有很多与核心逻辑无关的代码。

可以再看看更加函数式的写法，明显简单了很多

```javascript
var add = function(x, y) { return x + y };
var multiply = function(x, y) { return x * y };

var flock_a = 4;
var flock_b = 2;
var flock_c = 0;

var result = add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));
//=>16
```

上面的写法有几点好处：
- 重新命名，语意可读性更强
- 通过函数式特有的规则，让最终的函数调用链更加可理解。
- 代码更少。

上面提到的函数式特有的规则，指的是按照函数式编程的规范对函数进行封装之后，能够将数学中的某些计算规律进行应用。
```javascript
// 结合律（assosiative）
add(add(x, y), z) == add(x, add(y, z));

// 交换律（commutative）
add(x, y) == add(y, x);

// 同一律（identity）
add(x, 0) == x;

// 分配律（distributive）
multiply(x, add(y,z)) == add(multiply(x, y), multiply(x, z));
```
借此，我们可以极大缩短调用链的长度，并增加代码可读性。比如分配律...

```javascript
// 原有代码
add(multiply(flock_b, add(flock_a, flock_c)), multiply(flock_a, flock_b));

// 应用同一律，去掉多余的加法操作（add(flock_a, flock_c) == flock_a）
add(multiply(flock_b, flock_a), multiply(flock_a, flock_b));

// 再应用分配律
multiply(flock_b, add(flock_a, flock_a));
```

本章就讲了这么多，需要了解的是为什么选择函数式编程，以及函数式编程的特征。












