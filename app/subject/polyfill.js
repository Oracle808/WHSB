// *
//     DOM Living Standard
// *

// Elements.prototype.matches 
Element.prototype.matches = 
    Element.prototype.matches || 
    Element.prototype.matchesSelector || 
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector || 
    function (selector) {
	var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
	
	while (nodes[++i] && nodes[i] != node);
	
	return !!nodes[i];
    };

Element.prototype.__defineGetter__("parent", function() {
    return this.parentNode;
});

Element.prototype.hide = function(duration) {
    if(duration) {
	setTimeout(() => this.style.display = "none");
    } else {
	this.style.disaply = "none";
    }
};

const FRAME_RATE = 10;

Element.prototype.slideDown = function(duration=500) {
    var simulacrum = this.cloneNode(true);
    simulacrum.style.height = "auto";
    simulacrum.style.display = "block";
    simulacrum.style.visibility = "hidden";
    simulacrum.style.position = "absolute";
    simulacrum.style.left = "-9999px";
    this.parent.insertBefore(simulacrum, this);
    const finalHeight = simulacrum.clientHeight;
    console.log(finalHeight);
    const heightIncrement = finalHeight / (duration / FRAME_RATE);
    console.log(duration);
    console.log(FRAME_RATE);
    simulacrum.remove();
    this.style.height = "0px";
    this.style.display = "block";
    this.style.visibility = "visibile";
    var y = 0;
    console.log(heightIncrement);
    console.time("start");
    var tween = () => {
        y += heightIncrement;
        this.style.height = y + "px";
        if (y < finalHeight) {
            setTimeout(tween, FRAME_RATE);
        } else {
	    console.timeEnd("start");
	    this.style.height = "auto";
	}
	console.log(y);
    };
    tween();
};

NodeList.prototype.forEach = HTMLCollection.prototype.forEach = function(cb) {
    for(var i = 0; i < this.length; i++) {
	cb(this[i], i);
    }
};
