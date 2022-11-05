import * as R from "ramda"


export const trace = R.curry(function (tag, x) {
    console.log(tag, x);
    return x;
});

export const map = R.curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f)
});

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

/** Either */

class Left {
  __value;
  constructor(x) {
    this.__value = x;
  }

  static of(x) {
    return new Left(x);
  }

  map(func) {
    return Left.of(func(this.__value));
  }
}


class Right {
  __value;
  constructor(x) {
    this.__value = x;
  }

  static of(x) {
    return new Right(x);
  }

  map(func) {
    return Right.of(func(this.__value));
  }
}

export const either = R.curry((tFn, fFn, e) => {
  switch(v.constructor) {
    case Left: return tFn(e.__value);
    case Right: return fFn(e.__value);
  }
});

/** Maybe */


export class Maybe {
  __value;
  constructor(x) {
    this.__value = x;
  }

  static of(x) {
    return new Container(x);
  }

  isNothing() {
    return (this.__value === null || this.__value === undefined);
  }

  map(func) {
    return Maybe.of(func(this.__value));
  }
}

//  maybe :: b -> (a -> b) -> Maybe a -> b
export const maybe = R.curry(function(x, f, m) {
  return m.isNothing() ? x : f(m.__value);
});

/** IO */  

export class IO {
  __value;

  constructor(f) {
    this.__value = f;
  }

  static of(x) {
    return new IO(function() {
      return x;
    })
  }

  map(func) {
    return new IO(R.compose(func, this.__value));
  }
}


