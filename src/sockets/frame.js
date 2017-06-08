'use strict';
/**
 * include config
 */
const paths      = require("../../config/paths");
const config     = require(paths.config + "config");
const define     = require(paths.config + 'define');
const controller = require(paths.controllers + 'controller');
const strings    = require(paths.utils + 'strings');

exports.processCustommers = function(users, single) {
	if (single) {
		var data                 = {};
		data._id                 = users._id;
		data.role                = users.role;
		data.phone               = users.phone;
		data.email               = users.email;
		data.first_name          = users.first_name;
		data.last_name           = users.last_name;
		data.user_name           = users.user_name;
		data.support             = users.support;

		data.total_mesage        = users.total_mesage;
		data.time_update_message = users.time_update_message;
		
		var full_name            = ((users.first_name ? users.first_name : '') + ' ' + users.last_name).trim();
		
		data.full_name           = full_name;
		data.color               = strings.getColorFullName(full_name);
		data.sub_name            = strings.subName(full_name.trim());
		data.timesteamp          = controller.convertDateToTimesteamp(users.time_update_message);
		data.created             = controller.getConvertDate(users.time_update_message);
		
		return data;
	} else {
		var datas = new Array();
		for (var i = 0; i < users.length; i++) {
			datas[i] = this.processCustommers(users[i], true);
		}
		return datas;
	}
};

var listMessage    = false;
var userIdFromOld  = 0;
var keyOld         = false;
var timeOld        = 0;
var countDuplicate = 0;

exports.processMessages = function(messages, single) {
	if (single) {
		if (listMessage) {
			var timeCurrent = controller.formatDate(messages.created, 'HH:MM');

			if (messages.type_sent == define.CHATBOT) {
				var userIdToCurrent = messages.to._id;
			} else {
				var userIdToCurrent = messages.from._id;
			}
			
			var condition = listMessage && timeCurrent == timeOld && userIdToCurrent == userIdFromOld && countDuplicate > 0;
			if (condition){
				return messages.message;
			}
		}

		var data = {};
		data._id             = messages._id;
		data.type            = messages.type;
		data.read            = messages.read;
		data.message         = messages.message;
		data.type_sent       = messages.type_sent;
		data.created         = controller.getConvertDate(messages.created);

		if (messages.from) {
			var from      = messages.from;
			var full_name = ((from.first_name ? from.first_name : '') + ' ' + from.last_name).trim();
			data.from            = {};
			data.from.role       = from.role;
			data.from.email      = from.email;
			data.from.last_name  = from.last_name;
			data.from.first_name = from.first_name;
			data.from.phone      = from.phone;
			data.from._id        = from._id;
			data.from.full_name  = full_name;
			data.from.color      = strings.getColorFullName(full_name);
			data.from.sub_name   = strings.subName(full_name.trim());
		}

		if (messages.to) {
			var to = messages.to;
			var full_name = ((to.first_name ? to.first_name : '') + ' ' + to.last_name).trim();

			data.to            = {}
			data.to.email      = to.email;
			data.to.last_name  = to.last_name;
			data.to.first_name = to.first_name;
			data.to.phone      = to.phone;
			data.to._id        = to._id;
			data.to.full_name  = full_name;
			data.to.color      = strings.getColorFullName(full_name);
			data.to.sub_name   = strings.subName(full_name.trim());
		}

		return data;
	} else {
		listMessage = true;
		var datas = new Array();
		for (var i = 0; i < messages.length; i++) {
			var message  = messages[i];
			var time     = controller.formatDate(message.created, 'HH:MM');
			var userIdTo = '';

			if (message.type_sent == define.CHATBOT) { userIdTo = message.to._id; }
			else { userIdTo = message.from._id; }
			

			if (userIdTo == userIdFromOld && time == timeOld) {
				countDuplicate++;
			} else {
				countDuplicate = 0;
				keyOld         = i;

				if (message.type_sent == define.CHATBOT) { userIdFromOld = message.to._id; }
				else { userIdFromOld = message.from._id; }

				timeOld        = controller.formatDate(message.created, 'HH:MM');
			}
			message = this.processMessages(message, true);
			if (typeof message !== 'object'){
				var mgsOld = datas[keyOld].message;
				var messageNew = datas[keyOld];
				if (Array.isArray(mgsOld)) {
					messageNew.message.push(message);
				} else {
					messageNew.message = new Array();
					messageNew.message.push(mgsOld);
					messageNew.message.push(message);
				}
				datas[keyOld] = messageNew;
			} else {
				datas[i] = message;
			}
		}
		return datas;
	}
};