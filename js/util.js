﻿/**
 * Removes all duplicates from the given array. 
 * Array can be not sorted - it is sorted in this method anyway
 */
Array.prototype.removeDuplicates = function() {
  this.sort();
  for (var i = 1; i < this.length; i++) {
    if (this[i-1] == this[i]) { this.splice(i, 1); }
  }
  return this;
};

/**
 * Helpful function for implementing inheritance in Javascript.
 * If you want class A to extend class B, use the following:
 * function A() {
 *   A.extend(B);
 *   A.base.call(this, <other parameters of parent constructor>);
 * }
 * Note 'extend' (without 's' at the end): 'extends' is a probable future reserved word.
 */
Function.prototype.extend = function(base){
  for (var prop in base.prototype) {
    this.prototype[prop] = base.prototype[prop];
  }
  this.base = base;
};

/**
* Synonym for $(document.createElement).
* It is faster than $('<tag/>')
* It is shorter than $(document.createElement('tag'))
*/
function new$(name) {
  return $(document.createElement(name));
}

/**
 * Synonym for document.getElementById.
 * If you need just to get element by id, use get$('id') instead of $('#id'),
 * because JQuery's $() is slower as it uses complicated selector logic.
 */
function get$(id) {
  return document.getElementById(id);
}

/**
 * Scrolls to element with the given id.
 */
function scrollTo(id) {
  window.scroll(0, getPositionY(get$(id)));
}

/**
 * Returns the absolute vertical position of the given object.
 */
function getPositionY(obj) {
  var curtop = 0;
  if (obj.offsetParent) {
    while(true) {
      curtop += obj.offsetTop;
      if (!obj.offsetParent) {
        break;
      }
      obj = obj.offsetParent;
    }
  } else if (obj.y) {
    curtop += obj.y;
  }
  return curtop;
}

function purge(d) {
    var a = d.attributes, i, l, n;
    if (a) {
        l = a.length;
        for (i = 0; i < l; i += 1) {
            n = a[i].name;
            if (typeof d[n] === 'function') {
                d[n] = null;
            }
        }
    }
    a = d.childNodes;
    if (a) {
        l = a.length;
        for (i = 0; i < l; i += 1) {
            purge(d.childNodes[i]);
        }
    }
}
