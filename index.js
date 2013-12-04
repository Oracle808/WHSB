/*
var CS = require("./Streams.js").CS;
var FS = require("./Streams.js").FS;
var OS = require("./Streams.js").OS;
/*
console.log(CS);
console.log(FS);

var fileList = FS.ls("./sass");

CS.toString(CS.map(fileList, function(val, i) {
	return "./sass/" + val;
})).pipe(process.stdout);

fileList.on("end", function() {
	console.log("fsd");
});

// A Better Way of Working with Streams
var Stream = FS.cat("./sass/main.scss");
var Output = CS.tail(CS.each(CS.each(Stream, CS.toString), CS.toUpperCase), 10);

Output.pipe(process.stdout);



var Book = OS.Class.extend({
	defaults: {
		Author: "J.K Rowling"
	},
	schema: {
		Title: String
	}
});

var StoneOfPhilosopher = new Book({Title: 435534});
console.log(typeof StoneOfPhilosopher.get("Title"));

var mongodb = require("mongodb"), format = require('util').format;    

mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
	if(err) throw err;

	var collection = db.collection('users');

	// Streams let you work efficently with Dbs
	CS.each(collection.find(), function(val) {
		console.log(val);
	}).on("end", function() {
		db.close();
	});
});
*/

var DS = require("./scripts/Streams.common.js").DS;

new DS.mongoDb("mongodb://127.0.0.1:27017/test", function() {
    console.log("fsddf");
});
