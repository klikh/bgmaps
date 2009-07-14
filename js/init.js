function initialize() {
  createEventsList();
  initShowCheckpointsButton();
  MAP = new BGMap();
  $.ajaxSetup({'beforeSend': function(xhr){
      if (xhr.overrideMimeType)
          xhr.overrideMimeType("text/javascript");
      }
  });
}

function initShowCheckpointsButton() {
  $('#show_checkpoints').click(function () {
    $('#checkpoints').slideToggle(function() {
      var text = ($('#checkpoints').is(':visible') ? 'Скрыть' : 'Показать');
      $('#show_checkpoints').text(text);
    });
  });
}

function createEventsList() {
  var ul = new$('ul');
  for (var i = 0; i < Event.ALL_EVENTS.length; i++) {
    ul.append(createEventLink(i));
  }
  ul.appendTo($('#events'));
  
  $('#show_events').click(function() {
      $('#events').slideToggle(function() {
        toggleShowEventsButton();
      });
  });
}

function createEventLink(i) {
  var page = Event.ALL_EVENTS[i].key;
  var a = new$('a')
    .text(Event.ALL_EVENTS[i].name)
    .attr('href', '#' + page)
    .click(function() {
      loadEvent(page);
    });
  return new$('li').append(a);
}