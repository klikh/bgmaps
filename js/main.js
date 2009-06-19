function loadEvent(event) {
  if (!getEventByKey(event)) {
    alert('No event with codename ' + event);
  }
  
  changeHeader(event);
  if (FIRST_TIME) {
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
  $('#header h1').html(getEventByKey(page).name);
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
