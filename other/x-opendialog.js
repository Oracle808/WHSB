class OpenDialogElement extends HTMLDivElement {
    createdCallback() {
	if(this.hasAttribute("for")) {
	    this.proxy = document.querySelector(this.getAttribute("for"));
	} else if(this.hasAttribute("action")) {
	    this.action = this.getAttribute("action");
	}
    }
    scrollIntoView() {
	var fileElem = document.createElement("input");
	fileElem.type = "file";
	fileElem.addEventListener("change", () => {
	    if(this.proxy) {
		// Add the file to an element
		var reader = new FileReader();
		reader.addEventListener("load", (e) => {
		    if(this.proxy) {
			this.proxy.innerText = e.target.result;
			this.proxy.setAttribute("name", fileElem.files[0].name);
			fileElem.remove();
		    }
		});
		reader.readAsText(fileElem.files[0]);
	    } else if(this.action) {
		// Post the file over
		if(FormData) {
		    var data = new FormData();
		    for(var i = 0; i < fileElem.files.length; i++) {
			data.append("files[]", fileElem.files[i]);
		    }
		    var xhr = new XMLHttpRequest();
		    xhr.open("POST", this.action, true);
		    xhr.send(data);
		}
	    }
	});
	fileElem.click();
    }
}

document.register("x-opendialog", {
    prototype: OpenDialogElement.prototype
});
