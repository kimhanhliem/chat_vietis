"use strict";
const paths      = require("../../config/paths");
const config     = require(paths.config + 'config');
const define     = require(paths.config + 'define');
const controller = require(paths.controllers + 'controller');
const dateFormat = require('dateformat');
const strings    = require(paths.utils + 'strings');
const frame      = require(paths.sockets + 'frame');

const chatsModel      = require(paths.models + 'chats');
const chatsTable      = new chatsModel.Schema("chats").model;
const usersModel = require(paths.models + 'users');
const usersTable = new usersModel.Schema("users").model;


exports.test = function (req, res, next) {
	var response       = controller.response(req, res, next);
	response.view_path = './chats/test';
	response.title     = 'Chat';
    res.render(response.view_path, response);
};

exports.index = function (req, res, next) {
	var response              = controller.response(req, res, next);
	var custommerId           = req.params.id;
	response.view_path        = './chats/index';
	response.title            = 'Chat';
	response.custommerId      = custommerId;
	response.listCustommers   =  new Array();
	response.listMessages     =  new Array();
	response.custommerCurrent =  new Array();
	
	if (custommerId) {
		usersModel.getCustommerLists({}, false, 0, false, function(err, listCustommers){
			chatsModel.getListMessages(custommerId, {}, false, 0, false, function(err, listMessages){
				usersModel.getUser(custommerId, function(err, custommerCurrent){
					response.listCustommers = frame.processCustommers(listCustommers);
					response.listMessages = frame.processMessages(listMessages);
					response.custommerCurrent = frame.processCustommers(custommerCurrent, true);
			   		res.render(response.view_path, response);
				});
			});
		});
	} else {
		usersModel.getCustommerLists({}, {created: -1}, 0, 1, function(err, custommerCurrent){
			if (custommerCurrent.length) return res.redirect('/chats/index/' + custommerCurrent[0]._id);
			res.render(response.view_path, response);
		});
	}
};

exports.frame = function (req, res, next) {
	var response          = controller.response(req, res, next);
	var custommer         = req.session.userchat;
	response.view_path    = './chats/frame';
	response.title        = 'Chat';
	response.layout       = 'layout/page';
	response.body_class   = 'chat_frame';
	response.resize_frame = 'maximize';
	response.custommer    = (custommer ? custommer : false);
	response.listMessages = false;
	if(req.session.chatsFrame) { response.resize_frame = req.session.chatsFrame.resize; }

	if (custommer) {
		var custommerId = custommer._id;
		chatsModel.getListMessages(custommerId, {}, false, 0, false, function(err, listMessages){
			response.listMessages = frame.processMessages(listMessages);
			res.render(response.view_path, response);
		});
	} else {
		res.render(response.view_path, response);
	}
};