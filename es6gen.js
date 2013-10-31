// node --harmony es6gen.js

function* foo() {
  yield 1;
  return 2;
}

var g = foo(),
    state = null;

console.log(g);
console.log(g.constructor);

state = g.next();

console.log(state);

state = g.next();

console.log(state);

// if you call g.next() after done will throw!