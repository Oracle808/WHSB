var index = require("../views/apps.dust");
var codr = require("../views/codr.dust");

module.exports.index = function(req, res) {
    res.dust(index);
};

module.exports.codr = function(req, res) {
    res.dust(codr);
};
