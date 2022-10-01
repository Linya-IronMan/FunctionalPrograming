import * as _ from "ramda";
import {_curry} from '../../utils.js';

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

const either = _curry((f, g, e) => {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  }
})

console.log(Right.of("rain").map(str => "b" + str));

console.log(Left.of("rain").map(str => "b" + str));

console.log(Right.of({host: 'localhost', port: 80}).map(_.prop('host')));

console.log(Left.of("rolls eyes...").map(_.prop("host")));
