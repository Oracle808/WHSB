(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var URL = window.URL || window.webkitURL;

class SaveDialogElement extends HTMLDivElement {
    createdCallback() {
	this.proxy = document.querySelector(this.getAttribute("for"));
    }
    scrollIntoView() {
	if(URL.createObjectURL) {
	    var el = document.createElement("a");
	    var text = this.proxy.toDataURL ? this.proxy.toDataURL() : this.proxy.innerHTML;
	    if(!(text instanceof Array)) {
		text = [text];
	    }
	    el.href = URL.createObjectURL(new Blob(text, {type: "text"}));
	    el.download = this.proxy.getAttribute("name") || "script.js";
	    el.click();
	}
    }
}

document.register("x-savedialog", {
    prototype: SaveDialogElement.prototype
});

},{}]},{},[1])