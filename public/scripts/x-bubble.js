(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class BubbleElement extends HTMLDivElement {
    createdCallback() {
	if(this.hasAttribute("hidden")) {
	    this.style.display = "none";
	} else {
	    this.style.display = "block";
	}
    }
    show() {
	this.style.visibility = "hidden";
	this.style.display = "block";

	if(!this.triangle) {
	    this.triangle = document.createElement("div");

	    this.style.position = this.triangle.style.position = "absolute"
	    this.style.border = "1px solid black";
	    this.style.height = "auto";
	    this.style.top = "0px";
	    this.style.left = "0px";

	    var fur = document.querySelector(this.getAttribute("for"));
	    var rect = fur.getBoundingClientRect();
	    var offset = this.getBoundingClientRect();

	    this.triangle.style.width = "0";
	    this.triangle.style.height = "0";
	    this.triangle.style.borderTop = this.triangle.style.borderBottom = "10px solid transparent";
	    this.triangle.style.borderRight = "10px solid black";
	    this.triangle.style.top =  (this.clientHeight / 2) - (this.mockHeight(this.triangle) / 2) + "px";
	    this.triangle.style.left = "-10px";

	    this.style.top = (rect.top - (this.clientHeight / 2) - offset.top + (fur.clientHeight / 2)) + "px";
	    this.style.left = (rect.left - offset.left) + fur.clientWidth + 10 + "px";
	    this.style.zIndex = this.triangle.style.zIndex = "25";
	    this.appendChild(this.triangle);
	}

	this.triangle.style.display = "block";
	this.style.visibility = "visible";
    }
    hide() {
	this.style.display = "none";
	this.triangle.style.display = "none";
    }
    scrollIntoView() {
	console.log("fsdfds");
	if(this.hasAttribute("hidden")) {
	    this.removeAttribute("hidden");
	} else {
	    this.setAttribute("hidden", "");
	}
    }
    mockHeight(el) {
	let simulacrum = (el || this).cloneNode(true);
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
    attributeChangedCallback(key, oldVal, newVal) {
	if(key === "hidden") {
	    if(newVal === null) {
		this.show();
	    } else {
		this.hide();
	    }
	}
    }
}

document.register("x-bubble", {
    prototype: BubbleElement.prototype
});

},{}]},{},[1])