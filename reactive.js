var uu = require("underscore");
var us = require("underscore.string");

module.exports.intercept = function() {
    return function(req, res, next) {
	res.render = function(func, vars) {
	    res.writeHead(200);
	    res.end(func(uu.extend(vars || {}, req.session, res.locals, { uu: uu, us: us})));
	};
	res.error = function(error) {
	    res.writeHead(501);
	    res.end(error);
	};
	res.json = function(json) {
	    res.writeHead(200);
	    res.end(JSON.stringify(json));
	};
	next();
    };
};
