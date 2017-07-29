var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('AdminUser', new Schema({
    username: String, 
    password: String,
    initial_password: String
}));

