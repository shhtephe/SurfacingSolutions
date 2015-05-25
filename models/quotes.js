var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var quote = new Schema({
	quoteID: Number,
	custCode: Number,
	totalPrice: Number,
	jobDifficulty: Number,
	counters: [{
		counterShape: String,
		counterLength: Number,
		counterWidth: Number,
		counterThickness1: Number,
		counterThickness2: Number,
		totalPrice: Number,
		addons: [{
			product: String,
			name: String,
			price: Number,
			itemType: String,
			quantity: Number,
			totalPrice: Number
		}]
	}],
	description: String
});

quote.plugin(timestamps);
module.exports = mongoose.model('quote', quote);