var Backbone = require("./backbone");

var saveSelection, restoreSelection;

if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
	var range = window.getSelection().getRangeAt(0);
	var preSelectionRange = range.cloneRange();
	preSelectionRange.selectNodeContents(containerEl);
	preSelectionRange.setEnd(range.startContainer, range.startOffset);
	var start = preSelectionRange.toString().length;

	return {
		start: start,
		end: start + range.toString().length
	    };
    };

    restoreSelection = function(containerEl, savedSel) {
	var charIndex = 0, range = document.createRange();
	range.setStart(containerEl, 0);
	range.collapse(true);
	var nodeStack = [containerEl], node, foundStart = false, stop = false;

	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType == 3) {
		    var nextCharIndex = charIndex + node.length;
		    if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
			    range.setStart(node, savedSel.start - charIndex);
			    foundStart = true;
			}
		    if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
			    range.setEnd(node, savedSel.end - charIndex);
			    stop = true;
			}
		    charIndex = nextCharIndex;
			} else {
			    var i = node.childNodes.length;
			    while (i--) {
				    nodeStack.push(node.childNodes[i]);
				}
				}
	    }

	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
    };
} else if (document.selection) {
    saveSelection = function(containerEl) {
	var selectedTextRange = document.selection.createRange();
	var preSelectionTextRange = document.body.createTextRange();
	preSelectionTextRange.moveToElementText(containerEl);
	preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
	var start = preSelectionTextRange.text.length;

	return {
	    start: start,
	    end: start + selectedTextRange.text.length
	};
    };

    restoreSelection = function(containerEl, savedSel) {
	var textRange = document.body.createTextRange();
	textRange.moveToElementText(containerEl);
	textRange.collapse(true);
	textRange.moveEnd("character", savedSel.end);
	textRange.moveStart("character", savedSel.start);
	textRange.select();
    };
}

/*
  CodeBox is a Backbone.Controller for any element which contiains code be it a <p>, or <code> or, <div>.
  It even works with text editors such as <div contenteditable="true">.
*/

var CodeBox = Backbone.Controller.extend({
    className: "codebox",

    events: {
	"keyup": "highlight", // Called after character is inserted into HTML
	"keydown": "indent" // Called before character is inserted into HTML
    },

    initialize: function(options) {
	this.mode = options.mode;
	this.$el.attr("spellcheck", false); // Disable spellcheck
    },

    indent: function(e) {
	if(e.keyCode === 9) { // Checks whether tab was pressed
	    document.execCommand("indent");
	    e.preventDefault();
	}
    },

    highlight: function(e) {
	console.log(saveSelection(this.el));
	if(e && (e.keyCode === 13 || (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 9 || e.keyCode === 8)) {
	    return; // we don't want highlighting occuring on a return, up, down, left, right, tab, back keypresses
	}
	var d = saveSelection(this.el);
	var clone = this.$el.clone();
	clone.find("span").contents().unwrap(); // Remove all span tags (http://stackoverflow.com/questions/11442464/jquery-strip-all-specifc-html-tags-from-string);
	var data = clone.html();
	["keyword", "string", "parameter", "comment"].forEach((function(token) {
	    this.mode[token] && this.mode[token].forEach(function(regex) {
		regex = new RegExp("(" + regex.source + ")" + /(?![^<>]*>)/.source, "g"); // This ensures text inside tags isn't matches
		data =  data.replace(regex, function(match) {
		    return "<span class=\"" + token + "\">" + match + "</span>";
		});
	    });
	}).bind(this));
	this.$el.html(("<div>" + data.replace(/\n/g, "</div><div>").replace(/\t/g + "     ") + "</div>").replace(/<div><\/div>/g, "<div><br></div>"));
	restoreSelection(this.el, d);
    },

    val: function(value) {
	if(!value) {
	    return this.$el.html().replace(/<\/div>(?!$)/g, "\n").replace(/(<([^>]+)>)/ig,"");
	} else {
	    this.$el.html(value);
	    this.highlight();
	}
    }

},
{
    Modes: {
	JavaScript: {
	    string: [/"([a-zA-Z0-9]|\s|\}|\{|\(|\)|\s)*(")?/g, /'([^\\'\n]|\\.)*/g],
	    keyword: [/\b(class)/g, /\b(function)/g, /\b(var)/g, /\b(new)/g],
	    comment: [/\/\/.*$/g]
	},
	Python: {},
	LaTeX: {
	    string: [/\\[a-zA-Z]+/g],
	    parameter: [/\\[a-zA-Z]+\{([a-zA-Z]+)\}/g]
	}
    }
});

module.exports = CodeBox;
