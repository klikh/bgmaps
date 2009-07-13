function CategoriesControl(categories) {
  this.categories = categories;
  this.selectedDiv = null;
}

CategoriesControl.prototype = new GControl();

CategoriesControl.prototype.initialize = function(map) {
  var container = new$('div');

  this.selectedDiv = this.createCategoryElement(container, 'Все', 'all')
  this.selectedDiv.addClass('catControlSelectedButton');
  for (var i = 0; i < this.categories.length; i++) {
    this.createCategoryElement(container, this.categories[i].name, this.categories[i].key);
  }
  
  map.getContainer().appendChild(container.context);
  return container.context;
}

CategoriesControl.prototype.createCategoryElement = function(container, name, key) {
  var div = new$('span').addClass('catControlButton').text(name).appendTo(container);
  var outer = this;
  GEvent.addDomListener(div.context, 'click', function() {
    var points = Event.CURRENT.getPointsByCategoryGroup(key);
    
    MAP.clear();
    MAP.putPoints(points);
    
    CheckpointsList.instance.clear();
    CheckpointsList.instance.print(points);
    
    outer.selectedDiv.removeClass('catControlSelectedButton');
    outer.selectedDiv = div;
    div.addClass('catControlSelectedButton');
  });
  return div;
}

CategoriesControl.prototype.getDefaultPosition = function() {
  return new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(70, 10));
}