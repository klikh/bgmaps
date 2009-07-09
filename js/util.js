Array.prototype.removeDuplicates = function() {
  this.sort();
  for (var i = 1; i < this.length; i++) {
    if (this[i-1] == this[i]) { this.splice(i, 1); }
  }
  return this;
}

Function.prototype.extends = function(base){
 function Closure(){}
 Closure.prototype = base.prototype;
 this.prototype = new Closure();
 this.prototype.constructor = this.constructor;
 this.base = base;
}

function new$(name) {
  return document.createElement(name);
}

/**
 * Synonym for document.getElementById.
 * If you need just to get element by id, use get$('id') instead of $('#id'),
 * because JQuery's $() is slower, because it uses complicated selector logic.
 */
function get$(id) {
  return document.getElementById(id);
}