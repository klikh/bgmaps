function ResultsList() {
}
ResultsList.instance = new ResultsList();

/**
 * Prints the results for the current event in <div id="results">.
 * Results are grouped into categories. Click on category to display teams' results.
 * Click on a team to display its route.
 */
ResultsList.prototype.print = function() {
  var list = new$('ul');
  for (var i = 0; i < RESULTS.length; i++) {
    list.append(this.printCategoryResults(i));
  }
  list.appendTo('#results');
}

/******************************** PRIVATE METHODS ********************************/

ResultsList.prototype.printCategoryResults = function(i) {
  var res = RESULTS[i];

  var li = new$('li')
    .append(new$('span').addClass('link').addClass('cat_name')
      .click(function() { $('#cat_' + i).slideToggle(); })
      .text(res.category));
  
  var table = new$('table').addClass('results')
    .append(new$('th').text('#'))
    .append(new$('th').text('Команда'))
    .append(new$('th').text('Очки'))
    .append(new$('th').text('Время'));
  
  for (var j = 0; j < res.teams.length; j++) {
    table.append(this.printTeamResult(j, res));
  }
  
  new$('div').attr('id', 'cat_' + i).addClass('cat_results')
    .append(table)
    .appendTo(li);
  return li;
}

ResultsList.prototype.printTeamResult = function(j, res) {
  var t = res.teams[j];
  var warn = '';
  if (this.resultHasUndefinedCheckpoint(t.checkpoints)) { warn = '<strong class="no_points">!</strong> '; }
  return new$('tr')
    .append(new$('td').addClass('place').html(j+1))
    .append(new$('td').addClass('link')
      .click(function() { MAP.showRoute(t.checkpoints)} )
      .html(warn + t.title))
    .append(new$('td').text(t.count))
    .append(new$('td').text(t.time));
}

ResultsList.prototype.resultHasUndefinedCheckpoint = function(checkpoints) {
  for (var i = 0; i < checkpoints.length; i++) {
    if (!Event.CURRENT.findPointById(checkpoints[i])) {
      return true;
    }
  }
  return false;
}
