function map() {
  var words = this.text.split(' ');
  words.forEach(function(word) {
    emit(word, 1);
  });
}