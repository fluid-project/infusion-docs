"use strict";
module.exports = {
    eleventyComputed: {
        permalink: (data) => {
            return "/infusion/development" + data.page.filePathStem.replace("/documents", "") + ".html";
        },
        githubLocation: (data) => {
            // The documentation root on GitHub:
            // Used to build URLs for "Edit on GitHub" links
            var githubDocRoot = "https://github.com/fluid-project/infusion-docs/blob/main/src";
            // in case we're on Windows, replace "\" in the path with "/"
            var relativePath = data.page.filePathStem.replace(/\\/g, "/");
            return githubDocRoot + relativePath + ".md";
        }
    }
};
