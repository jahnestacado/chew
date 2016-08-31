var PAGE_CACHE = {};
var log = require("logia")("Chew::CacheMW");

module.exports = function cache(request, response, next){
    request.pageCache = {
        get: function(url){
            log.trace("Getting url: '{0}' with value {1} from cache", url, PAGE_CACHE[url] || "");
            return PAGE_CACHE[url];
        },
        set: function(url, data){
            log.trace("Setting url: '{0}' to {1}", url, data);
            PAGE_CACHE[url] = data;
        }
    }
    next();
}
