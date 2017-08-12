var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Officer', new Schema({
	level: Number,
	department: String,	
	emp_name1: String,
	position1: String,
	mobile1: String,
	landline1: String,
	email1: String,
	emp_name2: String,
	position2: String,
	mobile2: String,
	landline2: String,
	email2: String,
	date_created: String
}));

