function BGMap() {
  BGMap.extend(GMap2);
  BGMap.base.call(this, get$("map"));
  
  this.pointsToMarkers = new Hashtable();
  this.startPoint = null;
  this.polyline = null;
  this.categoriesControl = null;
  
  this.setUIToDefault();
  this.setMapType(G_NORMAL_MAP);
}

BGMap.prototype.putPoints = function(points, initial) {
  //start point
  this.startPoint = new GLatLng(points[0].coordinates[0], points[0].coordinates[1]);
  var startIcon = new GIcon(G_DEFAULT_ICON, "img/start.png");
  var marker = new GMarker(this.startPoint, startIcon);
  this.putPointMarkerOnMap(marker, points[0]);
  
  //other points
  var pointIcon = new GIcon(G_DEFAULT_ICON, "img/cleanmarker.png");
  for (var i = 1; i < points.length; i++) {
    var point = new GLatLng(points[i].coordinates[0], points[i].coordinates[1]);
    var labelOffset = new GSize(-6, -30);
    var markerLabel = "markerLabel";
    var markerOptions = {
        icon:pointIcon,
        title:points[i].id,
        labelText:points[i].id,
        labelClass:markerLabel,
        labelOffset:labelOffset };
    var marker2 = new LabeledMarker(point, markerOptions);
    this.putPointMarkerOnMap(marker2, points[i]);
  }

  if (initial) {
    this.categoriesControl = new CategoriesControl(Event.CURRENT.categoryGroups);
    this.addControl(this.categoriesControl);
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
  marker.openInfoWindowHtml(BGMap.getInfoHtmlWindow(point)); 
  this.setCenter(marker.getPoint());
};

/**
 * Shows the route of a team by drawing an arrowed polyline on the map.
 * @param checkpoint_numbers Array of numbers - checkpoint ids - in the order of taking checkpoints.
 *                    Start point is not included in this array.
 */
BGMap.prototype.showRoute = function(checkpoint_numbers) {
  if (this.polyline) {
    this.removeOverlay(this.polyline);
  }
  
  var coords = [this.startPoint];
  var checkpoints = [Event.CURRENT.findPointById(0)];
  for (var i = 0; i < checkpoint_numbers.length; i++) {
    var point = Event.CURRENT.findPointById(checkpoint_numbers[i]);
    if (!point) {
      alert("No checkpoint with id=" + checkpoint_numbers[i]);
      return;
    }
    coords.push(new GLatLng(point.coordinates[0], point.coordinates[1]));
    checkpoints.push(point);
  }
  coords.push(this.startPoint); // returning to start point to close the cycle
  
  this.polyline = new BDCCArrowedPolyline(coords, "blue", 4, 0.5, null, 30, 7, "blue", 3, 0.5);
  this.addOverlay(this.polyline);
  this.highlightMapRegion(checkpoints);
  scrollTo('map');
};


/**
* Clears the map: removes polyline (route) and all markers. 
*/
BGMap.prototype.clear = function() {
  if (this.polyline) {
    this.removeOverlay(this.polyline);
  }
  var markers = this.pointsToMarkers.values();
  for (var i = 0; i < markers.length; i++) {
    this.removeOverlay(markers[i]);
  }
  this.pointsToMarkers = new Hashtable();
  
  purge(document.getElementById('all'));
};


/******************************** PRIVATE METHODS ********************************/

/**
 * Puts marker on the map, adds click-event to it, adds marker and point to the pointsToMarkers hash.
 * @param marker {GMarker} Marker to put on the map.
 * @param point {Checkpoint} Point which marker is associated with. 
 */
BGMap.prototype.putPointMarkerOnMap = function(marker, point) {
  this.addOverlay(marker);
  var bgmap = this;
  GEvent.addListener(marker, 'click', function() {
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
  var visibleBounds = new GLatLngBounds(sw, ne);
  var preferredZoom = this.getBoundsZoomLevel(visibleBounds, this.getSize());
  var preferredCenter = new GLatLng(
      sw.lat() + (ne.lat() - sw.lat())/2,
      sw.lng() + (ne.lng() - sw.lng())/2);
  this.setCenter(preferredCenter, preferredZoom); 
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
  return [new GLatLng(minLat, minLng), new GLatLng(maxLat, maxLng)];
};
