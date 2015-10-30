var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var customerSchema = new Schema({
	firstName: String,
	lastName: String,
	companyName: String,
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

customerSchema.plugin(timestamps);
var Customer = mongoose.model('Customer', customerSchema);

module.exports = {
	Customer: Customer
};