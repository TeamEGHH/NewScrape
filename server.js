var express = require("express");
var Articles = require('./scrape/model');
var $ = require('jquery');
var app = express();
var g_skip = 0;
var g_batch = 20;

var g_query = {};
var sub_query = {};
/* serves main page */
app.get("/", function (req, res) {
    res.sendfile('index.html')
});

/*
 * Loads x many news from our mongo database
 */
app.get("/filterArray/:filter", function (req, res) {
    var filters = req.params.filter.split(';');
    var mainFilters = filters[0].split(',');
    var subFilters = filters[1].split(',');
    //console.log(mainFilters);
    //console.log(subFilters);

    var sub_arr = [];
    for (var i = 1; i <= subFilters.length - 1; i++) {
        sub_arr.push({tags: subFilters[i]});
    }

    var main_arr = [];
    for (var i = 1; i <= mainFilters.length - 1; i++) {
        var tmp = {};

        tmp["medium"] = mainFilters[i];
        tmp["$or"] = sub_arr;
        if (sub_arr.length < 1) {
            tmp["$or"] = [{}];
        }
        
        main_arr.push(tmp)
    }
    //console.log(tmp);
    if (main_arr.length < 1) {
        g_query = {};
    }
    else{
        g_query["$or"] = main_arr;    
    }
    //console.log(g_query);
});

app.get("/loadnews/:count", function (req, res) {
    if (req.params.count == 0) {
        g_skip = 0;
    }
    Articles.find(g_query).sort({time: -1}).skip(g_skip).limit(g_batch)
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
