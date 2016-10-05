var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;

var terms = new Schema({
		terms: String,
		calendar: Boolean
});

terms.plugin(timestamps);
module.exports = mongoose.model('terms', terms);