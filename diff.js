var a = "ccabac";
var b = "accbab";

var isPointEqual = function(x, y) {
	return a[x] === b[y];
}

var isSolved = function(snake) {
	return !snake.solved;
}

var sort = function(s1, s2) {
	if(s1.changes_length > s2.changes_length) return s1;
	else return s2;
}

function Snake(x, y) {
	this.x = x;
	this.y = y;
	this.changes = [];
	this.changes_length = 0;
	this.solved = false;
}

Snake.prototype.toString = function() {
	return this.solved + ": (" + this.x + "," + this.y + ")"; 
}

console.log(isPointEqual(1, 2));

var Snakes = [new Snake(0, 0)];

while(Snakes.filter(isSolved).length > 0) {
	Snakes.filter(isSolved).forEach(function(snake) {
		if(snake.x === (a.length - 1) && snake.y === (b.length -1)) {
			snake.solved = true;
		}
		
		if(isPointEqual(snake.x, snake.y) && isPointEqual(snake.x+1, snake.y+1)) {
			snake.x++;
			snake.y++;
			snake.changes.push([a[snake.x]]);
			snake.changes_length++;
		} else if(isPointEqual(snake.x + 1, snake.y)) {
			snake.changes.push(["+", a[snake.x]]);
			snake.changes_length++;
			snake.x++;
		} else if(isPointEqual(snake.x, snake.y + 1)) {
			snake.changes.push(["-", a[snake.x]]);
			snake.changes.push([a[snake.x]]);
			snake.changes_length++;
			snake.y++;
		} else {
			if(snake.y + 1 < b.length && snake.x + 1 < a.length) {
				console.log(snake);
				console.log(snake.x);
				var z = new Snake(snake.x, snake.y);
				z.changes = snake.changes.concat([["-", b[z.y]]]);
				z.changes_length++;
				z.x++;
				Snakes.push(z);
				snake.changes.push(["-", b[snake.y]]);
				snake.changes_length++;
				snake.x++;
			} else if(snake.y + 1 < b.length) {
				snake.changes.push(["-", b[snake.y]]);
				snake.changes.push([b[snake.y]]);
				snake.changes_length++;
				snake.y++;
			} else if(snake.x + 1 < a.length) {
				snake.changes.push(["+", b[snake.y]]);
				snake.changes_length++;
				snake.x++;
			}
		}
		
		console.log(snake.toString());
		
	});
}

console.log(Snakes[Snakes.length -1]);
console.log(Snakes[Snakes.length -2]);