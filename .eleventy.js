require('./index')
require('./src/scripts/create-search-digest');
var hljs = require('highlight.js');

module.exports = function (eleventyConfig) {
    var markdownit = require('markdown-it')({
		html: true,
		highlight: function (str, lang) {
			if (lang && hljs.getLanguage(lang)) {
			  try {
				return '<pre class="highlight"><code class="hljs ' + lang + '">' +
					   hljs.highlight(lang, str, true).value +
					   '</code></pre>';
			  } catch (__) {}
			}
			return '<pre class="highlight"><code class="hljs ' + lang + '">' + markdownit.utils.escapeHtml(str) + '</code></pre>';
		}
    });

	eleventyConfig.setLibrary("md", markdownit);
    eleventyConfig.addPassthroughCopy({
        "node_modules/infusion/dist": "lib/infusion/dist",
        "node_modules/infusion/src": "lib/infusion/src",
        "node_modules/foundation-sites/css": "lib/foundation",
        "node_modules/octicons/octicons": "lib/octicons",
        "node_modules/lunr": "lib/lunr",
        "node_modules/gpii-express/src/js/lib": "lib/gpii-express",
        "node_modules/gpii-binder/src/js": "lib/gpii-binder",
        "node_modules/gpii-location-bar-relay/src/js": "lib/gpii-location-bar-relay",
        "src/static/css": "css",
        "src/static/fonts": "fonts",
        "src/static/js": "js",
        "src/static/images": "images",
        "src/scripts": "js",
        "src/documents/images": "images"
    });

    eleventyConfig.addHandlebarsHelper("ifEqual", function(a, b, options) {
        if (a === b) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    eleventyConfig.addHandlebarsHelper("rewriteMdLinks", function(content) {
        return content.replace(/(<a\s[^>]*href="[\w-/\.]+)\.md(["#])/gm, "$1.html$2");
    });

    return {
        dir: {
            input: "./src/documents",
            output: "./out",
            includes: "../layouts",
            data: "../_data"
        },
        pathPrefix: "/infusion/development/"
    }
}