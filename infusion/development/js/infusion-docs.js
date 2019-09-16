/* eslint-env browser:true node:false */
(function ($) {
    "use strict";
    fluid.registerNamespace("fluid.docs");

    fluid.docs.findActivePageToc = function () {
        var allPages = $(".infusion-docs-TOC li .infusion-docs-TOC-pageName");
        var activePage = allPages.filter(":not(a *)");
        return activePage;
    };

    fluid.docs.scrollActivePageTocIntoView = function () {
        var active = fluid.docs.findActivePageToc();
        if (active.length === 1) {
            active[0].scrollIntoView();
        }
    };

    fluid.docs.headerLinkMarkup = "<a class=\"infusion-docs-anchor\" aria-hidden=\"true\" href=\"%href\"><span class=\"octicon octicon-link\"></a>";

    fluid.docs.fabricateHeaderLinks = function () {
        var headers = $(":header");
        fluid.each(headers, function (header) {
            var id = header.id;
            var anchor = $(fluid.stringTemplate(fluid.docs.headerLinkMarkup, {href: "#" + id}));
            var jHeader = $(header);
            jHeader.prepend(anchor);
            var link = $("span", anchor);
            jHeader.add(anchor).hover(function () {
                link.css("visibility", "visible");
            }, function () {
                link.css("visibility", "hidden");
            });
            link.css("visibility", "hidden"); // We do not apply this in the stylesheet because it does not work, for reasons I cannot explain
        });
    };

    fluid.docs.onLoad = function () {
        fluid.docs.scrollActivePageTocIntoView();
        fluid.docs.fabricateHeaderLinks();
    };
})(jQuery);
