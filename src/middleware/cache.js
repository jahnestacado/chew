var PAGE_CACHE = {};
module.exports = function cache(request, response, next){
    request.pageCache = {
        get: function(url){
            return PAGE_CACHE[url];
        },
        set: function(url, data){
            PAGE_CACHE[url] = data;
        }
    }
    next();
}
