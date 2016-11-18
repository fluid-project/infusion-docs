var fluid = fluid || {};

(function () {
    fluid.load = {};
    // based on Jake Archibald's example from:
    // http://www.html5rocks.com/en/tutorials/speed/script-loading/#toc-dom-rescue
    // Licensed as Apache 2.0
    fluid.load.loadScripts = function (scripts) {
        scripts.forEach(function(src) {
          var script = document.createElement('script');
          script.src = src;
          script.async = false;
          document.head.appendChild(script);
        });
    };

    fluid.load.hasCookie = function (cookieName) {
        var cookie = document.cookie;
        return cookie && cookie.indexOf(cookieName) >= 0;
    };

    fluid.load.lazyLoadScripts = function (cookieName, scripts) {
        if (fluid_load.hasCookie(cookieName)) {
            fluid_load.loadScripts(scripts);
        }
    };

})();
