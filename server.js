var express = require("express");
var Articles = require('./scrape/model');
var $ = require('jquery');
var app = express();

/* serves main page */
app.get("/", function (req, res) {
    res.sendfile('index.html')
});

app.get("/loadnews", function (req, res) {
	var batch = 25;
	var skip = 0;
    Articles.find({medium: "VISIR"}).skip(skip).limit(batch)
        .execQ()
    	.then(function (result) {
    		res.send(JSON.stringify(result));
    	})
    	.catch(function (err) {
    		console.log(err);
    	})
    	.done();
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
