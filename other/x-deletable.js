class DeletableElement extends HTMLDivElement {
    scrollIntoView(e) {
	var route = e.target.formAction || e.target.form.action;
	if(route) {
	    var req = new XMLHttpRequest();
	    req.open("delete", route);
	    req.send();
	}
	this.remove();
    }
}

document.register("x-deletable", {
    prototype: DeletableElement.prototype
});
