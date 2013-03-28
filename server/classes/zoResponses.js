/**
 * @author Diego Resendez <diego.resendez@zero-oneit.com>
 */
var exceptions = require("../exceptions/zoExceptions");
var u = require("underscore")._;
var Fs = require('fs');

(function ($){
	var response = function( oRequest, config){
		
		var self = {}
		
		self.isNotification = false;
		self.hasError = false;
		self.requestCount = 0;
		self.requestTotal = 0;
		self.response = [];
		
		
		if (oRequest){
			self.oRequest = oRequest 
		}else{
			throw new exceptions.RPC_INTERNAL_ERROR;
		}
		
		if (config){
			self.Config = config 
		}else{
			throw new exceptions.RPC_INTERNAL_ERROR;
		}
		
		self.checkRequest = function(oRequest){
			if 	( typeof(oRequest) != 'object' || (oRequest.jsonrpc == undefined) ||
		    	(oRequest.jsonrpc !== self.Config.JSON_RPC) || (oRequest.method == undefined) ||
		    	(typeof(oRequest.method) != 'string') ||  (oRequest.params == undefined) || 
		    	!(oRequest.params instanceof Array)  || (oRequest.id == undefined) )
		    	 
				return false;
		
			if ( oRequest.params == null )
				oRequest.params = [];
		
			return true;
		}
		
		self.getResponse = function(){
			if (!self.Config.isBatch){
				self.requestCount = 0;
				self.requestTotal = 1;
				if(!self.checkRequest(self.oRequest)) self.fail(new exceptions.RPC_INVALID_REQUEST, self.oRequest);
				self.exec(self.oRequest);	
			} else {
				self.requestCount = 0;
				self.requestTotal = self.oRequest.length;
				
				u.each(self.oRequest, function(oRequest){
					if(!self.checkRequest(oRequest)) self.fail(new exceptions.RPC_INVALID_REQUEST, oRequest);
					self.exec(oRequest);
				});
				
			}
		}
		
		self.fail = function(oErr, oReq){
			if ( !(oErr instanceof exceptions.RPC_INVALID_REQUEST || oErr instanceof exceptions.RPC_METHOD_NOT_FOUND ||
					oErr instanceof exceptions.RPC_INVALID_PARAMS || oErr instanceof exceptions.RPC_CLASS_NOT_FOUND ||
					oErr instanceof exceptions.RPC_NOT_FOUND_DATA)){
					
						oErr = new exceptions.RPC_INTERNAL_ERROR
			}
			
			self.hasError = true;
			self.response.push(oErr.getError(oReq));
			self.requestCount += 1;
			
		}
		
		self.done = function(oResult, oReq){
			$oResponse = u.omit(oReq,'method', 'params');
			$oResponse.result = oResult;
			if ( !u.isEmpty(oResult) || !u.isUndefined(oResult)){
				self.response.push($oResponse);
			}
			self.requestCount += 1;
		}
		
		self.complete = function(){
		
			if (self.requestCount >= self.requestTotal){
				sResponse = self.Config.serverResponse;
				var $response = (self.hasError)?404:200;
				
				sResponse.writeHead($response,{
				    "Content-Type": "application/json",
				    "Expires": "Mon, 26 Jul 1997 05:00:00 GMT",
				    "Cache-Control":"no-cache, must-revalidate"
				});
				if (self.Config.isBatch){
					if ( !u.isEmpty(self.response) ){
						sResponse.write(JSON.stringify(self.response));
						
					}	
				} else{
					sResponse.write(JSON.stringify(self.response[0]));
				}
				
				sResponse.end();
				
				
			}
			else return false;
		}
		
		self.exec = function(oRequest){
			console.log(oRequest);
			aMethod = oRequest.method.split('.');
			oMethod = {};
			
			
			if (aMethod.length == 1){
				oMethod.sClass = self.Config.Default_Class;
				oMethod.sMethod = aMethod[0];
			} else {
				oMethod.sClass = aMethod[0];
				oMethod.sMethod = aMethod[1];
			}
			
			Fs.exists(self.Config.actualPath+ self.Config.responses_dir + oMethod.sClass + '.js', function(isExists){
				var $responseClass= null;
				
				
				aMethod = oRequest.method.split('.');
				if (aMethod.length == 1){
					oMethod.sClass = self.Config.Default_Class;
					oMethod.sMethod = aMethod[0];
				} else {
					oMethod.sClass = aMethod[0];
					oMethod.sMethod = aMethod[1];
				}
				
				try{				
					if (!isExists){
						throw new exceptions.RPC_CLASS_NOT_FOUND({class: oMethod.sClass});
					}else{
						
						$responseClass = require(self.Config.actualPath+ self.Config.responses_dir + oMethod.sClass);
						if (u.isNull($responseClass) || u.isUndefined(oMethod.sClass)) throw new exceptions.RPC_CLASS_NOT_FOUND({class: oMethod.sClass, id:oRequest.id});
						
						$responseClass = new $responseClass[oMethod.sClass];
						
					}
					
					if (u.isUndefined($responseClass[oMethod.sMethod])) throw new exceptions.RPC_METHOD_NOT_FOUND({method: oMethod.sMethod});
					
					self.done($responseClass[oMethod.sMethod](oRequest.params), oRequest);
				}catch(err){
					
					self.fail(err, oRequest);
				}
				
				
				
				self.complete();
			});
		}
		return self;
	}
	$.response = response;
}(typeof window === 'undefined' ? exports:window));

