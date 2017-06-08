const paths      = require("../../config/paths");
const config     = require(paths.config + 'config');
const define     = require(paths.config + 'define');
const controller = require(paths.controllers + 'controller');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatSchema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'users' },
    to: { type: Schema.Types.ObjectId, ref: 'users' },
    type_sent: String, // custommer: Khách hàng chát, support: Thành viên support
    message: String,
    data: String,
    created: { type: Date, default: Date.now },
    read: Number,
    type: String,
});

mongoose.model('chats', chatSchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}

var chatsModel = new this.Schema("chats").model;

exports.getListMessages = function(user_id, condition, order, page, limit, callback) {
	var limit = limit ? limit : define.LIMIT;
	var offset = limit * page;
	var order = (order ? order : {created: 1});
	condition.$or = [ { 'to': user_id }, { 'from': user_id } ];
	chatsModel.find(condition)
		.sort(order)
		.skip (offset)
		.populate('to', define.POPULATE_SELECT_CHATS)
		.populate('from', define.POPULATE_SELECT_CHATS)
		.limit(limit)
		.exec(callback);
}

exports.getCountMessageNew = function(custommer_id, conditions, type, callback){
	var error_status = 0;
	conditions.read = 0;

	if (type == define.CUSTOMMER) {
		conditions.from = custommer_id;
	} else if (type == define.SUPPORT) {
		conditions.to = custommer_id;
	} else {
		error_status = 1;
	}
	if (error_status == 0) {
		chatsModel.count(conditions).exec(callback);
	}
}

exports.updateIsSeem = function(custommer_id, conditions, type, callback){
	/*var error_status = 0;
	conditions.read = 0;
	if (type == define.CUSTOMMER) {
		conditions.from = custommer_id;
	} else if (type == define.SUPPORT) {
		conditions.to = custommer_id;
	} else {
		error_status = 1;
	}

	if (error_status == 0) {
		// chatsModel.count(conditions).exec(callback);
	}*/
}