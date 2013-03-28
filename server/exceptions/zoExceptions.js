var u = require("underscore")._;

var getError =  function (oRequest){
		$oResponse = u.omit(oRequest,'method', 'params');
		$this = u.omit(this, 'method', 'params','class','id','jsonrpc');
		$oResponse.error = {};
		u.extend($oResponse.error, $this);
		return $oResponse;
};
/*
getError: function (error) {
		oResponse = {
			jsonrpc : JSON_RPC,
			error 	: {
				code	: error,
				message	: this.e_msg[error]
			},
			id 		: null
		};

*/		

//INVALID REQUEST TO SERVER
(function (global){
	function invalid_request(settings){
			settings = settings || {};
			
			this.code = -32600;
			this.message = 'Malformed or invalid_request';
			this.jsonrpc = "2.0";
	};
	invalid_request.prototype.getError = getError;
	global.RPC_INVALID_REQUEST = invalid_request;
}(typeof window === 'undefined' ? exports:window));

//METHOD NOT FOUND
(function (global){
	function method_not_found(settings){
			settings = settings || {};
			this.code = -32601;
			this.method = settings.method || '';
			this.message = 'Method '+ this.method + ' does not exists.';
			
	};
	method_not_found.prototype.getError = getError;
	global.RPC_METHOD_NOT_FOUND = method_not_found;
}(typeof window === 'undefined' ? exports:window));

//INVALID PARAMS
(function (global){
	function invalid_params(settings){
			settings = settings || {};
			
			this.code = -32602;
			this.message = 'Invalid Params';
			
	};
	invalid_params.prototype.getError = getError;
	global.RPC_INVALID_PARAMS = invalid_params;
}(typeof window === 'undefined' ? exports:window));

//SERVER INTERNAL ERROR
(function (global){
	function internal_error(settings){
			settings = settings || {};
			
			this.code = -32603;
			this.message = 'Server Internal Error';
			
	};
	internal_error.prototype.getError = getError;
	global.RPC_INTERNAL_ERROR = internal_error;
}(typeof window === 'undefined' ? exports:window));


//CLASS NOT FOUND
(function (global){
	function class_not_found(settings){
			settings = settings || {};
			
			this.code = -32603;
			this.class = settings.class || '';
			this.message = 'Class '+ this.class + ' does not exists.';
			
	};
	class_not_found.prototype.getError = getError;
	global.RPC_CLASS_NOT_FOUND = class_not_found;
}(typeof window === 'undefined' ? exports:window));


//CLASS NOT FOUND
(function (global){
	function not_found_data(settings){
			this.code = -32604;
			this.message = 'End Point not found';
			
	};
	not_found_data.prototype.getError = getError;
	global.RPC_NOT_FOUND_DATA = not_found_data;
}(typeof window === 'undefined' ? exports:window));

