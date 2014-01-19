 var indexPage = require("./index.web.js");

var index = function(req, res) {
    res.dust(indexPage);
};

exports.index = index;