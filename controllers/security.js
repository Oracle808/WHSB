exports.auth = function(req, res, next) {
    if(req.session.user) {
	res.locals.user = req.session.user;
	next();
    } else {
	res.redirect("/login?redirect=" + encodeURIComponent(req.path));
    }
};

exports.teacher = function(req, res, next) {
    if(req.session.user.role === "teacher" || req.session.user.role === "admin") {
	next();
    } else {
	res.forbid("An attempt was made to access a route restricted to staff.");
    }
};

exports.admin = function(req, res, next) {
    if(req.session.user.role === "admin") {
	next();
    } else {
	res.forbid("An attempt was made to access a route prohibited to all but administrators.");
    }
};

exports.logout = function(req, res) {
    delete req.session.user;
    res.redirect("/login");
};
