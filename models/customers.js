var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var customers = new Schema({
	firstName: String,
	lastName: String,
	company: String,
	email: String,
	addressLine1: String,
	addressLine2: String,
	city: String,
	postal: String,
	province: String,
	homePhone: String,
	mobilePhone: String,
	custCode: Number
});


module.exports = mongoose.model('customers', customers);