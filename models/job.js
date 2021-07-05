var mongoose = require("mongoose");

var jobSchema = new mongoose.Schema({
	department:String,
	name:String,
   image: String,
   description: String,
	requirements:String,
	respons:String,
	salary:String,
	lastUpdated:{type: Date, default: Date.now}
});

module.exports = mongoose.model("Job", jobSchema);