/*

    A component that trawls our generated content and reports errors if there are:

    1. Broken links between pages on the site.
    2. Broken links within a single page.

 */
/* eslint-env node */
"use strict";
var fluid   = require("infusion");
var request = require("request");
var url     = require("url");
var jsdom   = require("jsdom");

fluid.registerNamespace("fluid.tests.docs.linkChecker");

fluid.tests.docs.linkChecker.startScan = function (that) {
    var startingUrl = fluid.tests.docs.linkChecker.resolveSafely(that.options.baseUrl, that.options.startPage);

    that.pagesToScan.push(startingUrl);

    that.scanSinglePageOrFinish();
};

fluid.tests.docs.linkChecker.scanSinglePageOrFinish = function (that) {
    if (that.pagesToScan.length) {
        var promise = fluid.promise();
        promise.then(that.scanSinglePageOrFinish);

        var pageToScan = that.pagesToScan.pop();
        if (that.scannedPages[pageToScan]) {
            // Skip this, we've already scanned it.
            promise.resolve();
        }
        else {
            // Retrieve the page and process it.
            request(pageToScan, function (error, response, body) {
                fluid.tests.docs.linkChecker.processSingleResponse(that, pageToScan, error, response, body);
                promise.resolve();
            });
        }
    }
    else {
        fluid.tests.docs.linkChecker.checkInternalLinks(that);
        fluid.tests.docs.linkChecker.checkPageLinks(that);

        var report = fluid.model.transformWithRules(that, that.options.rules.report);
        that.events.onResultsAvailable.fire(report);
    }
};

fluid.tests.docs.linkChecker.urlBeforeHash = function (link) {
    return link.indexOf("#") !== -1 ? link.substring(0, link.indexOf("#")) : link;
};

fluid.tests.docs.linkChecker.urlAfterHash = function (link) {
    return link.indexOf("#") !== -1 ? link.substring(link.indexOf("#") + 1) : "";
};

fluid.tests.docs.linkChecker.checkInternalLinks = function (that) {
    fluid.each(that.internalLinksToCheck, function (link) {
        var linkBeforeHash = fluid.tests.docs.linkChecker.urlBeforeHash(link);
        var linkAfterHash  = fluid.tests.docs.linkChecker.urlAfterHash(link);
        if (linkAfterHash && linkAfterHash.length) {
            var pageIds = that.idsByPage[linkBeforeHash];
            if (!pageIds || pageIds.indexOf(linkAfterHash) === -1) {
                that.brokenInternalLinks.push(link);
            }
        }
    });
};

fluid.tests.docs.linkChecker.checkPageLinks = function (that) {
    fluid.each(that.scannedPages, function (results, page) {
        if (results.error || results.statusCode !== 200) {
            that.brokenPageLinks.push(page);
        }
    });
};

fluid.tests.docs.linkChecker.resolveSafely = function (baseUrl, path) {
    var cleanPath = path.replace(/^about:blank/i, "");
    return url.resolve(baseUrl, cleanPath);
};

fluid.tests.docs.linkChecker.processSingleResponse = function (that, pageToScan, error, response, body) {
    var pageResults = { statusCode: response.statusCode};
    if (error) {
        pageResults.error = error;
    }
    else if (body) {
        var dom = new jsdom.JSDOM(body);

        // Add the page's elements with IDs to our map of known placeholders.
        var pageIdNodeList = dom.window.document.querySelectorAll("[id]");
        var pageIds = [];
        for (var b = 0; b < pageIdNodeList.length; b++) {
            pageIds.push(pageIdNodeList.item(b).id);
        }
        that.idsByPage[pageToScan] = pageIds;

        var linksNodeList = dom.window.document.querySelectorAll("a[href]");
        for (var a = 0; a < linksNodeList.length; a++) {
            var link = linksNodeList.item(a);
            var href = link.href;

            if (href && href.length) {
                var resolvedHref = fluid.tests.docs.linkChecker.resolveSafely(pageToScan, href);

                var linkBeforeHash = fluid.tests.docs.linkChecker.urlBeforeHash(resolvedHref);
                var linkAfterHash  = fluid.tests.docs.linkChecker.urlAfterHash(resolvedHref);

                // As long as this is a placeholder link somewhere within the site, hold on to it to check later.
                if (linkAfterHash.length && resolvedHref.indexOf(that.options.baseUrl) === 0) {
                    that.internalLinksToCheck.push(resolvedHref);
                }

                // Links to other pages within the site, including subdirectories.  Add new links to the queue.
                if (linkBeforeHash !== pageToScan && resolvedHref.indexOf(that.options.baseUrl) === 0) {
                    if (that.pagesToScan.indexOf(linkBeforeHash) === -1) {
                        that.pagesToScan.push(linkBeforeHash);
                    }
                }
                // External and loopback links are ignored.
                else {
                    // fluid.log("Ignoring link '", resolvedHref, "'...");
                }
            }
        }
    }

    that.scannedPages[pageToScan] = pageResults;
};

fluid.defaults("fluid.tests.docs.linkChecker", {
    gradeNames: ["fluid.component"],
    members: {
        idsByPage:            {},
        internalLinksToCheck: [],
        pagesToScan:          [],
        brokenInternalLinks:  [],
        brokenPageLinks:      [],
        scannedPages:         {}
    },
    rules: {
        report: {
            "scannedPages":        "scannedPages",
            "brokenInternalLinks": "brokenInternalLinks",
            "brokenPageLinks":     "brokenPageLinks"
        }
    },
    events: {
        onResultsAvailable: null
    },
    invokers: {
        startScan: {
            funcName: "fluid.tests.docs.linkChecker.startScan",
            args:     ["{that}"]
        },
        scanSinglePageOrFinish: {
            funcName: "fluid.tests.docs.linkChecker.scanSinglePageOrFinish",
            args:     ["{that}"]
        }
    }
});
