// node --harmony es6gen.js
// traceur --out es6gen.js es6gen.out.js; cat runtime.js es6gen.out.js | node
// regenerator --include-runtime es6gen.js > es6gen.reg.js; node es6gen.reg.js

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


// yield can appear anywhere an expression can
// the follow doesn't work with Traceur yet
/*
function* bar() {
  return [1, yield "hello", 2];
}

var h = bar();

state = h.next();

console.log(state);

state = h.next("there");

console.log(state);
*/