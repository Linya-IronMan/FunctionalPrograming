# 2. 一等公民的函数

优秀的代码，除了变量、方法命名语意需要清晰之外，
状态变化可追踪，代码量、阅读代码时检索代码的成本都需要做出较好的处理。

## 02.1 不必要的包裹函数

当把函数看作一等公民的时候，我们需要通过某些手段来实现上面提到的代码优化。

书中有提到一个案例，
```javascript
const hi = name => `Hi ${name}`;
const greeting = name => hi(name);
```

此处的 greeting 方法就是一个完全多余的写法，他的内部只是调用了一个 hi 方法，这个函数实现的只是一个延迟执行的作用。
用一个函数将另一个函数包裹起来，目的**仅仅**是延迟执行，这是一种非常糟糕的编程习惯。

此处，按我的理解。延迟执行需要配合其他的东西来使用，仅仅为了延迟执行而包裹函数是不可取的。

```javascript
// 太傻了
const getServerStuff = callback => ajaxCall(json => callback(json));

// 这才像样
const getServerStuff = ajaxCall;

// 这行
ajaxCall(json => callback(json));

// 等价于这行
ajaxCall(callback);

// 那么，重构下 getServerStuff
const getServerStuff = callback => ajaxCall(callback);

// ...就等于
const getServerStuff = ajaxCall // <-- 看，没有括号哦


// 垃圾
const BlogController = {
  index(posts) { return Views.index(posts); },
  show(post) { return Views.show(post); },
  create(attrs) { return Db.create(attrs); },
  update(post, attrs) { return Db.update(post, attrs); },
  destroy(post) { return Db.destroy(post); },
};
// 优秀
const BlogController = {
  index: Views.index,
  show: Views.show,
  create: Db.create,
  update: Db.update,
  destroy: Db.destroy,
};
```

延迟执行实际上在某些地方非常有用，这里，作者应该是在排斥上面那些 “简单”、“无脑” 的延迟执行函数封装，那是无意义的。


- 如果一个函数被不必要地包裹了起来，并且放生了改动。包裹它的那个函数也要做出相应的变更。
- 如果被包裹的函数参数的数量发生了改变，那么所有调用他的地方都需要进行修改。

```javascript
// 把整个应用里的所有 httpGet 调用都改成这样，可以传递 err 参数。
httpGet('/post/2', (json, err) => renderPost(json, err));

// 写成一等公民函数的形式，要做的改动将会少得多：
httpGet('/post/2', renderPost);  // renderPost 将会在 httpGet 中调用，想要多少参数都行
```
这对于未来的扩展会更加友好。

## 2.2 命名

- 语意清晰，并且易读，减少生僻单词使用
- 减少针对同一个概念使用不同命名的情况，这容易造成混淆
- 从命名上减少对参数类型的限定，提高函数的通用型。

此处主要说的是第二种命名。下面两个函数做的一样的事情，但是后一个就更加通用，可重用性也就更高。
而且，不要在函数的命名上就将自己限定在特定的参数上。
这种情况非常常见，这也是我们经常重复造轮子的原因。

```javascript
// 只针对当前的博客
const validArticles = articles =>
  articles.filter(article => article !== null && article !== undefined),

// 对未来的项目更友好
const compact = xs => xs.filter(x => x !== null && x !== undefined);
```

## 03. this 的指向

在使用函数式编程的时候，不可避免地会将函数作为参数传递，其中如果涉及到 `this` 的问题，必须要明确 `this` 的指向。

```javascript
var fs = require('fs');

// 太可怕了
fs.readFile('freaky_friday.txt', Db.save);

// 好一点点
fs.readFile('freaky_friday.txt', Db.save.bind(Db));
```

函数作为一个回调函数传递，`this` 的指向状态是不确定的。这对于函数式编程来说是无法容忍的。

将 `Db` bind 到它自己身上以后，就可以随心所欲调用它的代码了。

实际中，我们应该尽量避免使用它，因为函数式编程中根本用不到它。

## 2.3 总结

本章中对函数第一等公民的概念阐述得并不清晰，至于网上很多地方说到的“将函数作为参数传递以及返回值返回”...
我并不认可这种说法。

从本书表达的观点来看，所谓的函数为第一等公民的含义就是：通过某些方式，消除函数封装过程中的副作用，提高可扩展性以及语意表达能力。

函数作为一等公民，应当可以基本取代面向对象的作用。
- 具备对事物的抽象能力
- 具备对相关业务逻辑的聚合能力
- 具备对业务逻辑链路清晰表达的能力
- 具备相当的可扩展能力

上面这些属于“道”的范畴，也是我们在使用任何编程范式过程中应当关注的要点。
至于本章说到的一些实际的操作，属于"术"的应用，那就远远不止本章提到的内容了。

我们为什么会发展出不同的编程范式，是因为我们想要在坚固健壮性、可扩展性的基础上，寻求能够更加清晰表达程序逻辑的方法。
参照各种范式书写的程序，最终还是要服务于人。

不应该忘记我们的目的，才能深刻理解做出的每一处改变的意义。
如果不能深入理解，那不如不去改变。








