import { _curry, match, add } from "../utils.js";
import * as _ from "ramda";


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

console.log(Maybe.of("Malkovich Malkovich").map(match(/a/ig))); // Maybe { __value: [ 'a', 'a' ] }
console.log(Maybe.of(null).map(match(/a/ig))); // Maybe { __value: null }

console.log(Maybe.of({name: "Boris"}).map(_.prop("age")).map(add(10))); // Maybe { __value: null }

// add 的延迟执行，就是为了让函数的调用更加 “声明式“ 而非 ”命令式“
console.log(Maybe.of({name: "Dinah", age: 14}).map(_.prop("age")).map(add(10))); // Maybe { __value: 24 }







