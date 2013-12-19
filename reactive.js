var uu = require("underscore");
var us = require("underscore.string");

module.exports.intercept = function() {
    return function(req, res, next) {
	res.render = function(func, vars) {
	    res.writeHead(200);
	    res.end(func(uu.extend(vars || {}, req.session, res.locals, {uu: uu, us: us})));
	};
	res.error = function(error) {
	    res.writeHead(501);
	    res.end(error);
	};
	res.forbid = function(error) {
	    res.writeHead(403);
	    res.end(error || "An attempt was made to access a forbidden route.");
	};
	res.json = function(json) {
	    res.writeHead(200);
	    res.end(JSON.stringify(json));
	};
	next();
    };
};
