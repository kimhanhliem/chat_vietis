const paths      = require("../../config/paths");
const config     = require(paths.config + 'config');
const define     = require(paths.config + 'define');
const controller = require(paths.controllers + 'controller');
const locutus    = require('locutus').php;
const mongoose   = require('mongoose');
const chatsModel = require(paths.models + 'chats');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    user_name: String,
    first_name:String,
    last_name: String,
    email: String,
    phone: String,
    password:String,
    role:Number, // 1: admin, 2: User Thường, 3: Khách hàng
    support: { type: Schema.Types.ObjectId, ref: 'users' },
    total_mesage: {user: {type: Number, default: 0}, custommer: {type: Number, default: 0}},
    time_update_message: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now }
});

mongoose.model('users', userSchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}

var usersTable = new this.Schema("users").model;

exports.validateAdd = function (data) {
	var schema = {
		'user_name': {
			notEmpty: true,
			isUsernameAvailable: {
				errorMessage: 'Username already in use',
			},
			matches: {
				options: [/^[a-z0-9_-]{4,20}$/, 'i'],
				errorMessage: 'Username phải là chữ thường và số, độ dài từ 4 đến 20 ký tự',
			},
			errorMessage: 'Username không được để trống',
		},
		'first_name' : {
			notEmpty: true,
			errorMessage: 'first_name không được để trống',
		},
		'last_name': {
			notEmpty: true,
			errorMessage: 'last_name không được để trống',
		},
		'email': {
			notEmpty: true,
			optional: {
				options: { checkFalsy: true }
			},
			isEmailAvailable: {
				errorMessage: 'Email already in use',
			},
			isEmail: {
				errorMessage: 'Lỗi định dạng email',
			},
			errorMessage: 'Email không được để trống',
		},
		'phone': {
			notEmpty: true,
			isPhoneAvailable: {
				errorMessage: 'Phone already in use',
			},
			errorMessage: 'phone không được để trống',
		},
		'password': {
			notEmpty: true,
			isLength: {
				options: [{min: 4, max: 30}],
				errorMessage: 'Mật khẩu phải từ 4 đến 30 ký tự',
			},
			errorMessage: 'password không được để trống',
		},
		're_password': {
			notEmpty: true,
			equals: {
				options: data.password,
				errorMessage: 'Mật khẩu nhập lại không đúng',
			},
			errorMessage: 're_password không được để trống',
		},
		'role': {
			notEmpty: true,
			equals: {
				options: ['1', '2'],
				errorMessage: 'Giá trị của role không đúng',
			},
			errorMessage: 'role không được để trống',
		}
	};

	return schema;
};

exports.validateEdit = function (data, user) {
	var schema = {
		'user_name': {
			notEmpty: true,
			isUsernameAvailable: {
				options: user.id,
				errorMessage: 'Username already in use',
			},
			matches: {
				options: [/^[a-z0-9_-]{4,20}$/, 'i'],
				errorMessage: 'Username phải là chữ thường và số, độ dài từ 4 đến 20 ký tự',
			},
			errorMessage: 'Username không được để trống',
		},
		'first_name' : {
			notEmpty: true,
			errorMessage: 'first_name không được để trống',
		},
		'last_name': {
			notEmpty: true,
			errorMessage: 'last_name không được để trống',
		},
		'email': {
			notEmpty: true,
			optional: {
				options: { checkFalsy: true }
			},
			isEmailAvailable: {
				options: user.id,
				errorMessage: 'Email already in use',
			},
			isEmail: {
				errorMessage: 'Lỗi định dạng email',
			},
			errorMessage: 'Email không được để trống',
		},
		'phone': {
			notEmpty: true,
			isPhoneAvailable: {
				options: user.id,
				errorMessage: 'Phone already in use',
			},
			errorMessage: 'phone không được để trống',
		},
		'role': {
			notEmpty: true,
			equals: {
				options: ['1', '2'],
				errorMessage: 'Giá trị của role không đúng',
			},
			errorMessage: 'role không được để trống',
		}
	};

	return schema;
};


exports.validatechangePassword = function (data, user) {
	var schema = {
		'current_password': {
			notEmpty: true,
			isCurrentPassword: {
				options: user.id,
				errorMessage: 'Current password không đúng',
			},
			errorMessage: 'Current password không được để trống',
		},
		'password': {
			notEmpty: true,
			isLength: {
				options: [{min: 4, max: 30}],
				errorMessage: 'Mật khẩu phải từ 4 đến 30 ký tự',
			},
			errorMessage: 'password không được để trống',
		},
		're_password': {
			notEmpty: true,
			equals: {
				options: data.password,
				errorMessage: 'Mật khẩu nhập lại không đúng',
			},
			errorMessage: 're_password không được để trống',
		}
	};
	
	return schema;
};


exports.processDataUser = function(users, single){
	if (single){
		var roles = define.ROLES;
		var data        = {};
		data.id         = users._id;
		data.user_name  = users.user_name;
		data.first_name = users.first_name;
		data.last_name  = users.last_name;
		data.email      = users.email;
		data.phone      = users.phone;
		data.password   = users.password;
		data.role       = users.role;
		data.role_name  = locutus.array.array_search(users.role, roles);
		data.created    = controller.formatDate(users.created);
		return data;
	} else {
		var datas = new Array();
		for (var i = 0; i < users.length; i++) {
			datas[i] = this.processDataUser(users[i], true);
		}
		return datas;
	}
}

exports.getCustommerLists = function(condition, order, page, limit, callback) {
	var limit = limit ? limit : define.LIMIT;
	var offset = limit * page;
	var order = (order ? order : {time_update_message: -1});

	condition.role = define.ROLE_3;
	usersTable.find(condition)
		.sort(order)
		.skip (offset)
		.limit(limit)
		.exec(callback);
}

exports.getUsersLists = function(condition, order, page, limit, callback) {
	var limit = limit ? limit : define.LIMIT;
	var offset = limit * page;
	var order = (order ? order : {created: -1});
	
	usersTable.find(condition)
		.sort(order)
		.skip (offset)
		.limit(limit)
		.exec(callback);
}

exports.getUser = function(id, callback) {
	usersTable.findOne({_id: id})
		.populate('support', define.POPULATE_SELECT_SUPPORT)
		.exec(callback);
}

exports.updateTotalMessageNew = function(id, type, callback) {
	this.getUser(id, function(err, user){
		if (user) {
			user.time_update_message = new Date();
			var typeCount = '';
			if (type == define.CUSTOMMER) {
				typeCount = define.SUPPORT;
			} else if (type == define.SUPPORT) {
				typeCount = define.CUSTOMMER;
			}
			chatsModel.getCountMessageNew(user._id, {}, typeCount, function(error, count){
				if (type == define.CUSTOMMER) {
					user.total_mesage.custommer = count;
				} else if (type == define.SUPPORT) {
					user.total_mesage.user = count;
				}
				user.save(callback);
			});
		}
	});
}

