var mmrd = require('../lib/mmrd');

// map test
(function() {
  console.log("Word count / Map test");
	var doc = { text: "foo bar baz" };
  mmrd.loadMap('./wordcount/map.js');
  mmrd.map(doc, function(key, value) {
    console.log(key, ":", value);
  });
})();

// reduce test
(function() {
  console.log("Word count / Reduce test");
  mmrd.loadReduce('./wordcount/reduce.js');
  var key = "foo";
  var values = [1, 1];
  var reduced = mmrd.reduce(key, values);
  console.log(key, ":", reduced);
})();

// integration test
(function() {
  console.log("Word count / Integration test");
  var docs = [
    { text: "foo bar baz" },
    { text: "foo baz baz"}
  ];
  mmrd.loadMap('./wordcount/map.js');
  mmrd.loadReduce('./wordcount/reduce.js');
  var result = mmrd.mapReduce(docs);
  console.log(result);
})();