class DestroyableElement extends HTMLElement {
    scrollIntoView() {
	this.remove();
    }
}

document.register("x-destroy", {
    prototype: DestroyableElement.prototype
});
