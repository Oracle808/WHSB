var indexPage = require("./index.dust");

var index = function(req, res) {
    res.dust(indexPage);
};

exports.index = index;