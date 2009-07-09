function BGMap() {
  BGMap.base.call(this, get$("map"));
  
  this.pointsToMarkers = new Hashtable();
  this.startPoint = null;
  this.polyline = null;
  this.categoryControl = null;
  
  this.setUIToDefault();
  this.setMapType(G_NORMAL_MAP);
}
BGMap.extends(GMap2);

BGMap.getInfoHtmlWindow = function(point) {
  return '<div class="info"><div class="info_id">' + point.id + '</div><div class="info_name">' + point.name + '</div><div class="info_task">' + point.task + '</div></div>';
}

BGMap.prototype.putPoints = function(points, initial) {
  //start point
  this.startPoint = new GLatLng(points[0].coordinates[0], points[0].coordinates[1]);
  var startIcon = new GIcon(G_DEFAULT_ICON, "img/start.png");
  var marker = new GMarker(this.startPoint, startIcon);
  this.putPointMarkerOnMap(marker, points[0]);
  
  //other points
  var pointIcon = new GIcon(G_DEFAULT_ICON, "img/cleanmarker.png");
  var maxLat = points[0].coordinates[0];
  var maxLng = points[0].coordinates[1];
  var minLat = points[0].coordinates[0];
  var minLng = points[0].coordinates[1];
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
    var marker = new LabeledMarker(point, markerOptions);
    this.putPointMarkerOnMap(marker, points[i]);

    if (initial) {
      this.categoriesControl = new CategoriesControl(Event.CURRENT.categoryGroups);
      this.addControl(this.categoriesControl);
    }
    
    maxLat = Math.max(maxLat, point.lat());
    maxLng = Math.max(maxLng, point.lng());
    minLat = Math.min(minLat, point.lat());
    minLng = Math.min(minLng, point.lng());
  }
  
  this.highlightMapRegion(new GLatLng(minLat, minLng), new GLatLng(maxLat, maxLng));
}

BGMap.prototype.highlightMapRegion = function(sw, ne) {
    var visibleBounds = new GLatLngBounds(sw, ne);
    var preferredZoom = this.getBoundsZoomLevel(visibleBounds, this.getSize());
    var preferredCenter = new GLatLng(
        sw.lat() + (ne.lat() - sw.lat())/2,
        sw.lng() + (ne.lng() - sw.lng())/2);
  
    // Set center of the map and preferred zoom
    this.setCenter(preferredCenter, preferredZoom); 
}

BGMap.prototype.putPointMarkerOnMap = function(marker, point) {
    this.addOverlay(marker);
    marker.bindInfoWindowHtml(BGMap.getInfoHtmlWindow(point));
    this.pointsToMarkers.put(point, marker);
}

BGMap.prototype.showInfo = function(point) {
  var marker = this.pointsToMarkers.get(point);
  marker.openInfoWindowHtml(BGMap.getInfoHtmlWindow(point)); 
  this.setCenter(marker.getPoint());
}

BGMap.prototype.showRoute = function(checkpoints) {
  if (this.polyline) {
    this.removeOverlay(this.polyline);
  }
  pts = [this.startPoint];
  var maxLat = this.startPoint.lat();
  var maxLng = this.startPoint.lng();
  var minLat = this.startPoint.lat()
  var minLng = this.startPoint.lng();
  for (var i = 0; i < checkpoints.length; i++) {
    point = Event.CURRENT.findPointById(checkpoints[i]);
    if (!point) {
      alert("No checkpoint with id=" + checkpoints[i]);
      return;
    }
    
    maxLat = Math.max(maxLat, point.coordinates[0]);
    maxLng = Math.max(maxLng, point.coordinates[1]);
    minLat = Math.min(minLat, point.coordinates[0]);
    minLng = Math.min(minLng, point.coordinates[1]);
    
    pts.push(new GLatLng(point.coordinates[0], point.coordinates[1]));
  }
  pts.push(this.startPoint);
  this.polyline = new BDCCArrowedPolyline(pts, "blue", 4, 0.5, null, 30, 7, "blue", 3, 0.5);
  this.addOverlay(this.polyline);
  
  this.highlightMapRegion(new GLatLng(minLat, minLng), new GLatLng(maxLat, maxLng));
  
  window.scroll(0, this.getObjectOffsetTop(get$("map")));
}

BGMap.prototype.getObjectOffsetTop = function(obj) {
  var curr = 0;
  while (obj) {
    if (obj.offsetTop) {
      curr += obj.offsetTop;
      if (!((obj.offsetParent) && (obj = obj.offsetParent))) {
        break;
      }
    } else {
      break;
    }
  }
  
  return curr;
}

BGMap.prototype.clear = function() {
  if (this.polyline) {
    this.removeOverlay(this.polyline);
  }
  var markers = this.pointsToMarkers.values();
  for (var i = 0; i < markers.length; i++) {
    this.removeOverlay(markers[i]);
  }
  this.pointsToMarkers = new Hashtable();
}