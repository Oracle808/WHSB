var mongoose = require('mongoose');

var GridStore = mongoose.mongo.GridStore,
Grid      = mongoose.mongo.Grid,
ObjectID  = mongoose.mongo.BSONPure.ObjectID;

exports.getGridFile = function(id, fn) {
    var db = mongoose.connection.db,
    id = new ObjectID(id),
    store = new GridStore(db, id, "r", {root: 'fs'} );
    store.open(fn);
};

exports.openGridFile = function(name, options, fn) {
    if(typeof options === "function") {
	fn = options;
	options = {};
    }
    var db = mongoose.connection.db,
    options = parse(options);

    new GridStore(db, name, "w", options).open(fn);
};

exports.putGridFile = function(buf, name, options, fn) {
    var db = mongoose.connection.db,
    options = parse(options);
    options.metadata.filename = name;

    new GridStore(db, name, "w", options).open(function(err, file){
	if (err)
	    return fn(err);
	else
	    file.write(buf, true, fn);
	//TODO: Should we gridStore.close() manully??
    });
};

exports.putGridFileByPath = function(path, name, options, fn) {
    var db = mongoose.connection.db,
    options = parse(options);
    options.metadata.filename = name;

    new GridStore(db, name, "w", options).open(function(err, file){
	if (err)
	    return fn(err);
	else
	    file.writeFile(path, fn);
    });
};

exports.deleteGridFile = function(id, fn){
    var db= mongoose.connection.db;
    new GridStore(db, id, 'r', {root: 'fs'}).unlink(function(err, result){
	if (err) {
	    return fn(err);
	}

	return fn(null);
    });
};

function parse(options) {
    var opts = {};
    if (options.length > 0) {
	opts = options[0];
    } else {
	opts = options;
    }

    if (!opts.metadata)
	opts.metadata = {};

    return opts;
}