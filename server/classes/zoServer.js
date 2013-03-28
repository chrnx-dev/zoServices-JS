var exceptions = require("../exceptions/zoExceptions");
var u = require("underscore");

(function($){
	var Server = function(settings){
		
		settings = settings || {};
		var self = {}
		self.response = {};
		u.extend(self, settings);
		
		self.Config = new require("./zoConfig").config();
		
		self.process = function(sRequest, Response){
			
			try{
				oRequest = JSON.parse(sRequest);
			}catch (Err){
				throw new exceptions.RPC_INVALID_REQUEST;
			}
			
			if (oRequest instanceof Array){
				self.Config.isBatch = true;
			}
			
			var response = new require("./zoResponses").response(oRequest,self.Config);
			response.getResponse();
		}
		return self;
	}
	$.server = Server;
}(typeof window === 'undefined' ? exports:window));
