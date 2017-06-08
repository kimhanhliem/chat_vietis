'use strict';
/**
 * include config
 */
const paths      = require("../paths");
const local      = require(paths.config_passport + "local");
const usersModel = require(paths.models + 'users');
const usersTable = new usersModel.Schema("users").model;

module.exports = function (passport) {
	passport.serializeUser(function(user, done){
		done(null, user);
	});

	passport.deserializeUser(function(id, done){
		usersTable.findById(id, function(err, user) {
			done(err, user);
		});
	});

    passport.use('local', local);
};
