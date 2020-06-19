---
title: "Preferences Framework: Minimal Footprint"
layout: default
category: Tutorials
---

Website performance optimization can be split into several categories: backend, over the wire, and front end. When
constructing your optimization strategy, you should examine the effect that each category has on your site's
performance. This document will focus on optimizing "over the wire" and "front end" performance when employing the
[Preferences Framework](../PreferencesFramework.md) on a site; however, it does not examine potential backend
optimizations.

Below are some resources which discuss general website optimization strategies:

* [https://developers.google.com/speed/](https://developers.google.com/speed/)
* [https://developers.google.com/speed/docs/insights/rules](https://developers.google.com/speed/docs/insights/rules)
* [https://developers.google.com/web/fundamentals/performance](https://developers.google.com/web/fundamentals/performance)
* [https://www.maxcdn.com/blog/frontend-optimizations/](https://www.maxcdn.com/blog/frontend-optimizations/)
* [https://www.smashingmagazine.com/2014/09/improving-smashing-magazine-performance-case-study/](https://www.smashingmagazine.com/2014/09/improving-smashing-magazine-performance-case-study/)
* [https://hpbn.co](https://hpbn.co)

## Optimization of the Preferences Framework

* Use a minified [custom build of Infusion](https://github.com/fluid-project/infusion#how-do-i-create-an-infusion-package)
* Use the grade version of a full page [Preferences Editor](../PreferencesEditor.md)
* [Lazy load](https://en.wikipedia.org/wiki/Lazy_loading)

To see a live version of the example outlined below, open the [Minimal Footprint - Preferences
Framework](http://build.fluidproject.org/infusion/examples/framework/preferences/minimalFootprint/) example.

<div class="infusion-docs-note">
    <strong>Note:</strong> The example outlined below uses individual JS files. However, these can be substituted by
    using an Infusion build.
</div>

### Minified Custom Build

Infusion provides a build tool for creating minified custom packages. This is essential for creating the smallest
package which requires the fewest requests. From the Infusion root directory run `grunt custom --include="preferences"`,
which will create a zip file containing all of the bundled code.

See: "[How Do I Create an Infusion
Package](https://github.com/fluid-project/infusion/blob/master/README.md#how-do-i-create-an-infusion-package)"
documentation for the full list of steps.

### Full Page Preferences Editor

Most website integrations of a [Preferences Editor](../PreferencesEditor.md) make use of [UI
Options](../tutorial-userInterfaceOptions/UserInterfaceOptions.md). UI Options provides a convenient interaction for
users to quickly review and modify their preferences without having to leave the page, and presents a live preview of
their adjustments. However, this also adds additional overhead to instantiate the preferences editor and load in all of
the required resources. A Full Page preference editor, on the other hand, is designed to run as a stand alone page and
can be configured with a preview window. Be sure to provide the user with a link to the full page preferences editor,
for example a link on each content page or in the site's user settings.

<div class="infusion-docs-note">
    <strong>Note:</strong> Preferences Editors can be configured either through an <a
    href="../AuxiliarySchemaForPreferencesFramework.md">Auxiliary Schema</a> or directly through grades. The grade
    version is slightly more complicated to configure, but removes computation time for processing the schema.
</div>

#### Instantiating a Full Page Preferences Editor

The following example instantiates a Full Page Preferences Editor with a preview window.
The code consists of the following three parts:

1. `fluid.prefs.globalSettingsStore` - Responsible for storing/retrieving preferences. By default it uses the
   `fluid.prefs.cookieStore` which uses a browser cookie for storage.
2. `fluid.pageEnhancer` - Initializes the UI Enhancer for the page. The UI Enhancer is responsible for applying the
   preferences to the page.
3. `fluid.prefs.fullPreview` - The Full Page prefs editor, including a preview.

(see: [fullPage.html](https://github.com/fluid-project/infusion/blob/master/examples/framework/preferences/minimalFootprint/fullPage.html))

<div class="infusion-docs-note">
    <strong>Note:</strong> The code snippet below can be loaded in through a JavaScript file or added directly to the
    HTML in a <code>&lt;script&gt;</code> tag.
</div>

```javascript
    /*
    /*
     * The various starter gradeNames mentioned below indicate that the
     * "starter" adjusters and enactors should be used. These correspond to the
     * same set of adjusters and enactors used in a typical UI Options
     * configuration. However, a custom set of adjusters and enactors could be
     * configured instead.
     */

    /**
     * Initialize the PrefsEditor global settings store.
     * The globalSettingsStore handles the storage and retrieval of preferences,
     * by default it is configured to use the fluid.prefs.cookieStore
     * which stores preferences in a browser cookie.
     */
    fluid.prefs.globalSettingsStore();

    /**
     * Initialize the UI Enhancer for the page.
     */
    fluid.pageEnhancer({
        uiEnhancer: {
            gradeNames: ["fluid.uiEnhancer.starterEnactors"],
            // The UI Enhancer's Table of Contents uses an HTML template. This tells the component
            // where to find that template.
            tocTemplate: "../../../../src/components/tableOfContents/html/TableOfContents.html"
        }
    });

    fluid.prefs.fullPreview(".demo-prefsEditor-fullWithPreview", {
        gradeNames: ["fluid.prefs.transformDefaultPanelsOptions", "fluid.prefs.initialModel.starter"],
        // Tell PrefsEditor where to find all the resources, relative to this file
        terms: {
            // The Preferences Editor interface is defined by several HTML templates. The component
            // needs to know where those templates are.
            templatePrefix: "../../../../src/framework/preferences/html",
            //  The strings used on Preferences Editor interface are defined in several JSON files. The component
            //  needs to know where those files are.
            messagePrefix: "../../../../src/framework/preferences/messages"
        },
        messageLoader: {
            gradeNames: ["fluid.prefs.starterMessageLoader"]
        },
        templateLoader: {
            gradeNames: ["fluid.prefs.starterFullPreviewTemplateLoader"]
        },
        prefsEditor: {
            gradeNames: ["fluid.prefs.starterPanels", "fluid.prefs.uiEnhancerRelay"],
            listeners: {
                // Tells the PrefsEditor where to redirect to if the user cancels the operation.
                // In this case, it goes back one step in the browser's history.
                onCancel: {
                    "this": window.history,
                    method: "back"
                }
            }
        },
        preview: {
            templateUrl: "html/prefsEditorPreview.html"
        }
    });
```

### Lazy Loading

With a Full Page Preferences Editor we've moved editing preferences off the content pages; however, these pages are
still required to enact/apply the preferences set by the user. Therefore, we still need to instantiate the [Settings
Store](../SettingsStore.md) and [Page Enhancer](../Enactors.md) on each page. However, we only need these if a user has
actually adjusted their preferences. In a default implementation of the Preferences Framework, preferences are stored in
a browser cookie. The simple solution is to check for the presence of this cookie, and only load and instantiate the
Settings Store and Page Enhancer if it's found.

The following example makes use the functions provided by
[loadScripts.js](https://github.com/fluid-project/infusion/blob/master/examples/framework/preferences/minimalFootprint/js/loadScripts.js)
to check the cookie and lazy load the required scripts:

The first step is to check if a cookie for user preferences was set. If it is found, the necessary JavaScript files
should be loaded. By lazy loading the scripts we save on the download and processing time for the scripts when they are
not in use.

(see:
[loadScripts.js](https://github.com/fluid-project/infusion/blob/master/examples/framework/preferences/minimalFootprint/js/loadScripts.js))

<div class="infusion-docs-note">

<strong>Note:</strong> The example below makes use of a build of Infusion, "infusion-custom.js", which is a
concatenated JavaScript file. However, the linked code above uses the individual JavaScript files. Using the single
"infusion-custom.js" file will save on server requests and is the preferred method, but will require a [custom
build](#minified-custom-build) to be generated.
</div>

```html
<!-- Add the following script tag to the HTML of each page -->
<script>
    // "fluid-ui-settings" is the default cookie name
    fluid_load.lazyLoadScripts("fluid-ui-settings", [
        // need to load the custom build of infusion first
        "../infusion/infusion-custom.js",
        // should point at a JavaScript file containing the instantiation of the
        // settings store and page enhancer. You'll need to write this yourself,
        // but an example has been provided below.
        "js/lazyLoad.js"
    ]);
</script>
```

The following is an example of an instantiation script.
(see: [lazyLoad.js](https://github.com/fluid-project/infusion/blob/master/examples/framework/preferences/minimalFootprint/js/lazyLoad.js))

```javascript
/**
 * Initialize the PrefsEditor global settings store.
 * The globalSettingsStore handles the storage and retrieval of preferences,
 * by default it is configured to use the fluid.prefs.cookieStore
 * which stores preferences in a browser cookie.
 */
fluid.prefs.globalSettingsStore();

/**
 * Initialize the UI Enhancer for the page.
 */
fluid.pageEnhancer({
    uiEnhancer: {
        //  The "fluid.uiEnhancer.starterEnactors" grade mentioned below indicate that the
        //  "starter" enactors should be used. These correspond to the
        //  same set of enactors used in a typical UI Options configuration. However, a
        //  custom set of enactors could be configured instead.
        gradeNames: ["fluid.uiEnhancer.starterEnactors"],
        // The UI Enhancer's Table of Contents uses an HTML template. This tells the component
        // where to find that template.
        tocTemplate: "../../../../src/components/tableOfContents/html/TableOfContents.html"
    }
});
```

## Caveats

While the strategy outlined above will improve page load performance, it is not without its drawbacks.

* Prefs Editor
  * Users will have to navigate away from the current content to adjust settings
  * The preview of changes is not a live preview of the content
* Lazy Loading
  * For users that have set preferences, page load will be slightly slower because of the lazy loading overhead
  * For users that have set preferences, there is a higher chance that the user will see the adjustments applied to the
    page (e.g. screen flicker, page layout shifting, and etc.)
