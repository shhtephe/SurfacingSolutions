var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var tos = new Schema({
	tos: String
});

tos.plugin(timestamps);
module.exports = mongoose.model('tos', tos);