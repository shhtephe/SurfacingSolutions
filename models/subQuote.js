var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var subQuote = new Schema({
	quoteID: Number,
	custCode: Number,
	counterShape: String,
	counterLength: Number,
	counterWidth: Number,
	counterThickness1: Number,
	counterThickness2: Number,
	addons: [{
		highGlossFinish: {
			quantity: Boolean,
			itemType: String,
			width: Number,
			length: Number
		},
		cuttingBoards: {
			quantity: Boolean,
			itemType: String
		},
		backBridgeForSlideInStove: {
			quantity: Boolean,
			itemType: String
		},
		drainBoard: {
			quantity: Boolean,
			itemType: String
		},
		directionalMaterialFabrication: {
			quantity: Boolean,
			itemType: String
		},
		adhesivePerLinerFoot: {
			quantity: Boolean,
			itemType: String
		},
		siteJoint: {
			quantity: Boolean,
			itemType: String
		}
	}]
});


module.exports = mongoose.model('subQuote', subQuote);