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
  var ul = $('<ul></ul>');
  for (var i = 0; i < Event.ALL_EVENTS.length; i++) {
    createEventLink(i, ul);
  }
  var index = $('<div id="index"></div>');
  ul.appendTo(index);
  index.appendTo($('#events'));
  
  initShowEventsButton();
}

function createEventLink(i, ul) {
  var page = Event.ALL_EVENTS[i].key;
  var a = $('<a>' + Event.ALL_EVENTS[i].name + '</a>');
  a.attr('href', '#' + page);
  a.click(function() {
    loadEvent(page);
  });
  var li = $('<li style="padding: 0.5em;"></li>');
  a.appendTo(li);
  li.appendTo(ul);
}

function initShowEventsButton() {
  $('#show_events').click(function() {
      $('#events').slideToggle(function() {
        toggleShowEventsButton();
      });
  });
}