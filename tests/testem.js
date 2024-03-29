/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-testem");
fluid.require("%infusion-docs");

// No code coverage for now.  Eventually we may want it for src/static/js.
var testemComponent = fluid.testem.base({
    testPages: [
        "tests/browser/all-tests.html"
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
        skip: "PhantomJS,Safari,Headless Chrome,IE" // Headless Chrome crashes with GPU errors, so we use "headed" at the moment.
    }
});

module.exports = testemComponent.getTestemOptions();
