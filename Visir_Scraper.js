var express    = require('express');
var fs         = require('fs'); //access to computers file system
var request    = require('request');
var cheerio    = require('cheerio');
var iconv = require('iconv-lite');
var app     = express();

var encoding = 'iso-8859-1';
var outputFileName = "visirScrape";
var subsites = ["FRETTIR", "VIDSKIPTI", "IDROTTIR"];//, "LIFID", "RAD"];

app.get('/scrape', function(req, res){
    //remove the old file
    checkForAndDeleteOldFile();
    //Sidasta loop-a a ad fara gegnum annad element (fyrir radningar)
    for (var i = 0; i < subsites.length; i++) {
        url = 'http://www.visir.is/section/' + subsites[i];

        // The structure of our request call
        // The callback function takes 3 parameters, an error, response status code and the html
        request.get({
                        headers: {
                            'User-Agent':'SomeUser',
                            'content-type' : 'text/html;charset=UTF-8'},
                        url: url,
                        encoding: null
                    }, function(error, response, html){

            // First we'll check to make sure no errors occurred when making the request
            if(!error){
                var html = iconv.decode(html,encoding);
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);

                console.log("Got response: " + response.statusCode);

                var jsonArray = [];
                var imageLink = "";
                var hrefLink = "";
                var headline1 = "";
                var headline2 = "";
                var timejson = {lastupdate : "", subsite : ""};
                timejson.lastupdate = new Date();
    			jsonArray.push(timejson)

                $('.newsitem').each(function(){
                	// Let's store the data we filter into a variable so we can easily see what's going on.
                    var data = $(this);
                    var tmpjson = new Object();

                    imageLink = data.find('.image img').attr('src');
                    hrefLink = data.find('.image a').attr('href');
                    headline1 = data.find('h3').text();
                    headline2 = data.find('.text').text();

                    tmpjson.subsite = data.find('.meta .category').text();
    	        	tmpjson.imageLink = imageLink;
    	        	tmpjson.hrefLink = "http://www.visir.is" + hrefLink;
    	        	tmpjson.headline1 = headline1.replace(/(\r\n|\n|\r|\t)/gm,"");
                    tmpjson.headline2 = headline2.replace(/(\r\n|\n|\r|\t)/gm,"");
                    tmpjson.timeWritten = data.find('.meta .date').eq(1).text() + " " + data.find('.meta .date').eq(0).text();
    	        	jsonArray.push(tmpjson);
                })
            }
            else{
            	console.log("Error occurred: " + error);
            }

            fs.appendFile(outputFileName + '.json', JSON.stringify(jsonArray, null, 4), function(err){
                console.log('File successfully written! - Check your project directory for the ' +outputFileName+ ' file');
            })

        })
    }
    // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
    res.send('Check your console!')
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;

function checkForAndDeleteOldFile(){
    fs.exists('visirScrape.json', function(exists){
        if (exists) {
            fs.unlink('visirScrape.json', function (err) {
                if (err){
                    console.log('error deleting %s', outputFileName);
                }
                else{
                    console.log('successfully deleted old file %s', outputFileName);
                }
            });
        }
    });
}