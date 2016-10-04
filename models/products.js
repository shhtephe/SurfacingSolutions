var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var products = new Schema({
	distributor: String,
	manufacturer: String,
	productType: String,
	description: String,
	itemCode: String,
	price: Number,
	formula: String,
	mandatory: Boolean,
	nonMandatory: Boolean
});

products.plugin(timestamps);
module.exports = mongoose.model('products', products);