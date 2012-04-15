Event.RUN_GROUP = (new CategoryGroup('run', 'Бег')).add(Category.RUN_LIGHT).add(Category.RUN_PRO);
Event.RIDER_GROUP = (new CategoryGroup('rider', 'Вело')).add(Category.RIDER_LIGHT).add(Category.RIDER_PRO);
Event.ROLLER_GROUP = (new CategoryGroup('roller', 'Роллер')).add(Category.ROLLER_LIGHT).add(Category.ROLLER_PRO).add(Category.ROLLER).add(Category.FREAK);

Event.ALL_EVENTS = [
  new Event('dvg2009', 'День в Городе 2009', Category.ROGAIN_CATEGORIES, [Event.RUN_GROUP, Event.RIDER_GROUP, Event.ROLLER_GROUP]),
  new Event('nvg2009', 'Ночь в Городе — Пушкин 2009', Category.ROGAIN_CATEGORIES_NO_ROLLER, [Event.RUN_GROUP, Event.RIDER_GROUP]),
  new Event('dvg2010', 'День в Городе 2010', Category.ROGAIN_CATEGORIES.push(Category.FREAK), [Event.RUN_GROUP, Event.RIDER_GROUP, Event.ROLLER_GROUP]),
  new Event('dvg2011', 'День в Городе 2011', Category.ROGAIN_CATEGORIES_NO_ROLLER.push(Category.ROLLER, Category.FREAK), [Event.RUN_GROUP, Event.RIDER_GROUP, Event.ROLLER_GROUP])
];

Event.DEFAULT = Event.ALL_EVENTS[Event.ALL_EVENTS.length - 1];
Event.CURRENT = Event.DEFAULT;

function Event(key, name, categories, categoryGroups) {
  this.key = key;
  this.name = name;
  this.categories = categories;
  this.points = [];
  
  if (categoryGroups) {
    this.categoryGroups = categoryGroups;
  } else {
    // if no category groups are specified, then put each category in separate group
    this.categoryGroups = [];
    for (var i = 0; i < categories.length; i++) {
      categoryGroups.push((new CategoryGroup(categories[i].key, categories[i].name)).add(categories[i]));
    }
  }
}

Event.get = function(key) {
  for (var i = 0; i < Event.ALL_EVENTS.length; i++) {
    if (Event.ALL_EVENTS[i].key == key) {
      return Event.ALL_EVENTS[i];
    }
  }
  return null;
}

Event.setCurrent = function(event) {
  Event.CURRENT = event;
}

Event.prototype.findGroupForCategoryKey = function(key) {
  for (var i = 0; i < this.categoryGroups.length; i++) {
    var group = this.categoryGroups[i];
    for (var j = 0; j < group.categories.length; j++) {
      if (group.categories[j].key == key) {
        return group;
      }
    }
  }
  return null;
}

Event.prototype.findGroupsForCategoryKeys = function(categoryKeys) {
  var groups = [];
  for (var i = 0; i < categoryKeys.length; i++) {
    groups.push(this.findGroupForCategoryKey(categoryKeys[i]));
  }
  return groups.removeDuplicates();
}

Event.prototype.setPoints = function(points) {
  this.points = points;
}

Event.prototype.findPointById = function(id) {
  for (var i = 0; i < this.points.length; i++) {
    if (this.points[i].id == id) {
      return this.points[i];
    }
  }
}

Event.prototype.getPointsByCategoryGroup = function(key) {
  if (key == 'all') {
    return this.points;
  }
  
  var points = [];
  var group = this.findGroupByKey(key);
  for (var i = 0; i < this.points.length; i++) {
    if (this.doesPointContainInGroup(this.points[i], group)) {
      points.push(this.points[i]);
    }
  }
  return points;
}

Event.prototype.doesPointContainInGroup = function(point, group) {
  for (var i = 0; i < group.categories.length; i++) {
    for (var j = 0; j < point.categories.length; j++) {
      if (group.categories[i].key == point.categories[j]) {
        return true;
      }
    }
  }
  return false;
}

Event.prototype.findGroupByKey = function(key) {
  for (var i = 0; i < this.categoryGroups.length; i++) {
    if (this.categoryGroups[i].key == key) {
      return this.categoryGroups[i];
    }
  }
}