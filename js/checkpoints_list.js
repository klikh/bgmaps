/**
 * List of all checkpoints.
 * It is intended to be a singleton, so use CheckpointsList.instance
 */
function CheckpointsList() {
}
CheckpointsList.instance = new CheckpointsList();

/**
 * Prints the table of the given checkpoints (id and address) in <div id="checkpoints">.
 * Address is clickable: click to show bubble on the map.
 * @param checkpoints Array of checkpoints to be printed.
 */
CheckpointsList.prototype.print = function(checkpoints) {
  var table = new$('table').addClass('results');
  for (var i = 0; i < checkpoints.length; i++) {
    new$('tr')
      .append(new$('td').text(checkpoints[i].id))
      .append(new$('td').addClass('link').attr('data-cpid', checkpoints[i].id)
        .click(function() { 
          var cpid = $(this).attr('data-cpid');
          MAP.showInfo(Event.CURRENT.findPointById(cpid));
          CheckpointsList.instance.highlightSelectedCheckpoint(cpid);
        })
        .html(checkpoints[i].name))
      .appendTo(table);
  }
  $('#checkpoints').append(table);
  
  // control panel to filter by categories
  new$('div')
    .addClass('categoriesControlPanel')
    .append(new$('span').text('Категории: '))
    .append(MAP.categoriesControl.makeControlPanel())
    .prependTo($('#checkpoints'));
}

/**
 * Clears the list from all checkpoints.
 */
CheckpointsList.prototype.clear = function() {
  $('#checkpoints').empty();
}

/**
 * Highlights the selected checkpoint in the list.
 * Removes hightlighting from the currently selected if there is one.
 * @param {Integer} cpid Checkpoint number - i.e. its contest's 'id', written in the points JSON.
 */
CheckpointsList.prototype.highlightSelectedCheckpoint = function(cpid) {
  this.resetHighlighting();
  $('#checkpoints td[data-cpid=' + cpid + ']').addClass('selectedCheckpoint');
}

/**
 * Removes highlighting from all checkpoints rows.
 */
CheckpointsList.prototype.resetHighlighting = function() {
  $('#checkpoints td.selectedCheckpoint').removeClass('selectedCheckpoint');
}
