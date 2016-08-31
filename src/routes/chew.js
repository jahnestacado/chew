var express = require("express");
var cacheMW = require("./../middleware/cache.js");
var fetchRenderedHtml = require("./../exec-render-html.js");
var chewRouter = express.Router();

chewRouter.get("/*", cacheMW,  function(request, response){
    var cache = request.pageCache;
    var data = "Pre-rendered page: " + request.url + " is not available.";
    var status = 404;
    var availableCachedPage = cache.get(request.url);
    if(availableCachedPage){
        data = availableCachedPage;
        status = 200;
        response.status(status).send(data);
    } else {
        fetchRenderedHtml.run(request.url, function(){
            var cachedPage = cache.get(request.url);
            if(cachedPage){
                data = cachedPage;
                status = 200;
            }
            response.status(status).send(data);
        })
    }
});

chewRouter.post("/chew", cacheMW, function(request, response){
    var body = request.body;
    var cache = request.pageCache;
    cache.set(body.pageUrl, body.data);
    response.send("OK");
});

module.exports = chewRouter;
