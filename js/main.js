function loadEvent(event, firstTime) {
  if (!Event.get(event)) {
    event = Event.DEFAULT.key;
    document.location.hash = '#' + event;
  }

  Event.setCurrent(Event.get(event));
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
  MAP.clear();
  MAP.removeControl(this.categoriesControl);
}

function changeHeader(page) {
  var event = Event.get(page);
  var name = event.name;
  $('#header h1').html(name);
  document.title = event.name;
}

function loadCheckpoints(event) {
  $.getJSON('points/' + event + '.js', function(data) {
    var points = eval(data);
    Event.CURRENT.setPoints(points);
    printPoints(points);
    MAP.putPoints(points, true);
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
