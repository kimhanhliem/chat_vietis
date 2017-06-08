/* limit item */
exports.LIMIT = 100;

/* table users */
exports.ROLE_1 = 1;
exports.ROLE_2 = 2;
exports.ROLE_3 = 3;
exports.ROLES  = {
	'Administrator': this.ROLE_1,
	'Thành viên': this.ROLE_2,
	'Khách hàng': this.ROLE_3,
};

/* table chats */
exports.CUSTOMMER = 'custommer';
exports.SUPPORT   = 'support';
exports.CHATBOT   = 'chatbot';

/* COLORS */
exports.COLORS = [
	'#e21400', '#91580f', '#f8a700', '#f78b00',
	'#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
	'#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

/* populate select */

exports.POPULATE_SELECT_CHATS = 'user_name first_name last_name email phone support total_mesage time_update_message';
exports.POPULATE_SELECT_SUPPORT = 'user_name first_name last_name email phone support total_mesage time_update_message';


/* THÔNG TIN CẤU HÌNH WATSON */
exports.WATSON_CONVERSATION = {
	username: "86b7499c-8720-41d3-b815-96ece84596bb",
	password: "rvOOfMnFvzZ6",
	version: "v1",
	version_date: "2017-02-03",
	workspace_id: "19c559d4-2c82-48e2-98ad-215005fe93af"
};