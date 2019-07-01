/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-testem");
fluid.require("%infusion-docs");

// No code coverage for now.  Eventually we may want it for src/static/js.
var testemComponent = gpii.testem.base({
    testPages:   [
        "tests/testem-fixtures/test-search.html"
    ],
    sourceDirs: {
        src: "%infusion-docs/src",
        out: "%infusion-docs/out"
    },
    contentDirs: {
        "tests": "%infusion-docs/tests",
        "node_modules": "%infusion-docs/node_modules"
    },
    testemOptions: {
        skip: "PhantomJS,Safari,Chrome" // Headless Chrome is now its own entry, disable non-headless to avoid double-runs.
    }
});

module.exports = testemComponent.getTestemOptions();
