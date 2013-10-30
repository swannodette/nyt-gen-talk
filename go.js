// node --harmony go.js
// traceur --out go.out.js go.js; cat runtime.js go.out.js | node
// regenerator --include-runtime go.js > go.reg.js; node go.reg.js

// actual machine stepper
function go_(machine, step) {
  while(!step.done) {
    // we attempt the operation by invoking value
    var arr   = step.value(),
        state = arr[0],
        value = arr[1];

    // success? or do we need to retry later?
    switch (state) {
      case "continue":
        // we can, goto the next step
        step = machine.next(value);
        break;
      case "park":
        // if we can't proceed put ourselves in the event loop
        setImmediate(function() { go_(machine, step); });
        return;
    }
  }
}


// kickoff
function go(machine) {
  var gen = machine();
  go_(gen, gen.next());
}


// put returns a function so we can retry the put!
function put(chan, val) {
  return function() {
    if(chan.length == 0) {
      chan.unshift(val);
      return ["continue", null];
    } else {
      return ["park", null];
    }
  };
}

// take returns a function so we can retry the take!
function take(chan) {
  return function() {
    if(chan.length == 0) {
      return ["park", null];
    } else {
      var val = chan.pop();
      return ["continue", val];
    }
  };
}


var c = [];

// you can reorder the go blocks!
// yes ... ORDER DOESN'T MATTER

go(function* () {
  for(var i = 0; i < 10; i++) {
    yield put(c, i);
    console.log("process one put", i);
  }
  yield put(c, null);
});

    
go(function* () {
  while(true) {
    var val = yield take(c);
    if(val == null) {
      break;
    } else {
      console.log("process two took", val);
    }
  }
});
