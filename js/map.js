function BGMap() {
  BGMap.extend(ymaps.Map);
  BGMap.base.call(this, get$("map"), {
    center: [59.939167,30.315833],
    zoom: 10
  });
  
  this.pointsToMarkers = new Hashtable();
  this.startPoint = null;
  this.polyline = null;
  this.categoriesControl = null;

  this.controls
      .add('zoomControl')
      .add('typeSelector')
      .add('mapTools');
}

BGMap.prototype.putPoints = function(points, initial) {
  //start point
  this.startPoint = [ points[0].coordinates[0], points[0].coordinates[1] ];
  var startMarker = new ymaps.Placemark(this.startPoint, {
    balloonContent: BGMap.getInfoHtmlWindow(points[0])
  },
  {
    iconImageHref: "img/start.png",
    iconImageSize: [20, 34]
  });
  this.putPointMarkerOnMap(startMarker, points[0]);
  
  //other points
  for (var i = 1; i < points.length; i++) {
    var marker = new ymaps.Placemark([ points[i].coordinates[0], points[i].coordinates[1] ], {
      iconContent: points[i].id,
      balloonContent: BGMap.getInfoHtmlWindow(points[i])
    });
    this.putPointMarkerOnMap(marker, points[i]);
  }

  if (initial) {
    this.categoriesControl = new CategoriesControl(Event.CURRENT.categoryGroups);
    this.controls.add(this.categoriesControl.control, {
      left: '7px',
      top: '40px'
    });
  }
  
  this.highlightMapRegion(points);
};

/**
 * Shows information about checkpoints in a floating bubble above the point's marker.
 * @param point Point in terms of checkpoints - read from JSON.
 */
BGMap.prototype.showInfo = function(point) {
  var marker = this.pointsToMarkers.get(point);
  CheckpointsList.instance.highlightSelectedCheckpoint(point.id);
  marker.balloon.open([point.coordinates[0], point.coordinates[1]]);
  this.setCenter([point.coordinates[0], point.coordinates[1]]);
};

/**
 * Shows the route of a team by drawing an arrowed polyline on the map.
 * @param checkpoint_numbers Array of numbers - checkpoint ids - in the order of taking checkpoints.
 *                    Start point is not included in this array.
 */
BGMap.prototype.showRoute = function(checkpoint_numbers) {
  if (this.polyline) {
    this.geoObjects.remove(this.polyline);
  }
  
  var coords = [this.startPoint];
  var checkpoints = [Event.CURRENT.findPointById(0)];
  for (var i = 0; i < checkpoint_numbers.length; i++) {
    var point = Event.CURRENT.findPointById(checkpoint_numbers[i]);
    if (!point) {
      alert("No checkpoint with id=" + checkpoint_numbers[i]);
      return;
    }
    coords.push([point.coordinates[0], point.coordinates[1]]);
    checkpoints.push(point);
  }
  coords.push(this.startPoint); // returning to start point to close the cycle
  
  this.polyline = new ymaps.Polyline(coords, {}, {
    strokeColor: '#0000FF',
    strokeWidth: 4
  });
  this.geoObjects.add(this.polyline);
  this.highlightMapRegion(checkpoints);
  scrollTo('map');
};


/**
* Clears the map: removes polyline (route) and all markers. 
*/
BGMap.prototype.clear = function() {
  if (this.polyline) {
    this.geoObjects.remove(this.polyline);
  }
  var markers = this.pointsToMarkers.values();
  for (var i = 0; i < markers.length; i++) {
    this.geoObjects.remove(markers[i]);
  }
  this.pointsToMarkers = new Hashtable();
  
  purge(document.getElementById('all'));
};


/******************************** PRIVATE METHODS ********************************/

/**
 * Puts marker on the map, adds click-event to it, adds marker and point to the pointsToMarkers hash.
 * @param marker {ymaps.Placemark} Marker to put on the map.
 * @param point {Checkpoint} Point which marker is associated with. 
 */
BGMap.prototype.putPointMarkerOnMap = function(marker, point) {
  this.geoObjects.add(marker);
  var bgmap = this;
  marker.events.add('click', function() {
    bgmap.showInfo(point);
  });
  this.pointsToMarkers.put(point, marker);
};

/**
 * Get HTML for bubble window which is shown on the map when a checkpoint is selected.
 * Window shows basic information about the checkpoint.
 * @param point {Checkpoint} Checkpoint which is selected.
 */
BGMap.getInfoHtmlWindow = function(point) {
  return new$('div').addClass('info')
    .append(new$('div').addClass('info_id').text(point.id))
    .append(new$('div').addClass('info_name').text(point.name))
    .append(new$('div').addClass('info_task').text(point.task))
    .context;
};

/**
 * Centralizes and zooms the map, so that all points are visible and centralized.
 * @param checkpoints Checkpoints
 */
BGMap.prototype.highlightMapRegion = function(checkpoints) {
  var rectangle = this.findRoundingRectangle(checkpoints);
  var sw = rectangle[0];
  var ne = rectangle[1];
  var centerAndZoom = ymaps.util.bounds.getCenterAndZoom(rectangle, this.container.getSize());
  this.setCenter(centerAndZoom.center, centerAndZoom.zoom);
};

/**
 * Finds the smallest rectangle containing all given checkpoints.
 * @param checkpoints Array of checkpoints. Each checkpoint is an object, which
 * has 'coordinates' attribute containing two floats - for x and y coordinates.
 * @return Array of two GLatLng objects for south-west and north-east corners
 * of the rectangle.
 */
BGMap.prototype.findRoundingRectangle = function(checkpoints) {
  var maxLat = checkpoints[0].coordinates[0];
  var maxLng = checkpoints[0].coordinates[1];
  var minLat = checkpoints[0].coordinates[0];
  var minLng = checkpoints[0].coordinates[1];
  for (var i = 1; i < checkpoints.length; i++) {
    maxLat = Math.max(maxLat, checkpoints[i].coordinates[0]);
    maxLng = Math.max(maxLng, checkpoints[i].coordinates[1]);
    minLat = Math.min(minLat, checkpoints[i].coordinates[0]);
    minLng = Math.min(minLng, checkpoints[i].coordinates[1]);
  }
  return [ [minLat, minLng], [maxLat, maxLng]];
};
