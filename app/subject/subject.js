const CSS_ID = /^\#[a-z]+[0-9]*/;


// Long story cut short, allows custom els to override what an a[href=that_el] does
window.onload = function() {
    document.querySelector("html").addEventListener("click", function(e) {
	var el = e.target;
	// Do not use href, returns a url with id appended
	var href = el.getAttribute("href");
	if(el.matches("a") && CSS_ID.test(href)) {
	    var target = document.querySelector(href);
	    if(target.matches("ul")) {
		if(target.isVisible()) {
		    target.hide();
		} else {
		    target.show();
		}
	    } else {
		target.scrollIntoView();
	    }
	    e.preventDefault();
	}
    });
};

class SlidableElement extends HTMLDivElement {
    enteredViewCallback() {
	if(this.getAttribute("hidden") === "") {
	    this.hide();
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
		this.slideDown(this.getAttribute("duration") || undefined);
	    } else {
		this.hide();
	    }
	}
    }
}

document.register("x-slidable", {
    prototype: SlidableElement.prototype
});
