var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var materials = new Schema([{
	colourGroup: String,
	colour: String,
	price: Number
}]);

materials.plugin(timestamps);
module.exports = mongoose.model('materials', materials);