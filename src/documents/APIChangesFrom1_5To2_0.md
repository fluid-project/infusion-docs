---
title: API Changes from 1.5 to 2.0
layout: default
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 2.0.

## Framework Changes ##

### Preferences Framework ###

#### Namespace Changes ####

Rename "fluid.prefs.enactors" to "fluid.prefs.enactor"

#### Component Grade Changes ####

<div class="infusion-docs-note"><strong>Note:</strong> According to the [comment](https://github.com/fluid-project/infusion/blob/master/src/framework/core/js/FluidView.js#L38-L39) on the implementation for relay components, in Infusion 2.0, relay components will be renamed back to its original names. If the rename has been made, this section can be ignored.</div>

* Replace "fluid.modelComponent" with "fluid.modelRelayComponent"
* Replace "fluid.standardComponent" with "fluid.standardRelayComponent"
* Replace "fluid.viewComponent" with "fluid.viewRelayComponent"
* Replace "fluid.rendererComponent" with "fluid.rendererRelayComponent"

#### Model Sharing Changes ####

##### In 1.5 #####

In Infusion 1.5, sharing models between non-relay components requires the change applier to be shared as a member option along with the model:

```javascript
fluid.default("fluid.parent", {
    gradeNames: ["fluid.standardComponent", "autoInit"],
    components: {
        child: {
            type: "fluid.standardComponent",
            options: {
                members: {
                    applier: "{parent}.applier"
                },
                model: "{parent}.model"
            }
        }
    }
});
```

##### In 2.0 #####

In Infusion 2.0 where relay components are introduced, sharing models no longer requires the change applier to be shared:

```javascript
fluid.default("fluid.parent", {
    gradeNames: ["fluid.standardRelayComponent", "autoInit"],
    components: {
        child: {
            type: "fluid.standardRelayComponent",
            options: {
                model: "{parent}.model"
            }
        }
    }
});
```

#### Enactor Listener Changes ####

##### In 1.5 #####

In Infusion 1.5, enactors use non-relay components where the decalration of model listeners had not been implemented. Enactors use:
* The `finalInit()` function to register model listeners
* An `onCreate` listener to apply the initial preference value that the model receives:

```javascript
fluid.defaults("fluid.prefs.enactor.textSize", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor", "autoInit"],
    preferenceMap: {
        "fluid.prefs.textSize": {
            "model.value": "default"
        }
    },
    invokers: {
        set: {
            funcName: "fluid.prefs.enactor.textSize.set",
            args: ["{arguments}.0", "{that}"]
        }
    },
    listeners: {
        onCreate: {
            listener: "{that}.set",
            args: "{that}.model.value"
        }
    }
});

fluid.prefs.enactor.textSize.set = function (value, that) {
    that.root.css("font-size", value + "px");
};

fluid.prefs.enactor.textSize.finalInit = function (that) {
    that.applier.modelChanged.addListener("value", function (newModel) {
        that.set(newModel.value);
    });
};
```

##### In 2.0 #####

In Infusion 2.0 where enactors use relay components, the `finalInit()` and the `onCreate` listener are replaced by declaring a model listener:

```javascript
fluid.defaults("fluid.prefs.enactor.textSize", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor", "autoInit"],
    preferenceMap: {
        "fluid.prefs.textSize": {
            "model.value": "default"
        }
    },
    invokers: {
        set: {
            funcName: "fluid.prefs.enactor.textSize.set",
            args: ["{arguments}.0", "{that}"]
        }
    },
    modelListeners: {
        value: {
            listener: "{that}.set",
            args: ["{change}.value"]
        }
    }
});

fluid.prefs.enactor.textSize.set = function (value, that) {
    that.root.css("font-size", value + "px");
};
```

#### Schema Changes ####

##### Specifying a prefsEditor type #####

###### In 1.5 ######

In Infusion 1.5 a `prefsEditorType` option was used to specify the type. The default was `"fluid.prefs.separatedPanel"`.

```javascript
// using a previous constructed grade
your.constructed.prefsEditor(".container", {
    prefsEditorType: "fluid.prefs.fullNoPreview"
});

// using fluid.prefs.create to construct the grade
fluid.prefs.create(container, {
    build: {
        gradeNames: ["fluid.prefs.auxSchema.starter"],
        auxiliarySchema: {
            "template": "%prefix/FullNoPreviewPrefsEditor.html",
            "templatePrefix": "../../../../../src/framework/preferences/html/",
            "messagePrefix": "../../../../../src/framework/preferences/messages/",
            "tableOfContents": {
                "enactor": {
                    "tocTemplate": "../../../../../src/components/tableOfContents/html/TableOfContents.html"
                }
            }
        }
    },
    prefsEditor: {
        prefsEditorType: "fluid.prefs.fullNoPreview"
    }
});
```

###### In 2.0 ######

In Infusion 2.0 the prefsEditor type is specified in a grade passed into the prefsEditorLoader via the `loaderGrades` property in the auxiliarySchema.
By default the `"fluid.prefs.separatedPanel"` grade is applied. Any grade to be applied to the prefsEditorLoader can be passed in; however, you must also supply the type grade as the default will be replaced by any modification.

```javascript
var auxiliarySchema = {
    "loaderGrades": ["fluid.prefs.fullNoPreview"]
};
```

##### A new "terms" block #####

###### In 1.5 ######

In Infusion 1.5, `messagePrefix` and `templatePrefix` are root level data defined in the auxiliary schema. When referring to them for locations of message bundles or html templates, a common `%prefix` is used, which causes confusion.

```javascript
fluid.defaults("fluid.prefs.auxSchema.starter", {
    gradeNames: ["fluid.prefs.auxSchema", "autoInit"],
    auxiliarySchema: {
        "loaderGrades": ["fluid.prefs.separatedPanel"],
        "namespace": "fluid.prefs.constructed", // The author of the auxiliary schema will provide this and will be the component to call to initialize the constructed PrefsEditor.
        "templatePrefix": "../../framework/preferences/html/",  // The common path to settings panel templates. The template defined in "panels" element will take precedence over this definition.
        "template": "%prefix/SeparatedPanelPrefsEditor.html",
        "messagePrefix": "../../framework/preferences/messages/",  // The common path to settings panel templates. The template defined in "panels" element will take precedence over this definition.
        "message": "%prefix/prefsEditor.json",
        "textSize": {
            "type": "fluid.prefs.textSize",
            "enactor": {
                "type": "fluid.prefs.enactor.textSize"
            },
            "panel": {
                "type": "fluid.prefs.panel.textSize",
                "container": ".flc-prefsEditor-text-size",  // the css selector in the template where the panel is rendered
                "template": "%prefix/PrefsEditorTemplate-textSize.html",
                "message": "%prefix/textSize.json"
            }
        }
        ...
    }
});
```

###### In 2.0 ######

In Infusion 2.0, both `templatePrefix` and `messagePrefix` become sub-elements of a `terms` block. The `terms` block is used to define all string templates used by `fluid.prefs.resourceLoader`. To refer to these terms, rather than using an ambiguous `%prefix`, use the defined term names such as `%templatePrefix` or `%messagePrefix`.

```javascript
fluid.defaults("fluid.prefs.auxSchema.starter", {
    gradeNames: ["fluid.prefs.auxSchema", "autoInit"],
    auxiliarySchema: {
        "loaderGrades": ["fluid.prefs.separatedPanel"],
        "namespace": "fluid.prefs.constructed", // The author of the auxiliary schema will provide this and will be the component to call to initialize the constructed PrefsEditor.
        "terms": {
            "templatePrefix": "../../framework/preferences/html",  // Must match the keyword used below to identify the common path to settings panel templates.
            "messagePrefix": "../../framework/preferences/messages"  // Must match the keyword used below to identify the common path to message files.
        },
        "template": "%templatePrefix/SeparatedPanelPrefsEditor.html",
        "message": "%messagePrefix/prefsEditor.json",
        "textSize": {
            "type": "fluid.prefs.textSize",
            "enactor": {
                "type": "fluid.prefs.enactor.textSize"
            },
            "panel": {
                "type": "fluid.prefs.panel.textSize",
                "container": ".flc-prefsEditor-text-size",  // the css selector in the template where the panel is rendered
                "template": "%templatePrefix/PrefsEditorTemplate-textSize.html",
                "message": "%messagePrefix/textSize.json"
            }
        },
        ...
    }
});
```
#### UI Options Changes ####
Changes and additions are being made to UI Options in order to improve its compliance with accesibility standards.

Additional descriptors were added to panels without. These include the text size, text font, line space, and contrast panels while remaining panels underwent updates.

#####** Message Bundles and Selectors **#####
New key value pair references and selectors added.

*Additions*
* textSizeDescr
* textFontDescr
* lineSpaceDescr
* contrastDescr

Selectors share the same name as the key value pair references.

*Changes*
<table>
<tr><th> 1.5</th><th>2.0</th></tr>
<tr>
    <td><code>speakChoiceLabel</code></td>
    <td><code>speakDescr</code></td>
</tr>
<tr>
    <td><code>tocChoiceLabel</code></td>
    <td><code>tocDescr</code></td>
</tr>
<tr>
    <td><code>simplifyChoiceLabel</code></td>
    <td><code>simplifyDescr</code></td>
</tr>
</table>

#####** CSS Class Selectors **#####
New CSS class selectors to compliment the new selectors

*Additions*
* flc-prefsEditor-contrast-descr
* flc-prefsEditor-linespace-descr
* flc-prefsEditor-textsize-descr
* flc-prefsEditor-textfont-descr

*Changes*
<table>
<tr><th> 1.5</th><th>2.0</th></tr>
<tr>
    <td><code>flc-prefsEditor-toc-choice-label </code></td>
    <td><code>flc-prefsEditor-toc-descr</code></td>
</tr>
<tr>
    <td><code>flc-prefsEditor-speak-choice-label</code></td>
    <td><code>flc-prefsEditor-speak-descr</code></td>
</tr>
<tr>
    <td><code>demo-prefsEditor-simplify-choice-label</code></td>
    <td><code>demo-prefsEditor-simplify-descr</code></td>
</tr>
</table>
