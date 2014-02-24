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
