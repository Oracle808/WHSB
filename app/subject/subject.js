class SlidableElement extends HTMLDivElement {
    createdCallback() {
	console.log("It's actually working... lol");
	if(this.dataset.hidden) {
	    this.style.display = "none";
	} else {
	    this.style.display = "block";
	}
    }
    scrollIntoView() {
	if(this.dataset.hidden) {
	    this.dataset.hidden = null;
	} else {
	    this.dataset.hidden = "";
	}
	this.createdCallback();
    }
}
console.log("At least the code's being run");

document.register("x-slidable", {
    prototype: SlidableElement.prototype
});
