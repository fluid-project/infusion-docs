var URI = require('URIjs');
var path = require('path');
var ncp = require('ncp');

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
}

// Helper function to build relative URLs:
// Used for links to static resources such as CSS files. So that the generated
// DocPad output is independent of the URL that it is hosted at.
var relativeUrl = function (forUrl) {
    return URI(forUrl).relativeTo(this.document.url);
}

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
    plugins: {
        handlebars: {
            helpers: {
                rewriteMdLinks: rewriteMdLinks,
                githubLocation: githubLocation,
                relativeUrl: relativeUrl
            }
        }
    },
    events: {
        writeAfter: function (opts, next) {
            ncp.ncp(imagesSrcDir, imagesDestDir, next);
        }
    }
}
