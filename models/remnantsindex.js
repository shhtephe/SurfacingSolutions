var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema;


var remnantsIndex = new Schema({
	location : String
});

remnantsIndex.plugin(timestamps);
module.exports = mongoose.model('remnantsIndex', remnantsIndex);