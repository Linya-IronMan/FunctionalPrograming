# 08.特百惠（容器）

本章主要是对函数式编程中的 控制流、异常处理、异步操作以及状态等内容进行说明。

这些内容都可以利用容器的概念来进行表述。

## 使用容器存储、操作数据

- of 存储数据
- map 自定义操作数据

```javascript
const Container = function(x) {
  this.__value = x;
}

Container.of = function(x) {return new Container(x)};
```

通过 `of` 来创建一个`Container` 包裹的数据，能够避免使用 `new` 来创建 Container 实例。
这是在语法上更方便之后的方法调用。

将容器存储与数据之后，方便对数据的操作，所以需要提供一个API用于自定义对存储数据的操作

**File: ./container.js**
```javascript
const Container = function(x) {
  this.__value = x;
}

Container.of = function(x) {return new Container(x)};
Container.prototype.map = function(fun) {return Container.of(fun(this.__value))};

const value = Container.of({name: "linya"});
console.log(value); //  Container { __value: { name: 'linya' } }
console.log(Container.of(22).map(d => d + '123')); // Container { __value: '22123' }
```

通过map方法会将原本的Container数据处理，之后返回一个新的被 `Container` 包裹的数据。

需要注意的是，`of` 因为要用来定义数据，取代了 new 的地位，可以直接定义在 `Container` 上；
而`map` 为了链式的调用，则需要定义在原型上，这样才能让 `of` 生产的 `Container` 实例调用。

map 能够让不必离开容器的情况下操作Container里面的值，这样就能实现 `Container` 的连续使用，而不是
将数据从容器中反复存取。

这样能够不断链式调用 map 去执行自定义函数的方式，就是一种 composition !。
它有能力将多种不同的操作组合在一起以实现某种功能。

我们可以将这种实现了map函数、拥有 composition 特性，并遵守一定特定规则的容器类型称为 `functor` 。
也就是之前范畴学中的函子。


---

我们也可以使用 ES6 的 class 来定义容器。

**File: ./container_class**

```javascript
class Container {
  __value;
  constructor(x) {
    this.__value = x;
  }

  static of(x) {
    return new Container(x);
  }

  map(func) {
    return Container.of(func(this.__value));
  }
}
```

---

这样就能将数据存储与数据操作封装在一起，让容器自己去运用函数。
这是一种抽象，对函数运用的抽象。

这种抽象是通过 map 方法来组合外部传递的函数。它以链式的方式，将多个自定义的函数组合到一起，
实现一个完整的功能。
看上去 compose 更适合上面的说法。它能够将多个函数组合到一起，以“通道”的方式传递参数。最后生成一个可复用的函数。

## Maybe 

这也是一种 functor。不同于 `Container` 这个 functor 将一些简单的逻辑封装在了内部。

```javascript
const Maybe = function(x) {
  this.__value = x
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return (this.__value === null) || (this.__value === undefined);
}

Maybe.prototype.map = function(fun) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(fun(this.__value));
}

```

如果当前值是空的，那么就会继续返回空，不会执行 fun 方法。这样，如果链式调用中的一环出现了问题，
后面的所有自定义函数都不会执行，都只会直接返回 `Maybe{ __value: null }` 

---

除了这种点记法(dot notation syntax)，还可以使用curry来“代理”任何functor
这样可以保持一种 `pointfree` 的风格。


我们的值没有完成它的使命，很有可能是其他代码分支造成的。我们的代码，就像薛定谔的猫一样，在某个特定的时间点有两种状态，
而且应该保持这种状况不变直到最后一个函数为止。
这样，哪怕代码有很多逻辑性的分支，也能保证一种线性的工作流。

```javascript
export const map = _curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f)
}) 
```

### 应用实例

我们需要对这个 map 进行了解。`map(fnCal)` 生成的函数需要传递任何一个 functor(函子)，这个函子会调用 map 方法，并将 fnCal 作为参数传入。


```javascript
//  withdraw :: Number -> Account -> Maybe(Account)
var withdraw = curry(function(amount, account) {
  return account.balance >= amount ?
    Maybe.of({balance: account.balance - amount}) :
    Maybe.of(null);
});

//  finishTransaction :: Account -> String
var finishTransaction = compose(remainingBalance, updateLedger); // <- 假定这两个函数已经在别处定义好了

//  getTwenty :: Account -> Maybe(String)
var getTwenty = compose(map(finishTransaction), withdraw(20));


getTwenty({ balance: 200.00});
// Maybe("Your balance is $180.00")

getTwenty({ balance: 10.00});
// Maybe(null)
```

## 释放容器中的值

数据不可能一直在容器里面，我们需要将容器中的数据取出来才能传递出去。

```javascript
export const maybe = _curry(function(x, f, m) {
  return m.isNothing() ? x : f(m.__value);
})
```

```javascript
//  maybe :: b -> (a -> b) -> Maybe a -> b
var maybe = curry(function(x, f, m) {
  return m.isNothing() ? x : f(m.__value);
});

//  getTwenty :: Account -> String
// “通道“ 式的参数传递，从右侧开始，上一个函数的执行结果作为下一个函数的如餐
// 要求函数只有一个入参，如果有多个，使用 curry 处理
var getTwenty = compose(
  maybe("You're broke!", finishTransaction), withdraw(20)
);

// 这作为 “通道”的第一个函数的入参
getTwenty({ balance: 200.00});
// "Your balance is $180.00"

getTwenty({ balance: 10.00});
// "You're broke!"
```

## Either “纯”错误处理

throw/catch 的方式并不十分 "纯"。当一个错误被抛出的时候，我们并没有收到返回值，反而是得到了一个警告。
> 纯函数需要一个输出，并得到一个输出。输出应当是必须要有的。

使用Either，可以在发生错误的时候搜集到错误消息，并返回。

**either.js**
```javascript
const Left = function(x) {
  this.__value = x;
}

Left.of = function(x) {
  return new Left(x);
}

Left.prototype.map = function(f) {
  return this;
}

const Right = function(x) {
  this.__value = x;
}

Right.of = function(x) {
  return new Right(x);
}

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}


```

Left 与 Right 可以称为 Either 的抽象类型的两个子类。

如果出现错误，则使用 `Left.of()` 存储报错信息，若运行正常，则使用 `Right.of()` 存储返回数据。
因为 `Left` 与 `Right` 都实现了相同的接口，并且具有相同的接口签名，所以在方法的调用上不会出现问题。
而 `Left` 的 `map` 方法，虽然有 f 函数作为参数，但是实际上并没有用到它，而是直接将自身返回。

这样，如果链式调用中的某一环节出现了错误，错误信息就会随着链式调用返回到最终的结果。如此，就可以冒泡获得错误信息，并统一进行处理。
实际使用中，当然不会只将一个字符串作为错误信息返回，应当需要一个专门的结构体来构造错误信息


## IO functor

纯函数中又一个例子，它会产生副作用，但是我们通过将其包裹在另一个函数中，把它变得看起来像一个纯函数。

```javascript
const getFromStorage = function (key) {
  return function() {
      return localStorage[key];
    }
}
```
之所以说里面的函数不纯，是因为每次传入相同的key，返回的数据可能是不一样的。localStorage 是可以被其他地方改变的。
封装之后的使用

```javascript
const getName = getFromStorage("name");
const name = getName();
```

封装起来之后，就变成了从 Storage 中取出特定元素的函数生成器。然而也只是看起来像是纯函数，实际上并没有什么用，算是自我安慰。

这里又一个IO functor，用于处理此类非纯函数。可以作为各种从外界函数中获取值的操作的容器。
`IO` 的 `__value` 总是一个函数。`IO` 将"非纯执行动作" 捕获到包裹函数里，目的是延迟执行这个非纯动作。

IO 的 `map` 方法中使用了compose，将当前 __value 函数的执行结果作为参数传入 map 的回调函数中。以此形成链式

**IO.js**
```javascript
import { _curry, match, add } from "../utils.js";
import * as _ from "ramda";

const IO = function(f) {
  this.__value = f;
}

IO.of = function(x) {
  return new IO(function() {
    return x;
  }); 
}

IO.prototype.map = function(f) {
  return new IO(_.compose(f, this.__value));
}
```








