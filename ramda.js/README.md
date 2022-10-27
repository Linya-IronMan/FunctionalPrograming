
# 通过实际的应用实践函数式编程

项目启动：
```shell
cd ramda.js
npx vite
```
使用 vite 启动的一个服务，能够直接使用 npm 安装对应的包并且通过ES Module 引入

问题：
1. compose 调用链中有异步函数，如何使用 await 将其加入到调用链中？

# ramda.js 常用方法

## Logic

### ifElse

```javascript
const inccount = r.ifelse(
  r.has('count'),
  r.over(r.lensprop('count'), r.inc),
  r.assoc('count', 1)
);
inccount({ count: 1 }); //=> { count: 2 }
incCount({}); //=> { count: 1 }
```           

### allPass

所有条件都通过才会返回 true ，否则返回false

```javascript
const isQueen = R.propEq('rank', 'Q');
const isSpade = R.propEq('suit', '♠︎');
const isQueenOfSpades = R.allPass([isQueen, isSpade]);

isQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false
isQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true
```

### anyPass

只要有一个条件满足就返回true，否则就返回false

```javascript
const isClub = R.propEq('suit', '♣');
const isSpade = R.propEq('suit', '♠');
const isBlackCard = R.anyPass([isClub, isSpade]);

isBlackCard({rank: '10', suit: '♣'}); //=> true
isBlackCard({rank: 'Q', suit: '♠'}); //=> true
isBlackCard({rank: 'Q', suit: '♦'}); //=> false
```

### cond

```javascript
const fn = R.cond([
  [R.equals(0),   R.always('water freezes at 0°C')],
  [R.equals(100), R.always('water boils at 100°C')],
  [R.T,           temp => 'nothing special happens at ' + temp + '°C']
]);
fn(0); //=> 'water freezes at 0°C'
fn(50); //=> 'nothing special happens at 50°C'
fn(100); //=> 'water boils at 100°C'
```

### isEmpty

```javascript
R.isEmpty([1, 2, 3]);           //=> false
R.isEmpty([]);                  //=> true
R.isEmpty('');                  //=> true
R.isEmpty(null);                //=> false
R.isEmpty({});                  //=> true
R.isEmpty({length: 0});         //=> false
R.isEmpty(Uint8Array.from('')); //=> true
```
### pathSatisfies

按照指定路径读取数据，并作为参数传递到第一个输入中去

```javascript
R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
R.pathSatisfies(R.is(Object), [], {x: {y: 2}}); //=> true
```

### when

输入是否满足第一个条件，如果满足，就将输入带入第二个参数函数。
如果不满足，就原样返回。


```javascript
// truncate :: String -> String
const truncate = R.when(
  R.propSatisfies(R.gt(R.__, 10), 'length'),
  R.pipe(R.take(10), R.append('…'), R.join(''))
);
truncate('12345');         //=> '12345'
truncate('0123456789ABC'); //=> '0123456789…'
```

### unless 

除非第一个条件为false的时候，才会执行第二个回调参数

```javascript
let safeInc = R.unless(R.isNil, R.inc);
safeInc(null); //=> null
safeInc(1); //=> 2
```

### until 

直到第一个条件为false的时候，才会停止执行第二个 回调参数

```javascript
R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128
```

## Promise

## List 

### intersection

intersection 意为十字路口；交叉；

可以用来获得两个数组重合的部分。

```javascript
R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
```

## 函数调用链

### on

接收一个二元函数 f，一个一元函数 g 和两个值。将两个值应用到函数 g 上，在把返回的结果应用到函数 f 上。

```javascript
const containsInsensitive = R.on(R.contains, R.toLower);
containsInsensitive('o', 'FOO'); //=> true
```

'o' 与 'FOO' 两个值，分别作为参数调用一次 `R.toLower` 一次，得到两个结果。
这两个结果会同时传入 `R.contains` 中，得到最终的结果

## Object 

### evolve 

递归地对 object 的属性进行变换，变换方式由 transformation 函数定义。所有非原始类型属性都通过引用来复制。
如果某个 transformation 函数对应的键在被变换的 object 中不存在，那么该方法将不会执行。


### pick

返回对象的部分拷贝，其中仅包含指定键对应的属性。如果某个键不存在，则忽略该属性。

```javascript
R.pickBy(["A", "B"], {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
```

### pickBy


返回对象的部分拷贝，其中仅包含 key 满足 predicate 的属性。
这里说的 predicate 是一个函数，每个字段的 key 和对应的 value 都会被提取出来，然后传入函数进行判断。

```javascript
const isUpperCase = (val, key) => key.toUpperCase() === key;
R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
```

### pickAll

与 pick 类似，但 pickAll 会将不存在的属性以 key: undefined 键值对的形式返回。

```javascript
R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
```

### omit

删除对象中给定的 keys 对应的属性。

```javascript
R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
```










