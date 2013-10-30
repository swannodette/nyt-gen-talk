// node --harmony es6gen.js

function* foo() {
  yield 1;
  return 2;
}

var g = foo(),
    v = null;

console.log(g);
console.log(g.constructor);

v = g.next();

console.log(v);

v = g.next();

console.log(v);