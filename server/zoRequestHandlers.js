var exceptions = require("./exceptions/zoExceptions");
var cServer = require("./classes/zoServer").server;

var display_404 = function(response,pathname){
	console.log("No request handler found for " + pathname);
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not found");
    response.end();
};

var index = function(response, postData){
			server = new cServer;
			server.Config.serverResponse = response;
			server.process(postData, response);	
}

exports.home = index;
exports.e_404 = display_404;