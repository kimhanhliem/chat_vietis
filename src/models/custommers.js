var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var custommerSchema = new Schema({
    full_name: String,
    email: String,
    phone: String,
    website: String,
    address: String,
    status: { type: Number, default: 0 }, // 0: chưa có ai support, 1: Đã có người support
    created: { type: Date, default: Date.now }
});

mongoose.model('custommers', custommerSchema);
module.exports.Schema =function (modelName){
    return{model:mongoose.model(modelName)};
}