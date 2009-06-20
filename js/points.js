function printPoints() {
  var table = $('<table/>').addClass('results');
  for (var i = 0; i < POINTS.length; i++) {
    printPoint(i, table);
  }
  $('#checkpoints').append(table);
}

function printPoint(i, table) {
  $('<tr/>')
    .append($('<td/>').text(POINTS[i].id))
    .append($('<td/>').addClass('link').click(function() { showInfo(i); })
      .html(POINTS[i].name) )
    .appendTo(table);
}

function printResults() {
  var list = $('<ul/>');
  for (var i = 0; i < RESULTS.length; i++) {
    list.append(printCategoryResults(i));
  }
  list.appendTo('#results');
}

// Print results for the category
function printCategoryResults(i) {
  var res = RESULTS[i];

  var li = $('<li class="cat_name"></li>')
    .append($('<span/>').addClass('link').addClass('cat_name')
      .click(function() { $('#cat_' + i).slideToggle(); })
      .text(res.category));
  
  var table = $('<table/>').addClass('results')
    .append($('<th/>').text('#'))
    .append($('<th/>').text('Команда'))
    .append($('<th/>').text('Очки'))
    .append($('<th/>').text('Время'));
  
  for (var j = 0; j < res.teams.length; j++) {
    printTeamResult(j, res);
  }
  
  $('<div/>').attr('id', 'cat_' + i).addClass('cat_results')
    .append(table)
    .appendTo(li);
  return li;
}

function printTeamResult(j, res) {
  var t = res.teams[j];
  var warn = '';
  if (resultHasUndefinedCheckpoint(t.checkpoints)) { warn = '<strong class="no_points">!</strong> '; }
  $('<tr/>')
    .append($('<td/>').addClass('place').html(j+1))
    .append($('<td/>').addClass('link').click(function() { showRoute(t.checkpoints)} ).html(warn + t.title))
    .append($('<td/>').text(t.count))
    .append($('<td/>').text(t.time))
    .appendTo(table);
}

function resultHasUndefinedCheckpoint(checkpoints) {
  for (var i = 0; i < checkpoints.length; i++) {
    if (!findPointById(checkpoints[i])) {
      return true;
    }
  }
  return false;
}

function findPointById(id) {
  for (var i = 0; i < POINTS.length; i++) {
    if (POINTS[i].id == id) {
      return POINTS[i];
    }
  }
}
