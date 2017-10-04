/*

 Trawl our generated content and ensure that all links within and between pages on our site are valid.

 NOTE:  This script will only display accurate results if the content is regenerated before it's run.

 Running this script using `npm test` will take care of that, as the `pretest` script regenerates the content.

 */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");
fluid.require("%infusion-docs");
fluid.require("%gpii-express");

gpii.express.loadTestingSupport();

require("./lib/link-checker");

// TODO: Test the link checker with the static content as well.

fluid.registerNamespace("fluid.test.docs.links");
fluid.test.docs.links.checkResults = function (results) {
    jqUnit.assertEquals("There should be no broken internal links (page#id)...", 0, results.brokenInternalLinks.length);
    jqUnit.assertEquals("There should be no broken links between pages...", 0, results.brokenPageLinks.length);
};

fluid.defaults("fluid.test.docs.links.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [{
        name: "Checking links within docpad-generated site...",
        tests: [
            {
                name: "Checking links...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.linkChecker.startScan"
                    },
                    {
                        event:    "{testEnvironment}.linkChecker.events.onResultsAvailable",
                        listener: "fluid.test.docs.links.checkResults",
                        args:     ["{arguments}.0"] // results
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.test.docs.links.environment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    components: {
        linkChecker: {
            type: "fluid.tests.docs.linkChecker",
            options: {
                baseUrl:  "{testEnvironment}.options.baseUrl",
                startPage: "/infusion/development/index.html"
            }
        },
        express: {
            options: {
                components: {
                    content: {
                        type: "gpii.express.router.static",
                        options: {
                            path:    "/",
                            content: "%infusion-docs/out"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.test.docs.links.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.test.docs.links.environment");
