var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('AppUser', new Schema({
    uuid: String,	
    username: String, 
    password: String
}));

