var uu = require("underscore");
var us = require("underscore.string");

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
		    res.end(JSON.stringify(json));
		} else {
		    res.type("txt");
		    res.end(JSON.stringify(json));
		}
	    }
	};
	res.json = function(json) {
	    if(!res.headersSent) {
		res.writeHead(200);
	    }

	    res.end(JSON.stringify(json));
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
