
import _ from "lodash";

export const _curry = _.curry;

export const match = _.curry(function(what, str) {
  return str.match(what);
});

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


