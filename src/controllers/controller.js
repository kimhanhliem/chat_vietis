'use strict';
/**
 * include config
 */
 
const paths      = require("../../config/paths");
const config     = require(paths.config + 'config');
const define     = require(paths.config + 'define');
const dateFormat = require('dateformat');

exports.response = function(req, res, next){
	var response = {
		'title': config.site_name,
		'focus': false,
		'user_login': {},
		'status': 0,
		'message': '',
		'data': {},
		'errors': {},
		'view_path': '',
		'body_class': '',
		'define': define,
	};

	if (req.isAuthenticated()) {
		response.user_login = req.user;
	}
	
	return response;
}

exports.responseAPI = function(req, res, next){
	var response = {
		'focus': false,
		'status': 0,
		'message': '',
		'data': {},
		'errors': {},
	};
	
	return response;
}

exports.responseSocket = function(){
	
	var response = {
		'focus': false,
		'status': 0,
		'message': '',
		'data': {},
		'errors': {},
	};

	return response;
}

exports.formatDate = function(date, format){
	return dateFormat(date, (format ? format : 'yyyy-mm-dd'));
}

exports.convertDateToTimesteamp = function(date){
	return new Date(date).getTime();
}

exports.getConvertDate = function(date){
	if (date) {
		var hour  = 3600;
		var day   = 86400;
		var week  = 604800;
		var month = 2629743;
		var year  = 31556926;
		var minisecond = 1000;

		var timeConvert = new Date(date);
		var timeCurrent = new Date();

		var timeTemaining = (timeCurrent - timeConvert) / minisecond;
		var timeReturn;

		if (timeTemaining < day) {
			timeReturn = dateFormat(date, 'HH:MM');
		} else {
			timeReturn = dateFormat(date, 'dd/mm/yy');
		}
		return timeReturn;
	} else {
		return '';
	}
}

