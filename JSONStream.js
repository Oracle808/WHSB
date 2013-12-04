// The Revolution will be Televised

var either = function(a, b) {
	// This is a beautiful example of a Higher Order Function
	return function() {
		var args = Array.prototype.slice.call(arguments);
		return a.apply(null, args) || b.apply(null, args);
	}
}

var isNumeric = function(input) {
   return (input - 0) == input && input.length > 0;
}

var isAlpha = function(input) {
	return /^[a-zA-Z]+$/.test(input);
}

var isAlphaNumeric = either(isNumeric, isAlpha);

var trim = function(input) {
	return input.replace(/^\s+|\s+$/g, '');
}

//var X = "53";
//var X = "'SFDFDS'";
//var X = "[5, [54322343232 ,[],3423424332424234333335, [5]]]";
//var X = "55   ";
//var X = "{X:5}";
//var X = "{X:5, Y:6}";
var X = "[{X:5, Y:6}, 4, 'FSD', [], {x:\"fds\", n:[]}]";

var Selection = "*";
var Value = undefined;

var States = [0];
var currentSelection = Selection;
var currentValue = undefined;

var Key = new Array;
var Value = new Array;

var getCurrentState = function() { return States[States.length-1]; };
var getCurrentSelection = function() { return Selection; };
var getCurrentKey = function() { return Key; };
var getCurrentValue = function() { return Value; };
var getCurrentIndex = function() { return Index; };

var Character = 0;

// States
// 	0 = Init
//		1 = Number
//		2 = Space After Number
//		3 = String
//		4 = Expecting Array Value

while(Character < X.length) {
	// Character
	var Y = X[Character];

	if((getCurrentState() === 0 || getCurrentState() === 5 || getCurrentState() === 6 || getCurrentState() === 9) && Y === " ") {
		Character++;
		continue;
	}
	 
	// STATE 1: IN NUMBER
	if(getCurrentState() === 1) {
		if(isNumeric(Y)) {
			Value.push(Value.pop() + Y);
		} else {
			Value.push(parseInt(trim(Value.pop()), 10));
			States.pop();
		}
	// STATE 2: IN DOUBLE QUOTED STRING
	} else if(getCurrentState() === 2) {
		if(Y === '"' && (Value[Value.length-1].length === 0 || Value[Value.length-1][Value.length-1] !== "\\")) {
			States.pop();	
		} else {
			Value.push(Value.pop() + Y);
		}
	// STATE 3: IN SINGLE QUOTED STRING
	} else if(getCurrentState() === 3) {
		if(Y === "'" && (Value[Value.length-1].length === 0 || Value[Value.length-1][Value.length-1] !== "\\")) {
			States.pop();
		} else {
			Value.push(Value.pop() + Y);
		}
	}
	// STATE 4 IS REDUNDANT
		
	// EXPECTING KEY
	if(getCurrentState() === 6 && isAlpha(Y)) {
		States.pop();
		States.push(7);
	}
		
	// IN KEY
	if(getCurrentState() === 7) {
		if(isAlphaNumeric(Y)) {
			Key[Key.length-1] += Y;
		} else if(Y === ":") {
			States.pop();
			States.push(0);
		}
	}
	
	if(getCurrentState() === 0) {
		if(isNumeric(Y)) {
			States.pop();
			States.push(1);
			Value.push(Y);
		} else if(Y === '"') {
			States.pop();
			States.push(2);
			Value.push(new String);
		} else if(Y === "'") {
			States.pop();
			States.push(3);
			Value.push(new String);
		} else if(Y === '[') {
			States.pop();
			States.push(5);
			States.push(0);
			Value.push(new Array);
		} else if(Y === '{') {
			States.pop();
			States.push(9);
			States.push(6);
			Value.push(new Object);
			Key.push(new String);
		} else if(Y === ']') {
			Key.pop();
			States.pop();
		}
	} else if((getCurrentState() === 5 || getCurrentState() === 9) && (Y === "," || Y === "]" || Y === "}")) {
		if(getCurrentState() === 5) {
			Value[Value.length-2].push(Value.pop());
		} else {
			Value[Value.length-2][Key.pop()] = Value.pop();
		}
				
		if(Y === ",") {
			if(getCurrentState() === 5) {
				States.push(0);
			} else if(getCurrentState() === 9) {
				Key.push("");
				States.push(6);
			}
		} else {
			States.pop();
		}
				
	} else if(getCurrentState() === 6 && Y === "}") {
		States.pop();
		States.pop();
	}
	
	Character++;
}

if(getCurrentState() === 1) {
	Value.push(parseInt(trim(Value.pop()), 10));
}

if(States.length > 1) {
	States.pop();
}

if(States.length > 1) {
	throw "Incomplete JSON inputted";
} else {
	console.log(Value.pop());
}