var locutus = require('locutus');

const paths    = require("../config/paths");
const config   = require(paths.config + 'config');
const define   = require(paths.config + 'define');

exports.getColorFullName = function(fullName){
	var hash = 7;
	for (var i = 0; i < fullName.length; i++) {
		hash = fullName.charCodeAt(i) + (hash << 5) - hash;
	}
	var index = Math.abs(hash % define.COLORS.length);
	return define.COLORS[index];
}

exports.subName = function(str){
   return str.substr(0, 1);;
}