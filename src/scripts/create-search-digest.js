// Bundle our content so that it can be searched using Fuse.js
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var fs     = require("fs");
var path   = require("path");

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

fluid.docs.search.digester.extractHeadingText = function (mdContent) {
    var matches = mdContent.match(/^#+ *([^#\n]+) *#*\n/);
    return matches ? matches[1] : false;
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
    var rawPayload = JSON.stringify(that.digestBlocks, null, 4);
    var indentedPayload = rawPayload.replace(/^/mg, "    ").substring(4);
    var output = fluid.stringTemplate(that.options.outputTemplate, { payload: indentedPayload });
    fs.writeFileSync(resolvedOutputPath, output);
};

/**
 *
 * @typedef digestBlock
 * @property {String} body - The renderered HTML for this digest segment.
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
        return index === 0 ? segment : ("#" + segment);
    });

    var fileHeadings = [];

    fluid.each(repairedSegments, function (segment) {
        var headingText = fluid.docs.search.digester.extractHeadingText(segment);
        var preferredHeadingId = fluid.docs.search.digester.extractHeadingId(headingText);

        // Check the preferred heading id for uniqueness and add a trailing numeral if needed.
        var actualHeadingId = preferredHeadingId;
        var offset = 2;
        while (fileHeadings.indexOf(actualHeadingId) !== -1) {
            actualHeadingId = preferredHeadingId + "-" + offset;
            offset++;
        }
        fileHeadings.push(actualHeadingId);

        var rendereredContent = md.render(segment);

        // We are rendering each sub-heading independently, which by default results in the headings become <h1>s.
        // Here we resize them to make the search results consistent and more readable.
        var contentWithResizedHeadings = rendereredContent.replace(/(<\/?h)1(>)/g, "$14$2");

        var digestBlock = {
            pagePath: relativePath,
            pageTitle: pageTitle,
            headingId: actualHeadingId,
            body: contentWithResizedHeadings
        };

        if (headingText) {
            digestBlock.headingText = md.renderInline(headingText);
        }
        else {
            digestBlock.headingText = pageTitle;
        }

        digestBlocks.push(digestBlock);
    });
};

fluid.defaults("fluid.docs.search.digester", {
    gradeNames: ["fluid.component"],
    documentsRoot: "%infusion-docs/src/documents",
    outputPath: "%infusion-docs/out/infusion/development/js/search-digest.js",
    outputTemplate: "(function (fluid) {\n    \"use strict\";\n    fluid.registerNamespace(\"fluid.docs.search\");\n    fluid.docs.search.digest = %payload;\n})(fluid);\n",
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
