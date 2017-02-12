var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var materials = new Schema({
	manufacturer: String,
	distributor: String,
	materialType: String,
	description: String,
	itemCode: String,
	colourGroup: String,
	matCollection: String,
	thickness: Number,
	length: Number,
	width: Number,
	quarterSheet: Number,
	halfSheet: Number,
	fullSheet1: Number,
	fullSheet5: Number,
	fullSheet21: Number,
	salePrice: Number,
	isa: Number
});

materials.plugin(timestamps);
module.exports = mongoose.model('materials', materials);