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
      .append(new$('td').addClass('link').attr('data-cpid', i)
        .click(function() { MAP.showInfo(checkpoints[$(this).attr('data-cpid')]); })
        .html(checkpoints[i].name) )
      .appendTo(table);
  }
  $('#checkpoints').append(table);
}

/**
 * Clears the list from all checkpoints.
 */
CheckpointsList.prototype.clear = function() {
  $('#checkpoints').empty();
}
