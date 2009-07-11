// function getCategoriesAbbrs(categories) {
//   var groups = Event.CURRENT.findGroupsForCategoryKeys(categories);
//   var text= '';
//   for (var i = 0; i < groups.length; i++) {
//     text += groups[i].abbr;
//   }
//   return text;
// }

function printResults() {
  var list = $('<ul/>');
  for (var i = 0; i < RESULTS.length; i++) {
    list.append(printCategoryResults(i));
  }
  list.appendTo('#results');
}

function printCategoryResults(i) {
  var res = RESULTS[i];

  var li = $('<li/>')
    .append($('<span/>').addClass('link').addClass('cat_name')
      .click(function() { $('#cat_' + i).slideToggle(); })
      .text(res.category));
  
  var table = $('<table/>').addClass('results')
    .append($('<th/>').text('#'))
    .append($('<th/>').text('Команда'))
    .append($('<th/>').text('Очки'))
    .append($('<th/>').text('Время'));
  
  for (var j = 0; j < res.teams.length; j++) {
    table.append(printTeamResult(j, res));
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
  return $('<tr/>')
    .append($('<td/>').addClass('place').html(j+1))
    .append($('<td/>').addClass('link')
      .click(function() { MAP.showRoute(t.checkpoints)} )
      .html(warn + t.title))
    .append($('<td/>').text(t.count))
    .append($('<td/>').text(t.time));
}

function resultHasUndefinedCheckpoint(checkpoints) {
  for (var i = 0; i < checkpoints.length; i++) {
    if (!Event.CURRENT.findPointById(checkpoints[i])) {
      return true;
    }
  }
  return false;
}
