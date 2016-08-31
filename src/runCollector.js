var meow = require("meow");
var args = meow();
var exec = require("child_process").exec;
var targetServerUri = args.flags.targetUri;
var listenPort = args.flags.port;
var pageLoadedSelector = args.flags.pageLoadedSelector;

function getCommandString(targetUrl){
    var cmd = [
        'node_modules/casperjs/bin/casperjs src/collector.js',
        '--target-uri="'+targetServerUri+'"',
        '--page-url="'+ targetUrl +'"',
        '--chew-server-submission-url="localhost:'+ listenPort + '/chew"',
        '--page-loaded-selector="' + pageLoadedSelector + '"'
    ].join(" ");
    return cmd;
}

function runCommand(targetUrl, onDone){
    var cmd = getCommandString(targetUrl);
    console.log("executing command ", cmd);
    exec(cmd, function(error, stdout, stderr) {
        if(error){
            console.log(error);
        }
        onDone();
    });
}

exports.run = runCommand;
