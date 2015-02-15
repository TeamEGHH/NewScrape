var express    = require('express');
var fs         = require('fs'); //access to computers file system
var request    = require('request');
var cheerio    = require('cheerio');
var app     = express();


var outputFileName = "ruvScrape";
var subsites = ["innlent", "erlent", "fotbolti", "golf", "handbolti", "korfubolti", "menning"];

app.get('/scrape', function(req, res){
    //remove the old file
    checkForAndDeleteOldFile();
	//All the web scraping magic will happen here
    for (var i = 0; i < subsites.length; i++) {
        
        url = 'http://www.ruv.is/' + subsites[i];

        // The structure of our request call
        // The callback function takes 3 parameters, an error, response status code and the html
        request(url, function(error, response, html){

            // First we'll check to make sure no errors occurred when making the request
            if(!error){
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
                var $ = cheerio.load(html);

                var jsonArray = [];
                var imageLink = "";
                var hrefLink = "";
                var headline1 = "";
                var headline2 = "";
                var timejson = {lastupdate : "", subsite : ""};
                timejson.lastupdate = new Date();
                //timejson.subsite = subsites[i];
    			jsonArray.push(timejson);

                //var currentElement = 'article.' + subsites[i];

                $('.frett').each(function(){
                	// Let's store the data we filter into a variable so we can easily see what's going on.
                    var data = $(this);
                    var tmpjson = new Object();

                    imageLink = data.find('a img').attr('src');
                    hrefLink = data.find('a').attr('href');
                    headline1 = data.find('h3 a').text();
                    headline2 = data.find('.frettir-inngangur').text();

                    tmpjson.subsite = hrefLink.split('/')[1];
    	        	tmpjson.imageLink = imageLink;
    	        	tmpjson.hrefLink = hrefLink;
    	        	tmpjson.headline1 = headline1;
                    tmpjson.headline2 = headline2;
                    tmpjson.timeWritten = headline2.split(' ')[0] + headline2.split(' ')[1];
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
    fs.exists('ruvScrape.json', function(exists){
        if (exists) {
            fs.unlink('ruvScrape.json', function (err) {
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