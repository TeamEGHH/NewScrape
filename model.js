var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', function (){
	console.error('MongoDB Connection Error. Make sure MongoDB is running');
});

var articleSchema = new mongoose.Schema({
	medium   : String,
	headline1: String,
	headline2: String,
	image    : String,
	href     : String,
	time     : String,
	tags     : Array
});

module.exports = mongoose.model('article', articleSchema);