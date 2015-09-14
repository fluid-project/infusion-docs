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