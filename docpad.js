var URI = require('URIjs');
var path = require('path');
var ncp = require('ncp');

var rewriteMdLinks = function (content) {
    return content.replace(/(<a\s[^>]*href="[\w-/\.]+)\.md(["#])/gm, "$1.html$2");
};

var githubLocation = function () {
    // in case we're on Windows, replace "\" in the path with "/"
    var relativePath = this.document.relativePath.replace(/\\/g, "/");
    return "https://github.com/fluid-project/infusion-docs/blob/master/" + relativePath;
}

var relativeUrl = function (forUrl) {
    return URI(forUrl).relativeTo(this.document.url);
}

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
