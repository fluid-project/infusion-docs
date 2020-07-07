// Bundle our content so that it can be searched using lunr.js on the client side.
/* eslint-env node */
"use strict";
var fluid   = require("infusion");
var fs      = require("fs");
var path    = require("path");
var lunr    = require("lunr");

var MarkdownIt = require("markdown-it");
var md = new MarkdownIt({ html :true });

fluid.registerNamespace("fluid.docs.search.digester");

/**
 *
 * Calculate the heading ID (which can be used to link to the heading) from the heading text.  For example, here's a
 * heading as markdown:
 *
 * ### fluid.generate(n, generator[, applyFunc])
 *
 * That would be represented using the ID `fluidgeneraten-generator-applyfunc`;
 *
 * @param {String} headingText - The text of the heading.
 * @return {String} - The calculated ID.
 *
 */
fluid.docs.search.digester.extractHeadingId = function (headingText) {
    if (headingText) {
        var lowerCase = headingText.toLowerCase();
        var minusSpecialChars = lowerCase.replace(/[^a-z0-9 ]/g, "");
        var spacesEscaped = minusSpecialChars.replace(/ +/g, "-");
        return spacesEscaped;
    }
    else {
        return "";
    }
};

fluid.docs.search.digester.extractPageTitle = function (mdContent) {
    // Parse docpad title metadata like `title: Builder`
    var matches = mdContent.match(/^title: *(.+) *$/m);
    return matches ? matches[1] : "Untitled";
};

/**
 *
 * Starting at our root directory, scan all subdirectories for markdown files and split them up into "digested" chunks
 * for searching.
 *
 * @param {Object} that - The digester component itself.
 *
 */
fluid.docs.search.digester.scanAll = function (that) {
    var resolvedStart = fluid.module.resolvePath(that.options.documentsRoot);
    fluid.docs.search.digester.scanSingleDir(resolvedStart, resolvedStart, that.digestBlocks);

    var resolvedOutputPath = fluid.module.resolvePath(that.options.outputPath);

    var idx = lunr(function () {
        // Ensure that the search results will have positional data we can use for highlighting.
        this.metadataWhitelist = ["position"];

        // We use the section (pagePath#heading) as our unique identifier.
        this.ref("section");
        this.field("headingText");
        this.field("body");

        that.digestBlocks.forEach(function (digestBlock) {
            this.add({
                section:      digestBlock.pagePath + "#" + digestBlock.headingId,
                headingText:  digestBlock.headingText,
                body:         digestBlock.body
            });
        }, this);
    });

    var rawIndex = JSON.stringify(idx.toJSON(), null, 4);
    var indentedIndex = rawIndex.replace(/^/mg, "    ").substring(4);

    // Organise the digest into a map keyed by the "section"
    var digestMap = {};
    fluid.each(that.digestBlocks, function (digestBlock) {
        digestMap[digestBlock.pagePath + "#" + digestBlock.headingId] = digestBlock;
    });

    var rawDigest = JSON.stringify(digestMap, null, 4);
    var indentedDigest = rawDigest.replace(/^/mg, "    ").substring(4);

    var output = fluid.stringTemplate(that.options.outputTemplate, { index: indentedIndex, digest: indentedDigest });
    fs.writeFileSync(resolvedOutputPath, output);
};

/**
 *
 * @typedef digestBlock
 * @property {String} body - The rendered HTML for this digest segment.
 * @property {String} headingId - If the search is associated with a linkable subheading, its ID (used for deep linking).
 * @property {String} headingText - If the search is associated with a linkable subheading, its text, otherwise the page title.
 * @property {String} pagePath - The relative path to the page within the site.
 * @property {String} pageTitle - The page's title.
 *
 */

/**
 *
 * Scan a single directory looking for markdown files and/or subdirectories.
 *
 * @param {String} dirPath - The full path to the directory to scan.
 * @param {String} rootPath - The full path to the root, so that we can derive relative paths.
 * @param {Array<digestBlock>} digestBlocks - The array in which we will accumulate results.  Will be modified in place.
 *
 */
fluid.docs.search.digester.scanSingleDir = function (dirPath, rootPath, digestBlocks) {
    var dirEntries = fs.readdirSync(dirPath, { withFileTypes: true});
    fluid.each(dirEntries, function (dirEntry) {
        var entryPath = path.resolve(dirPath, dirEntry.name);
        if (dirEntry.isDirectory()) {
            fluid.docs.search.digester.scanSingleDir(entryPath, rootPath, digestBlocks);
        }
        else if (dirEntry.isFile() && dirEntry.name.match(/.md$/i)) {
            fluid.docs.search.digester.scanSingleFile(entryPath, rootPath, digestBlocks);
        }
    });
};

/**
 *
 * Scan a single file, breaking it down into "digested" search chunks by header, so that we can link to matching
 * headings within longer documents.
 *
 * @param {String} filePath - The full path to the file.
 * @param {String} rootPath - The full path to the root, so that we can derive relative paths.
 * @param {Array<digestBlock>} digestBlocks - The array in which we will accumulate results.  Will be modified in place.
 *
 */
fluid.docs.search.digester.scanSingleFile = function (filePath, rootPath, digestBlocks) {
    var relativePath = path.relative(rootPath, filePath).replace(/\.md$/, ".html");
    var mdContent = fs.readFileSync(filePath, { encoding: "utf8" });

    var pageTitle = fluid.docs.search.digester.extractPageTitle(mdContent);

    var rawSegments = mdContent.split(/^\#{2,}/m);
    var repairedSegments = fluid.transform(rawSegments, function (segment, index) {
        var toModify = segment;
        // Replace the docpad metadata with a single heading to avoid having the metadata appear literally in results that match the top-level of the page.
        if (index === 0) {
            toModify = segment.replace(/---\ntitle: *([^\n]+)\n[^-]*---/mi, "$1");
        }

        return "# " + toModify;
    });

    var fileHeadings = [];

    fluid.each(repairedSegments, function (segment) {
        var renderedContent = md.render(segment);
        var headingMatches = renderedContent.match(/^(<h1>([^<]+)<\/h1>\n)/i);
        var headingText = headingMatches ? headingMatches[2] : "";
        var renderedBody = headingMatches ? renderedContent.substring(headingMatches[1].length) : renderedContent;
        var cleanedBody = fluid.docs.search.digester.stripTags(renderedBody);

        var preferredHeadingId = fluid.docs.search.digester.extractHeadingId(headingText);

        // Check the preferred heading id for uniqueness and add a trailing numeral if needed.
        var actualHeadingId = preferredHeadingId;

        if (preferredHeadingId !== "") {
            var offset = 2;
            while (fileHeadings.indexOf(actualHeadingId) !== -1) {
                actualHeadingId = preferredHeadingId + "-" + offset;
                offset++;
            }
            fileHeadings.push(actualHeadingId);
        }

        var digestBlock = {
            pagePath: relativePath,
            pageTitle: pageTitle,
            headingId: actualHeadingId,
            headingText: headingText,
            body: cleanedBody
        };

        digestBlocks.push(digestBlock);
    });
};

fluid.docs.search.digester.stripTags = function (rawHTML) {
    var minusTags = rawHTML.replace(/<[^>]+>/g, "");
    var collapsedWhitespace = minusTags.replace(/[\t\r\n ]+/g, " ");
    return collapsedWhitespace;
};

fluid.defaults("fluid.docs.search.digester", {
    gradeNames: ["fluid.component"],
    documentsRoot: "%infusion-docs/src/documents",
    outputPath: "%infusion-docs/out/search-digest.js",
    outputTemplate: "(function (fluid) {\n    \"use strict\";\n    fluid.registerNamespace(\"fluid.docs.search\");\n    fluid.docs.search.digest = %digest;\n\n fluid.docs.search.index = %index; \n})(fluid);\n",
    members: {
        digestBlocks: []
    },
    listeners: {
        "onCreate.scanAll": {
            funcName: "fluid.docs.search.digester.scanAll",
            args:    ["{that}"]
        }
    }
});

fluid.docs.search.digester();
