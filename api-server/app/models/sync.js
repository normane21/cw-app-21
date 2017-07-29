var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Sync', new Schema({
	app_id: String,	
	status: Number
}));

