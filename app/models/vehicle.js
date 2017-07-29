var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Vehicle', new Schema({
	auth_key: String,
	
	plateno: String,
	brand: String,
	model: String,
	year_model: String,
	transmission: String,
	color_engine_fuel: String,
	acquisition_date: String,
	company: String,
	custodian: String,
	department: String,
	registered_owner: String,
	previous_assignee: String,
	remarks: String,
	actual_mileage: String,
	renewal: String,
    datecreated: String
}));

