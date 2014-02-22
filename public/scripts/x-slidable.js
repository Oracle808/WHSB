(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class SlidableElement extends HTMLDivElement {
    enteredViewCallback() {
	if(this.hasAttribute("hidden")) {
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
    mockHeight() {
	let simulacrum = this.cloneNode(true);
	simulacrum.style.height = "auto";
	simulacrum.style.display = "block";
	simulacrum.style.visibility = "hidden";
	simulacrum.style.position = "absolute";
	simulacrum.style.left = "-9999px";
	this.parentNode.insertBefore(simulacrum, this);
	const x = simulacrum.clientHeight;
	simulacrum.remove();
	return x;
    }
    slideDown() {

	const duration = this.getAttribute("duration") || 500;
	const initialHeight = this.isHidden() ? 0 : this.clientHeight;
	const finalHeight = this.mockHeight();
	const additionalHeight = finalHeight - initialHeight;
	const originalOverflow = this.style.overflow;
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

},{}]},{},[1])