$(document).ready(function() {
  var resultsDiv = $("#results");
  $("#submit").click(function(e) {
    e.preventDefault();
    var query = $("#query").val();
    $.ajax({
      url: `http://localhost:3000/imdb?q=${query}`,
      success: function(results) {
        var tableCategories = {};
        for (var result of results) {
          if (tableCategories[result.category] == null) {
            tableCategories[result.category] = $(
              `<table>
                <thead>
                  <tr><th>${result.category}</th></tr>
                </thead>
                <tbody></tbody>
              </table>`
            );
          }
          var row = $("<tr></tr>");
          var tableItem = $("<td></td>");
          tableItem.append($(`<span>${result.title}</span>`));
          if (result.description) {
            tableItem.append($(`<br><span>${result.description}</span>`));
          }
          row.append(tableItem);
          tableCategories[result.category].find("tbody").append(row);
        }
        for (let category of Object.keys(tableCategories)) {
          resultsDiv.append(tableCategories[category]);
        }
      }
    });
    resultsDiv.html("");
  });
});
