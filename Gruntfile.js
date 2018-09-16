/* eslint-env node */
/*
 Copyright 2017 Raising the Floor, International

 Licensed under the Educational Community License (ECL), Version 2.0 or the New
 BSD license. You may not use this file except in compliance with one these
 Licenses.

 You may obtain a copy of the ECL 2.0 License and BSD License at
 https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
 */
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            options: {
                config: {
                    "first-header-h1": false // Docpad takes care of this for us.
                }
            },
            sources: {
                md: ["./*.md", "./src/**/*.md", "./tests/**/*.md", "!./src/static/lib"],
                js: ["./*.js", "./src/**/*.js", "./tests/**/*.js", "!./src/static/lib"],
                json: ["./*.json", "./.*.json", "./src/**/*.json", "tests/**/*.json", "!./src/static/lib"],
                json5: ["./*.json5", "./src/**/*.json5", "tests/**/*.json5", "!./src/static/lib"],
                other: ["./.*"]
            }
        },
        markdownlint: {
            options: {
                config: {
                    // See https://github.com/DavidAnson/markdownlint#rules--aliases for rule names and meanings.
                    "first-header-h1": false, // Docpad takes care of this for us.
                    "first-line-h1": false, // Docpad also takes care of this for us.
                    "line-length": false
                }
            }
        }
    });

    grunt.loadNpmTasks("gpii-grunt-lint-all");

    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
};
