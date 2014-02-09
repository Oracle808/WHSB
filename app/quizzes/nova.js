var change = function(e) {
    var el = e.target;
    if(el.value === "text" || el.value === "number" && el.nextSibling instanceof HTMLInputElement) {
	el.nextSibling.type = el.value;
    }
};

document.addEventListener("DOMContentLoaded", function(e) {
    var count = 0;
    var questions = document.getElementById("questions");
    document.getElementById("newQuestion").post(function(e) {
	var named = questions.children[questions.children.length -1].querySelectorAll("[name]");
	for(var i = 0; i < named.length; i++) {
	    if(named[i].name.indexOf("[") === -1) {
		named[i].name += "[" + count  + "]";
	    } else {
		named[i].name = named[i].name.split("[")[0] + "[" + count + "]" + named[i].name.slice(1).join("");
	    }
	    if(named[i].tagName === "SELECT") {
		named[i].addEventListener("change", change);
	    }
	}
	count++;
    });
});
