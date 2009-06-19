function printPoints() {
  panel = document.getElementById("checkpoints");
  panel.innerHTML += '<ul>';
  for (var i = 0; i < POINTS.length; i++) {
    id = POINTS[i].id;
    cpid = 'cp_' + id;
    panel.innerHTML += '<li><span id="' + cpid + '" class="link" onclick="showInfo(' + i + ')">' + id + '-' + POINTS[i].name + '</span></li>';
   }
  panel.innerHTML += '</ul>';
}

function printResults() {
  var list = $('<ul></ul>');
  for (var i = 0; i < RESULTS.length; i++) {
    list.append(printCategoryResults(i));
  }
  list.appendTo('#results');
}

// Print results for the category
function printCategoryResults(i) {
  var res = RESULTS[i];

  var li = $('<li class="cat_name"></li>');
  var a = $('<span class="link"></span>');
  a.click(function() {
    $('#cat_' + i).slideToggle();
  });
  a.append('<span class="cat_name">' + res.category + '</span>');
  li.append(a);
  var results = $('<div id="cat_' + i + '" class="cat_results">');
  results.html(html);
  
  var html = '<table><th>#</th><th>Команда</th><th>Очки</th><th>Время</th>';
  for (var j = 0; j < res.teams.length; j++) {
    var t = res.teams[j];
    var title = '';
    if (resultHasUndefinedCheckpoint(t.checkpoints)) {
      title += '<strong class="no_points">!</strong> '
    }
    title +=  '<span class="link" onclick="showRoute([' + t.checkpoints + ']);">' + t.title + '</a>';
    html += '<tr>' + '<td class="place">' + (j+1) + '</td><td>' + title + '</td><td class="points">' + t.count + '</td><td>' + t.time + '</td></tr>';
  }
  html += '</table>';
  
  results.html(html);
  li.append(results);
  return li;
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
