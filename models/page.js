var mongoose = require("mongoose");

var pageSchema = new mongoose.Schema({
	name: { type : String , unique : true,sparse:true},
	content:String,
});

module.exports = mongoose.model("Page", pageSchema);