var http = require("http");
var url = require("url");
var requestHandlers = require("./zoRequestHandlers");
var exceptions = require("./exceptions/zoExceptions");

var handle = {};
handle["/"] = requestHandlers.home;
handle["/index"] = requestHandlers.home;


var zoService = {
	/** INIT zoServices **/
	run: function(handle) {
			function onRequest(request, response) {
				var postData = "";
				var pathname = url.parse(request.url).pathname;
				console.log("Request for " + pathname + " received.");

				request.setEncoding("utf8");

				request.addListener("data", function(postDataChunk) {
					postData += postDataChunk;
					console.log("Received POST data chunk '"+
					postDataChunk + "'.");
				});

				request.addListener("end", function() {
					zoService.route(handle, pathname, response, postData);
				});
			}

			http.createServer(onRequest).listen(8888);
			console.log("Server has started.");
	},

	/** Route Table handle **/
	route: function(handle, pathname, response, postData) {
  			response.writeHead(200, {
				    "Content-Type": "application/json",
				    "Expires": "Mon, 26 Jul 1997 05:00:00 GMT",
				    "Cache-Control":"no-cache, must-revalidate"
			});
  			try{
  				if (typeof handle[pathname] === 'function') {
		    		handle[pathname](response, postData);
			  	} else {
			    	throw new exceptions.RPC_NOT_FOUND_DATA();
	  			}
  			}
  			catch(err){
	  			
	  			response.writeHead(404, {
					    "Content-Type": "application/json",
					    "Expires": "Mon, 26 Jul 1997 05:00:00 GMT",
					    "Cache-Control":"no-cache, must-revalidate"
				});
				if ( !(err instanceof exceptions.RPC_INVALID_REQUEST || err instanceof exceptions.RPC_METHOD_NOT_FOUND ||
					err instanceof exceptions.RPC_INVALID_PARAMS || err instanceof exceptions.RPC_CLASS_NOT_FOUND ||
					err instanceof exceptions.RPC_NOT_FOUND_DATA)){
						console.log(err);
						err = new exceptions.RPC_INTERNAL_ERROR
					}
				response.write(JSON.stringify(err));
				response.end();
  			}
  			
	}
};

zoService.run(handle);


