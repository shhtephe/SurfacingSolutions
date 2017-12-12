var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var quote = new Schema({
	account: {
		firstName: String,
		lastName: String,
		userName: String,
		phoneNumber: String,
		email: String,
	},
	lastSavedBy: String,
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
	showGCPSF : Boolean,
	linearFootage: Number,
	LSUM: Number,
	totalLength: Number,
	sheetsUsed: Number,
	notes: String,
	mandatoryAddons: [{
		distributor: String,
		manufactuer: String,
		productType: String,
		description: String,
		itemCode: String,
		price: Number,
		formula: String,
		overrideValue: Number,
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
		areaYield: Number,
		addons: [{
			distributor: String,
			manufacturer: String,
			productType: String,
			description: String,
			itemCode: String,
			price: Number,
			formula: String,
			formula: String,
			overrideValue: Number,
			quantity: Number,
			totalPrice: Number
		}],
		material:{
				itemCode: String,
				thickness: Number,
				width: Number,
				length: Number,
				overrideWidth: Number,
				overrideLength: Number,
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
			matPrice: Number,
			areaYield: Number
		}]
	}]
});

quote.plugin(timestamps);
module.exports = mongoose.model('quote', quote);