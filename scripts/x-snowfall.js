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
