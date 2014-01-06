class SlidableElement extends HTMLDivElement {
    enteredViewCallback() {
	if(this.getAttribute("hidden") === "null") {
	    this.hide();
	} else {
	    this.show();
	}
    }
    scrollIntoView() {
	if(this.getAttribute("hidden") === null) {
	    this.setAttribute("hidden", "");
	} else {
	    this.removeAttribute("hidden");
	}
    }
    attributeChangedCallback(key, oldVal, newVal) {
	if(key === "hidden") {
	    if(newVal === null) {
		this.slideDown();
	    } else {
		this.hide();
	    }
	}
    }
    show() {
	this.style.display = "block";
	this.style.visibility = "visibile";
    }
    slideDown() {
	const duration = this.getAttribute("duration") || 500;
	let simulacrum = this.cloneNode(true);
	simulacrum.style.height = "auto";
	simulacrum.style.display = "block";
	simulacrum.style.visibility = "hidden";
	simulacrum.style.position = "absolute";
	simulacrum.style.left = "-9999px";
	this.parentNode.insertBefore(simulacrum, this);
	const finalHeight = simulacrum.clientHeight;
	const originalOverflow = this.style.overflow;
	simulacrum.remove();
	this.style.height = "0px";
	this.style.overflow = "hidden";
	this.show();
	const startTime = Date.now();

	const tween = () => {
	    const heightToBeSet = (((Date.now() - startTime) / duration) * finalHeight);
	    if(heightToBeSet < finalHeight) {
		this.style.height = heightToBeSet + "px";
		window.requestAnimationFrame(tween);
	    } else {
		this.style.height = "auto";
		this.style.overflow = originalOverflow;
	    }
	};
	tween();
    }
}

document.register("x-slidable", {
    prototype: SlidableElement.prototype
});

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

function Snowflake() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.r = 0;
}

Snowflake.prototype.reset = function(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.vy = 1 + Math.random() * 3;
    this.vx = 0.5 - Math.random();
    this.r = 1 + Math.random() * 2;
    this.o = 0.5 + Math.random() * 0.5;
};

class SnowfallElement extends HTMLDivElement {
    createdCallback() {
	this.count = parseInt(this.getAttribute("count")) || 300;
	this.canvas = document.createElement('canvas');

	this.canvas.style.zIndex = "-25";
	this.canvas.style.width = "100%";
	this.canvas.style.position = "absolute";
	this.canvas.style.left = "0";
	this.canvas.style.top = "0";

	this.ctx = this.canvas.getContext("2d");

	this.snowflakes = [];
	for(var i = 0; i < this.count; i++) {
	    var snowflake = new Snowflake();
	    snowflake.reset(this.clientWidth, this.clientHeight);
	    this.snowflakes.push(snowflake);
	}

	this.reset();
	window.addEventListener("resize", this.reset.bind(this));
	window.requestAnimationFrame(this.update.bind(this));

	this.appendChild(this.canvas);
    }
    reset() {
	this.canvas.width = this.clientWidth;
	this.canvas.height = this.clientHeight;
	this.ctx.fillStyle = "#FFF";
    }
    update() {
	this.ctx.clearRect(0, 0, this.clientWidth, this.clientHeight);

	for (var i = 0; i < this.count; i++) {
	    var snowflake = this.snowflakes[i];
	    snowflake.y += snowflake.vy;
	    snowflake.x += snowflake.vx;

	    this.ctx.globalAlpha = snowflake.o;
	    this.ctx.beginPath();
	    this.ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
	    this.ctx.closePath();
	    this.ctx.fill();

	    if (snowflake.y > this.clientHeight || snowflake.x > this.clientWidth) {
		snowflake.reset(this.clientWidth, this.clientHeight);
	    }
	}

	window.requestAnimationFrame(this.update.bind(this));
    }
}

document.register("x-snowfall", {
    prototype: SnowfallElement.prototype
});
