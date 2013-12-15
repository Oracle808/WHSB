var FS = {};
var TS = {};

var mongodb;
var events = require("events");
var fs = require("fs");
var http = require("http");
var os = require("os");
var path = require("path");
var stream = require("stream");
var url = require("url");
var util = require("util");

// Extend
var extend = (typeof util !== "undefined" && util._extend) || function(extendee, extender) {
    var obj = {};
    for(var i in extender) {
	extendee[i] = extender[i];
    }
};

// Inherits
var inherits = function(constructor, superConstructor) {
    constructor.prototype = new superConstructor();
    constructor._super = superConstructor;
    constructor.prototype.__super__ = superConstructor;
};

// InstanceOf
var instanceOf = function(object, klass) {
    return (object.constructor === klass || object.constructor.prototype instanceof klass || ((klass === stream.Writable || klass.prototype instanceof stream.Writable) && instanceOf(object, stream.Duplex)));
};

// NextTick
var nextTick = process.nextTick; // Browserify ought to sort this out for us.

// Once
var once = function(cb) {
    var hasBeenRun = false, result;
    return function() {
	if(!hasBeenRun) {
	    result = cb.apply(null, Array.prototype.slice.call(arguments));
	    hasBeenRun = true;
	}
	return result;
    };
};

// Either
var either = function(a, b) {
    if(CS.isFunction(a) && CS.isFunction(b)) {
	return function() {
	    return a.apply(null, arguments) || b.apply(null, arguments);
	};
    } else {
	return a || b;
    }
};

// *
//      Complementary System
// *

var CS = {};

extend(CS, {
    each: function(list, iterator) {
	if(stream && stream.Stream && list instanceof stream.Stream) {
	    var Stream = new stream.Transfrom();
	    Stream._transform = function(chunk, encoding, done) {
		iterator(chunk);
		this.push(chunk);
		done();
	    };
	    return list.pipe(Stream);
	} else if(mongodb && mongodb.Cursor && list instanceof mongodb.Cursor) {
	    CS.each(list.stream());
	} else if(list instanceof Array && list.forEach) {
	    list.forEach(iterator);
	} else if(list instanceof Array) {
	    for(var i = 0; i < list.length; i++) iterator(list[i], i);
	} else {
	    for(var c in list) iterator(c, list[c]);
	}
    },
    map: function(list, iterator) {
	if(list instanceof stream.Stream) {
	    var Stream = new stream.Transform();
	    Stream._transform = function(chunk, encoding, done) {
		this.push(iterator(chunk));
		done();
	    };
	    return list.pipe(Stream);
	} else if(mongodb && mongodb.Cursor && list instanceof mongodb.Cursor) {
	    CS.each(list.stream());
	} else if(list instanceof Array && list.map) {
	    return list.map(iterator);
	} else if(list instanceof Array) {
	    var res = [];
	    for(var i = 0; i < list.length; i++) res[i] = iterator(list[i], i);
	    return res;
	}
    },
    filter: function(list, iterator) {
	if(list instanceof stream.Stream) {
	    var Stream = new stream.Transform();
	    Stream._transform = function(chunk, encdoing, done) {
		if(iterator(chunk)) this.push(chunk);
		done();
	    };
	    return list.pipe(Stream);
	} else if(mongodb && mongodb.Cursor && list instanceof mongodb.Cursor) {
	    CS.each(list.stream());
	} else if(list instanceof Array && list.filter) {
	    return list.filter(iterator);
	} else if(list instanceof Array) {
	    var res = [];
	    for(var i = 0; i < list.length; i++) {
		if(iterator(list[i])) {
		    res.push(list[i]);
		}
		return res;
	    }
	}
    }
});

// ARRAY
extend(CS, {
    join: function(data, delimeter) {
	return data.join(delimeter || ',');
    },
    flatten: function(list) {
	var ret = [];
	CS.each(list, function(val) {
	    if(CS.isArray(val)) ret = ret.concat(CS.flatten(val));
	    else ret.push(val);
	});
	return ret;
    },
    last: function(list) {
	return list[list.length-1];
    }
});

// OBJECTS
extend(CS, {
    merge: function(extendee, extender) {
	var obj = {};
	for(var i in extendee) {
	    obj[i] = extendee[i];
	}
	for(var i in extender) {
	    obj[i] = extender[i];
	}
	return obj;
    },
    keys: Object.keys || function(obj) {
	var array = [];
	for(var i in obj) {
	    array.push(i);
	}
	return array;
    },
    values: function(obj) {
	var array = [];
	for(var i in obj) {
	    array.push(obj[i]);
	}
	return array;
    },
    pairs: function(obj) {
	var array = [];
	for(var i in obj) {
	    array.push([i, obj[i]]);
	}
	return array;
    },
    pick: function(obj) {
	var args = Array.prototype.slice.call(arguments).slice(1);
	var objToReturn = {};
	for(var i = 0; i < args.length; i++) {
	    objToReturn[args[i]] = obj[args[i]];
	}
	return objToReturn;
    },
    has: function(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
    },
    object: function(keys, values) {
	var ret = {};
	for(var i = 0; i < keys.length && i < values.length; i++) {
	    ret[keys[i]] = values[i];
	}
	return ret;
    }
});

// STRING
extend(CS, {
    toUpperCase: function(str) {
	return str.toUpperCase();
    },
    toString: function(str) {
	return str.toString();
    },
    tail: function(str, lines) {
	lines = lines || 10;
	lines = (lines > str.length ? str.length : lines);
	var val = str.split("\n");
	return val.slice(val.length - lines - 1).join("\n");
    },
    trim: function(str) {
	return str.replace(/^\s+|\s+$/g, '');

    }
});

extend(CS, {
    isCanvas: function(val) {
	return val.tagName === "CANVAS";
    },
    isElement: function(val){
	return (typeof HTMLElement === "object" ? val instanceof HTMLElement //DOM2 and Above
		: val && typeof val === "object" && val !== null && val.nodeType === 1 && typeof val.nodeName==="string");
    },
    isStream: function(val) {
	return val instanceof stream.Stream;
    },
    isDOMTokenList: function(val) {
	return val instanceof DOMTokenList;
    }
});

// Error is valid only in Node.js, Generator & Symbol is only in ES6
CS.each("Arguments Array Boolean Blob Buffer Date Error File Function Generator Number Object RegExp String Symbol Undefined".split(" "), function(type) {
    CS["is" + type] = (root[type] && root[type]["is" + type]) || (util && util["is" + type]) || function(val) {
	return Object.prototype.toString.call(val) === ("[object " + type + "]");
    };
});

// H.O.F. FTW
CS.isNullOrUndefined = either(CS.isNull, CS.isUndefined);

// NUMBER
extend(CS, {
    range: function(start, stop, step) {
	if(stop === undefined) {
	    stop = start;
	    start = 1;
	}
	if(step === undefined) step = 1;
	var x = start || 1, res = [];
	while(x <= stop) {
	    res.push(x);
	    x += step;
	}
	return res;
    }
});

// *
//       Data System
// *

var DS = {};

DS.Model = CS.Events.extend({
    constructor: function(options) {
	var _this = this;
	CS.each(this.schema, function(key, value) {
	    if(value.default) {
		_this.set(key, value.default);
	    } else if(options[key]) {
		_this.set(key, options[key]);
	    } else if(value.required) {
		throw "Invalid Create Operation";
	    } else if(value.multiple) {
		_this.set(key, []);
	    }

	});

    },
    get: function(key) {
	return this.data[key];
    },
    set: function(key, value){
	if(this.schema[key].multiple && !CS.isArray(value)) throw "Invalid Set Operation";
	else if(CS["is" + this.schema[key].type](value)) throw "Invalid Set Operation";
	else this._data[key] = value;
	this.emit("change");
    }
});


var ES = {};

extend(ES, {
    clone: function(el) {
	return el.cloneNode(true);
    },
    wrap: function(wrapper, el) {
	var parent = el.parentNode;
	wrapper.appendChild(el);
	parent.appendChild(wrapper);
    },
    clear: function(el) {
	el.innerHTML = "";
    },
    prepend: function(parent, child) {
	console.log(child);
	if(parent.firstChild) return parent.insertBefore(child, parent.firstChild);
	else return parent.appendChild(child);
    },
    append: function(parent, child) {
	if(typeof child === "string") child = document.createTextNode(child);
	return parent.appendChild(child);
    },
    insertBefore: function(hook, el) {
	hook.parentNode.insertBefore(el, hook);
    },
    insertAfter: function(hook, el) {
	hook.parentNode.insertAfter(el, hook);
    },
    scrollTo: function(el) {
	el.scrollIntoView();
    },
    getDocHeight:  function() {
	var d = document;
	return Math.max(
	    Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
	    Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
	    Math.max(d.body.clientHeight, d.documentElement.clientHeight)
	);
    },
    create: function(name, props) {
	var el = document.createElement(name);
	if(props.href) el.href = props.href;
	if(props.download) el.download = props.download;
	return el;
    }
});

ES.Controller = function(el) {
    if(el) this.el = el;
};

inherits(ES.Controller, events.EventEmitter);

NodeList.prototype.on = function(eventName, cb) {
    this.forEach(function(key, value) {
	value.addEventListener(eventName, cb);
    });
};

if(fs) {
    FS.getCurrentDirectory = function() {
	return {
	    ls: fs.readdir,
	    cat: fs.createReadStream,
	    write: function(location, data, cb) {
		if(data instanceof stream.Readable) {
		    var sponge = fs.createWriteStream(location);
		    data.pipe(sponge);
		    if(cb) sponge.on("end", cb);
		} else {
		    fs.writeFile(location, data, cb);
		}
	    },
	    drop: function(filename, data, cb) {
		fs.write(path.join(os.tmpdir(), filename), data, cb);
	    }
	};
    };
} else {
    var URL = (root.URL || root.webkitURL);

    var saveAs = root.saveAs || root.navigator.msSaveOrOpenBlob || function(blob, filename) {
	var link = ES.create("a", {
	    href: URL.createObjectURL(blob),
	    download: filename
	});
	link.click();
    };

    FS.getRestrictedAccess = function() {
	return {
	    drop: function(val, filename, type) {
		if(CS.isString(val) || CS.isArray(val)) {
		    val = new Blob(val, {type: type});
		}

		saveAs(val, filename);
	    }
	};
    }
}

// *
//        Transmission System
// *

var TS = {};

TS.Connection = function(options) {

    if(!options.headers) {
	options.headers = {};
    }

    if(options.username && options.password) {
	options.auth = options.username + ":" + options.password;
    }

    if(options.json) {
	options.headers.Accept = "application/json";
    }

    if(options.ajax || typeof options.ajax === "undefined") {
	options.headers["X-Requested-With"] = "XMLHttpRequest";
    }

    if(!CS.isString(options.data) && !CS.isUndefined(options.data)) {
	options.data = JSON.stringify(options.data);
	options.headers["Content-Type"] = "application/json";
    }

    var _this = this;

    this.stdout = http.request(options, function(input) {
	_this.stdin = input;
    });

};


// Pseudo Methods to TS.Connection
CS.each("get post put delete connect".split(" "), function(method, i) {
    TS[method] = function(url, data, options) {
	var Connection = new TS.Connection(extend({url: url, method: method}, options));
	Connection.stdout.write(data);
	Connection.stdout.end();
	return Connection.stdin;
    };
});


// EMCAScript6 Exports
export { CS, DS, ES, FS, TS };
