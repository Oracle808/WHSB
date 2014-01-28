var uu = require("underscore");
var us = require("underscore.string");
var dust = require("dustjs-linkedin");
var crypto = require('crypto');
var fs = require("fs");

if (require.extensions) {
    require.extensions[".dust"] = function(module, filename) {
	module.exports = fs.readFileSync(filename).toString();
    };
}

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
	    return chunk.write("false");
	}
    }
};

dust.onLoad = function(name, cb) {
    fs.readFile(name, function(err, out) {
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
	res.error = function(error) {
	    if(!res.headersSent) {
		res.writeHead(500);
	    }

	    if(req.accepts("html")) {
		if(opts && opts.errorPage) {
		    res.render(opts.errorPage, {error: error});
		} else {
		    res.end("<html><head><title>" + res.statusCode + "</title></head><body><h1>" + res.statusCode + "</h1><p>" + error.toString() + "</p></body></html>");
		}
	    } else if(req.accepts("json")) {
		if(uu.isString(error)) {
		    res.json({error: error});
		} else {
		    res.json(error);
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