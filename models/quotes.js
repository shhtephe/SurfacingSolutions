var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var quote = new Schema({
	quoteID: Number,
	custCode: Number,
	totalPrice: Number,
	jobDifficulty: Number,
	counters: [{
		description: String,
		counterShape: String,
		counterLength: Number,
		counterWidth: Number,
		counterThickness1: Number,
		counterThickness2: Number,
		totalPrice: Number,
		material:{
			colourGroup: String,
			colour: String,
			price: Number
		},
		addons: [{
			product: String,
			name: String,
			price: Number,
			itemType: String,
			quantity: Number,
			totalPrice: Number,
			dropDown: String
		}],
		mandatoryCharges: [{
			product: String,
			name: String,
			price: Number,
			unitOfMeasure: String,
			menuType: String,
			quantity: Number,
			totalPrice: Number,
			dropDown: [{
				price: Number,
				product: String,
				name: String,
				quantity: Number
			}]
		}]
	}],
	description: String
});

quote.plugin(timestamps);
module.exports = mongoose.model('quote', quote);