// Dummy HTTP Server
console.log("Server Initialising");

var http = require("http");

var server = http.createServer(function(req, res) {
    res.end("Thanks for HTTP " + req.method + "ing my server. Bye!");
});

server.listen(process.env.PORT, function() {
    console.log("Server Listening at " + process.env.PORT);
});
