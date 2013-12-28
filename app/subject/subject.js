const CSS_ID = /^\#[a-z]+[0-9]*/;

var getClosestParentWhichIs = function(el, criteria) {
    while(!el.matches(criteria)) {
	if(el.parentNode) {
	    el = el.parentNode;
	} else {
	    return false;
	}
    }
    return el;
};

window.onload = function() {
    // Hide .jsless 
    {
	let toBeHidden = document.querySelectorAll(".jsless");
	for(let i = 0; i < toBeHidden.length; i++) {
	    toBeHidden[i].style.display = "none";
	}
    }
    // Show .jsmore -- BUGGY // FIX LATER
    {
	let toBeShown = document.querySelectorAll(".jsmore");
	for(let i = 0; i < toBeShown.length; i++) {
	    toBeShown[i].style.display = "block";
	}
    }

    // Long story cut short, allows custom els to override what an a[href=that_el] does
    document.querySelector("html").addEventListener("click", function(e) {
	var el = getClosestParentWhichIs(e.target, "a");
	if(!el) {
	    return;
	}
	var cite = el.getAttribute("cite");
	if(cite) {
	    var target = document.querySelector(cite);
	    target.scrollIntoView(e);
	    e.preventDefault();
	    if(history.pushState) {
		history.pushState({state: cite}, document.title, el.href);
	    }
	} else if(CSS_ID.test(el.href)) {
	    if(target.matches("ul")) {
		if(target.isVisible()) {
		    target.hide();
		} else {
		    target.show();
		}
		e.preventDefault();
	    }
	}
    });
};

class SlidableElement extends HTMLDivElement {
    enteredViewCallback() {
	if(this.getAttribute("hidden") === "null") {
	    this.hide();
	} else {
	    this.show();
	}
    }
    scrollIntoView() {
	if(this.getAttribute("hidden") === null) {
	    this.setAttribute("hidden", "");
	} else {
	    this.removeAttribute("hidden");
	}
    }
    attributeChangedCallback(key, oldVal, newVal) {
	if(key === "hidden") { 
	    if(newVal === null) {
		this.slideDown();
	    } else {
		this.hide();
	    }
	}
    }
    show() {
	this.style.display = "block";
	this.style.visibility = "visibile";
    }
    slideDown() {
	const duration = this.dataset.duration || 500;
	var simulacrum = this.cloneNode(true);
	simulacrum.style.height = "auto";
	simulacrum.style.display = "block";
	simulacrum.style.visibility = "hidden";
	simulacrum.style.position = "absolute";
	simulacrum.style.left = "-9999px";
	this.parentNode.insertBefore(simulacrum, this);
	const finalHeight = simulacrum.clientHeight;
	const heightIncrement = finalHeight / (duration / FRAME_RATE);
	const originalOverflow = this.style.overflow;
	simulacrum.remove();
	this.style.height = "0px";
	this.style.overflow = "hidden";
	this.show();
	var y = 0;
	var tween = () => {
	    y += heightIncrement;
	    this.style.height = y + "px";
	    if (y < finalHeight) {
		setTimeout(tween, FRAME_RATE);
	    } else {
		this.style.height = "auto";
		this.style.overflow = originalOverflow;
	    }
	};
	tween();
    }
}

document.register("x-slidable", {
    prototype: SlidableElement.prototype
});

class RichTextEditor extends HTMLDivElement {
    createdCallback() {
	this.contentEditable = true;
	this.addEventListener("DOMSubtreeModified", () => {
	    document.querySelector(this.getAttribute("for")).value = this.innerHTML;
	});
    }
    scrollIntoView(e) {
	var el = e.target;
	document.execCommand(el.getAttribute("action"));
    }
}

document.register("x-richtexteditor", {
    prototype: RichTextEditor.prototype
});
