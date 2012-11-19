mmrd
===================================
mmrd, MongoDB MapReduce Driver, is driver utility for testing Map and Reduce function of MongoDB.

You can invoke your Map and Reduce functions whether isolated or integrated with without MongoDB itself.

### Notice

mmrd is Node.js module. It would behave different from MongoDB in paticular situation because Javascript engine that MongoDB uses is SpiderMonkey rather than V8.


## Installation

    $ npm install mmrd


## Word Count Example

Now show you word-count example below.

First, there are 'map.js' and 'reduce.js' for MongoDB's MapReduce.
"map" or "reduce" function must be implemented in these codes.

map.js

    function map() {
      var words = this.text.split(' ');
      words.forEach(function(word) {
        emit(word, 1);
      });
    }

reduce.js

    function reduce(key, values) {
      var result = 0;
      values.forEach(function(v) {
        result += v;
      });
      return result;
    }

Then, you can invoke MapReduce functionality using mmrd.

    var mmrd = require('mmrd');

    // map test
    (function() {
      console.log("Word count / Map test");
      var doc = { text: "foo bar baz" };
      mmrd.loadMap('map.js');
      mmrd.map(doc, function(key, value) {
        console.log(key, ":", value);
      });
    })();

    // reduce test
    (function() {
      console.log("Word count / Reduce test");
      mmrd.loadReduce('reduce.js');
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
      mmrd.loadMap('map.js');
      mmrd.loadReduce('reduce.js');
      var result = mmrd.mapReduce(docs);
      console.log(result);
    })();


## License
mmrd is released under the MIT license.

## Copyright
Copyright (c) 2012 [daisuke sugimori][1] (Twitter: [@daixque][2]).

[1]: http://opentechnica.blogspot.com/
[2]: https://twitter.com/daixque