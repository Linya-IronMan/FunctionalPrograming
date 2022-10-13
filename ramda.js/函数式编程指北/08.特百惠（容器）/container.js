import _ from "lodash";

const Container = function(x) {
  this.__value = x;
}

Container.of = function(x) {return new Container(x)};
Container.prototype.map = function(func) {return Container.of(func(this.__value))};

const value = Container.of({name: "linya"});
console.log(value); //  Container { __value: { name: 'linya' } }
console.log(Container.of(22).map(d => d + '123')); // Container { __value: '22123' } 这个 functor 将一些简单的逻辑封装在了内部。





