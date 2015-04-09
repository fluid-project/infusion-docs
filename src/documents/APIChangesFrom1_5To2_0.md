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
