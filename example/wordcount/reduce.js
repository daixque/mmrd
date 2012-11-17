function reduce(key, values) {
  var result = 0;
  values.forEach(function(v) {
  	result += v;
  });
  return result;
}