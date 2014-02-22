var index = require("./index.dust");
var codr = require("./codr.dust");

module.exports.index = function(req, res) {
    res.dust(index);
};

module.exports.codr = function(req, res) {
    res.dust(codr);
};
