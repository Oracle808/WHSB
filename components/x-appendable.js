class AppendableElement extends HTMLDivElement {
    scrollIntoView() {
	var fragment = document.createDocumentFragment();
	for(var i = 0; i < this.children.length; i++) {
	    fragment.appendChild(this.children[i].cloneNode(true));
	}
	console.log(document.getElementById(this.getAttribute("to")));
	document.getElementById(this.getAttribute("to")).appendChild(fragment);
    }
}

document.register("x-appendable", {
    prototype: AppendableElement.prototype
});
