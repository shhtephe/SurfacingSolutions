var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var products = new Schema({
	distributor: String,
	manufacturer: String,
	type: String,
	description: String,
	itemCode: String,
	price: String,
	formula: String,
	add: function(total) {
	},
	subtract: function(total) {
	}
});

products.plugin(timestamps);
module.exports = mongoose.model('products', products);