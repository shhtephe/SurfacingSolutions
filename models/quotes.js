var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var quote = new Schema({
	quoteID: Number,
	custCode: Number,
	totalPrice: Number,
	jobDifficulty: Number,
	description: String,
	poNumber: String,
	mandatoryAddons: [{
		distributor: String,
		manufactuer: String,
		productType: String,
		description: String,
		itemCode: String,
		price: Number,
		formula: String,
		quantity: Number,
		totalPrice: Number
	}],
	terms: [{
		term: String
	}],
	counterGroup: [{
		groupNumber: Number,
		description: String,
		TAC: Number,
		totalPrice: Number,
		addons: [{
			distributor: String,
			description: String,
			manufacturer: String,
			type: String,
			itemCode: String,
			price: Number,
			formula: String,
			quantity: Number,
			totalPrice: Number
		}],
		material:{
				itemCode: String,
				thickness: Number,
				width: Number,
				length: Number,
				fullSheet1: Number,
				halfSheet: Number,
				fullSheet5: Number,
				fullSheet20: Number,
				isa: Number,
				distributor: String,
				manufacturer: String,
				colourGroup: String,
				description: String
		},
		counters: [{
			quantity: Number,
			description: String,
			counterShape: String,
			counterLength: Number,
			counterWidth: Number,
			counterThickness1: Number,
			counterThickness2: Number,
			totalPrice: Number,
			squareFootage: Number,
			pricing: String,
			matPrice: Number,
			sheets: Number,
			jobDifficulty: Number
		}]
	}]
});

quote.plugin(timestamps);
module.exports = mongoose.model('quote', quote);