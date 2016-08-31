var express = require("express");
var bodyParser = require("body-parser");
var fetchRenderedHtml = require("./runCollector.js");

var Server = function(listenPort){
    var server = this;
    server.listenPort = listenPort;
    server.app = express();

    server.app.use(bodyParser.urlencoded());
    server.app.use(bodyParser.json());

    var PAGE_CACHE = {};
    server.app.get("/*", function(request, response){
        var data = "Could not find pre-rendered page: " + request.url +".";
        var status = 404;
        if(PAGE_CACHE[request.url]){
            data = PAGE_CACHE[request.url];
            status = 200;
            response.status(status).send(data);
        } else {
            fetchRenderedHtml.run(request.url, function(){
                if(PAGE_CACHE[request.url]){
                    data = PAGE_CACHE[request.url];
                    status = 200;
                }
                response.status(status).send(data);
            })
        }
    });

    server.app.post("/renderedHtml", function(request, response){
        var body = request.body;
        PAGE_CACHE[body.pageUrl] = body.data;
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
