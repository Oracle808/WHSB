class EnableElement extends HTMLDivElement {
    scrollIntoView() {
	var els = this.querySelectorAll("[disabled]");
	for(var i = 0; i < els.length; i++) {
	    els[i].disabled = false;
	}
    }
}

document.register("x-enable", {
    prototype:EnableElement.prototype
});
