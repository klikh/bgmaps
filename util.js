function $(id) {
  return document.getElementById(id);
}

function changeVisibility(id, switcherID, shownHTML, hiddenHTML) {
  var st = $(id).style;
  setVisible(id, (st.display == 'none') || (st.display == ''), switcherID, shownHTML, hiddenHTML);
}

function setVisible(id, visible, switcherID, shownHTML, hiddenHTML) {
  if (!shownHTML) { shownHTML = 'Скрыть'; }
  if (!hiddenHTML) { hiddenHTML = 'Показать'; }

  var el = $(id).style;
  if (visible) {
    el.display = 'block';
    if (switcherID) {
      $(switcherID).innerHTML = shownHTML;
    }
  } else {
    el.display = 'none';
    if (switcherID) {
      $(switcherID).innerHTML = hiddenHTML;
    }
  }
}

function swtag(string, tag) {
  return '<' + tag + '>' + string + '</' + tag + '>';
}