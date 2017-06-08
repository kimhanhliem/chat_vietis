'use strict';
/**
 * Module dependencies.
 */


/**
 * include config
 */
const paths      = require("../paths");
const config     = require(paths.config + "config");
const mongoUtils = require(paths.utils + "mongoUtils");

/**
 * Expose
 */
module.exports = function (app, passport) {
    // connect mongodb
	mongoUtils.connect(function(error){
	    if (error) throw error;
	    console.log("Database created!");
	});

	app.on('close', function(errno) {
		mongoUtils.disconnect(function(err) { });
	});
};
