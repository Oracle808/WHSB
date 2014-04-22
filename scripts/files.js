var uu = require("underscore");

module.exports.openFile = function(cb) {
    // cb is a function which tags one parameter: a file
    var fileEl = $("<input type=\"file\">"); // creates virtual <input> tag
    fileEl.on("change", function() {
	cb(fileEl.get(0).files[0]);
    });
    fileEl.click(); // simulates mouse click
};

module.exports.openFiles = function(cb) {
    var fileEl = $("<input type=\"file\" multiple>"); // creates virtual <input> tag  
    fileEl.on("change", function() {
	cb(fileEl.get(0).files);
    });
    fileEl.click();
};

module.exports.openFileAsText = function(cb) {
    // cb is a function which tags two parameters
    // first a filename, second actual text
    openFile(function(filename, file) {
	var reader = new FileReader();
	reader.addEventListener("load", function(e) {
	    cb(filename, e.target.result);
	});
    });
};

var URL = window.URL || window.webkitURL;

module.exports.saveFile = function(filename, file) {
    var linkEl = $("<a download=\"" + filename + "\">"); // creates virtual <a> tag with "download" attribute equal to filename
    if(uu.isString(file)) {
	file = new Blob([file], {type: "text"}); // Convert file to a Blob if it's a string
    }
    linkEl.attr("href", URL.createObjectURL(file));
    linkEl.click(); // simulates mouse click
};
