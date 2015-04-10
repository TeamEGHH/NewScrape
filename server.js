var express = require("express");
var Articles = require('./scrape/model');
var $ = require('jquery');
var app = express();
var g_skip = 0;
var g_batch = 20;
/* serves main page */
app.get("/", function (req, res) {
    res.sendfile('index.html')
});

/*
 * Loads x many news from our mongo database
 */
app.get("/loadnews0", function (req, res) {
    g_skip = 0;
    Articles.find().sort({time: -1}).skip(g_skip).limit(g_batch)
        .execQ()
        .then(function (result) {
            res.send(JSON.stringify(result));
        })
        .catch(function (err) {
            console.log(err);
        })
        .done();
        g_skip += g_batch;
});

app.get("/loadnews20", function (req, res) {
	//var batch = 20;
    Articles.find().sort({time: -1}).skip(g_skip).limit(g_batch)
        .execQ()
    	.then(function (result) {
    		res.send(JSON.stringify(result));
    	})
    	.catch(function (err) {
    		console.log(err);
    	})
    	.done();
        g_skip += g_batch;
});

app.get("/article/:id", function(req, res) {
    var newsframe;
    Articles.findOne({
            '_id': req.params.id
        }, function(err, article) {
            if (err) {
                return err;
            }
            if (!article) {
                console.log('Article not found');
            } else {
                console.log('found article');
                console.log(article.href);
                newsframe = article.href;
                res.send('<iframe src="' + newsframe + '" height="100%" width="100%">')
            }
        });
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
