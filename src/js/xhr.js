/*======================================================
************   XHR   ************
======================================================*/
// XHR Caching
app.cache = [];
app.removeFromCache = function (url) {
    var index = false;
    for (var i = 0; i < app.cache.length; i++) {
        if (app.cache[i].url === url) index = i;
    }
    if (index !== false) app.cache.splice(index, 1);
};

// XHR
app.xhr = false;
app.get = function (url, callback) {
    if (app.params.cache && url.indexOf('nocache') < 0 && app.params.cacheIgnoreList.indexOf(url) < 0) {
        // Check is the url cached
        for (var i = 0; i < app.cache.length; i++) {
            if (app.cache[i].url === url) {
                // Check expiration
                if ((new Date()).getTime() - app.cache[i].time < app.params.cacheDuration) {
                    // Load from cache
                    callback(app.cache[i].data);
                    return false;
                }
            }
        }
    }

    app.xhr = $.ajax({
        url: url,
        method: 'GET',
        start: app.params.onAjaxStart,
        complete: function (xhr) {
            if (xhr.status === 200 || xhr.status === 0) {
                callback(xhr.responseText, false);
                if (app.params.cache) {
                    app.removeFromCache(url);
                    app.cache.push({
                        url: url,
                        time: (new Date()).getTime(),
                        data: xhr.responseText
                    });
                }
            }
            else {
                callback(xhr.responseText, true);
            }
            if (app.params.onAjaxComplete) app.params.onAjaxComplete(xhr);
        },
        error: function (xhr) {
            callback(xhr.responseText, true);
            if (app.params.onAjaxError) app.params.onAjaxonAjaxError(xhr);
        }
    });

    return app.xhr;
};
