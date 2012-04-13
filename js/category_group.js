function CategoryGroup(key, name, abbr) {
  this.key = key;
  this.name = name;
  this.categories = [];
  
  if (abbr) {
    this.abbr = abbr;
  } else {
    var words = name.split(' ');
    this.abbr = '';
    for (i in words) {
      this.abbr += words[i][0];
    }
  }
  
}

CategoryGroup.prototype.add = function(category) {
  this.categories.push(category);
  return this;
};
