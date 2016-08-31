var express = require("express");
var bodyParser = require("body-parser");
var fetchRenderedHtml = require("./runCollector.js");
var cacheMW = require("./middleware/cache.js");

var Server = function(listenPort){
    var server = this;
    server.listenPort = listenPort;
    server.app = express();

    server.app.use(bodyParser.urlencoded());
    server.app.use(bodyParser.json());

    server.app.get("/*", cacheMW,  function(request, response){
        var cache = request.pageCache;
        var data = "Could not find pre-rendered page: " + request.url +".";
        var status = 404;
        console.log("WTF", cache);
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

    server.app.post("/renderedHtml", cacheMW, function(request, response){
        var body = request.body;
        var cache = request.pageCache;
        cache.set(body.pageUrl, body.data);
        response.send("OK");
    });
}

Server.prototype.start = function(){
    var server = this;
    server.app.listen(server.listenPort, "localhost",  function(error){
        console.log("Listening on ", server.listenPort);
    });
}

module.exports = Server;
