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
		totalPrice: Number,
		counters: [{
			quantity: Number,
			description: String,
			counterShape: String,
			counterLength: Number,
			counterWidth: Number,
			counterThickness1: Number,
			counterThickness2: Number,
			totalPrice: Number,
			pricing: String,
			sheets: Number,
			material:{
				itemCode: String,
				thickness: Number,
				width: Number,
				length: Number,
				price: Number,
				fullSheet1: Number,
				halfSheet: Number,
				fullSheet5: Number,
				fullSheet21: Number,
				isa: Number,
				distributor: String,
				manufacturer: String,
				colourGroup: String,
				description: String
			},
			addons: [{
				distributor: String,
				manufactuer: String,
				productType: String,
				description: String,
				itemCode: String,
				price: Number,
				formula: String,
				quantity: Number,
				totalPrice: Number
			}]
		}]
	}]
});

quote.plugin(timestamps);
module.exports = mongoose.model('quote', quote);