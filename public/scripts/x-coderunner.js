(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var replace = function(str, regex, colour) {
    return str.replace(regex, function(match) {
	return "<span style=\"color:" + colour + "\">" + match + "</span>";
    });
};

class CodeRunnerElement extends HTMLDivElement {
    createdCallback() {
	this.contentEditable = true;
	this.addEventListener("keypress", this.highlightSyntax.bind(this));
    }
    highlightSyntax(e) {
	if(e.keyCode !== 13) {
	    var s = saveSelection(this);
	    var data = this.toDataURL();
	    var character = String.fromCharCode(e.keyCode);
	    data = data.slice(0, s.start) + character + data.slice(s.end);
	    data = replace(data, /"([a-zA-Z0-9]|\s|\}|\{|\(|\)|\s|\\|#)*(")?/g, "#090");
	    data = replace(data, /'([a-zA-Z0-9]|\s|\}|\{|\(|\)|\s|\\|#)*(')?/g, "#090");
	    data = replace(data, /\/\/.*$/gm, "#A50");
	    this.innerHTML = ("<div>" + data.replace(/\n/g, "</div><div>") + "</div>").replace(/<div><\/div>/g, "<div><br></div>");
	    s.start++;
	    s.end++;
	    restoreSelection(this, s);
	    e.preventDefault();
	}
    }
    scrollIntoView() {
	var output = document.querySelector(this.getAttribute("for"));
	while(output.hasChildNodes()) {
	    output.removeChild(output.lastChild);
	}
	eval("(function() { var console = {}; console.log = function(s) { document.querySelector(\"" + this.getAttribute("for") + "\").innerHTML += s.toString() + \"<br>\"; };" + this.toDataURL() + "})();");
    }
    toDataURL() {
	return this.innerHTML.replace(/<\/div>(?!$)/g, "\n").replace(/(<([^>]+)>)/ig,"");
    }
}

document.register("x-coderunner", {
    prototype: CodeRunnerElement.prototype
});

},{}]},{},[1])