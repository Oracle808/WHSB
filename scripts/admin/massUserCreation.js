var dust = require("dustjs-linkedin/lib/dust");
var row = require("../../app/users/row.dust");
var users = document.getElementById("users");
var stubRow = users.querySelector("tr:last-child");
var parser = new DOMParser();

stubRow.addEventListener("click", function(e) {
    dust.render(row, {}, function(err, out) {
	var table = document.createElement("table");
	table.innerHTML = out;
	users.insertBefore(table.querySelector("tr"), stubRow);
    });
});
