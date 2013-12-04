// So far so good
var cookie, crc32, events, formidable, fs, http, path, signature, stream, url, util, mime, mongodb;

// FORWARD DECLERATIONS
var FS = {};
var TS = {};

if(typeof require !== "undefined") {
    cookie = require("cookie"),
    crc32 = require("buffer-crc32"),
    events = require("events"),
    formidable = require("formidable"),
    fs = require("fs"),
    http = require("http"),
    path = require("path"),
    signature = require("cookie-signature"),
    stream = require("stream"),
    url = require("url"),
    util = require("util"),
    mime = require("mime");
}

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
var nextTick = (typeof process !== "undefined" && process.nextTick) || root.setImmediate || function(fn) {
    setTimeout(fn, 0);
};

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

// CS.Events - The Core Building Block of the Entire Framework
CS.Events = (events && events.EventEmitter) || function() {
    this._events = {};
};

CS.Events.prototype.addListener = CS.Events.prototype.on = CS.Events.prototype.addListener ||  function(eventName, cb) {
    if(!this._events[eventName]) this._events[eventName] = [];
    this._events[eventName].push(cb);
};

CS.Events.prototype.once = CS.Events.prototype.once || function(eventName, cb) {
    this.addListener(eventName, once(cb));
};

CS.Events.prototype.removeAllListeners = CS.Events.prototype.removeAllListeners || function(eventName) {
    delete this._events[eventName];
};

CS.Events.prototype.listeners = CS.Events.prototype.listeners || function(eventName) {
    return this._events[eventName];
};

CS.Events.prototype.totalListeners = function(eventName) {
    return this._events[eventName].length;
};

CS.Events.prototype.emit = CS.Events.prototype.emit || function(eventName) {
    if(this._events[eventName]) {
	this._events[eventName].apply(this, Array.prototype.slice.call(arguments).slice(1));
    }
};

CS.Events.extend = function(options) {

    var parent = this;
    var child;

    if (options && CS.has(options, 'constructor')) {
	child = function() {
	    options.constructor.apply(this, arguments);
	};
    } else {
	child = function() {
	    parent.apply(this, arguments);
	};
    }

    inherits(child, parent);
    extend(child.prototype, options);
    child.extend = parent.extend;

    if(parent.listen) {
	child.listen = parent.listen;
    }

    return child;

};

CS.Enum = function(options) {
    if(CS.isObject(options)) {
	var count = 0;
	for(var i in options) {
	    options[i]._id = count;
	    this[i] = options[i];
	    if(CS.isObject(this[i])) Object.freeze(this[i]);
	    count++;
	}
    } else {
	for(var i = 0; i < arguments.length; i++) {
	    this[arguments[i]] = i;
	}
    }
    Object.freeze(this);

};

if(stream === undefined) {
    var stream = {};

    // One Line Inheritance
    stream.Stream = CS.Events.extend();

    // N.B: stream.Stream did have a pipe method, but stream.Readable has its own version
    // and stream.Writable doesn't even use it, so like what's the point in stream.Stream
    // having a pipe method.

    function ReadableState(options, stream) {
	options = options || {};

	// the point at which it stops calling _read() to fill the buffer
	// Note: 0 is a valid value, means "don't call _read preemptively ever"
	var hwm = options.highWaterMark;
	var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	// cast to ints.
	this.highWaterMark = ~~this.highWaterMark;

	this.buffer = [];
	this.length = 0;
	this.pipes = null;
	this.pipesCount = 0;
	this.flowing = null;
	this.ended = false;
	this.endEmitted = false;
	this.reading = false;

	// a flag to be able to tell if the onwrite cb is called immediately,
	// or on a later tick.  We set this to true at first, because any
	// actions that shouldn't happen until "later" should generally also
	// not happen before the first write call.
	this.sync = true;

	// whenever we return null, then we set a flag to say
	// that we're awaiting a 'readable' event emission.
	this.needReadable = false;
	this.emittedReadable = false;
	this.readableListening = false;

	// object stream flag. Used to make read(n) ignore n and to
	// make all the buffer merging and length checks go away
	this.objectMode = !!options.objectMode;

	// Crypto is kind of old and crusty.  Historically, its default string
	// encoding is 'binary' so we have to make this configurable.
	// Everything else in the universe uses 'utf8', though.
	this.defaultEncoding = options.defaultEncoding || 'utf8';

	// when piping, we only care about 'readable' events that happen
	// after read()ing all the bytes and not getting any pushback.
	this.ranOut = false;

	// the number of writers that are awaiting a drain event in .pipe()s
	this.awaitDrain = 0;

	// if true, a maybeReadMore has been scheduled
	this.readingMore = false;

	this.decoder = null;
	this.encoding = null;
	if (options.encoding) {
	    if (!StringDecoder)
		StringDecoder = require('string_decoder').StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	}

    }

    stream.Readable = stream.Stream.extend({
	constructor: function(options) {
	    this._readableState = new ReadableState(options, this);
	    this.readable = true;
	    this.__super__();
	},
	push: function(chunk, encoding) {
	    var state = this._readableState;

	    // Check Whether String is Compliant with the Mode
	    if (CS.isString(chunk) && !state.objectMode) {
		encoding = encoding || state.defaultEncoding;
		if (encoding !== state.encoding) {
		    chunk = new (Buffer || Blob)(chunk, encoding);
		    encoding = '';
		}
	    }

	    return readableAddChunk(this, state, chunk, encoding, false);
	},
	unshift: function(chunk) {
	    var state = this._readableState;

	    if (CS.isString(chunk) && !state.objectMode) {
		encoding = encoding || state.defaultEncoding;
		if (encoding !== state.encoding) {
		    chunk = new ((Buffer || Blob)(chunk, encoding));
		    encoding = '';
		}
	    }

	    return readableAddChunk(this, state, chunk, '', true);
	},
	// you can override either this method, or the async _read(n) below.
	read: function(n) {
	    var state = this._readableState;
	    var nOrig = n;

	    if (!CS.isNumber(n) || n > 0) state.emittedReadable = false;

	    // if we're doing read(0) to trigger a readable event, but we
	    // already have a bunch of data in the buffer, then just trigger
	    // the 'readable' event and move on.
	    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
		if (state.length === 0 && state.ended) endReadable(this);
		else emitReadable(this);
		return null;
	    }

	    n = howMuchToRead(n, state);

	    // if we've ended, and we're now clear, then finish it up.
	    if (n === 0 && state.ended) {
		if (state.length === 0) endReadable(this);
		return null;
	    }

	    // All the actual chunk generation logic needs to be
	    // *below* the call to _read.  The reason is that in certain
	    // synthetic stream cases, such as passthrough streams, _read
	    // may be a completely synchronous operation which may change
	    // the state of the read buffer, providing enough data when
	    // before there was *not* enough.
	    //
	    // So, the steps are:
	    // 1. Figure out what the state of things will be after we do
	    // a read from the buffer.
	    //
	    // 2. If that resulting state will trigger a _read, then call _read.
	    // Note that this may be asynchronous, or synchronous.  Yes, it is
	    // deeply ugly to write APIs this way, but that still doesn't mean
	    // that the Readable class should behave improperly, as streams are
	    // designed to be sync/async agnostic.
	    // Take note if the _read call is sync or async (ie, if the read call
	    // has returned yet), so that we know whether or not it's safe to emit
	    // 'readable' etc.
	    //
	    // 3. Actually pull the requested chunks out of the buffer and return.

	    // if we need a readable event, then we need to do some reading.
	    var doRead = state.needReadable;

	    // if we currently have less than the highWaterMark, then also read some
	    if (state.length === 0 || state.length - n < state.highWaterMark) {
		doRead = true;
		debug('length less than watermark', doRead);
	    }

	    // however, if we've ended, then there's no point, and if we're already
	    // reading, then it's unnecessary.
	    if (state.ended || state.reading) {
		doRead = false;
		debug('reading or ended', doRead);
	    }

	    if (doRead) {
		state.reading = true;
		state.sync = true;
		// if the length is currently zero, then we *need* a readable event.
		if (state.length === 0) state.needReadable = true;
		// call internal read method
		this._read(state.highWaterMark);
		state.sync = false;
	    }

	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (doRead && !state.reading) n = howMuchToRead(nOrig, state);

	    var ret;
	    if (n > 0) ret = fromList(n, state);
	    else ret = null;

	    if (CS.isNull(ret)) {
		state.needReadable = true;
		n = 0;
	    }

	    state.length -= n;

	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (state.length === 0 && !state.ended)
		state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended && state.length === 0)
		endReadable(this);

	    if (!CS.isNull(ret))
		this.emit('data', ret);

	    return ret;
	},
	pipe: function(dest, pipeOpts) {
	    var src = this;
	    var state = this._readableState;

	    switch (state.pipesCount) {
	    case 0:
		state.pipes = dest;
		break;
	    case 1:
		state.pipes = [state.pipes, dest];
		break;
	    default:
		state.pipes.push(dest);
		break;
	    }

	    state.pipesCount += 1;

	    var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
		dest !== process.stdout &&
		dest !== process.stderr;

	    var endFn = doEnd ? onend : cleanup;
	    if (state.endEmitted) nextTick(endFn);
	    else src.once('end', endFn);

	    dest.on('unpipe', onunpipe);
	    function onunpipe(readable) {
		debug('onunpipe');
		if (readable === src) {
		    cleanup();
		}
	    }

	    function onend() {
		debug('onend');
		dest.end();
	    }

	    // when the dest drains, it reduces the awaitDrain counter
	    // on the source.  This would be more elegant with a .once()
	    // handler in flow(), but adding and removing repeatedly is
	    // too slow.
	    var ondrain = pipeOnDrain(src);
	    dest.on('drain', ondrain);

	    function cleanup() {
		debug('cleanup');
		// cleanup event handlers once the pipe is broken
		dest.removeListener('close', onclose);
		dest.removeListener('finish', onfinish);
		dest.removeListener('drain', ondrain);
		dest.removeListener('error', onerror);
		dest.removeListener('unpipe', onunpipe);
		src.removeListener('end', onend);
		src.removeListener('end', cleanup);
		src.removeListener('data', ondata);

		// if the reader is waiting for a drain event from this
		// specific writer, then it would cause it to never start
		// flowing again.
		// So, if this is awaiting a drain, then we just call it now.
		// If we don't know, then assume that we are waiting for one.
		if (state.awaitDrain &&
		    (!dest._writableState || dest._writableState.needDrain))
		    ondrain();
	    }

	    src.on('data', ondata);
	    function ondata(chunk) {
		debug('ondata');
		var ret = dest.write(chunk);
		if (false === ret) {
		    debug('false write response, pause',
			  src._readableState.awaitDrain);
		    src._readableState.awaitDrain++;
		    src.pause();
		}
	    }

	    // if the dest has an error, then stop piping into it.
	    // however, don't suppress the throwing behavior for this.
	    function onerror(er) {
		debug('onerror', er);
		unpipe();
		dest.removeListener('error', onerror);
		if (EE.listenerCount(dest, 'error') === 0)
		    dest.emit('error', er);
	    }
	    // This is a brutally ugly hack to make sure that our error handler
	    // is attached before any userland ones.  NEVER DO THIS.
	    if (!dest._events || !dest._events.error)
		dest.on('error', onerror);
	    else if (Array.isArray(dest._events.error))
		dest._events.error.unshift(onerror);
	    else
		dest._events.error = [onerror, dest._events.error];



	    // Both close and finish should trigger unpipe, but only once.
	    function onclose() {
		dest.removeListener('finish', onfinish);
		unpipe();
	    }
	    dest.once('close', onclose);
	    function onfinish() {
		debug('onfinish');
		dest.removeListener('close', onclose);
		unpipe();
	    }
	    dest.once('finish', onfinish);

	    function unpipe() {
		debug('unpipe');
		src.unpipe(dest);
	    }

	    // tell the dest that it's being piped to
	    dest.emit('pipe', src);

	    // start the flow if it hasn't been started already.
	    if (!state.flowing) {
		debug('pipe resume');
		src.resume();
	    }

	    return dest;
	},
	_read: function() {
	    this.emit('error', new Error('not implemented'));
	},
	setEncoding: function(enc) {
	    if (!StringDecoder) StringDecoder = require('string_decoder').StringDecoder;
	    this._readableState.decoder = new StringDecoder(enc);
	    this._readableState.encoding = enc;
	    return this;
	}
    });

    function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	var er = chunkInvalid(state, chunk);
	if (er) {
	    stream.emit('error', er);
	} else if (CS.isNullOrUndefined(chunk)) {
	    state.reading = false;
	    if (!state.ended)
		onEofChunk(stream, state);
	} else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
		var e = new Error('stream.push() after EOF');
		stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
		var e = new Error('stream.unshift() after end event');
		stream.emit('error', e);
	    } else {
		if (state.decoder && !addToFront && !encoding)
		    chunk = state.decoder.write(chunk);

		if (!addToFront)
		    state.reading = false;

		// if we want the data now, just emit it.
		if (state.flowing && state.length === 0 && !state.sync) {
		    stream.emit('data', chunk);
		    stream.read(0);
		} else {
		    // update the buffer info.
		    state.length += state.objectMode ? 1 : chunk.length;
		    if (addToFront)
			state.buffer.unshift(chunk);
		    else
			state.buffer.push(chunk);

		    if (state.needReadable)
			emitReadable(stream);
		}

		maybeReadMore(stream, state);
	    }
	} else if (!addToFront) {
	    state.reading = false;
	}

	return needMoreData(state);
    }

    // if it's past the high water mark, we can push in some more.
    // Also, if we have no data yet, we can stand some
    // more bytes.  This is to work around cases where hwm=0,
    // such as the repl.  Also, if the push() triggered a
    // readable event, and the user called read(largeNumber) such that
    // needReadable was set, then we ought to push more, so that another
    // 'readable' event will be triggered.
    function needMoreData(state) {
	return !state.ended &&
	    (state.needReadable ||
	     state.length < state.highWaterMark ||
	     state.length === 0);
    }

    // Don't raise the hwm > 128MB
    var MAX_HWM = 0x800000;
    function roundUpToNextPowerOf2(n) {
	if (n >= MAX_HWM) {
	    n = MAX_HWM;
	} else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	}
	return n;
    }

    function howMuchToRead(n, state) {
	if (state.length === 0 && state.ended)
	    return 0;

	if (state.objectMode)
	    return n === 0 ? 0 : 1;

	if (isNaN(n) || util.isNull(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
		return state.buffer[0].length;
	    else
		return state.length;
	}

	if (n <= 0)
	    return 0;

	// If we're asking for more than the target buffer level,
	// then raise the water mark.  Bump up to the next highest
	// power of 2, to prevent increasing it excessively in tiny
	// amounts.
	if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);

	// don't have that much.  return null, unless we've ended.
	if (n > state.length) {
	    if (!state.ended) {
		state.needReadable = true;
		return 0;
	    } else
		return state.length;
	}

	return n;
    }


    function chunkInvalid(state, chunk) {
	var er = null;
	if (!util.isBuffer(chunk) &&
	    !util.isString(chunk) &&
	    !util.isNullOrUndefined(chunk) &&
	    !state.objectMode &&
	    !er) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	}
	return er;
    }

    function onEofChunk(stream, state) {
	if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
		state.buffer.push(chunk);
		state.length += state.objectMode ? 1 : chunk.length;
	    }
	}
	state.ended = true;

	// emit 'readable' now to make sure it gets picked up.
	emitReadable(stream);
    }

    // Don't emit readable right away in sync mode, because this can trigger
    // another read() call => stack overflow.  This way, it might trigger
    // a nextTick recursion warning, but that's not so bad.
    function emitReadable(stream) {
	var state = stream._readableState;
	state.needReadable = false;
	if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) {
		nextTick(function() {
		    emitReadable_(stream);
		});
	    } else {
		emitReadable_(stream);
	    }
	}
    }

    function emitReadable_(stream) {
	stream.emit('readable');
	flow(stream);
    }

    // at this point, the user has presumably seen the 'readable' event,
    // and called read() to consume some data.  that may have triggered
    // in turn another _read(n) call, in which case reading = true if
    // it's in progress.
    // However, if we're not ended, or reading, and the length < hwm,
    // then go ahead and try to read some more preemptively.
    function maybeReadMore(stream, state) {
	if (!state.readingMore) {
	    state.readingMore = true;
	    nextTick(function() {
		maybeReadMore_(stream, state);
	    });
	}
    }

    function maybeReadMore_(stream, state) {
	var len = state.length;
	while (!state.reading && !state.flowing && !state.ended &&
	       state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
		// didn't get any data, stop spinning.
		break;
	    else
		len = state.length;
	}
	state.readingMore = false;
    }

    // *
    //       stream.Writable
    // *

    function WriteReq(chunk, encoding, cb) {
	this.chunk = chunk;
	this.encoding = encoding;
	this.callback = cb;
    }

    function WritableState(options, stream) {
	options = options || {};

	// the point at which write() starts returning false
	// Note: 0 is a valid value, means that we always return false if
	// the entire buffer is not flushed immediately on write()
	var hwm = options.highWaterMark;
	var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;

	// object stream flag to indicate whether or not this stream
	// contains buffers or objects.
	this.objectMode = !!options.objectMode;

	// cast to ints.
	this.highWaterMark = ~~this.highWaterMark;

	this.needDrain = false;
	// at the start of calling end()
	this.ending = false;
	// when end() has been called, and returned
	this.ended = false;
	// when 'finish' is emitted
	this.finished = false;

	// should we decode strings into buffers before passing to _write?
	// this is here so that some node-core streams can optimize string
	// handling at a lower level.
	var noDecode = options.decodeStrings === false;
	this.decodeStrings = !noDecode;

	// Crypto is kind of old and crusty.  Historically, its default string
	// encoding is 'binary' so we have to make this configurable.
	// Everything else in the universe uses 'utf8', though.
	this.defaultEncoding = options.defaultEncoding || 'utf8';

	// not an actual buffer we keep track of, but a measurement
	// of how much we're waiting to get pushed to some underlying
	// socket or file.
	this.length = 0;

	// a flag to see when we're in the middle of a write.
	this.writing = false;

	// when true all writes will be buffered until .uncork() call
	this.corked = 0;

	// a flag to be able to tell if the onwrite cb is called immediately,
	// or on a later tick.  We set this to true at first, because any
	// actions that shouldn't happen until "later" should generally also
	// not happen before the first write call.
	this.sync = true;

	// a flag to know if we're processing previously buffered items, which
	// may call the _write() callback in the same tick, so that we don't
	// end up in an overlapped onwrite situation.
	this.bufferProcessing = false;

	// the callback that's passed to _write(chunk,cb)
	this.onwrite = function(er) {
	    onwrite(stream, er);
	};

	// the callback that the user supplies to write(chunk,encoding,cb)
	this.writecb = null;

	// the amount that is being written when _write is called.
	this.writelen = 0;

	this.buffer = [];

	// number of pending user-supplied write callbacks
	// this must be 0 before 'finish' can be emitted
	this.pendingcb = 0;

	// emit prefinish if the only thing we're waiting for is _write cbs
	// This is relevant for synchronous Transform streams
	this.prefinished = false;
    }

    stream.Writable = stream.Stream.extend({
	constructor: function(options) {
	    this._writableState = new WritableState(options, this);
	},
	write: function(chunk, encoding, cb) {
	    var state = this._writableState;
	    var ret = false;

	    if(CS.isFunction(encoding)) {
		cb = encoding;
		encoding = null;
	    }

	    if(CS.isBlob(chunk) || CS.isBuffer(chunk)) encoding = 'buffer';
	    else if(!encoding) encoding = state.defaultEncoding;

	    if(!CS.isFunction(cb)) cb = function() {};

	    if(state.ended) {
		writeAfterEnd(this, state, cb);
	    } else if(validChunk(this, state, chunk, cb)) {
		state.pendingcb++;
		ret = writeOrBuffer(this, state, chunk, encoding, cb);
	    }

	    return ret;
	}
    });

    function validChunk(stream, state, chunk, cb) {
	var valid = true;
	if (!CS.isBuffer(chunk) && !CS.isString(chunk) && !CS.isNullOrUndefined(chunk) && !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    nextTick(function() {
		cb(er);
	    });
	    valid = false;
	}
	return valid;
    }

    function writeOrBuffer(stream, state, chunk, encoding, cb) {
	chunk = decodeChunk(state, chunk, encoding);
	if (CS.isBlob(chunk) || CS.isBuffer(chunk)) encoding = 'buffer';
	var len = state.objectMode ? 1 : chunk.length;

	state.length += len;

	var ret = state.length < state.highWaterMark;
	state.needDrain = !ret;

	if (state.writing || state.corked)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	else
	    doWrite(stream, state, false, len, chunk, encoding, cb);

	return ret;
    }

    function decodeChunk(state, chunk, encoding) {
	if (!state.objectMode &&
	    state.decodeStrings !== false &&
	    util.isString(chunk)) {
	    chunk = new Buffer(chunk, encoding);
	}
	return chunk;
    }

    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	state.writelen = len;
	state.writecb = cb;
	state.writing = true;
	state.sync = true;
	if (writev)
	    stream._writev(chunk, state.onwrite);
	else
	    stream._write(chunk, encoding, state.onwrite);
	state.sync = false;
    }

    function onwrite(stream, er) {
	var state = stream._writableState;
	var sync = state.sync;
	var cb = state.writecb;

	onwriteStateUpdate(state);

	if (er)
	    onwriteError(stream, state, sync, er, cb);
	else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);

	    if (!finished &&
		!state.corked &&
		!state.bufferProcessing &&
		state.buffer.length) {
		clearBuffer(stream, state);
	    }

	    if (sync) {
		nextTick(function() {
		    afterWrite(stream, state, finished, cb);
		});
	    } else {
		afterWrite(stream, state, finished, cb);
	    }
	}
    }

    function afterWrite(stream, state, finished, cb) {
	if (!finished)
	    onwriteDrain(stream, state);
	state.pendingcb--;
	cb();
	finishMaybe(stream, state);
    }

    function onwriteStateUpdate(state) {
	state.writing = false;
	state.writecb = null;
	state.length -= state.writelen;
	state.writelen = 0;
    }

    function onwriteStateUpdate(state) {
	state.writing = false;
	state.writecb = null;
	state.length -= state.writelen;
	state.writelen = 0;
    }

    function needFinish(stream, state) {
	return (state.ending &&
		state.length === 0 &&
		!state.finished &&
		!state.writing);
    }

    function onwriteDrain(stream, state) {
	if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	}
    }

    function finishMaybe(stream, state) {
	var need = needFinish(stream, state);
	if (need) {
	    if (state.pendingcb === 0) {
		prefinish(stream, state);
		state.finished = true;
		stream.emit('finish');
	    } else
		prefinish(stream, state);
	}
	return need;
    }

    // *
    //       stream.Duplex - Credit goes to Node.js Source Code
    // *

    stream.Duplex = stream.Readable.extend({
	constructor: function(options) {
	    // This is what you call Multiple Inheritance
	    // I WILL get rid of this, one day
	    extend(this, new stream.Readable());
	    extend(this, new stream.Writable());

	    this.allowHalfOpen = true && (!options || options.allowHalfOpen);

	    this.once("end", function() {
		if(this.allowHalfOpen || this._writableState.ended) return;

		nextTick(this.end.bind(this));
	    });
	}
    });

    // HP: Ugly IKR, And I'll eventually replace this, with some Multiple Inheritance
    CS.keys(stream.Writable.prototype).forEach(function(method) {
	if (!stream.Duplex.prototype[method]) stream.Duplex.prototype[method] = stream.Writable.prototype[method];
    });

    // *
    //       stream.Transform - Credit goes to Node.js Source Code
    // *

    function TransformState(options, stream) {
	this.afterTransform = function(er, data) {
	    return afterTransform(stream, er, data);
	};

	this.needTransform = false;
	this.transforming = false;
	this.writecb = null;
	this.writechunk = null;
    }

    function afterTransform(stream, er, data) {
	var ts = stream._transformState;
	ts.transforming = false;

	var cb = ts.writecb;

	if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

	ts.writechunk = null;
	ts.writecb = null;

	if (!CS.isNullOrUndefined(data))
	    stream.push(data);

	if (cb) cb(er);

	var rs = stream._readableState;
	rs.reading = false;
	if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	}
    }

    // ERROR SOMEWHERE BELOW

    stream.Transform = stream.Duplex.extend({
	constructor: function (options) {
	    this.__super__(options);

	    this._transformState = new TransformState(options, this);

	    // when the writable side finishes, then flush out anything remaining.
	    var stream = this;

	    // start out asking for a readable event once data is transformed.
	    this._readableState.needReadable = true;

	    // we have implemented the _read method, and done the other things
	    // that Readable wants before the first _read call, so unset the
	    // sync guard flag.
	    this._readableState.sync = false;

	    this.once('prefinish', function() {
		if (CS.isFunction(this._flush))
		    this._flush(function(er) {
			done(stream, er);
		    });
		else
		    done(stream);
	    });
	},
	push: function(chunk, encoding) {
	    this._transformState.needTransform = false;
	    return this.__super__.prototype.push.call(this, chunk, encoding);
	},
	_transform: function(chunk, encoding, cb) {
	    throw new Error('AbstractBaseMethod Called');
	},
	_write: function(chunk, encoding, cb) {
	    var ts = this._transformState;
	    ts.writecb = cb;
	    ts.writechunk = chunk;
	    ts.writeencoding = encoding;
	    if (!ts.transforming) {
		var rs = this._readableState;
		if (ts.needTransform ||
		    rs.needReadable ||
		    rs.length < rs.highWaterMark)
		    this._read(rs.highWaterMark);
	    }
	},
	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	_read: function(n) {
	    var ts = this._transformState;

	    if (!CS.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
		ts.transforming = true;
		this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	    } else {
		// mark that we need a transform, so that any data that comes in
		// will get processed, now that we've asked for it.
		ts.needTransform = true;
	    }
	}
    });

    function done(stream, er) {
	if (er) return stream.emit('error', er);

	// if there's nothing in the write buffer, then that means
	// that nothing more will ever be provided
	var ws = stream._writableState;
	var ts = stream._transformState;

	if (ws.length)
	    throw new Error('calling transform done when ws.length != 0');

	if (ts.transforming)
	    throw new Error('calling transform done when still transforming');

	return stream.push(null);
    }

    exports.stream = stream;
}

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

DS.Collection = CS.Events.extend({
    constuctor: function(options) {
	this.model = options.model;
	this.backend = options.backend;
    },
    backend: function(eventName, obj, obj2) {
	if(eventName === "schema") {
	    this.data = [];
	} else if(eventName === "create") {
	    this.data.push(obj);
	} else if(eventName === "delete") {
	    for(var i = 0; i < this.data.length; i++) {
		if(val.id === obj) delete this.data[i];
	    }
	} else if(eventName === "update") {
	    this.data.forEach(function(val) {
		if(val.id === obj) {
		    extend(val, obj2);
		    return;
		}
	    });
	}
    },
    find: function(criteria, cb) {
	var _this = this;
	if(CS.isString(criteria)) {
	    this.backend("pinpoint", criteria, function(doc) {
		var x = new _this.model(doc);
		x.on("change", function() {
		    _this.update({_id: this.id()}, this.toObject());
		});
		cb(x);
	    });
	} else {
	    this.backend("find", criteria, function(docs) {
		docs.forEach(function(doc) {
		    var x = new _this.model(doc);
		    x.on("change", function() {
			_this.update({_id: this.id()}, this.toObject());
		    });
		});
	    });
	}
    },
    create: function(obj) {
	return this.backend("create", new this.model(obj));
    },
    delete: function(criteria) {
	return this.backend("delete", criteria);
    },
    update: function(criteria, obj) {
	return this.backend("update", criteria, obj);
    }
});

DS.mongoDb = CS.Events.extend({
    constructor: function(url, onconnect) {
	if(onconnect) this.on("connect", onconnect);
	var _this = this;
	this.db = mongodb.MongoClient.connect(url, function(err, db) {
	    _this.emit("connect");
	});
    },
    ls: function(cb) {
	return this.db.collectionNames(cb);
    },
    delete: function(collection) {
	return this.db.dropCollection(collection);
    },
    close: function() {
	this.db.close();
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
    }
});

// Controllers
ES.Controller = CS.Events.extend({
    constructor: function(el) {
	if(el) {
	    this.el = el;
	    this.id = this.el.id;
	}

	for(var e in this.events) {
	    var m  = e.split(" ");
	    if(m.length === 1) {
		this.el.addEventListener(e, this[this.events[e]].bind(this), false);
	    } else {
		var n = m.slice(0, m.length-1);
		var o = m[m.length-1];
		var els = this.el.querySelectorAll(n.join(" "));
		for(var i = 0; i < els.length; i++) {
		    els[i].addEventListener(o, this[this.events[e]].bind(this), false);
		}
	    }
	}
    },
    find: function(selector) {
	return this.el.querySelector(selector);
    }
});

if(fs !== undefined) {
    FS.ls = function(dirname) {
	var Stream = stream.Readable({objectMode: true});
	Stream._read = function(size) {
	    fs.readdir(dirname, function(err, list) {
		Stream.push(list);
		Stream.emit("end");
	    });
	};
	return Stream;
    };
    FS.cat = fs.createReadStream;
    FS.write = function(data, location) {
	data.pipe(fs.createWriteStream(location));
    };
} else {
    var URL = (root.URL || root.webkitURL);

    var saveAs = root.saveAs || root.navigator.msSaveOrOpenBlob || function(blob, filename) {
	var privateUrl = URL.createObjectURL(blob);
	var x = document.createElement("a");
	x.href = privateUrl;
	x.download = filename;
	x.click();
    };

    FS.save = function(val, filename, type) {
	if(type === undefined && CS.isCanvas(val)) text = "image/png";
	else if(type === undefined) type = "text/plain";
	if(CS.isBlob(val)) {
	    saveAs(val, filename);
	} else if(CS.isCanvas(val)) {
	    if(val.toBlob) {
		val.toBlob(function(val) {
		    FS.save(val, filename);
		}, type);
	    } else if (val.mozGetAsFile) {
		FS.save(val.mozGetAsFile("canvas", type), filename);
	    }
	} else if(CS.isString(val)) {
	    FS.save([val], filename, type);
	} else if(CS.isArray(val)) {
	    FS.save(new Blob(val, {type: type}));
	}
    };
}

// *
//        Transmission System
// *

var TS = {};

TS.Connection = function(data, options) {
    this.__super__();

    options = extend({
	headers: {},
	ajax: true
    }, options);

    if(options === undefined) {
	options = data;
	data = null;
    }

    if(options.username && options.password) {
	options.auth = options.username + ":" + options.password;
    }

    if(options.json) {
	options.headers.Accept = "application/json";
    }

    if(options.ajax) {
	options.headers["X-Requested-With"] = "XMLHttpRequest";
    }

    if(typeof url !== undefined && options.url) {
	options = merge(url.parse(options.url), options);
    }

    if(!CS.isString(options.data) && !CS.isUndefined(options.data)) {
	options.data = JSON.stringify(options.data);
	options.headers["Content-Type"] = "application/json";
    }

    var _this = this;

    if(typeof http !== undefined && http.request) {
	this.out = http.request(options, function(input) {
	    _this.stdin = input;
	});
    } else {
	// Composition of Input & Output Streams: Simply Beautiful
	this.stdin = new stream.Readable();
	this.stdout = new stream.Writable();

	this.xmlhttp = new (root.XMLHttpRequest || (root.ActiveXObject && ActiveXObject("Microsoft.XMLHTTP")));
	this.xmlhttp.open(options.method, options.url, true, options.username, options.password);

	this.xmlhttp.onreadystatechange = (function(chunk) {
	    if(xmlhttp.readyState === 3) {
		_this.stdout.push(chunk);
	    } else if (xmlhttp.readyState === 4) {
		var call = (200 >= xmlhttp.status && xmlhttp.status <= 226) ? "end" : "error";
	    	this.stdout.emit(call, xmlhttp.responseText || xmlhttp.responseXML, xmlhttp.status);
	    }
	}).bind(this);

	CS.each(options.headers, (function(key, value) {
	    this.xmlhttp.setRequestHeader(key, value);
	}).bind(this));

	xmlhttp.send(options.data || "");
    }
};


// Pseudo Methods to TS.Connection
CS.each("get post put delete connect".split(" "), function(method, i) {
    TS[method] = function(url, data, options) {
	var Connection = new TS.Connection(extend({url: url, method: method}, options));
	Connection.out.write(data);
	Connection.out.emit("end");
	return Connection.in;
    };
});

TS.Controller = CS.Events.extend({
    constructor: function(req, res) {
	console.log("BROOM UNUS");
	if(req) {
	    req.extension = req.path.split("/").slice(req.before.split("/").length).join("/");
	}
	if(res) {
	    this.out = res;
	}
	console.log(typeof req);
	console.log(typeof res);
	if(req && res) {
	    console.log("BRROM DUO");
	    if(this.static) {
		var _this = this;
		fs.exists(path.join(_this.static, req.extension), function(exists) {
		    if(exists) {
			fs.stat(path.join(_this.static, req.extension), function(err, stat) {
			    if(stat.isFile()) {
				_this.out.render(path.join(_this.static, req.extension));
			    } else {
				_this.handle(req);
			    }
			});
		    } else {
			_this.handle(req);
		    }
		});
	    } else {
		console.log("BROOM TRES");
		this.handle(req);
	    }
	}
    },
    authenticate: function(req, cb) {
	// DEPENDS ON PASSPORT INTERGRATION
	if(req.session.user && req.extension === "logout") {
	    delete req.session.user;
	} else if(!this.passport || req.session.user) {
	    return cb(req);
	}

	// USER IS NOT LOGGED IN
	if(req.extension === "login") {
	    if(req.method === "POST") {
		var self = this;
		var obj = Object.create({
		    success: function(user, info) {
			req.session.user = user;
			self.index(req);
		    },
		    fail: function(user, info) {
			self.login(req, info);
		    }
		});
		var strategy = Object.create(this.passport);
		for(var x in obj) {
		    strategy[x] = obj[x].bind(this);
		}
		strategy.authenticate(req);
	    } else {
		this.login(req);
	    }
	} else {
	    this.illicit();
	}
    },
    handle: function(req) {
	var self = this;
	this.authenticate(req, function() {
	    var route = TS.pathToRegexp(req.before +"/" + "$", req.keys);
	    if(route.test(req.path)) {
		req.params = CS.object(req.keys, route.exec(req.path));
		if(req.method === "GET" && self.index) {
		    self.index(req);
		    return;
		} else if(req.method === "POST" && self.create) {
		    self.create(req);
		    return;
		}
	    }
	    var xavier = false;
	    CS.each(self.subs, function(key, value) {
		if(TS.pathToRegexp(req.before + "/" + key, req.keys).test(req.path)) {
		    req.before += "/" + key;
		    new value(req, self.out);
		    xavier = true;
		}
	    });
	    if(xavier) return;
	    self.cannotBeFound();
	});
    },
    permissionDenied: function() {
	this.out.writeHead(403);
	this.out.end();
    },
    cannotBeFound: function() {
	this.out.writeHead(404);
	this.out.end();
    },
    serverError: function() {
	this.out.writeHead(501);
	this.out.end();
    }
});

TS.Resource = TS.Controller.extend({
    handle: function(req) {
	var self = this;
	console.log("BROOM QUINZE");
	this.authenticate(req, function() {
	    console.log("BROOM QUINQUE");
	    var route = TS.pathToRegexp(req.before + "/", req.keys, {
		absolute: true
	    });
	    if(route.test(req.path)) {
		req.params = CS.object(req.keys, route.exec(req.path));
		if(req.method === "GET" && self.index) {
		    self.index(req);
		    return;
		} else if(req.method === "POST" && self.create) {
		    self.create(req);
		    return;
		}
	    }
	    console.log(req.before + "/:" + self.name);
	    route = TS.pathToRegexp(req.before + "/:" + self.name, req.keys, {
		absolute: true
	    });
	    console.log(route.test(req.path));
	    console.log("BROOM SEX");
	    if(route.test(req.path)) {
		console.log("BROOM SEPTEM");
		req.params = CS.object(req.keys, route.exec(req.path));
		req.id = CS.last(route.exec(req.path));
		if(req.method === "GET" && self.get) {
		    console.log("BROOM OCTO");
		    console.log(self.out.headersSent);
		    self.get(req);
		    return;
		} else if(req.method === "PUT" && self.update) {
		    self.update(req);
		    return;
		} else if(req.method === "DELETE" && self.del) {
		    self.del(req);
		    return;
		}
	    }
	    CS.each(self.subs, function(key, value) {
		if(TS.pathToRegexp(req.before + "/:" + self.name + "/" + key, req.keys).test(req.url)) {
		    req.before += "/:" + self.name + "/" + key;
		    new value(req, self.out);
		    return;
		}
	    });
	    self.cannotBeFound();
	});
    }
});

// I confess, these are stolen from connect.js, sorry but I couldn't afford yet another dependency
TS.parseSignedCookies = function(obj, secret){
    var ret = {};
    Object.keys(obj).forEach(function(key){
	var val = obj[key];
	if (val.indexOf('s:') === 0) {
	    val = signature.unsign(val.slice(2), secret);
	    if (val) {
		ret[key] = val;
		delete obj[key];
	    }
	}
    });
    return ret;
};

TS.parseSignedCookie = function(str, secret){
    console.log(str.slice(3));
    return str.indexOf('s:') === 0 ? signature.unsign(str.slice(3), secret) : str;
};

TS.parseJSONCookies = function(obj){
    Object.keys(obj).forEach(function(key){
	var val = obj[key];
	var res = exports.parseJSONCookie(val);
	if (res) obj[key] = res;
    });
    return obj;
};

TS.parseJSONCookie = function(str) {
    if (str.indexOf('j:') === 0) {
	try {
	    return JSON.parse(str.slice(2));
	} catch (err) {
	    // no op
	}
    }
};

TS.pathToRegexp = function(path, keys, options) {
    options = options || {};
    var sensitive = options.sensitive;
    var strict = options.strict;
    keys = keys || [];

    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';

    path = path
	.concat(strict ? '' : '/?')
	.replace(/\/\(/g, '(?:/')
	.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(_, slash, format, key, capture, optional, star){
	    keys.push({ name: key, optional: !! optional });
	    slash = slash || '';
	    return ''
		+ (optional ? '' : slash)
		+ '(?:'
		+ (optional ? slash : '')
		+ (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
		+ (optional || '')
		+ (star ? '(/*)?' : '');
	})
	.replace(/([\/.])/g, '\\$1')
	.replace(/\*/g, '(.*)');

    if(options.absolute) return new RegExp('^' + path + "$", sensitive ? '' : 'i');
    else return new RegExp('^' + path, sensitive ? '' : 'i');
};

TS.Controller.listen = function(port, options) {
    var _this = this;
    var server = http.createServer();
    server.on("request", function(req, res) {

	// COOKIES
	if(!req.cookies) {
	    var cookies = req.headers.cookie;
	    req.secret = options.secret;
	    req.cookies = {};
	    res.signedCookies = {};
	    if(cookies) {
		try {
		    req.cookies = cookie.parse(cookies);
		    if(secret) {
			req.signedCookies = TS.parseSignedCookies(req.cookies, options.secret);
			req.signedCookies = TS.parseJSONCookies(req.cookies, options.secret);
		    }
		    req.cookies = TS.parseJSONCookies(req.cookies);
		} catch(err) {
		    err.status = 400;
		}
	    }
	}

	// SESSIONS
	if(options.session) {
	    var secret = options.session.secret || req.secret;
	    if(!secret) throw "There needs to be a secret for sessions to actually work";
	    var key = options.session.key || "connect.sess";

	    req.session = {};

	    if(!options.session.secret) {
		req.session = (options.session.key && req.signedCookies[options.session.key]) || {};
	    } else {

		var rawCookie = req.cookies[key];

		if(rawCookie) {
		    var unsigned = TS.parseSignedCookie(rawCookie, secret);

		    if(unsigned) {
			var originalHash = crc32.signed(unsigned);
			req.session = TS.parseJSONCookie(unsigned) || {};
		    }
		}
	    }
	}

	res.setHeader = function(key, value) {
	    if(this._headers && key.toLowerCase()  === "set-cookie") {
		var prev = this.getHeader(key);
		if(prev) {
		    if(CS.isArray(prev)) {
			value = prev.concat(value);
		    } else if(CS.isArray(value)) {
			value = value.concat(prev);
		    } else {
			value = [prev, value];
		    }
		}
	    } else if(this.charset && key.toLowerCase() === "content-type") {
		value += '; charset=' + this.charset;
	    }

	    return http.ServerResponse.prototype.setHeader.call(this, key, value);
	};

	res.writeHead = function(statusCode, reasonPhrase, headers) {
	    // VERY HACKY > BUT CONNECT DO IT > SO WHY CAN'T I > LOL
	    if(CS.isObject(reasonPhrase)) headers = reasonPhrase;
	    if(CS.isObject(headers)) CS.each(headers, this.setHeader.bind(this));
	    this.emit("header");
	    return http.ServerResponse.prototype.writeHead.call(this, statusCode, reasonPhrase);
	};

	res.render = function(filename, vars) {
	    if(CS.isString(filename)) {
		this.setHeader("Content-Type", mime.lookup(filename));
		fs.createReadStream(filename).pipe(this);
	    } else {
		this.setHeader("Content-Type", "text/html");
		this.write(filename(extend(vars || {}, req.session)));
		this.end();
	    }
	};

	res.once("header", function() {
	    if(!req.session) {
		if(!options.session.expires) options.session.expires = new Date(0);
		var biscuits = [];
		CS.each(req.cookies, function(key, value) {
		    biscuits.push(cookie.serialize(key, value, options.session));
		});
		res.setHeader("Set-Cookie", biscuits.join(";"));
	    } else {
		var value = "j: " + JSON.stringify(req.session);

		if(originalHash === crc32.signed(value)) return;

		value = "s: " + signature.sign(value, options.session.secret);
		value = cookie.serialize(key, value, options.session);
		res.setHeader("Set-Cookie", value);
	    }
	});

	var uri = url.parse(req.url, true);
	req.path = decodeURIComponent(uri.pathname);
	req.href = uri.href;
	req.search = uri.search;
	req.keys = [];
	req.before = "";

	// FORM HANDLING
	if(req.method === "POST" || req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE") {
	    var form = new formidable.IncomingForm();

	    form.parse(req, function(err, fields, files) {
		req.query = fields;
		req.files = files;
		new _this(req, res);
	    });
	} else {
	    req.query = uri.query;
	    new _this(req, res);
	}
    });

    server.listen(port, function() {
	console.log("TS.Controller listening at " + port + ".");
    });
};

// EMCAScript6 Exports
exports.CS = CS;
exports.DS = DS;
exports.ES = ES;
exports.FS = FS;
exports.TS = TS;