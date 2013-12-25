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
		this.slideDown();
	    } else {
		this.hide();
	    }
	}
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
	this.style.display = "block";
	this.style.visibility = "visibile";
	this.style.overflow = "hidden";
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
