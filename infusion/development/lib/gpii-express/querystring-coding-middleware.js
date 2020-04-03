/*

    Functions to consistently encode and decode JSON objects that are part of a query string, and components
    that use these functions.  See the documentation for details:

    https://github.com/GPII/gpii-express/blob/master/docs/querystring-coding.md

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var url = require("url");

fluid.registerNamespace("gpii.express.querystring");

// Middleware to replace the built-in query parser
fluid.registerNamespace("gpii.express.middleware.withJsonQueryParser");

gpii.express.middleware.withJsonQueryParser.middleware = function (request, next) {
    var urlObject = url.parse(request.url);
    request.query = gpii.express.querystring.decode(urlObject.search ? urlObject.search.substring(1) : "");
    next();
};

fluid.defaults("gpii.express.middleware.withJsonQueryParser", {
    gradeNames: ["gpii.express.middleware"],
    namespace: "jsonQueryParser",
    invokers: {
        middleware: {
            funcName: "gpii.express.middleware.withJsonQueryParser.middleware",
            args:     ["{arguments}.0", "{arguments}.2"] // request, response (not used), next
        }
    }
});

// Integrate our parser with `gpii.express`
fluid.defaults("gpii.express.withJsonQueryParser", {
    gradeNames: ["gpii.express"],
    expressAppOptions: {
        "query parser": false
    },
    components: {
        queryParser: {
            type: "gpii.express.middleware.withJsonQueryParser",
            options: {
                priority: "first"
            }
        }
    }
});
