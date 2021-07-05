var mongoose = require("mongoose");

var programSchema = new mongoose.Schema({
	department:String,
	faculty:String,
	name:String,
   image: String,
   description: String,
	description_link: String,
	graduate_programs:String,
	lastUpdated:{type: Date, default: Date.now}
});

module.exports = mongoose.model("Program", programSchema);