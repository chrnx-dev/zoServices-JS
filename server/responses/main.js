var exceptions = require("../exceptions/zoExceptions");
var u = require("underscore");

(function($){
	var main = function(settings){
		
		settings = settings || {};
		var self = {}
		self.response = {};
		u.extend(self, settings);
		
		
		
		self.hola = function(){
			return 'hola mundo';
		}
		
		self.algo = function(){
			for (i=0; i<5000; i++) setTimeout(function(){},1);
			
		}
		return self;
	}
	$.main = main;
}(typeof window === 'undefined' ? exports:window));
