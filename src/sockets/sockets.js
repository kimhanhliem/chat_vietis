'use strict';

/**
 * Module dependencies.
 */


/**
 * include config
 */
const paths      = require("../../config/paths");
const config     = require(paths.config + "config");

exports.getSessionSupport = function(socket){
	var user = socket.handshake.session.passport.user;
	return (user) ? user : false;
}

exports.getSessionCustommer = function(socket){
	var userchat = socket.handshake.session.userchat
	return (userchat) ? userchat : false;
}

exports.setSessionCustommer = function(socket, data){
	socket.handshake.session.userchat = data;
	socket.handshake.session.save();
}