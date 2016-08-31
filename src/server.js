var express = require("express");
var bodyParser = require("body-parser");
var chewRouter = require("./routes/chew.js");

var Server = function(listenPort){
    var server = this;
    server.listenPort = listenPort;
    server.app = express();
    server.app.use(bodyParser.urlencoded());
    server.app.use(bodyParser.json());
    server.app.use(chewRouter);
}

Server.prototype.start = function(){
    var server = this;
    server.app.listen(server.listenPort, "0.0.0.0",  function(error){
        console.log("Listening on ", server.listenPort);
    });
}

module.exports = Server;
