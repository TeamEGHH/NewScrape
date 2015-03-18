var Model = require('./model');
var Scraper = require('./scraper');
var mongoose = require('mongoose-q')();
var Pages = [];
var Medias = [];

/*
 * Initialize several media sites for scraping
 */
var media_objects = {
    dv: {
        name: "DV",
        url: "http://www.dv.is",
        article: "article:not(.list-decimal)",
        image: ".image img",
        hreflink: "a",
        headline1: ".headlines h1",
        headline2: ".headlines h2",
        subsites: ["/frettir/innlent", "/frettir/erlent", "/frettir/stjornmal", "/frettir/teakni", "/frettir/vidskipti", "/musik", "/sport", "/folk"]
    },
    ruv: {
        name: "RUV",
        url: "http://ruv.is",
        article: ".views-row",
        image: "picture img",
        hreflink: "h2 a",
        headline1: "h2 a",
        headline2: ".article-summary",
        subsites: ["/frettalisti"] // /frettalisti?page=1, /frettalisti?page=2, /frettalisti?page=3, /frettalisti?page=4...
    },
    visir: {
        name: "VISIR",
        url: "http://www.visir.is/section",
        article: ".newsitem",
        image: ".image img",
        hreflink: "h3 a",
        headline1: "h3",
        headline2: ".text",
        subsites: ["/FRETTIR01", "/FRETTIR02", "/LIFID", "/VIDSKIPTI", "/althingi", "/IDROTTIR", "/LIFID02"]
    },
    mbl: {
        name: "MBL",
        url: "http://www.mbl.is",
        article: ".teaser",
        image: ".mynd img",
        hreflink: "h1 a",
        headline1: "h1 a",
        headline2: ".texti",
        subsites: ["/frettir/innlent", "/frettir/erlent", "/frettir/togt", "/vidskipti", "/sport", "/folk"]
    },
    nutiminn: {
        name: "NUTIMINN",
        url: "http://nutiminn.is",
        article: "article",
        image: "div .entry-content img",
        hreflink: "h2 a",
        headline1: "h1, h2",
        headline2: "div .entry-content",
        subsites: ["/folk", "/politik", "/utlond"]
    }
};


//Gather urls and object names to look for during the scrape
//Return values:
//      urls: array of urls, subsites of media website, sports, news etc.
//      media: array of information about what objects to seek for during
//              scrape process.
function generateScrapeObjects() {
    var urls = [];
    var media = [];
    for (var media_object in media_objects) {
        if (media_objects.hasOwnProperty(media_object)) {
            var medium = media_objects[media_object];
            for (var subsite_item in medium.subsites) {
                var subsite = medium.subsites[subsite_item];
                var url = medium.url + subsite;
                urls.push(url);
                media.push(medium);
            }
        }
    }
    return {
        urls: urls,
        medias: media
    };
}

var ScrapeObjects = generateScrapeObjects();

Pages = ScrapeObjects.urls;
Media = ScrapeObjects.medias;

//The main process
//Uses the urls we created earlier and sends request for each one,
//This a recursive function that continues until all urls in the
//Pages array are done.
function wizard() {
    if (!Pages.length) {
        return console.log('Done!!!!');
    }

    var url = Pages.pop();
    var medium = Media.pop();
    var scraper = new Scraper(url, medium);
    var model;

    console.log('Requests left: ' + Pages.length);

    //If an error occurs we still want to create
    //our next request
    scraper.on('error', function (error) {
        console.log(error);
        wizard();
    });

    //If the request completed successfully,
    //we continue and use the next url.
    scraper.on('complete', function (article) {
        wizard();
    });

    //If we have gathered data from an article we
    //save it to our database.
    scraper.on('save', function (article) {
        model = new Model(article);
        model.save(function (err) {
            if (err) {
                console.log('Database error saving');
            }
        });
    });
}


//Lets kick things off
wizard();

module.exports = Scraper;
