Category.RUN_LIGHT = new Category('run-light', 'Бег Лайт');
Category.RUN_PRO = new Category('run-pro', 'Бег Про');
Category.RIDER_LIGHT = new Category('rider-light', 'Вело Лайт');
Category.RIDER_PRO = new Category('rider-pro', 'Вело Про');
Category.ROLLER_LIGHT = new Category('roller-light', 'Роллер Лайт');
Category.ROLLER_PRO = new Category('roller-pro', 'Роллер Про');
Category.FREAK = new Category('freak', 'Фрик');

Category.ROGAIN_CATEGORIES = [Category.RUN_LIGHT, Category.RUN_PRO, Category.RIDER_LIGHT, Category.RIDER_PRO, Category.ROLLER_LIGHT, Category.ROLLER_PRO];
Category.ROGAIN_CATEGORIES_NO_ROLLER = [Category.RUN_LIGHT, Category.RUN_PRO, Category.RIDER_LIGHT, Category.RIDER_PRO];

function Category(key, name, abbr) {
  this.key = key;
  this.name = name;
  
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

Category.prototype.abbr = function() { return this.abbr; }
