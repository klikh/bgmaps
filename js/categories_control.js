function CategoriesControl(categories) {
  this.categories = categories;
  this.selectedDiv = null;
}

CategoriesControl.prototype = new GControl();

CategoriesControl.prototype.initialize = function(map) {
  var container = new$('div');

  this.selectedDiv = this.createCategoryElement(container, 'Все', 'all');
  this.setSelectedStyle(this.selectedDiv);
  for (var i = 0; i < this.categories.length; i++) {
    this.createCategoryElement(container, this.categories[i].name, this.categories[i].key);
  }
  
  map.getContainer().appendChild(container);
  return container;
}

CategoriesControl.prototype.createCategoryElement = function(container, name, key) {
  var div = new$("span");
  this.setButtonStyle(div);
  container.appendChild(div);
  div.appendChild(document.createTextNode(name));
  var outer = this;
  GEvent.addDomListener(div, "click", function() {
    MAP.clear();
    MAP.putPoints(Event.CURRENT.getPointsByCategoryGroup(key));
    outer.setButtonStyle(outer.selectedDiv);
    outer.selectedDiv = div;
    outer.setSelectedStyle(outer.selectedDiv);
  });
  return div;
}

CategoriesControl.prototype.getDefaultPosition = function() {
  return new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(70, 10));
}

CategoriesControl.prototype.setButtonStyle = function(button) {
  button.style.color = "darkblue";
  button.style.backgroundColor = "white";
  button.style.fontWeight = 'normal';
  button.style.fontSize = '90%';
  button.style.border = "1px dotted black";
  button.style.margin = "2px";
  button.style.padding = "2px 5px 2px 5px";
  button.style.textAlign = "center";
  button.style.cursor = "pointer";
}

CategoriesControl.prototype.setSelectedStyle = function(button) {
  button.style.color = 'black';
  button.style.fontWeight = 'bold';
  button.style.cursor = 'default';
}

