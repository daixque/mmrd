var mmrd;

(function (exports) {
  if (typeof module !== "undefined" && module.exports) {
    var fs = require('fs'),
        vm = require('vm');
    exports.loadMap = function(path) {
      this.mapSource = fs.readFileSync(path).toString();
    };
    exports.loadReduce = function(path) {
      this.reduceSource = fs.readFileSync(path).toString();
    };
    exports.runInNewContext = function(src, context) {
      vm.runInNewContext(src, context);
    };
    exports._map = function (doc) {
      doc.map();
    };
    exports._reduce = function (key, values, context) {
      return context.reduce(key, values);
    };
    module.exports = exports; // CommonJS
  } else if (typeof define === "function") {
    define(exports); // AMD
  } else {
    mmrd = exports; // <script>
  }
})(
  (function () {

    var exports =  {
      loadMap: function(path) {
        throw('loadMap is supported Node.js only.');
      },

      loadReduce: function(path) {
        throw('loadReduce is supported Node.js only.');
      },

      runInNewContext: function(src, context) {
        var global = (function() { return this; })();
        global.emit = context.emit;
        global.print = context.print;
        eval(src);
      },

      _map: function(doc) {
        this.mapFunc.apply(doc);
      },

      setMap: function(func) {
        this.mapFunc = func;
      },

      map: function(doc, emit) {
        doc.emit = emit;
        doc.print = console.log;
        this.runInNewContext(this.mapSource, doc);
        this._map(doc);
      },

      _reduce: function(key, values) {
        return this.reduceFunc(key, values);
      },

      setReduce: function(func) {
        this.reduceFunc = func;
      },

      reduce: function(key, values, func) {
        var context = {};
        this.runInNewContext(this.reduceSource, context);
        var result = this._reduce(key, values, context);
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

    return exports;
  })()
);