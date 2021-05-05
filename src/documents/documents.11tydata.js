"use strict";
module.exports = {
    eleventyComputed: {
        permalink: (data) => {
            return "/infusion/development" + data.page.filePathStem.replace("/documents", "") + ".html";
        }
    }
};
