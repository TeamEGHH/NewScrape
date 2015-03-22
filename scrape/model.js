var mongoose = require('mongoose-q')();

mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', function () {
    console.error('MongoDB Connection Error. Make sure MongoDB is running');
});

var articleSchema = new mongoose.Schema({
    medium: {
    	type: String,
    	required: true
    },
    headline1: {
    	type: String,
    	required: true,
    	unique: true
    },
    headline2: {
    	type: String,
    	required: true
    },
    image: {
    	type: String,
    	required: true
    },
    href: {
    	type: String,
    	required: true
    },
    time: {
    	type: Date,
    	required: true,
    },
    tags: Array
});

module.exports = mongoose.model('article', articleSchema);
    
