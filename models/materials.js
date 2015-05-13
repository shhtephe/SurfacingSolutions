var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var materials = new Schema({
	colourGroup: String,
	material: String
	name: String,
	price: Number
});


module.exports = mongoose.model('products', products);