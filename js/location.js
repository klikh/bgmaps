function Location(event, category, route) {
  this.event = event;
  this.category = category;
  this.route = route;
}

Location.CURRENT = new Location();

Location.prototype.equals = function (location) {
  return location.event == this.event && location.category == this.category && location.route == this.route;
};

function parseLocation() {
  var loc = document.location.hash;
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

function updateLocation(event, category, teamId) {
  Location.CURRENT = new Location(event, category, teamId);
  var hash = '#';
  if (event) {
    hash += '/' + event;
    if (category) {
      hash += '/' + category;
      if (teamId) {
        hash += '/' + teamId;
      }
    }
  }
  document.location.hash = hash;
}

