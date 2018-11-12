$(document).ready(function() {
  var resultsHead = $("#results thead");
  var resultsBody = $("#results tbody");
  $("#submit").click(function(e) {
    e.preventDefault();
    var query = $("#query").val();
    $.ajax({
      url: `http://localhost:3000/imdb?q=${query}`,
      success: function(results) {
        for (var result of results) {
          var row = $("<tr></tr>");
          var tableItem = $("<td></td>");
          tableItem.append($(`<span>${result.title}</span>`));
          if (result.description) {
            tableItem.append($(`<br><span>${result.description}</span>`));
          }
          row.append(tableItem);
          resultsBody.append(row);
        }
        resultsHead.append($("<tr><th>Results</th></tr>"));
      }
    });
    resultsHead.html("");
    resultsBody.html("");
  });
});
