var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var products = new Schema({
	category: String,
	id: Number,
	name: String,
	product: String,
	price: Number,
	unitOfMeasure: String,
	chargeType: String,
	menuType: String
});

products.plugin(timestamps);
module.exports = mongoose.model('products', products);