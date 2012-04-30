function loadEvent(event, callback) {
  if (!Event.get(event)) {
    event = Event.DEFAULT.key;
  }

  Event.setCurrent(Event.get(event));
  changeHeader(event);
  $('#events').slideUp(function() {
    toggleShowEventsButton(false);
    clearAll();
    loadCheckpoints(event);
    loadResults(event, callback);
  });
  return Event.CURRENT;
}

function clearAll() {
  $('#checkpoints').empty();
  $('#results').empty();
  MAP.clear();
  MAP.removeControl(MAP.categoriesControl);
}

function changeHeader(page) {
  var event = Event.get(page);
  $('#header h1').html(event.name);
  document.title = event.name;
}

function loadCheckpoints(event) {
  $.getJSON('points/' + event + '.js', function(data) {
    var points = eval(data);
    Event.CURRENT.setPoints(points);
    MAP.putPoints(points, true);
    CheckpointsList.instance.print(points);
  });
}

function loadResults(event, callback) {
  $.getJSON('results/' + event + '.js', function(data) {
    RESULTS = eval(data);
    ResultsList.instance.print();
    if (callback) {
      callback.call();
    }
  });
}

function toggleShowEventsButton(show) {
  if (!show) { show = $('#events').is(':visible'); }
  $('#show_events').text(show ? 'Скрыть' : 'Показать');
}

