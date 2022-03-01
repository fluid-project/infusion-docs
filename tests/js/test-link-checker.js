/* eslint-env node */
/*

    Test the link checker to confirm that it correctly identifies a range of broken links, and that it does not
    incorrectly flag a range of valid links.

 */
"use strict";
var fluid = require("infusion");

var url = require("url");

var jqUnit = require("node-jqunit");
fluid.require("%infusion-docs");
fluid.require("%fluid-express");

fluid.express.loadTestingSupport();

require("./lib/link-checker");

fluid.registerNamespace("fluid.test.docs.linkChecker");
fluid.test.docs.linkChecker.checkResults = function (results) {
    jqUnit.assertEquals("There should be 8 errors...", 8, results.errors.length);
};

fluid.test.docs.linkChecker.generateBaseUrl = function (basePath) {
    var resolvedPath = fluid.module.resolvePath(basePath);
    return url.resolve("file://", resolvedPath + "/");
};

fluid.defaults("fluid.test.docs.linkChecker.caseHolder", {
    gradeNames: ["fluid.test.express.caseHolder"],
    rawModules: [{
        name: "Testing the link checker against a small site with variations on good and bad links...",
        tests: [
            {
                name: "Checking link checker...",
                type: "test",
                sequence: [
                    {
                        func: "{testEnvironment}.linkChecker.startScan"
                    },
                    {
                        event:    "{testEnvironment}.linkChecker.events.onResultsAvailable",
                        listener: "fluid.test.docs.linkChecker.checkResults",
                        args:     ["{arguments}.0"] // results
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.test.docs.linkChecker.environment", {
    gradeNames: ["fluid.test.express.testEnvironment"],
    components: {
        linkChecker: {
            type: "fluid.tests.docs.linkChecker",
            options: {
                baseUrl:  "{testEnvironment}.options.baseUrl",
                startPage: "/test-link-checker.html"
            }
        },
        express: {
            options: {
                components: {
                    content: {
                        type: "fluid.express.router.static",
                        options: {
                            path:    "/",
                            content: "%infusion-docs/tests/link-checker-fixtures"
                        }
                    }
                }
            }
        },
        testCaseHolder: {
            type: "fluid.test.docs.linkChecker.caseHolder"
        }
    }
});

fluid.test.runTests("fluid.test.docs.linkChecker.environment");
