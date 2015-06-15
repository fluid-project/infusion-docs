---
title: API Changes from 1.5 to 2.0
layout: default
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 2.0.

## Framework Changes ##

### Core Framework ###

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

### Preferences Framework ###

#### Namespace Changes ####

Rename "fluid.prefs.enactors" to "fluid.prefs.enactor"

#### Component Grade Changes ####

<div class="infusion-docs-note"><strong>Note:</strong> According to the [comment](https://github.com/fluid-project/infusion/blob/master/src/framework/core/js/FluidView.js#L38-L39) on the implementation for relay components, in Infusion 2.0, relay components will be renamed back to its original names. If the rename has been made, this section can be ignored.</div>

* Replace "fluid.modelComponent" with "fluid.modelRelayComponent"
* Replace "fluid.standardComponent" with "fluid.standardRelayComponent"
* Replace "fluid.viewComponent" with "fluid.viewRelayComponent"
* Replace "fluid.rendererComponent" with "fluid.rendererRelayComponent"

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

#### PrefsEditor Model Structure Changes ####

##### A new model path for preferences #####

###### In 1.5 ######

In Infusion 1.5, all preferences reside at the root of the `prefEditor` component model.

```javascript
/*******************************************************************************
 * Starter root Model
 *
 * Provides the default values for the starter enhancer/panels models
 *******************************************************************************/

fluid.defaults("fluid.prefs.initialModel.starter", {
    gradeNames: ["fluid.prefs.initialModel", "autoInit"],
    members: {
        // TODO: This information is supposed to be generated from the JSON
        // schema describing various preferences. For now it's kept in top
        // level prefsEditor to avoid further duplication.
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

In Infusion 2.0, preferences are moved to a model path named "preferences" so the prefsEditor model can be used to save other user data as well. This means, the enhancer model no longer receives the entire prefsEditor model. It only receives the value of "preferences" path.

```javascript
/*******************************************************************************
 * Starter prefsEditor Model
 *
 * Provides the default values for the starter prefsEditor model
 *******************************************************************************/

fluid.defaults("fluid.prefs.initialModel.starter", {
    gradeNames: ["fluid.prefs.initialModel", "autoInit"],
    members: {
        // TODO: This information is supposed to be generated from the JSON
        // schema describing various preferences. For now it's kept in top
        // level prefsEditor to avoid further duplication.
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
