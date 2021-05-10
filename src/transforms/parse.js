"use strict";
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

module.exports = function (value, outputPath) {
    if (outputPath && outputPath.includes(".html")) {
        const DOM = new JSDOM(value, {
            resources: "usable"
        });

        const document = DOM.window.document;
        const headings = [...document.querySelectorAll(".infusion-docs-articleContainer h1, .infusion-docs-articleContainer h2, .infusion-docs-articleContainer h3, .infusion-docs-articleContainer h4")];

        if (headings.length) {
            headings.forEach(heading => {
                const href = heading.id || "";
                heading.innerHTML = `<a class="infusion-docs-anchor" aria-label="${heading.textContent}" href="#${href}"><span class="octicon octicon-link" aria-hidden="true"></span></a>${heading.textContent}`;
            });
        }

        return "<!DOCTYPE html>\r\n" + document.documentElement.outerHTML;
    }
    return value;
};
