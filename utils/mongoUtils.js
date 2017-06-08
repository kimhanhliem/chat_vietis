const paths    = require("../config/paths");
const config   = require(paths.config + 'config');
const mongoose = require('mongoose');
var admin      = mongoose.mongo.Admin;

exports.connect = function(callback) {
	mongoose.connect(config.db);
}

exports.mongoObj = function(){
	return mongoose;	
}

// create a connection to the DB
exports.createConnection=function(callback, returnFunc){
    var connection = mongoose.createConnection(config.db);

    connection.on('open', function() {
		callback(connection, admin, returnFunc);
	});
}