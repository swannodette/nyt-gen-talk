// node --harmony go.js
// traceur --out go.out.js go.js; cat runtime.js go.out.js | node

// actual machine stepper
function go_(machine, step) {
  while(!step.done) {
    var arr   = step.value(),
        state = arr[0],
        value = arr[1];

    switch (state) {
      case "park":
        // if we can't proceed put ourselves in the event loop
        setImmediate(function() { go_(machine, step); });
        return;
      case "continue":
        // we can, goto the next step
        step = machine.next(value);
        break;
    }
  }
}


// kickoff
function go(machine) {
  var gen = machine();
  go_(gen, gen.next());
}


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
