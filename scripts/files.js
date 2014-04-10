var uu = require("underscore");
module.exports.openFileAsText = function(cb) {
    // cb is a function which tags two parameters
    // first a filename, second actual text
    var fileEl = $("<input type=\"file\">"); // creates virtual <input> tag
    fileEl.on("change", function() {
	var reader = new FileReader();
	fileEl = fileEl.get(0);
	reader.addEventListener("load", function(e) {
	    cb(fileEl.files[0].name, e.target.result);
	});
	reader.readAsText(fileEl.files[0]);
    });
    fileEl.click(); // simulates mouse click
};

var URL = window.URL || window.webkitURL;

module.exports.saveFile = function(filename, file) {
    var linkEl = $("<a download=\"" + filename + "\">"); // creates virtual <a> tag with "download" attribute equal to filename
    if(uu.isString(file)) {
	file = new Blob([file], {type: "text"}); // Convert file to a Blob if it's a string
    }
    linkEl.href(URL.createObjectURL(file));
    linkEl.click(); // simulates mouse click
};
