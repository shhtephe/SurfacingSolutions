var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var remnants = new Schema({
	manufacturer: String,
	remnantType: String,
	colourGroup: String,
	description: String,
	thickness: Number,
	length: Number,
	width: Number,
	location: String, 
	hold: Boolean,
	remnantID: Number
});

remnants.plugin(timestamps);
module.exports = mongoose.model('remnants', remnants);