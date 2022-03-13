---
title: Auxiliary Schema for Preferences Framework
category: Infusion
---

An Auxiliary Schema is a JSON document that defines the information needed to build a preferences editor interface, including

* what component(s) to use to render the preference panels,
* where to find HTML templates and string bundles,
* what component(s) to use to act on preference settings.

An auxiliary schema must contain some required properties, described below. In addition to these properties, developers
are free to include any other properties their implementation may require.

## Properties

### Top-level properties

* `namespace` (optional)
  * the namespace of the component to call to initialize the constructed grades
* `loaderGrades` (optional)
  * an array of grades to be applied to the `prefsEditorLoader`. To modify the default prefsEditor type
    (`"fluid.prefs.separatedPanel"`), a valid alternative should be supplied here.
* `generatePanelContainers`
  * Indicate if the panel containers should be generated. If `false` it is expected that the supplied template already
    contains all of the necessary container elements. Default is `true`.
* `terms`
  * defines paths to directories containing the message files and template files. This property is used to define all
    common terms used by `fluid.prefs.resourceLoader`.
* `message`
  * the path to the message bundle for the prefs editor itself
  * provided the term name defined in the `terms` block for the path to the directory containing the messages is
    `messagePrefix`, use `%messagePrefix` to reference the prefix specified by `messagePrefix` as part of the path
* `template`
  * the path to the template for the prefs editor itself
  * provided the term name defined in the `terms` block for the path to the directory containing the html templates is
    `templatePrefix`, use `%templatePrefix` to reference the prefix specified by `templatePrefix` as part of the path

### Preference block properties

Preference blocks are keyed off of the preference name, which is also used for the preference map and must match the
string defined by the [Primary Schema](PrimarySchemaForPreferencesFramework.md). Preference blocks have  the following
properties:

* `panel`
  * specifies the configuration for the panel component
  * each preference block can specify only one panel
* `enactor`
  * specifies the configuration for the enactor component
  * each preference block can specify only one enactor

### Panel properties

* `type`
  * used to identify the component to use
* `container`
  * the DOM element to use as a container for the component
  * only used in the "`panel`" block
* `template`
  * the path to the template for the panel
  * provided the term name defined in [the top level `terms` property](#top-level-properties) for the path to the
    directory containing the templates is `templatePrefix`, use `%templatePrefix` to reference the prefix specified by
    `templatePrefix` as part of the path
* `message`
  * the path to the message bundle for the panel
  * provided the term name defined in [the top level `terms` property](#top-level-properties) for the path to the
    directory containing the messages is `messagePrefix`, use `%messagePrefix` to reference the prefix specified by
    `messagePrefix` as part of the path

### Enactor properties

* `type`
  * used to identify the component to use

### Composite Panel properties

* `groups`
  * contains named composite panel blocks, similar to panel definitions described above
  * contains special `panels` property listing names of subpanels to include

For detailed information about how to work with composite panels, see [Composite Panels](CompositePanels.md).

## Example Auxiliary Schema

```json5
{
    // The common terms to use in "template" and "message" properties in "panels" elements
    "terms": {
        // The template defined in "panels" element will take precedence over this definition.
        "templatePrefix": "../../../framework/preferences/html",
        // The message defined in "panels" element will take precedence over this definition.
        "messagePrefix": "../../../framework/preferences/messages",
    },

    // The path to the preferences editor own template (e.g. the separated panel prefs editor template)
    "template": "%templatePrefix/SeparatedPanelPrefsEditor.html",

     // The path to the preferences editor own message file (e.g. the separated panel prefs editor message file)
    "message": "%messagePrefix/prefsEditor.json",

    "fluid.prefs.textSize": {
        "alias": "textSize",
        "enactor": {
            "type": "fluid.prefs.enactor.textSize"
        },
        "panel": {
            "type": "fluid.prefs.panel.textSize",
            "container": ".flc-prefsEditor-text-size",  // the css selector in the template where the panel is rendered
            "message": "%messagePrefix/textSize.json",
            "template": "%templatePrefix/PrefsEditorTemplate-textSize.html"
        }
    }
}
```

```JavaScript
fluid.defaults("fluid.prefs.auxSchema.textSize", {
    gradeNames: ["fluid.prefs.auxSchema"],
    auxiliarySchema: {
        "fluid.prefs.textSize": {
            alias: "textSize",
            enactor: {
                type: "fluid.prefs.enactor.textSize"
            },
            panel: {
                type: "fluid.prefs.panel.textSize",
                container: ".flc-prefsEditor-text-size",  // the css selector in the template where the panel is rendered
                message: "%messagePrefix/textSize.json",
                template: "%templatePrefix/PrefsEditorTemplate-textSize.html"
            }
        }
    }
});
```
