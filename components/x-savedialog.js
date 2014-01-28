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
