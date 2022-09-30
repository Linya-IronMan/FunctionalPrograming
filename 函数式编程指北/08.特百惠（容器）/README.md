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


