/**
 * Control which allows to filter checkpoints by category.
 * Initially is a part of GMap and extends GControl.
 * Can have multiple control panels, which act identically and reflect self state to each other.
 * @param {Array} categories Array of checkpoints' categories, which will be displayed 
 *         on the control. Each category is represented by {Category} class.
 */
function CategoriesControl(categories) {
  this.categories = categories;
  this.currentCategory = 'all';
  this.controlPanels = [];

  this.control = new ymaps.control.ToolBar(this.asYmapsToolButtons());
}

CategoriesControl.prototype.asYmapsToolButtons = function() {
  var elements = this._createElements(true);
  var buttons = [];
  for (var i = 0; i < elements.length; i++) {
    buttons.push(new ymaps.control.Button( {
      data: {
        content: elements[i].context,
      }
    }));
  }
  console.log('registering container for elements', elements)
  this._makeContainerAndRegisterPanel(elements);
  return buttons;
};

/**
 * Creates a control panel to filter checkpoints and returns it as a JQuery object
 * holding a DIV with buttons for each category and one for 'all' category (reset filter).
 * Buttons' look style is configured via catControlButton and catControlSelectedButton CSS styles.
 * @return JQuery holding a DIV with the control panel.
 */
CategoriesControl.prototype.makeControlPanel = function() {
  var elements = this._createElements(false);
  return this._makeContainerAndRegisterPanel(elements);
};

/**
 * Emulates clicking on a category control button.
 * @param key {String} Codename of category group which is to be selected.
 */
CategoriesControl.prototype.selectCategory = function(key) {
  var points = Event.CURRENT.getPointsByCategoryGroup(key);
  
  MAP.clear();
  MAP.putPoints(points);
  
  CheckpointsList.instance.clear();
  CheckpointsList.instance.print(points);
  ResultsList.instance.resetHighlighting();
    
  for (var i = 0; i < this.controlPanels.length; i++) {
    this.controlPanels[i].children('.catControlSelectedButton').removeClass('catControlSelectedButton');
    this.controlPanels[i].children('#catCPButton_' + key).addClass('catControlSelectedButton');
  }
  
  this.currentCategory = key;
};

/************************************** PRIVATE METHODS ******************************************/

CategoriesControl.prototype._makeContainerAndRegisterPanel = function(elements) {
  var container = new$('div');
  for (var i = 0; i < elements.length; i++) {
    elements[i].appendTo(container)
  }
  this.controlPanels.push(container); // we can have multiple control panels
  console.log(this.controlPanels);
  return container;
};


CategoriesControl.prototype._createElements = function(onMap) {
  var elements = [];
  elements.push(this._createElement('Все', 'all', onMap));  // separately for 'all' pseudo-category
  for (var i = 0; i < this.categories.length; i++) {
    elements.push(this._createElement(this.categories[i].name, this.categories[i].key, onMap));
  }
  return elements;
};

/**
 * Creates a single SPAN JQuery object holding button to filter by the category it represents.
 * @param {String} name of the category, which will be displayed on the control.
 * @param {String} key to the category, which identifies this category in the 'database'.
 * @return {JQuery} SPAN with the button.
 */
CategoriesControl.prototype._createElement = function(name, key, onMap) {
  var tooltipText;
  if (key == 'all') {
    tooltipText = 'Показать все категории';
  } else {
    tooltipText = 'Показать только КП категории «' + name + '»'
  }
  
  var nameWithImg = '<span class="text">' + name + '<img src="img/' + key + '16.png"/></span>';
  var button;
    button = new$('a')
      .attr('href', '#')
      .addClass('tooltip')
      .addClass('catControlButton')
      .addClass(onMap ? 'mapCatControlButton' : 'pageCatControlButton')
      .html(nameWithImg + '<span class="tooltip">' + tooltipText + '</span>')
      .attr('id', 'catCPButton_' + key);

  var outer = this;
  button.click(function() { outer.selectCategory(key); return false; });
  return button;
};
