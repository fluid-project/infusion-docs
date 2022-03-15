/*
    Copyright 2014 OCAD University
    Copyright 2017 Raising the Floor, International

    Licensed under the Educational Community License (ECL), Version 2.0 or the New
    BSD license. You may not use this file except in compliance with one these
    Licenses.`

    You may obtain a copy of the ECL 2.0 License and BSD License at
    https://github.com/fluid-project/infusion/raw/main/Infusion-LICENSE.txt
*/
"use strict";

var GithubSlugger = require("github-slugger");
var githubSlugify = function (string) {
    var slugger = new GithubSlugger();
    return slugger.slug(string);
};

require("./index.js");
var hljs = require("highlight.js");
var parseTransform = require("./src/transforms/parse.js");
var navigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
    var markdownit = require("markdown-it")({
        html: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
			  try {
                    return "<pre class=\"highlight\"><code class=\"hljs " + lang + "\">" +
					   hljs.highlight(lang, str, true).value +
					   "</code></pre>";
			  } catch (__) {}
            }
            return "<pre class=\"highlight\"><code class=\"hljs " + lang + "\">" + markdownit.utils.escapeHtml(str) + "</code></pre>";
        }
    });

    var markdownItAnchor = require("markdown-it-anchor");
    var markdownItLibrary = markdownit.use(markdownItAnchor, { slugify: githubSlugify });

    eleventyConfig.setLibrary("md", markdownItLibrary);

    eleventyConfig.addTransform("parse", parseTransform);

    eleventyConfig.addPlugin(navigationPlugin);

    eleventyConfig.addPassthroughCopy({
        "node_modules/infusion/dist": "lib/infusion/dist",
        "node_modules/infusion/src": "lib/infusion/src",
        "node_modules/foundation-sites/css": "lib/foundation",
        "node_modules/octicons/octicons": "lib/octicons",
        "node_modules/lunr": "lib/lunr",
        "node_modules/fluid-express/src/js/lib": "lib/fluid-express",
        "node_modules/fluid-binder/src/js": "lib/fluid-binder",
        "node_modules/fluid-location-bar-relay/src/js": "lib/fluid-location-bar-relay",
        "src/static/css": "css",
        "src/static/fonts": "fonts",
        "src/static/js": "js",
        "src/scripts": "js",
        "src/documents/images": "images",
        "src/icons": "/"
    });

    // Helper function to rewrite *.md links to *.html:
    // With this helper, we can write links to *.md files in our source files but
    // generate links to *.html in the DocPad output. This arrangement gives us
    // links that work both on the GitHub website and in the generated HTML.
    eleventyConfig.addFilter("rewriteMdLinks", function (content) {
        return content.replace(/(<a\s[^>]*href="[\w-/\.]+)\.md(["#])/gm, "$1.html$2");
    });

    // Helper function to add a prefix to a relative URL.
    eleventyConfig.addFilter("addPrefix", function (href) {
        return "/infusion/development" + href;
    });

    eleventyConfig.on("afterBuild", () => {
        require("./src/scripts/create-search-digest");
    });

    return {
        dir: {
            input: "src",
            output: "dist"
        }
    };
};
