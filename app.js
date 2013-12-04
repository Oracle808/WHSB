var CS = require("./Streams.js").CS;
var FS = require("./Streams.js").FS;
var OS = require("./Streams.js").OS;
var TS = require("./Streams.js").TS;

var Stream = TS.get("http://127.0.0.1:5984");
Stream.pipe(process.stdout);

Stream.on("error", function(err) {
    console.log(err);
});
