var uu = require("underscore");
var us = require("underscore.string");
var dust = require("dustjs-linkedin");
var crypto = require('crypto');
var fs = require("fs");
var util = require("util");

// This allows us to `require` dust files
require.extensions[".dust"] = function(module, filename) {
    module.exports = fs.readFileSync(filename).toString();
};


dust.helper = require("dustjs-helpers");

dust.helpers.first = function(chunk, ctx, bodies, params) {
    if(ctx.get("$idx") === 0) {
	if(bodies.block) {
	    return chunk.render(bodies.block, ctx);
	} else {
	    return chunk.write("true");
	}
    } else {
	if(bodies["else"]) {
	    return chunk.render(bodies["else"], ctx);
	} else {
	    return chunk;
	}
    }
};

dust.helpers.contains = function(chunk, ctx, bodies, params) {
    try {
	var key = params.key ? dust.helpers.tap(params.key, chunk, ctx) : ctx.get("selectKey");
	var value = params.value ? dust.helpers.tap(params.value, chunk, ctx) : ctx.get("selectKey");
    } catch (e) {
	throw e;
    }
    if(key.indexOf(value) !== -1) {
	if(bodies.block) {
	    return chunk.render(bodies.block, ctx);
	} else {
	    return chunk.write("contains");
	}
    } else {
	if(bodies["else"]) {
	    return chunk.render(bodies["else"], ctx);
	} else {
	    return chunk;
	}
    }
};

dust.helpers.lacks = function(chunk, ctx, bodies, params) {
    console.log("vcxvxccv");
    try {
	var key = params.key ? dust.helpers.tap(params.key, chunk, ctx) : ctx.get("selectKey");
	var value = dust.helpers.tap(params.value, chunk, ctx);
    } catch (e) {
	throw e;
    }
    console.log(typeof key[0]);
    console.log(typeof value);
    if(key.indexOf(value) !== -1) {
	if(bodies["else"]) {
	    return chunk.render(bodies["else"], ctx);
	} else {
	    return chunk;
	}
    } else {
	if(bodies.block) {
	    return chunk.render(bodies.block, ctx);
	} else {
	    return chunk.write("lacks");
	}
    }
};

dust.helpers.pluck = function(chunk, ctx, bodies, params) {
    var key = dust.helpers.tap(params.key, chunk, ctx);
    var value = dust.helpers.tap(params.value, chunk, ctx);
    console.log(key);
    console.log(value);
    if(bodies.block) {
	console.log(uu.pluck(key, value));
	return chunk.render(bodies.block, ctx.push({isSelect: true, isResolved: false, selectKey: uu.pluck(key, value)}));
    } else {
	return chunk;
    }
};

dust.helpers.shuffle = function(chunk, ctx, bodies, params) {
    var key = dust.helpers.tap(params.key, chunk, ctx);
    return chunk.render(bodies.block, ctx.push({isSelect: true, isResolved: false, selectKey: uu.shuffle(key)}));
};

dust.helpers.stringify = function(chunk, ctx, bodies, params) {
    var key = (params && params.key) ? dust.helpers.tap(params.key, chunk, ctx) : ctx.get("selectKey");
    if(uu.isArray(key)) {
	key = uu.map(key, function(v) {
	    return v.toString();
	});
    } else {
	key = key.toString();
    }
    if(bodies.block) {
	return chunk.render(bodies.block, ctx.push({isSelect: true, isResolved: false, selectKey: key}));
    } else {
	return chunk.write(key);
    }
};

dust.helpers["typeof"] = function(chunk, ctx, bodies, params) {
    var key = typeof ((params && params.key) ? dust.helpers.tap(params.key, chunk, ctx) : ctx.get("selectKey"));
    if(bodies.block) {
	return chunk.render(bodies.block, ctx.push({isSelect: true, isResolved: false, selectKey: key}));
    } else {
	return chunk.write(key);
    }
};

dust.onLoad = function(name, cb) {
    fs.readFile(name, function(err, out) {
	console.log(name);
	console.log(err);
	cb(err, out.toString());
    });
};

module.exports.intercept = function(opts) {
    return function(req, res, next) {
	res.render = function(func, vars) {
	    if(!res.headersSent) {
		res.writeHead(200);
	    }

	    if(uu.isFunction(func)) {
		res.end(func(uu.extend(vars || {}, req.session, res.locals, {uu: uu, us: us})));
	    } else if(uu.isObject(func)) {
		if(req.accepts("json")) {
		    res.type("json");
		    res.end(JSON.stringify(func));
		} else {
		    res.type("txt");
		    res.end(JSON.stringify(func));
		}
	    }
	};
	res.dust = function(template, options) {
	    var shasum = crypto.createHash('sha1');
	    shasum.update(template);
	    var id = shasum.digest("hex");
	    var compiled = dust.compile(template, id);
	    dust.loadSource(compiled);
	    dust.render(id, uu.extend(req.query, req.session, res.locals, options || {}), function(err, out) {
		if(err) {
		    res.error(err);
		} else {
		    res.end(out);
		}
	    });
	};
	res.json = function(json) {
	    if(!res.headersSent) {
		res.writeHead(200);
	    }

	    res.end(JSON.stringify(json));
	};
	res.rss = function(xml) {
	    res.type("application/rss+xml");
	    res.end(xml);
	};
	res.error = function(err) {
	    util.inspect(err);
	    if(!res.headersSent) {
		res.writeHead(500);
	    }

	    if(req.accepts("html")) {
		if(opts && opts.errorPage) {
		    res.render(opts.errorPage, {error: err});
		} else {
		    err = err.toString().replace(/\n/g, "<br/>");
		    res.end("<html><head><title>" + res.statusCode + "</title></head><body><h1>" + res.statusCode + "</h1><p>" + err + "</p></body></html>");
		}
	    } else if(req.accepts("json")) {
		if(uu.isString(err)) {
		    res.json({error: err});
		} else {
		    res.json(err);
		}
	    }
	};
	res.forbid = function(error) {
	    res.writeHead(403);
	    res.error(error || "An attempt was made to access a forbidden route.");
	};
	next();
    };
};

module.exports.howler = function() {
    return function(req, res, next) {
	res.writeHead(404);
	res.error("The requested resource could not be found");
    };
};
