(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class AppendableElement extends HTMLDivElement {
    scrollIntoView() {
	this.pre();
	var fragment = document.createDocumentFragment();
	for(var i = 0; i < this.children.length; i++) {
	    fragment.appendChild(this.children[i].cloneNode(true));
	}
	console.log(document.getElementById(this.getAttribute("to")));
	document.getElementById(this.getAttribute("to")).appendChild(fragment);
	this.post();
    }
    pre(f) {
	if(f === undefined && this.before) {
	    this.before.apply(this);
	} else {
	    this.before = f;
	}
    }
    post(f) {
	if(f === undefined && this.after) {
	    this.after.apply(this);
	} else {
	    this.after = f;
	}
    }
}

document.register("x-appendable", {
    prototype: AppendableElement.prototype
});

},{}]},{},[1])