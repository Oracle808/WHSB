var CodeBox = require("./codebox");
var Files = require("./files");

$(document).ready(function() {
    // if a user opens a file, filename stores the file's name
    // so when the user saves it, it is downloaded with the same name
    var filename = "";

    var code = CodeBox.create({
	el: $("#code"),
	mode: CodeBox.Modes.JavaScript
    });

    console.log(code);

    $("#runCode").on("click", function() {
	var console = {};
	console.log = function(text) {
	    $(".code-output").append($("<pre>").text(text));
	};
	eval(code.val());
    });

    $("#openFile").on("click", function() {
	console.log("hi");
	Files.openFileAsText(function(filename2, text) {
	    filename = filename2;
	    code.val(text);
//	    code.highlight();
	});
    });

    $("#saveFile").on("click", function() {
	Files.saveFile(filename, code.val());
    });

    $("#documentation").on("click", function() {
	$(".flip-container").toggleClass("flipped");
    });
});
