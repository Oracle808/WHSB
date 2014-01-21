class OpenDialogElement extends HTMLDivElement {
    createdCallback() {
	this.proxy = document.querySelector(this.getAttribute("for"));
    }
    scrollIntoView() {
	var fileElem = document.createElement("input");
	fileElem.type = "file";
	fileElem.addEventListener("change", () => {
	    var reader = new FileReader();
	    reader.addEventListener("load", (e) => {
		this.proxy.innerText = e.target.result;
		fileElem.remove();
	    });
	    reader.readAsText(fileElem.files[0]);
	});
	fileElem.click();
    }
}

document.register("x-opendialog", {
    prototype: OpenDialogElement.prototype
});
