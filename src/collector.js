var casper = require("casper").create();
var targetServerUri = addHttpSchemeIfNotPresent(casper.cli.get("target-uri"));
var pageUrl = casper.cli.get("page-url");
var cacheServerUri = addHttpSchemeIfNotPresent(casper.cli.get("chew-server-submission-url"));
var pageLoadedSelector = casper.cli.get("page-loaded-selector");
var targetUri = targetServerUri + "/" + pageUrl;
console.log(targetUri, cacheServerUri, pageLoadedSelector, cacheServerUri, "-----------");

casper.start(targetUri);
casper.waitForSelector(pageLoadedSelector, function() {
    casper.thenEvaluate(function(uri, pageUrl, data) {
        $.ajax({
            async: false,
            url: uri,
            data: {
                pageUrl: pageUrl,
                data: data,
            },
            type: "post",
        });
    }, cacheServerUri, pageUrl, casper.getHTML());
});

casper.run();

function addHttpSchemeIfNotPresent(uri){
    if(!(/^http(s)?:\/\//).test(uri)){
        uri = "http://" + uri;
    }
    return uri;
}
