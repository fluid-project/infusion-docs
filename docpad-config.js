/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Note that this file has been renamed from the standard docpad.js to allow use as an npm
// script under Windows - see https://github.com/docpad/docpad/issues/561

var URI = require("URIjs");
var path = require("path");
var fs = require("fs-extra");

var docsVersion = "development";

// The documentation root on GitHub:
// Used to build URLs for "Edit on GitHub" links
var githubDocRoot = "https://github.com/fluid-project/infusion-docs/blob/master/src/documents/";

// Helper function to rewrite *.md links to *.html:
// With this helper, we can write links to *.md files in our source files but
// generate links to *.html in the DocPad output. This arrangement gives us
// links that work both on the GitHub website and in the generated HTML.
var rewriteMdLinks = function (content) {
    return content.replace(/(<a\s[^>]*href="[\w-/\.]+)\.md(["#])/gm, "$1.html$2");
};

// Helper function to build a URL for "Edit on GitHub" for the current document
var githubLocation = function () {
    // in case we're on Windows, replace "\" in the path with "/"
    var relativePath = this.document.relativePath.replace(/\\/g, "/");
    return githubDocRoot + relativePath;
};

// Helper function to build relative URLs:
// Used for links to static resources such as CSS files. So that the generated
// DocPad output is independent of the URL that it is hosted at.
var relativeUrl = function (forUrl, relativeToUrl) {
    return URI(forUrl).relativeTo(relativeToUrl);
};

// Helper function to determine if two values are equal
// Used to determine which table of contents category to display on a particular
// page.
var ifEqual = function (a, b, options) {
    if (a == b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
};

var siteStructure = JSON.parse(fs.readFileSync("site-structure.json"));

// We locate the images within the src/documents directory so that images can
// be viewed on GitHub, as well as in the DocPad output. We need to
// instruct DocPad to treat the images specially so that they are not
// processed. We tell DocPad to ignore the images using "ignorePaths" and we
// then copy them ourselves with a "writeAfter" event handler.
var rootPath = process.cwd();
var imagesSrcDir = path.join(rootPath, "src", "documents", "images");
var imagesDestDir = "out/images";

module.exports = {
    rootPath: rootPath,
    ignorePaths: [ imagesSrcDir ],
    renderSingleExtensions: true,
    templateData: {
        siteStructure: siteStructure
    },
    plugins: {
        handlebars: {
            helpers: {
                rewriteMdLinks: rewriteMdLinks,
                githubLocation: githubLocation,
                relativeUrl: relativeUrl,
                ifEqual: ifEqual
            }
        },
        highlightjs: {
            aliases: {
                stylus: "css"
            }
        }
    },
    events: {
        generateBefore: function (options) {
            // Remove the previous incarnation of index.html since it causes a faulty redirect
            fs.removeSync("out/index.html");
        },
        writeAfter: function () {
            // Copy the images
            fs.copySync(imagesSrcDir, imagesDestDir);
            
            // Copy the contents of the out directory to
            // out/infusion/<version>. We need to do this to prepare the
            // structure for the ghpages plugin as it does not support
            // deploying to a location other than the root.
            fs.removeSync("tmp-out");
            try {
                fs.renameSync("out", "tmp-out");
                fs.mkdirsSync("out");
            } catch (e) {
                console.log("Failed to rename out to tmp-out - copying instead: error ", e);
                fs.copySync("out", "tmp-out");
                try {
                    fs.emptyDirSync("out");
                } catch (e2) {
                    console.log("Failed to empty dir out: error ", e2);
                }
            }
            // Preserve anything that was correctly dumped into "infusion" on the previous round
            if (fs.existsSync("tmp-out/infusion")) {
                fs.renameSync("tmp-out/infusion", "out/infusion");
            }
            
            // Anything that was generated on this round gets copied into infusion
            fs.copySync("tmp-out", "out/infusion/" + docsVersion);
            fs.removeSync("tmp-out");

            // Copy the files for GitHub Pages:
            // redirect index.htmls and CNAME
            fs.copySync(path.join(rootPath, "src", "ghpages-files"), "out");
        }
    }
};
