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
    list.append(this.printCategoryResults(RESULTS[i]));
  }
  list.appendTo('#results');
};

/******************************** PRIVATE METHODS ********************************/

ResultsList.prototype.printCategoryResults = function(categoryResult) {
  var li = new$('li')
    .append(new$('span').addClass('link').addClass('cat_name')
      .click(function() { $('#' + ResultsList.getCategoryDivId(categoryResult.category.key)).slideToggle(); })
      .text(categoryResult.category.name));
  
  var table = new$('table').addClass('results')
    .append(new$('th').text('#'))
    .append(new$('th').text('№'))
    .append(new$('th').text('Команда'))
    .append(new$('th').text('Очки'))
    .append(new$('th').text('Время'));
  
  for (var j = 0; j < categoryResult.teams.length; j++) {
    table.append(this.printTeamResult(categoryResult.category, categoryResult.teams[j], j+1));
  }
  
  new$('div').attr('id', ResultsList.getCategoryDivId(categoryResult.category.key)).addClass('cat_results')
    .append(table)
    .appendTo(li);
  return li;
};

ResultsList.getCategoryDivId = function (categoryKey) {
  return 'cat_' + categoryKey;
};

ResultsList.getTeamResultDivId = function (categoryKey, teamId) {
  return categoryKey + "/" + teamId;
};

ResultsList.prototype.showRoute = function(categoryKey, teamId) {
  var groupForCategoryKey = Event.CURRENT.findGroupForCategoryKey(categoryKey);
  if (groupForCategoryKey != null && groupForCategoryKey.key != MAP.categoriesControl.currentCategory) {
    MAP.categoriesControl.selectCategory('all');
  }
  var teamResult = this.findTeamResultByTeamId(categoryKey, teamId);
  if (!teamResult) {
    return;
  }
  MAP.showRoute(teamResult.checkpoints);
  this.highlightSelected($(get$(ResultsList.getTeamResultDivId(categoryKey, teamId))));
  updateLocation(Event.CURRENT.key, categoryKey, teamId);
};

ResultsList.prototype.findTeamResultByTeamId = function(categoryKey, number) {
  for (var i = 0; i < RESULTS.length; i++) {
    if (RESULTS[i].category.key == categoryKey) {
      var teams = RESULTS[i].teams;
      for (var j = 0; j < teams.length; j++) {
        if (teams[j].number == number) {
          return teams[j];
        }
      }
    }
  }
};

ResultsList.prototype.printTeamResult = function(category, teamResult, place) {
  var warn = '';
  if (this.resultHasUndefinedCheckpoint(teamResult.checkpoints)) {
    warn = '<strong class="no_points">!</strong> '; 
  }
  
  var outer = this;
  return new$('tr')
    .append(new$('td').addClass('place').html(place))
    .append(new$('td').addClass('number').html(teamResult.number))
    .append(new$('td').addClass('link').attr('id', ResultsList.getTeamResultDivId(category.key, teamResult.number))
      .click(function() {
        outer.showRoute(category.key, teamResult.number);
      })
      .html(warn + teamResult.title))
    .append(new$('td').text(teamResult.count))
    .append(new$('td').text(teamResult.time));
};

ResultsList.prototype.resultHasUndefinedCheckpoint = function(checkpoints) {
  for (var i = 0; i < checkpoints.length; i++) {
    if (!Event.CURRENT.findPointById(checkpoints[i])) {
      return true;
    }
  }
  return false;
};

/**
 * Highlights the selected team result in the list.
 * Removes highlighting from the currently selected if there is one.
 * @param obj {JQuery} JQuery wrapper for DOM element which should be selected
 *                     (row in the results table).
 */
ResultsList.prototype.highlightSelected = function(obj) {
  this.resetHighlighting();
  obj.addClass('selectedResult');
};

/**
 * Removes highlighting from all result rows.
 */
ResultsList.prototype.resetHighlighting = function() {
  $('#results td.selectedResult').removeClass('selectedResult');
};
