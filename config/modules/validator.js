'use strict';

/**
 * include config
 */
const paths      = require("../paths");
const config     = require(paths.config + "config");
const define     = require(paths.config + 'define');
const usersModel = require(paths.models + 'users');
const usersTable = new usersModel.Schema("users").model;
const crypt      = require(paths.utils + 'crypt');

/**
 * Expose
 */
 module.exports = function () {
 	var customValidate = {
 		customValidators: {
 			isUsernameAvailable: function(value, id) {
 				var boolean = new Promise(function(resolve, reject) {
 					var condition = {user_name: value};
 					if (id != null) condition._id = {$ne: id};
 					usersTable.findOne(condition, function(err, results) {
 						if (err) return reject();
 						if (results){
	                        return reject();
	                    } else {
	                    	return resolve();
	                    }
 					});
 				});
 				return boolean;
 			},
 			isEmailAvailable: function(value, id) {
 				var boolean = new Promise(function(resolve, reject) {
 					var condition = {email: value};
 					condition.role = {$ne: define.ROLE_3};
 					if (id != null) condition._id = {$ne: id};
 					usersTable.findOne(condition, function(err, results) {
 						if (err) return reject();
 						if (results){
	                        return reject();
	                    } else {
	                    	return resolve();
	                    }
 					});
 				});
 				return boolean;
 			},
 			isPhoneAvailable: function(value, id) {
 				var boolean = new Promise(function(resolve, reject) {
 					var condition = {phone: value};
 					condition.role = {$ne: define.ROLE_3};
 					if (id != null) condition._id = {$ne: id};
 					usersTable.findOne(condition, function(err, results) {
 						if (err) return reject();
 						if (results){
	                        return reject();
	                    } else {
	                    	return resolve();
	                    }
 					});
 				});
 				return boolean;
 			},
 			isCurrentPassword: function(value, id) {
 				var boolean = new Promise(function(resolve, reject) {
 					console.log(value);
 					var condition = {'password': crypt.sha1(value)};
 					condition._id = id;
 					
 					usersTable.findOne(condition, function(err, results) {
 						console.log(err);
 						if (err) return reject();
 						console.log(results);
 						if (results){
	                        return resolve();
	                    } else {
	                    	return reject();
	                    }
 					});
 				});
 				return boolean;
 			},
 		},
 	};
 	return customValidate;
 }