var fs = require('fs'),
    vm = require('vm');

var mmrd = {
  loadMap: function(path) {
    this.mapSource = fs.readFileSync(path).toString();
  },

  loadReduce: function(path) {
    this.reduceSource = fs.readFileSync(path).toString();
  },

  map: function(doc, emit) {
    doc.emit = emit;
    doc.print = console.log;
    vm.runInNewContext(this.mapSource, doc);
    doc.map();
  },

  reduce: function(key, values, func) {
    var context = {};
    vm.runInNewContext(this.reduceSource, context);
    var result = context.reduce(key, values);
    if (func) func(result);
    return result;
  },

  mapReduce: function(docs, func) {
    var fragments = {};
    var self = this;
    // map
    docs.forEach(function(doc) {
      self.map(doc, function emit(key, value) {
        fragments[key] = fragments[key] || [];
        fragments[key].push(value);
      });
    });
    // reduce
    var ret = {};
    for (var key in fragments) {
      ret[key] = self.reduce(key, fragments[key]);
    };
    if (func) func(ret);
    return ret;
  }
}

module.exports = mmrd;