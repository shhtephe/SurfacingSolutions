var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var terms = new Schema({
		tos: String
});

terms.plugin(timestamps);
module.exports = mongoose.model('terms', terms);