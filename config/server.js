'use strict';
/**
 * Module dependencies.
 */
const http = require('http');

/**
 * include config
 */
const paths      = require("./paths");
const config     = require(paths.config + "config");

/**
 * Expose
 */
module.exports = function (app, passport) {
    var server = http.createServer(app);
	server.listen(app.get('port'), function(){
		var host = server.address().address; // get host
		var port = server.address().port; // get Port
		console.log("Express server listening on port " + app.get('port'));
	});
	return server;
};
