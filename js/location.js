function Location(event, category, route) {
  this.event = event;
  this.category = category;
  this.route = route;
}

function parseLocation(location) {
  var loc = location.hash;
  if (loc[0] == '#') {
    loc = loc.substr(1); // remove leading hash if exists
  }
  if (loc[0] == '/') {
    loc = loc.substr(1); // remove leading slash if exists
  }
  var parts = loc.split('/');
  var event = parts[0];
  var category = parts[1];
  var route = parts[2];
  return new Location(event, category, route);
}

function updateLocation(event, category, place) {
  document.location.hash = '#/' + event + '/' + category + '/' + place;
}