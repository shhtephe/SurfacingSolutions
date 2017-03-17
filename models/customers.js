var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var customers = new Schema({
	companyName: String,
	addressLine1: String,
	addressLine2: String,
	city: String,
	province: String,
	postal: String,
	businessPhone: String,
	contacts: [{
		firstName: String,
		lastName: String,
		title: String,
		phone: String,
		email: String
	}],
	custCode: Number,
	rep: String
});

customers.plugin(timestamps);
module.exports = mongoose.model('customers', customers);