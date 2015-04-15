/**
    This file contains a Scraper with an EventEmitter. It
    creates a Scrape prototype which has it's own url and
    info about a medium.
**/

var http         = require('http');
var request      = require('request');
var cheerio      = require('cheerio');
var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var iconv        = require('iconv-lite');
var STATUS_CODES = http.STATUS_CODES;


/*  
 *   Scraper Constructor
 */
function Scraper(url, medium) {
    this.url = url;
    this.medium = medium;

    this.init();
}

/*
 *   Make it an EventEmitter
 */
util.inherits(Scraper, EventEmitter);

/*
 *   Initialize scraping
 */
Scraper.prototype.init = function () {
    var model;
    var self = this;

    self.on('loaded', function (html) {
        model = self.parsePage(html);
        self.emit('complete', model);
    });
    self.loadWebPage();
}

/*
 *   Loads webpage and puts together html data
 */
Scraper.prototype.loadWebPage = function () {
    var self  = this;
    console.log('\n\nLoading: ' + this.url);
    var body  = ''
    request(self.url, function (error, res, html) {}).on('data', function (chunk) {
        body += chunk;
    }).on('end', function () {
        self.emit('loaded', body);
    }).on('error', function (err) {
        self.emit('error', err);
    });
};

/*
 *   Parse html and return an object
 */
Scraper.prototype.parsePage = function (html) {

    var self   = this;
    var medium = self.medium;


    /*
     *  Special case scenario for visir.is
     *  where a user is requested before fetching
     *  data from the website.
    */
    if (medium.name == "VISIR") {
        var encoding = 'iso-8859-1';
        request.get({
            headers: {
                'User-Agent': 'SomeUser',
                'content-type': 'text/html;charset=iso-8859-1'
            },
            url: self.url,
            encoding: null
        }, function (error, response, html1) {
            if (!error) {
                html = html1;
                html = iconv.decode(html, encoding);
                getData(html);
            }
        });
    }

    getData(html);

    /*
     * Get data fromn article and handle each medium
     */
    function getData(html) {
        var $ = cheerio.load(html);

        //For each article we find, we gather data from the article
        //and then save the results to mongodb.
        $(medium.article).each(function () {
            var data = $(this);
            var medium_name, headline1, headline2, image, href, time;

            if (medium.name == "RUV") {

                //This blocks advertisements, we don't want them
                //in out database
                if (data.find(medium.hreflink).attr('href') == undefined) {
                    return true;
                }
                medium_name  = medium.name;
                headline1    = data.find(medium.headline1).text();
                headline2    = data.find(medium.headline2).clone().children().remove().end().text();
                headline2    = headline2.replace(/\n    |\n\n| \n|\n |\t\n|\n\t/g, "");
                image        = data.find(medium.image).attr('srcset');
                href         = medium.url + data.find(medium.hreflink).attr('href');
                time         = getTimeStamp();
                tags         = getTags();
            }

            if (medium.name  == "DV") {
                medium_name  = medium.name;
                headline1    = data.find(medium.headline1).text();
                headline2    = data.find(medium.headline2).text();
                image        = medium.url + data.find(medium.image).attr('src');
                href         = medium.url + data.find(medium.hreflink).attr('href');
                time         = getTimeStamp();
                tags         = getTags();
            }

            if (medium.name  == "VISIR") {
                medium_name  = medium.name;
                headline1    = data.find(medium.headline1).text();
                headline1    = headline1.replace(/(\r\n|\n|\r|\t)/gm, "");
                headline2    = data.find(medium.headline2).text();
                headline2    = headline2.replace(/(\r\n|\n|\r|\t)/gm, "");
                if(data.find(medium.image).attr('src') == "/support/images/blank.gif") {
                    return true;
                }else {
                    image    = data.find(medium.image).attr('src');
                }
                href         = medium.url + data.find(medium.hreflink).attr('href');
                time         = getTimeStamp();
                tags         = getTags();
            }

            if (medium.name  == "MBL") {
                medium_name  = medium.name;
                headline1    = data.find(medium.headline1).attr('title');
                headline2    = data.find(medium.headline2).clone().children().remove().end().text();
                headline2    = headline2.replace(/\n|\n\n/g, "");
                if(data.find(medium.image).attr('data-mbl-postload') == undefined){
                    return true;
                } else{
                    image    = medium.url + data.find(medium.image).attr('data-mbl-postload');
                }
                href         = medium.url + data.find(medium.hreflink).attr('href');
                time         = getTimeStamp();
                tags         = getTags();
            }

            if(medium.name == "NUTIMINN") {
                medium_name  = medium.name;
                headline1    = data.find(medium.headline1).text();
                headline2    = data.find(medium.headline2).text();
                headline2    = headline2.replace(/\n/g, "");
                image        = data.find(medium.image).attr('src');
                if(image == undefined) {
                    return true;
                }
                href         = data.find(medium.hreflink).attr('href');
                time         = getTimeStamp();
                tags         = getTags();
            }

            //The model we save into our mongoDB
            //See model.js
            var model = {
                medium   : medium_name,
                headline1: headline1,
                headline2: headline2,
                image    : image,
                href     : href,
                time     : time,
                tags     : tags
            };
            self.emit('save', model);
        });
    }

    /*
     *  Time article was fetched.
     */
    function getTimeStamp() {
        return new Date();
    }

    /*
     * Compare the url to the groups below and add tags
     * to the articles
     */
    function getTags() {
        var tags = [];
        var groups = {
            innlent  : ["/frettir/innlent", "/FRETTIR01"],
            erlent   : ["/FRETTIR02", "/frettir/erlent", "/utlond"],
            sport    : ["/sport", "/IDROTTIR"],
            politik  : ["/frettir/stjornmal", "/althingi", "/politik"],
            taekni   : ["/frettir/teakni", "/frettir/togt"],
            vidskipti: ["/vidskipti", "/frettir/vidskipti"],
            musik    : ["/musik", "/LIFID02"],
            folk     : ["/folk", "/LIFID"]
        }

        for (var group in groups) {
            if (groups.hasOwnProperty(group)) {
                var subsites = groups[group];
                for (var item in subsites) {
                    var subsite = subsites[item];
                    if ((self.url).indexOf(subsite) > -1) {
                        tags.push(group);
                    }
                }
            }
        }
        if(tags.length == 0) {
            tags.push("annad");
        }
        return tags;
    }
}

module.exports = Scraper;