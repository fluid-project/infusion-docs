---
title: API Changes from 1.5 to 2.0
layout: default
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 2.0.

## Framework Changes ##

### Core Framework Changes ###

This section describes major APIs that were in common use. For information about less widely-used features removed in 2.0, consult [Deprecations in 1.5](DeprecationsIn1_5.md).

#### Component Grade Changes ####

* Replace "fluid.eventedComponent" and "fluid.littleComponent" with "fluid.component"
* Replace "fluid.standardComponent", "fluid.modelRelayComponent" and "fluid.standardRelayComponent" with "fluid.modelComponent"
* Replace "fluid.viewRelayComponent" with "fluid.viewComponent"
* Replace "fluid.rendererRelayComponent" with "fluid.rendererComponent"
* Remove "autoInit" - it is now the default for every component
* Order of merging component grades has reversed - grades at the right-hand end of the `gradeNames` list now take priority over those at the left

#### fluid.demands ####

`fluid.demands` has been removed from the framework. Depending on your use case, these uses can be replaced by one or more of:

* [dynamic grades](ComponentGrades.md#dynamic-grades)
* [options distributions](IoCSS.md)
* [context awareness directives](ContextAwareness.md)

#### Manual lifecycle points ####

The component events `preInit`, `postInit` and `finalInit` have been removed. Instead use listeners to `onCreate` together with a suitable namespace
and [priority](Priorities.md) declaration if necessary.

The component events `onAttach` and `onClear` have also been removed.

#### Dynamic invokers ####
In Infusion 1.5, standard invokers cached all of their arguments that were not part of `{arguments}` or `{that}.model` on their first use, unless they
had the annotation `dynamic: true`. In 2.0, all invoker arguments are evaluated freshly on each invokation, and the `dynamic: true` annotation is no
longer used.

#### Options distributions ####

Every component now supports a top-level options area named `distributeOptions`, which contains records which include `priority` and `namespace` entries - consult the page on [options distributions](IoCSS.md) for more details.

#### Progressive Enhancement becomes Context Awareness ####

The old "progressive enhancement" API has been removed and replaced with a new API [ContextAwareness](ContextAwareness.md).

#### Constraint-based priorities ####

In addition to the old-style numeric and `first`/`last` priorities, constraint-based priorities of the form `before:namespace` and `after:namespace` are supported
on event listeners as well as in numerous other areas of configuration - consult [Priorities](Priorities.md).

#### `fluid.makeEventFirer` ####

The utility `fluid.event.makeEventFirer` has been moved to `fluid.makeEventFirer` and accepts an options structure rather than an argument list.

#### Model Sharing Changes ####

##### In 1.5 #####

In Infusion 1.5, sharing models between non-relay components requires the change applier to be shared as a member option along with the model:

```javascript
fluid.default("fluid.parent", {
    gradeNames: ["fluid.modelComponent"],
    components: {
        child: {
            type: "fluid.modelComponent",
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

In Infusion 2.0 where relay components are introduced, the [change applier](ChangeApplierAPI.md) must not be configured separately - model sharing
just happens automatically:

```javascript
fluid.default("fluid.parent", {
    gradeNames: ["fluid.modelComponent"],
    components: {
        child: {
            type: "fluid.modelComponent",
            options: {
                model: "{parent}.model"
            }
        }
    }
});
```

#### Model Reference Changes ####

In Infusion 1.5, the base model reference `that.model` could be relied upon to be i) an Object, and ii) constant for the lifetime of a component. In Infusion 2.0,
this model reference may change at any time and therefore must not be closed over. In addition, `that.model` may hold any JS type including primitives, `null` and `undefined`.


### Preferences Framework ###

#### Panel Changes ####

##### Message Bundle Keys #####

###### Additions ######
* `textSizeDescr`
* `textFontDescr`
* `lineSpaceDescr`
* `contrastDescr`

###### Changes ######
<table>
<tr><th> 1.5</th><th>2.0</th></tr>
<tr>
    <td><code>choiceLabel</code></td>
    <td><code>speakDescr</code></td>
</tr>
<tr>
    <td><code>choiceLabel</code></td>
    <td><code>tocDescr</code></td>
</tr>
<tr>
    <td><code>choiceLabel</code></td>
    <td><code>simplifyDescr</code></td>
</tr>
</table>

##### Selectors #####

###### Additions ######
* `contrastDescr: .flc-prefsEditor-contrast-descr`
* `lineSpaceDescr: .flc-prefsEditor-line-space-descr`
* `textSizeDescr: .flc-prefsEditor-text-size-descr`
* `textFontDescr: .flc-prefsEditor-text-font-descr`

###### Changes ######
<table>
<tr><th>1.5</th><th>2.0</th></tr>
<tr>
    <td><code>choiceLabel: ".flc-prefsEditor-toc-choice-label"</code></td>
    <td><code>tocDescr: ".flc-prefsEditor-toc-descr"</code></td>
</tr>
<tr>
    <td><code>choiceLabel: ".flc-prefsEditor-speak-choice-label"</code></td>
    <td><code>speakDescr: ".flc-prefsEditor-speak-descr"</code></td>
</tr>
</table>

##### Styles #####

###### Changes ######
<table>
<tr><th>1.5</th><th>2.0</th></tr>
<tr>
    <td><code>.heading-text</code></td>
    <td><code>.fl-heading-text</code></td>
</tr>
</table>

#### Namespace Changes ####

Rename "fluid.prefs.enactors" to "fluid.prefs.enactor"

#### Enactor Changes ####

##### Styles #####

###### Removals ######

* `.fl-font-serif`
* `.fl-font-sans`
* `.fl-font-monospace`
* `.fl-font-courier`
* `.fl-toggleButton`
* `.fl-theme-prefsEditor-bw`
* `.fl-theme-prefsEditor-wb`
* `.fl-theme-prefsEditor-by`
* `.fl-theme-prefsEditor-yb`
* `.fl-theme-prefsEditor-lgdg`

##### Listeners #####

###### In 1.5 ######

In Infusion 1.5, enactors use non-relay components where the declaration of model listeners had not been implemented. Enactors use:
* The `finalInit()` function to register model listeners
* An `onCreate` listener to apply the initial preference value that the model receives:

```javascript
fluid.defaults("fluid.prefs.enactor.textSize", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
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

###### In 2.0 ######

In Infusion 2.0 enactors use model relay components and the `finalInit()` and the `onCreate` listener are replaced by declaring a model listener:

```javascript
fluid.defaults("fluid.prefs.enactor.textSize", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
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

In Infusion 1.5, a `prefsEditorType` option was used to specify the type. The default was `"fluid.prefs.separatedPanel"`.

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

In Infusion 2.0, the prefsEditor type is specified in a grade passed into the prefsEditorLoader via the `loaderGrades` property in the auxiliarySchema.
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

In Infusion 2.0, both `templatePrefix` and `messagePrefix` become sub-elements of a `terms` block. The `terms` block is used to define all string templates used by `fluid.prefs.resourceLoader`.
To refer to these terms, rather than using an ambiguous `%prefix`, use the specific term names such as `%templatePrefix` or `%messagePrefix`.

```javascript
fluid.defaults("fluid.prefs.auxSchema.starter", {
    gradeNames: "fluid.prefs.auxSchema",
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

#### PrefsEditor Changes ####

##### Selectors #####

###### Removals ######

* `.flc-prefsEditor-separatedPanel-tabs`
* `.flc-prefsEditor-controls`

##### Styles #####

###### Removals ######

* `.fl-prefsEditor-option-description`
* `.fl-prefsEditor-separatedPanel-toc`
* `.fl-prefsEditor-text-icon`
* `.fl-prefsEditor-layout-icon`
* `.fl-prefsEditor-links-icon`
* `.fl-prefsEditor-save`
* `.fl-prefsEditor-cancel`
* `.fl-icon-lines`
* `.fl-icon-preferences`
* `.fl-icon-next`
* `.fl-icon-prev`
* `.fl-icon-speak`

##### A new model path "preferences" #####

###### In 1.5 ######

In Infusion 1.5, all preferences reside at the root of the `prefsEditor` component's model.

```javascript
/*******************************************************************************
 * Starter root Model
 *
 * Provides the default values for the starter enhancer/panels models
 *******************************************************************************/

fluid.defaults("fluid.prefs.initialModel.starter", {
    gradeNames: ["fluid.prefs.initialModel", "autoInit"],
    members: {
        initialModel: {
            textFont: "default",          // key from classname map
            theme: "default",             // key from classname map
            textSize: 1,                  // in points
            lineSpace: 1,                 // in ems
            toc: false,                   // boolean
            links: false,                 // boolean
            inputsLarger: false           // boolean
        }
    }
});
```

###### In 2.0 ######

In Infusion 2.0, preferences are moved to a model path named `preferences` so the prefsEditor model can be used to save other user data as well.
This means that the enhancer model no longer receives the entire prefsEditor model. It only receives the value held at the path `preferences`.

```javascript
/*******************************************************************************
 * Starter prefsEditor Model
 *
 * Provides the default values for the starter prefsEditor model
 *******************************************************************************/

fluid.defaults("fluid.prefs.initialModel.starter", {
    gradeNames: "fluid.prefs.initialModel",
    members: {
        initialModel: {
            preferences: {
                textFont: "default",          // key from classname map
                theme: "default",             // key from classname map
                textSize: 1,                  // in points
                lineSpace: 1,                 // in ems
                toc: false,                   // boolean
                links: false,                 // boolean
                inputsLarger: false           // boolean
            }
        }
    }
});
```

## Component Changes ##

### Uploader Changes ###

Removed deprecated string tokens.

<table>
    <tr><th>String</th><th>Tokens</th></tr>
    <tr>
        <td><code>toUploadLabel</code></td>
        <td>
            <code>fileCount</code>,
            <code>fileLabel</code>,
            <code>totalBytes</code>
        </td>
    </tr>
    <tr>
        <td><code>totalProgressLabel</code></td>
        <td>
            <code>curFileN</code>,
            <code>totalFilesN</code>,
            <code>fileLabel</code>,
            <code>currBytes</code>,
            <code>totalBytes</code>
        </td>
    </tr>
    <tr>
        <td><code>completedLabel</code></td>
        <td>
            <code>curFileN</code>,
            <code>totalFilesN</code>,
            <code>fileLabel</code>,
            <code>totalCurrBytes</code>
        </td>
    </tr>
</table>
