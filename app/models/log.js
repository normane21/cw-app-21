var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Log', new Schema({
    
    datetime: String,	
    user: String
}));

