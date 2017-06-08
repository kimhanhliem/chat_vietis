'use strict';
/**
 * include config
 */
 
const paths         = require("../../paths");
const LocalStrategy = require('passport-local').Strategy;
const crypt         = require(paths.utils + 'crypt');
const usersModel    = require(paths.models + 'users');
const usersTable    = new usersModel.Schema("users").model;

module.exports = new LocalStrategy({
    usernameField: 'user_name',
    passwordField: 'password',
}, function(username, password, done){
    password = crypt.sha1(password);
	usersTable.findOne({'user_name': username, 'password' : password}, function(err, user) {
		if (err) { return done(err); }
		if (!user) return done(null, false);
		return done(null, user);
	});
});