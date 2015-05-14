var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var materials = new Schema({
	colourGroup: String,
	colour: String,
	price: Number
});


module.exports = mongoose.model('materials', materials);