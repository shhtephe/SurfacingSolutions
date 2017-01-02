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
	TAC: Number,
	GMC: Number,
	TGC: Number,
	GMCPSF: Number,
	GCPSF: Number,
	QGM: Number,
	linearFootage: Number,
	LSUM: Number,
	totalLength: Number,
	sheetsUsed: Number,
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
		term: String,
		calendar: String,
		date: String
	}],
	counterGroup: [{
		groupNumber: Number,
		description: String,
		TAC: Number,
		GMC: Number,
		TGC: Number,
		GMCPSF: Number,
		GCPSF: Number,
		totalPrice: Number,
		estimatedSheets: Number,
		sheets: Number,
		quantity: Number,
		totalLength: Number,
		LSUM: Number,
		linearFootage: Number,
		addons: [{
			distributor: String,
			manufacturer: String,
			productType: String,
			description: String,
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
				fullSheet21: Number,
				isa: Number,
				distributor: String,
				manufacturer: String,
				colourGroup: String,
				pricing: String,
				description: String,
				customPrice: Number
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
			linearFootage: Number,
			LSUM: Number,
			matPrice: Number
		}]
	}]
});

quote.plugin(timestamps);
module.exports = mongoose.model('quote', quote);