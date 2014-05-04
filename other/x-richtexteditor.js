class RichTextEditor extends HTMLDivElement {
    createdCallback() {
	this.contentEditable = true;
	this.addEventListener("DOMSubtreeModified", this.update.bind(this));
    }
    scrollIntoView(e) {
	var el = e.target;
	document.execCommand(el.getAttribute("action"));
    }
    update() {
	var textarea = this.getAttribute("for");
	if(textarea) {
	    document.querySelector(textarea).value = (this.innerHTML);
	}
    }
}

document.register("x-richtexteditor", {
    prototype: RichTextEditor.prototype
});
