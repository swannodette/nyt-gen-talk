// node --harmony promises.js
// traceur --out promises.js promises.out.js; cat runtime.js promises.out.js | node

var when    = require("when"),
    request = require("request"),
    baseUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";


function wikiSearch(query) {
  var res = when.defer();

  request(baseUrl+query, function(err, resp, body) {
    res.resolve(JSON.parse(body));
  });

  return res.promise;
}


function async(f) {
  // must invoke the generator fn once to get
  // the generator

  var g   = f(),
      res = when.defer();

  (function _async(state) {
    if(!state.done) {
      // not done, each yield returns a promise
      // wait for the promise, then call the
      // generator again to goto the next step
      p = state.value;
      p.then(function(v) {
        _async(g.next(v));
      });
    } else {
      // resolve the promise of the entire
      // async operation
      res.resolve(state.value);
    }
  })(g.next());

  return res.promise;
}


var searches = async(function* () {
  var dogs  = yield wikiSearch("dog");
  var cats  = yield wikiSearch("cat");
  var birds = yield wikiSearch("bird");
  return dogs.concat(cats).concat(birds);
});


searches.then(function(v) {
   console.log("3 search results:", v);
});
