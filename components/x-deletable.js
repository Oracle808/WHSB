class DeletableElement extends HTMLDivElement {
    scrollIntoView(e) {
	if(e.target.formAction) {
	    var req = new XMLHttpRequest();
	    console.log(e.target.formAction);
	    req.open("delete", e.target.formAction);
	    req.send();
	}
	this.remove();
    }
}

document.register("x-deletable", {
    prototype: DeletableElement.prototype
});