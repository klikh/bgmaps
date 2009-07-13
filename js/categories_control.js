/**
 * Control which allows to filter checkpoints by category.
 * Initially is a part of GMap and extends GControl.
 * Can have multiple control panels, which act identically and reflect self state to each other.
 * @param {Array} categories Array of checkpoints' categories, which will be displayed 
 *         on the control. Each category is represented by {Category} class.
 */
function CategoriesControl(categories) {
  this.categories = categories;
  this.controlPanels = [];
}

CategoriesControl.prototype = new GControl();

/**
 * Required by GControl. Called when control is placed on the map by GMap2.addControl().
 * Here we make a control panel and place it on the map.
 */
CategoriesControl.prototype.initialize = function(map) {
  var container = this.makeControlPanel().context; // using 'context' because we need DOM element, not JQuery
  map.getContainer().appendChild(container); 
  return container;
}

/**
 * Required by GControl. Called when control is placed on the map by GMap2.addControl().
 */
CategoriesControl.prototype.getDefaultPosition = function() {
  return new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(70, 10));
}

/**
 * Creates a control panel to filter checkpoints and returns it as a JQuery object
 * holding a DIV with buttons for each category and one for 'all' category (reset filter).
 * Buttons' look style is configured via catControlButton and catControlSelectedButton CSS styles.
 * @return JQuery holding a DIV with the control panel.
 */
CategoriesControl.prototype.makeControlPanel = function() {
  var container = new$('div');
  
  this.makeCategoryElement('Все', 'all')  // separately for 'all' pseudo-category
    .appendTo(container)
    .addClass('catControlSelectedButton');
  
  // then for all other real categories.
  for (var i = 0; i < this.categories.length; i++) {
    this.makeCategoryElement(this.categories[i].name, this.categories[i].key).appendTo(container);
  }
  
  this.controlPanels.push(container); // we can have multiple control panels
  return container;
}

/************************************** PRIVATE METHODS ******************************************/

/**
 * Creates a single SPAN JQuery object holding button to filter by the category it represents.
 * @param {String} name of the category, which will be displayed on the control.
 * @param {String} key to the category, which identifies this category in the 'database'.
 * @return {JQuery} SPAN with the button.
 */
CategoriesControl.prototype.makeCategoryElement = function(name, key) {
  var button = new$('span').addClass('catControlButton').text(name).attr('id', 'catCPButton_' + key);
  
  var outer = this;
  button.click(function() {
    var points = Event.CURRENT.getPointsByCategoryGroup(key);
    
    MAP.clear();
    MAP.putPoints(points);
    
    CheckpointsList.instance.clear();
    CheckpointsList.instance.print(points);
      
    for (var i = 0; i < outer.controlPanels.length; i++) {
      outer.controlPanels[i].children('.catControlSelectedButton').removeClass('catControlSelectedButton');
      outer.controlPanels[i].children('#catCPButton_' + key).addClass('catControlSelectedButton');
    }
  });
  return button;
}