var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var products = new Schema({
	manufacturer: String,
	distributor: String,
	itemCode: String,
	type: String,
	description: String,
	price: String,
	chargeType: String,
	menuType: String,
	dropDown:[{
		name: String,
		product: String,
		price: Number
	}]
});

products.plugin(timestamps);
module.exports = mongoose.model('products', products);