function loadEvent(event, firstTime) {
  if (!getEventByKey(event)) {
    event = DEFAULT_EVENT_KEY;
    document.location.hash = '#' + event;
  }
  
  changeHeader(event);
  if (firstTime) {
    loadCheckpoints(event);
    loadResults(event);
  } else {                 
    $('#events').slideUp(function() {
      toggleShowEventsButton(false);
      clearAll();
      loadCheckpoints(event);
      loadResults(event);
      $('#results').slideDown();
    });
  }
}

function clearAll() {
  $('#checkpoints').html(' ');
  $('#results').html('');
  clearMap();
}

function changeHeader(page) {
  var name = getEventByKey(page).name;
  $('#header h1').html(name);
  document.title = getEventByKey(page).name;
}

function loadCheckpoints(event) {
  $.getJSON('points/' + event + '.js', function(data) {
    POINTS = eval(data);
    printPoints();
    setPointsOnMap();
  });
}

function loadResults(event) {
  $.getJSON('results/' + event + '.js', function(data) {
    RESULTS = eval(data);
    printResults();
  });
}

function toggleShowEventsButton(show) {
  if (!show) { show = $('#events').is(':visible'); }
  $('#show_events').text(show ? 'Скрыть' : 'Показать');
}
