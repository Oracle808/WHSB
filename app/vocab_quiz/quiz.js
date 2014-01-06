// A beautiful example of custom elements

const traverse = {
    along: function(el, val) {
	if(typeof val === "string") {
	    do {
		if(el.nextElementSibling) {
		    el = el.nextElementSibling;
		} else {
		    return null;
		}
	    } while(!el.matches(val));
	    return el;
	} else if(typeof val === "number") {
	    while(val !== 0) {
		if(el.nextElementSibling) {
		    el = el.nextElementSibling;
		} else {
		    return null;
		}
		val--;
	    }
	    return el;
	}
    }
};

class QuizElement extends HTMLDivElement {
    createdCallback() {
	this.addEventListener("keyup", this.inputChanged);
    }
    inputChanged(e)  {
	var el = e.target;
	if(el.checkValidity()) {
	    var nextAnswerField = traverse.along(el, "input");
	    if(nextAnswerField) {
		nextAnswerField.focus();
	    } else {
		el.blur();
	    }
	}
    }
    scrollIntoView(e) {
	var els = this.querySelectorAll("input");
	for(var i = 0; i < els.length; i++) {
	    els[i].value = els[i].getAttribute("pattern").split("|")[0];
	    if(!els[i].checkValidity()) {
		els[i].readOnly = true;
		els[i].classList.remove("interacted");
		els[i].style.color = "red";
	    } 
	}
    }
}

document.register("x-quiz", {
    prototype: QuizElement.prototype
});
