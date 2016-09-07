var express = require("express");
var cacheMW = require("./../middleware/cache.js");
var fetchRenderedHtml = require("./../exec-render-html.js");
var log = require("logia")("Chew::ChewRouter");
var chewRouter = express.Router();

chewRouter.get("/*", cacheMW,  function(request, response){
    var cache = request.pageCache;
    var url = request.url;
    var data = "Pre-rendered page: " + request.originalUrl + " is not available.";
    var status = 404;
    var availableCachedPage = cache.get(url);
    log.info("GET | '{0}'", url);
    if(availableCachedPage){
        data = availableCachedPage;
        status = 200;
        log.debug("Page found. Returning content");
        response.status(status).send(data);
    } else {
        log.debug("Page not cached. Making render-page request");
        fetchRenderedHtml.run(url, function(){
            var cachedPage = cache.get(url);
            if(cachedPage){
                data = cachedPage;
                status = 200;
                log.debug("Page found. Returning content -->");
            } else{
                log.debug(data);
            }

            response.status(status).send(data);
        })
    }
});

chewRouter.post("/chew", cacheMW, function(request, response){
    var body = request.body;
    var url = body.pageUrl;
    var cache = request.pageCache;
    log.info("POST | Caching pre-rendered page: '{0}'", request.originalUrl);
    cache.set(url, body.data);
    response.send("OK");
});

module.exports = chewRouter;
