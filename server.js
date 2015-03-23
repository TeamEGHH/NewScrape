var express = require("express");
var Articles = require('./scrape/model');
var $ = require('jquery');
var app = express();

/* serves main page */
app.get("/", function (req, res) {
    res.sendfile('index.html')
});

/*
 * Loads x many news from our mongo database
 */
 
 var g_skip = 0;
app.get("/loadnews", function (req, res) {
	var batch = 20;
    Articles.find().skip(g_skip).limit(batch)
        .execQ()
    	.then(function (result) {
    		res.send(JSON.stringify(result));
    	})
    	.catch(function (err) {
    		console.log(err);
    	})
    	.done();
        g_skip += batch;
});


/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    //console.log('static file request : ' + req.params);
    res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 8000;
app.listen(port, function () {
    console.log("Listening on " + port);
});
