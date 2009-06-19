var EVENTS = [
{ 'key': 'dvg2009',
  'name': 'День в Городе 2009' },
{ 'key': 'nvg2009',
  'name': 'Ночь в Городе — Пушкин 2009' }
];


function getEventByKey(key) {
  for (var i = 0; i < EVENTS.length; i++) {
    if (EVENTS[i].key == key) {
      return EVENTS[i];
    }
  }
  return null;
}

