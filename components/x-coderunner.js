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
    }
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
	}
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

class CodeRunnerElement extends HTMLDivElement {
    createdCallback() {
	this.contentEditable = true;
	this.addEventListener("keyup", this.highlightSyntax.bind(this));
    }
    highlightSyntax(e) {
	if(e.keyCode !== 13) {
	    var s = saveSelection(this);
	    var data = this.getSource();
	    console.log(data);
	    //	data = data.replace(/"([^\\"\n]|\\.)*"/g, function(match) {
	    //      data = data.replace(/"[a-zA-Z0-9\{\}\s\(\)]*(")?/g, function(match) {
	    data = data.replace(/"([a-zA-Z0-9]|\s|\}|\{|\(|\)|\s)*(")?/g, function(match) {
		return "<span style=\"color:#090\">" + match + "</span>";
	    });
	    data = data.replace(/'([^\\'\n]|\\.)*'/g, function(match) {
		return "<span style=\"color:#090\">" + match + "</span>";
	    });
	    data = data.replace(/\/\/.*$/gm, function(match) {
		return "<span style=\"color:#a50\">" + match + "</span>";
	    });
	    this.innerHTML = ("<div>" + data.replace(/\n/g, "</div><div>") + "</div>").replace(/<div><\/div>/g, "<div><br></div>");
	    restoreSelection(this, s);
	}
    }
    scrollIntoView() {
	eval("(function() { var console = {}; console.log = function(s) { document.querySelector(\"" + this.getAttribute("for") + "\").innerHTML += s.toString() + \"<br>\"; };" + this.getSource() + "})();");
    }
    getSource() {
	return this.innerHTML.replace(/<\/div>(?!$)/g, "\n").replace(/(<([^>]+)>)/ig,"");
    }
}

document.register("x-coderunner", {
    prototype: CodeRunnerElement.prototype
});
