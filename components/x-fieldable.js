class FieldableElement extends HTMLDivElement {
    scrollIntoView() {
	var els = this.querySelectorAll("[name]");
	var fieldset = document.createElement("fieldset");
	fieldset.name = this.getAttribute("name");
	for(var i = 0; i < els; i++) {
	    let realInput = document.createElement("input");
	    realInput.type = "hidden";
	    els[i].addEventListener("change", function() {
		realInput.value = this.value;
	    });
	    fieldset.appendChild(realInput);
	    if(!(els[i] instanceof HTMLInputElement)) {
		els[i].
	    }
	}
    }
}

document.register("x-fieldable", {
    prototype: FieldableElement.prototype
});
