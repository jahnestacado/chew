var meow = require("meow");
var args = meow();
var listenPort = args.flags.port;

var Server = require("./src/server.js");
new Server(listenPort).start();
