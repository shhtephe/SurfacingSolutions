var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var customers = new Schema({
	firstName: String,
	lastName: String,
	companyName: String,
	email: String,
	addressLine1: String,
	addressLine2: String,
	city: String,
	postal: String,
	province: String,
	mainPhone: String,
	mobilePhone: String,
	custCode: Number,
	rep: String
});

customers.plugin(timestamps);
module.exports = mongoose.model('customers', customers);