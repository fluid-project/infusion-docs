/*

    A "mini search" that intercepts the normal form submission and ensures that search queries are properly encoded so
    that the search form can handle them.

*/
(function (fluid) {
    "use strict";
    fluid.registerNamespace("fluid.docs.search.mini");

    fluid.docs.search.mini.submitOnEnter = function (that, event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            var queryInput = that.locate("queryInput");
            var queryString = queryInput.val();
            var searchUrl = that.options.targetUrl + "?qs=" + JSON.stringify(queryString);
            window.location.assign(searchUrl);
        }
    };

    fluid.defaults("fluid.docs.search.mini", {
        gradeNames: ["fluid.viewComponent"],
        targetUrl: "search.html",
        selectors: {
            queryInput: "input[name='qs']"
        },
        model: {
            qs: ""
        },
        invokers: {
            submitOnEnter: {
                funcName: "fluid.docs.search.mini.submitOnEnter",
                args:     ["{that}", "{arguments}.0"] // event
            }
        },
        listeners: {
            "onCreate.bindExtendedResultsToggleKeys": {
                "this": "{that}.dom.queryInput",
                method: "keypress",
                args: ["{that}.submitOnEnter"]
            }
        }
    });
})(fluid);
