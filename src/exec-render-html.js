var meow = require("meow");
var args = meow();
var exec = require("child_process").exec;
var targetServerUri = args.flags.targetUri;
var listenPort = args.flags.port;
var pageLoadedSelector = args.flags.pageLoadedSelector;
var log = require("logia")("Chew::ExecRenderHtml");
var exportedPhantomjsBinVar = "PHANTOMJS_EXECUTABLE=node_modules/.bin/phantomjs";

function getStringCommand(targetUrl){
    var cmd = [
        'export ' + exportedPhantomjsBinVar + '; ',
        'node_modules/casperjs/bin/casperjs src/render-html.js',
        '--target-uri="'+targetServerUri+'"',
        '--page-url="'+ targetUrl +'"',
        '--chew-server-submission-url="localhost:'+ listenPort + '/chew"',
        '--page-loaded-selector="' + pageLoadedSelector + '"'
    ].join(" ");
    return cmd;
}

function execRenderHtml(targetUrl, onDone){
    var cmd = getStringCommand(targetUrl);
    log.trace("Executing command ", cmd);
    exec(cmd, function(error, stdout, stderr) {
        if(error){
            console.log(error);
        }
        onDone();
    });
}

exports.run = execRenderHtml;
