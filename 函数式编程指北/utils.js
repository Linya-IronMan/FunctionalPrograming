
import _ from "lodash";

export const _curry = _.curry;

export const replace = _curry((what, replacement, str) => {
  return str.replace(what, replacement);
});

export const filter = _curry((f, ary) => ary.filter(f));

/**
* 函数生成器，能够根据输入返回输出。
* */
export const memoize = (f) => {
  const cache = {};
  return function() {
    const arg_str = JSON.stringify(arguments);
    cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
    return cache[arg_str];
  }
};

export const match = _.curry(function(what, str) {
  return str.match(what);
});

export const split = _curry(function(t, s) {
  return String.prototype.split.call(t, s);
});

export const head = x => x[0];

export const add = function(x) {
  return function(y) {
    return x + y;
  };
};

export const compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};

export const trace = _.curry(function(tag, x){
  console.log(tag, x);
  return x;
});

export const map = _curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f)
}) 

export const maybe = _curry(function(x, f, m) {
  return m.isNothing() ? x : f(m.__value);
})

export const id = x => x;
