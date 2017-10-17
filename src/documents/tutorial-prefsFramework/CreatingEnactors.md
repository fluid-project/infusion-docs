---
title: Creating Enactors
layout: default
category: Tutorials
---

This article describes how to use the Infusion [Preferences Framework](../PreferencesFramework.md)
to create Enactors, components that act in response to changes to a user's preferences.

## Overview ##

In the [Preferences Framework](../PreferencesFramework.md), "Enactors" are Infusion [components](../UnderstandingInfusionComponents.md) that act upon changes to user preferences.

The configuration information used to define an enactor must include certain required information:

* the `fluid.prefs.enactor` [grade](../ComponentGrades.md) (provided by the Framework)
* a Preference Map (see [below](#preferencemap))
* a renderer [proto-tree](../RendererComponentTrees.md) or `produceTree` function
* selectors for rendering the controls, labels, etc
* any other information required by the enactor

If the enactor will be modifying the view of the interface, you will also want to add the `fluid.viewComponent` grade as well as selectors.

## PreferenceMap ##

Each enactor defines a "preference map," which map the information in the [Primary Schema](../PrimarySchemaForPreferencesFramework.md) into your enactor. The preference map is used to copy the default preference value from the primary schema into the enactor's model. It can also be used to copy any other necessary information from the primary schema into the enactor, if relevant. The values can be mapped to any path in the Panels options, and then they can be accessed through those paths.

### Format ###

```json5
{
    "preferenceMap": {
        "<key of preference from primary schema>": {
            "<path in enactor's options where value should be held>": "<key in primary schema where value held>"
            // ...
        }
        // ...
    }
}
```

### Examples ###

```javascript
fluid.defaults("fluid.prefs.enactor.textSize", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        "fluid.prefs.textSize": {
            "model.value": "default"
        }
    }
    // ...
});
```

```javascript
fluid.defaults("fluid.prefs.enactor.emphasizeLinks", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor.styleElements"],
    preferenceMap: {
        "fluid.prefs.emphasizeLinks": {
            "model.value": "default"
        }
    }
    // ...
});
```

```javascript
fluid.defaults("fluid.videoPlayer.panels.captionsSettings", {
    gradeNames: ["fluid.videoPlayer.panels.mediaSettings"],
    preferenceMap: {
        "fluid.videoPlayer.displayCaptions": {
            "model.show": "default"
        },
        "fluid.videoPlayer.captionLanguage": {
            "model.language": "default"
        }
    }
    // ...
});
```

## Binding to Model Changes ##

The most important thing that an enactor does is listen for changes to its model and act when changes occur. The [Preferences Framework](../PreferencesFramework.md) automatically binds the enactor's model to the user's preferences through the Preferences Map (described above). This means that if the user's preference changes (for example, through the preferences editor), the enactor's model will automatically be updated and a `modelChanged` event will be fired. All the enactor has to do is listen for that `modelChanged` event and carry out whatever adjustments are necessary. (For more information about model changes, see [ChangeApplier API](../ChangeApplierAPI.md); for more information about the events and listeners in general, see [Infusion Event System](../InfusionEventSystem.md)).

`modelChanged` event listeners are bound in a special block of a component's defaults called `modelListeners`. The general format is shown below:

```javascript
modelListeners: {
    <modelpath>: {
        funcName: <listener name>,
        args: [<argument list>]
    }
}
```

In the argument list of a model listener, the `change` object is the original change request, which can be used to access the new model value:

```javascript
{
    path: [<model paths],
    value: <new value>,
    oldValue: <old value>
}
```

In the following example, an enactor function acts upon a new magnification value:

```javascript
gpii.pmt.enactors.magnification.magnify = function (that, newModel) {
    that.magnify(newModel.value);
};

fluid.defaults("gpii.pmt.enactors.magnification", {
    // ...
    modelListeners: {
        "magnificationFactor": {
            funcName: "gpii.pmt.enactors.magnification.magnify",
            args: ["{that}", "{change}.value"]
        }
    }
});
```

## Acting on model changes ##

The actions that an enactor will take will be entirely dependent on what the enactor is for. It is up to the developer to create the necessary functions, etc. required.

## Example: Line Spacing Enactor ##

```javascript
fluid.defaults("fluid.prefs.enactor.lineSpace", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
    preferenceMap: {
        "fluid.prefs.lineSpace": {
            "model.value": "default"
        }
    },
    fontSizeMap: {},  // must be supplied by implementors
    invokers: {
        set: {
            funcName: "fluid.prefs.enactor.lineSpace.set",
            args: ["{arguments}.0", "{that}", "{that}.getLineHeightMultiplier"]
        },
        getTextSizeInPx: {
            funcName: "fluid.prefs.enactor.getTextSizeInPx",
            args: ["{that}.container", "{that}.options.fontSizeMap"]
        },
        getLineHeight: {
            funcName: "fluid.prefs.enactor.lineSpace.getLineHeight",
            args: "{that}.container"
        },
        getLineHeightMultiplier: {
            funcName: "fluid.prefs.enactor.lineSpace.getLineHeightMultiplier",
            args: [{expander: {func: "{that}.getLineHeight"}}, {expander: {func: "{that}.getTextSizeInPx"}}],
            dynamic: true
        }
    },
    modelListeners: {
        value: {
            funcName: "{that}.set",
            args: ["{change}.value"]
        }
    }
});

fluid.prefs.enactor.lineSpace.set = function (that, newValue) {
    that.set(newValue);
};
```

## Example: Table of Contents Enactor ##

```javascript
fluid.defaults("fluid.prefs.enactor.tableOfContents", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
    preferenceMap: {
        "fluid.prefs.tableOfContents": {
            "model.toc": "default"
        }
    },
    tocTemplate: null,  // must be supplied by implementors
    components: {
        tableOfContents: {
            type: "fluid.tableOfContents",
            container: "{fluid.prefs.enactor.tableOfContents}.container",
            createOnEvent: "onCreateTOCReady",
            options: {
                components: {
                    levels: {
                        type: "fluid.tableOfContents.levels",
                        options: {
                            resources: {
                                template: {
                                    forceCache: true,
                                    url: "{fluid.prefs.enactor.tableOfContents}.options.tocTemplate"
                                }
                            }
                        }
                    }
                },
                listeners: {
                    afterRender: "{fluid.prefs.enactor.tableOfContents}.events.afterTocRender"
                }
            }
        }
    },
    invokers: {
        applyToc: {
            funcName: "fluid.prefs.enactor.tableOfContents.applyToc",
            args: ["{arguments}.0", "{that}"]
        }
    },
    events: {
        onCreateTOCReady: null,
        afterTocRender: null,
        onLateRefreshRelay: null
    },
    modelListeners: {
        toc: {
            funcName: "{that}.applyToc",
            args: ["{change}.value"]
        }
    }
});

fluid.prefs.enactor.tableOfContents.applyToc = function (value, that) {
    if (value) {
        if (that.tableOfContents) {
            that.tableOfContents.show();
        } else {
            that.events.onCreateTOCReady.fire();
        }
    } else if (that.tableOfContents) {
        that.tableOfContents.hide();
    }
};
```
