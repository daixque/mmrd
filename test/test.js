var mmrd   = require('../lib/mmrd'),
    should = require('should');

describe('mmrd', function() {
  it('should invoke map function', function() {
    var doc = { text: "foo bar baz" };
    mmrd.loadMap('./wordcount/map.js');
    var answers = [
      { key: 'foo', value: 1 },
      { key: 'bar', value: 1 },
      { key: 'baz', value: 1 }
    ];
    mmrd.map(doc, function(key, value) {
      var answer = answers.shift();
      key.should.eql(answer.key);
      value.should.eql(answer.value);
    });
  });

  it('should invoke reduce function', function() {
    mmrd.loadReduce('./wordcount/reduce.js');
    var key = "foo";
    var values = [1, 1];
    var reduced = mmrd.reduce(key, values);
    reduced.should.eql(2);
  });


  it('should invoke map-reduce integration', function() {
    var docs = [
      { text: "foo bar baz" },
      { text: "foo baz baz"}
    ];
    mmrd.loadMap('./wordcount/map.js');
    mmrd.loadReduce('./wordcount/reduce.js');
    var result = mmrd.mapReduce(docs);
    result.foo.should.eql(2);
    result.bar.should.eql(1);
    result.baz.should.eql(3);
  });
});