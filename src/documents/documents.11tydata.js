"use strict";
module.exports = {
    eleventyComputed: {
        permalink: (data) => {
            return "/infusion/development" + data.page.filePathStem.replace("/documents", "") + ".html";
        },

        // Generate a URL for "Edit on GitHub" for the current document
        githubLocation: (data) => {
            // The documentation root on GitHub:
            var githubDocRoot = "https://github.com/fluid-project/infusion-docs/blob/main/src";
            // In case we're on Windows, replace "\" in the path with "/"
            var relativePath = data.page.filePathStem.replace(/\\/g, "/");
            return githubDocRoot + relativePath + ".md";
        }
    }
};
