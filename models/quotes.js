var mongoose = require('mongoose');
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
		addons: {
			highGlossFinish: {
				quantity: Number
			},
			cuttingBoards: {
				quantity: Number
			},
			backBridgeForSlideInStove: {
				quantity: Number
			},
			drainBoard: {
				quantity: Number
			},
			directionalMaterialFabrication: {
				quantity: Number
			},
			adhesivePerLinerFoot: {
				quantity: Number
			},
			siteJoint: {
				quantity: Number
			}
		}
	}]
});

module.exports = mongoose.model('quote', quote);