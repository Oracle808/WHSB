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
    isHidden() {
	return window.getComputedStyle(this).visibility !== "visibile" || window.getComputedStyle(this).display === "none";
    }
    show() {
	this.style.display = "block";
	this.style.visibility = "visibile";
    }
    slideDown() {

	const duration = this.getAttribute("duration") || 500;
	let simulacrum = this.cloneNode(true);
	simulacrum.style.height = "auto";
	simulacrum.style.display = "block";
	simulacrum.style.visibility = "hidden";
	simulacrum.style.position = "absolute";
	simulacrum.style.left = "-9999px";
	this.parentNode.insertBefore(simulacrum, this);
	const initialHeight = this.isHidden() ? 0 : this.clientHeight;
	const finalHeight = simulacrum.clientHeight;
	const additionalHeight = finalHeight - initialHeight;
	const originalOverflow = this.style.overflow;
	simulacrum.remove();
	this.style.height = initialHeight + "px";
	this.style.overflow = "hidden";
	this.show();
	const startTime = Date.now();

	const tween = () => {
	    const heightToBeSet = initialHeight + (((Date.now() - startTime) / duration) * additionalHeight);
	    if(heightToBeSet < finalHeight) {
		this.style.height = heightToBeSet + "px";
		window.requestAnimationFrame(tween);
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
