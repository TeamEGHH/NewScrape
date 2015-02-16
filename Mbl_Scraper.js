var express = require('express');
var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


var outputFileName = "mblScrape";
var subsites = ["frettir/innlent", "frettir/erlent", "frettir/togt", "vidskipti", "sport" ,"folk", "smartland" ];

app.get('/scrape', function(req, res){
	
	checkForAndDeleteOldFile();
	
	for(var i = 0; i < subsites.length; i++){
		
		url = 'http://www.mbl.is/' + subsites[i];

		request(url, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);
				
				var jsonArray = [];
                var imageLink = "";
                var hrefLink = "";
                var headline1 = "";
                var headline2 = "";

				// titles
				$('.teaser').each(function() {
					var data = $(this);
                    var tmpjson = new Object();
					
					imageLink = data.find('img').attr('src');
                    hrefLink = data.find('h1 a').attr('href');
                    headline1 = data.find('h1 a').attr('title');
                    headline2 = data.find('.texti').text();
					
					tmpjson.subsite = subsites[i];
    	        	tmpjson.imageLink = "https://www.mbl.is" + imageLink;
    	        	tmpjson.hrefLink = "https://www.mbl.is" + hrefLink;
    	        	tmpjson.headline1 = headline1;
                    tmpjson.headline2 = headline2.replace(/(\r\n|\n|\r|\t)/gm,"");
    	        	jsonArray.push(tmpjson);
				});
			}
			
			else{console.log("error happened whoopsie")};
			
			fs.appendFile(outputFileName + '.json', JSON.stringify(jsonArray, null, 4), function(err){
                console.log('File successfully written! - Check your project directory for the ' +outputFileName+ ' file');
            });
		});
	}
	res.send('Scrapeing complete mjen');
});

app.listen('8000');
console.log('port 8000');
exports = module.exports = app;


function checkForAndDeleteOldFile(){
    fs.exists('mblScrape.json', function(exists){
        if (exists) {
            fs.unlink('mblScrape.json', function (err) {
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