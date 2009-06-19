var MAP;
var MARKERS = [];
var POLYLINE;
var START_POINT = new GLatLng(POINTS[0].coordinates[0], POINTS[0].coordinates[1]);

function initialize() {
  initMap();
  setPointsOnMap();
  printPoints();
  printResults();
  setVisible('points', false, 'points_hide');
}

function initMap() {
  MAP = new GMap2($("map"));
  MAP.setUIToDefault();
  MAP.setMapType(G_NORMAL_MAP);
  MAP.setCenter(START_POINT, 12);
}

function getInfoHtmlWindow(point) {
  return '<div class="info"><div class="info_id">' + point.id + '</div><div class="info_name">' + point.name + '</div><div class="info_task">' + point.task + '</div></div>';
}

function setPointsOnMap() {
  //start point
  var startIcon = new GIcon(G_DEFAULT_ICON, "start.png");
  var marker = new GMarker(START_POINT, startIcon);
  putPointMarkerOnMap(marker, POINTS[0]);
  
  //other points
  var pointIcon = new GIcon(G_DEFAULT_ICON, "cleanmarker.png");
  var maxLat = POINTS[0].coordinates[0];
  var maxLng = POINTS[0].coordinates[1];
  var minLat = POINTS[0].coordinates[0];
  var minLng = POINTS[0].coordinates[1];
  for (var i = 1; i < POINTS.length; i++) {
    var point = new GLatLng(POINTS[i].coordinates[0], POINTS[i].coordinates[1]);
    var labelOffset = new GSize(-6, -30);
    var markerLabel = "markerLabel";
    var markerOptions = {
        icon:pointIcon,
        title:POINTS[i].id,
        labelText:POINTS[i].id,
        labelClass:markerLabel,
        labelOffset:labelOffset };
    var marker = new LabeledMarker(point, markerOptions);
    putPointMarkerOnMap(marker, POINTS[i]);
    
    
    maxLat = Math.max(maxLat, point.lat());
    maxLng = Math.max(maxLng, point.lng());
    minLat = Math.min(minLat, point.lat());
    minLng = Math.min(minLng, point.lng());
  }
  
  highlightMapRegion(new GLatLng(minLat, minLng), new GLatLng(maxLat, maxLng));
}

function highlightMapRegion(sw, ne) {
    var visibleBounds = new GLatLngBounds(sw, ne);
    var preferredZoom = MAP.getBoundsZoomLevel(visibleBounds, MAP.getSize());
    var preferredCenter = new GLatLng(
        sw.lat() + (ne.lat() - sw.lat())/2,
        sw.lng() + (ne.lng() - sw.lng())/2);
  
    // Set center of the map and preferred zoom
    MAP.setCenter(preferredCenter, preferredZoom); 
}

function putPointMarkerOnMap(marker, point) {
    MAP.addOverlay(marker);
    marker.bindInfoWindowHtml(getInfoHtmlWindow(point));
    MARKERS.push(marker);
}

function showInfo(i) {
  MARKERS[i].openInfoWindowHtml(getInfoHtmlWindow(POINTS[i])); 
  MAP.setCenter(MARKERS[i].getPoint());
}

function printPoints() {
  panel = $("points");
  panel.innerHTML += '<ul>';
  for (var i = 0; i < POINTS.length; i++) {
    id = POINTS[i].id;
    cpid = 'cp_' + id;
    panel.innerHTML += '<li><a id="' + cpid + '" href="#" onclick="showInfo(' + i + ')">' + id + '-' + POINTS[i].name + '</li>';
   }
  panel.innerHTML += '</ul>';
}

// Get results from results.js and display them for all categories in initially hidden tables.
function printResults() {
  var html = "<ul>"
  for (var i = 0; i < RESULTS.length; i++) {
    res = RESULTS[i];
    catid = 'cat_' + i;
    
    html += '<li class="cat_name"><a href="#" onclick="changeVisibility(\'' + catid + '\')">';
    html += '<span class="cat_name">' + res.category + '</span>';
    html += '</a>';
    html += '<div id="' + catid + '" class="cat_results">';
    html += '<table class="results_table"><th>#</th><th>Команда</th><th>Очки</th><th>Время</th>';
    for (var j = 0; j < res.teams.length; j++) {
      var t = res.teams[j];
      var title = '';
      if (resultHasUndefinedCheckpoint(t.checkpoints)) {
        title += '<strong class="no_points">!</strong> '
      }
      title +=  '<a href="#" onclick="showRoute([' + t.checkpoints + ']);">' + t.title + '</a>';
      html += '<tr>' + '<td class="place">' + j + '</td>' + swtag(title, 'td') + '<td class="points">' + t.count + '</td>' + swtag(t.time, 'td') + '</tr>';
    }
    html += '</table></div></li>';
  }
  html += "</ul>"
  $('teams').innerHTML += html;
}

function showRoute(checkpoints) {
  if (POLYLINE) {
    MAP.removeOverlay(POLYLINE);
  }
  pts = [START_POINT];
  var maxLat = START_POINT.lat();
  var maxLng = START_POINT.lng();
  var minLat = START_POINT.lat()
  var minLng = START_POINT.lng();
  for (var i in checkpoints) {
    point = findPointById(checkpoints[i]);
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
  pts.push(START_POINT);
  POLYLINE = new BDCCArrowedPolyline(pts, "blue", 4, 0.5, null, 30, 7, "blue", 3, 0.5);
  MAP.addOverlay(POLYLINE);
  
  highlightMapRegion(new GLatLng(minLat, minLng), new GLatLng(maxLat, maxLng));
}

function resultHasUndefinedCheckpoint(checkpoints) {
  for (var i in checkpoints) {
    if (!findPointById(checkpoints[i])) {
      return true;
    }
  }
  return false;
}

function findPointById(id) {
  for (var i in POINTS) {
    if (POINTS[i].id == id) {
      return POINTS[i];
    }
  }
}