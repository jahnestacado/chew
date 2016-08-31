var meow = require("meow");
var args = meow();
var listenPort = args.flags.port;
var express = require("express");
var bodyParser = require("body-parser");
var chewRouter = require("./src/routes/chew.js");
var app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(chewRouter);
app.listen(listenPort, "0.0.0.0",  function(error){
    console.log("Listening on ", listenPort);
});
