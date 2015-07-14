var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var materials = new Schema({
	manufacturer: String,
	distributor: String,
	description: String,
	itemCode: String,
	colourGroup: String,
	thickness: Number,
	length: Number,
	width: Number,
	fullSheet1: Number,
	halfSheet: Number,
	fullSheet5: Number,
	fullSheet21: Number
});

materials.plugin(timestamps);
module.exports = mongoose.model('materials', materials);