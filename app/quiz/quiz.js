// A beautiful example of custom elements

class QuizElement extends HTMLDivElement {
    createdCallback() {
	this.children.filter("input").on("click", this.inputChanged);
    }
    inputChanged(e) {
	var el = e.target;
	if(el.value = el.dataset.answer) {
	    el.classList.add("valid");
	} else {
	    el.classList.add("invalid");
	}
    }
}

document.register("x-quiz", QuizElement);
