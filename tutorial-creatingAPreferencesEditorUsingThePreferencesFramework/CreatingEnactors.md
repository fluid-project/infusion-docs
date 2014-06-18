# Creating Enactors #

---
Part of the [Creating a Preferences Editor Using the Preferences Framework Tutorial](CreatingAPreferncesEditorUsingThePreferencesFramework.md)

This article describes how to use the Infusion [Preferences Framework](../PreferencesFramework.md)
to create Enactors, components that act in response to changes to a user's preferences.

---

## Overview ##

In the [Preferences Framework](../PreferencesFramework.md), "Enactors" are Infusion [components](../UnderstandingInfusionComponents.md) that act upon changes to user preferences.

The configuration information used to define an enactor must include certain required information:

* the `fluid.prefs.enactors` and `autoInit` [grades](ComponentGrades.md) (provided by the Framework)
* a Preference Map (see [below](#preferencemap))
* a renderer [proto-tree](RendererComponentTrees.md) or [`produceTree`](../ComponentConfigurationOptions.md#producetree) function
* selectors for rendering the controls, labels, etc
* any other information required by the enactor

If the enactor will be modifying the view of the interface, you will also want to add the `fluid.viewComponent` grade as well as selectors.

## PreferenceMap ##

Each enactor defines a "preference map," which map the information in the [Primary Schema](../PrimarySchemaForPreferencesFramework.md) into your enactor. The preference map is used to copy the default preference value from the primary schema into the enactor's model. It can also be used to copy any other necessary information from the primary schema into the enactor, if relevant. The values can be mapped to any path in the Panels options, and then they can be accessed through those paths.

### Format ###

```json
preferenceMap: {
    <key of preference from primary schema>: {
        <path in enactor's options where value should be held>: <key in primary schema where value held>
        ... any number of the above, as required ...
    },
    ... any number of the above, as required ...
}
```

### Examples ###

```javascript
fluid.defaults("fluid.prefs.enactors.textSize", {
    gradeNames: ["fluid.prefs.panel", "autoInit"],
    preferenceMap: {
        "fluid.prefs.textSize": {
            "model.value": "default"
        }
    },
    ....
}
```

```javascript
fluid.defaults("fluid.prefs.enactors.emphasizeLinks", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactors.styleElements", "autoInit"],
    preferenceMap: {
        "fluid.prefs.emphasizeLinks": {
            "model.value": "default"
        }
    },
    ....
}
```

```javascript
fluid.defaults("fluid.videoPlayer.panels.captionsSettings", {
    gradeNames: ["fluid.videoPlayer.panels.mediaSettings", "autoInit"],
    preferenceMap: {
        "fluid.videoPlayer.displayCaptions": {
            "model.show": "default"
        },
        "fluid.videoPlayer.captionLanguage": {
            "model.language": "default"
        }
    },
    ....
}
```

## Binding to Model Changes ##

The most important thing that an enactor does is listen for changes to its model and act when changes occur. The [Preferences Framework](../PreferencesFramework.md) automatically binds the enactor's model to the user's preferences through the Preferences Map (described above). This means that if the user's preference changes (for example, through the preferences editor), the enactor's model will automatically be updated and a modelChanged event will be fired. All the enactor has to do is listen for that modelChanged event and carry out whatever adjustments are necessary. (For more information about model changes, see [ChangeApplier API](../ChangeApplierAPI.md); for more information about the events and listeners in general, see [Infusion Event System](../InfusionEventSystem.md)).

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
    ....
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
fluid.defaults("fluid.prefs.enactors.lineSpace", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactors", "autoInit"],
    preferenceMap: {
        "fluid.prefs.lineSpace": {
            "model.value": "default"
        }
    },
    fontSizeMap: {},  // must be supplied by implementors
    invokers: {
        set: {
            funcName: "fluid.prefs.enactors.lineSpace.set",
            args: ["{arguments}.0", "{that}"]
        },
        getTextSizeInPx: {
            funcName: "fluid.prefs.enactors.getTextSizeInPx",
            args: ["{that}.container", "{that}.options.fontSizeMap"]
        },
        getLineHeight: {
            funcName: "fluid.prefs.enactors.lineSpace.getLineHeight",
            args: "{that}.container"
        },
        numerizeLineHeight: {
            funcName: "fluid.prefs.enactors.lineSpace.numerizeLineHeight",
            args: [{expander: {func: "{that}.getLineHeight"}}, {expander: {func: "{that}.getTextSizeInPx"}}]
        }
    },
    listeners: {
        onCreate: {
            listener: "{that}.set",
            args: "{that}.model.value"
        }
    },
    modelListeners: {
        "value": "fluid.prefs.enactors.lineSpace.set",
        args: ["{that}", "{change}.value"]
    }
});

fluid.prefs.enactors.lineSpace.set = function (that, newValue) {
    that.set(newValue);
};
```

## Example: Table of Contents Enactor ##

```javascript
fluid.defaults("fluid.prefs.enactors.tableOfContents", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactors", "autoInit"],
    preferenceMap: {
        "fluid.prefs.tableOfContents": {
            "model.value": "default"
        }
    },
    tocTemplate: null,  // must be supplied by implementors
    components: {
        tableOfContents: {
            type: "fluid.tableOfContents",
            container: "{fluid.prefs.enactors.tableOfContents}.container",
            createOnEvent: "onCreateTOCReady",
            options: {
                components: {
                    levels: {
                        type: "fluid.tableOfContents.levels",
                        options: {
                            resources: {
                                template: {
                                    forceCache: true,
                                    url: "{fluid.prefs.enactors.tableOfContents}.options.tocTemplate"
                                }
                            }
                        }
                    }
                },
                listeners: {
                    afterRender: "{fluid.prefs.enactors.tableOfContents}.events.afterTocRender"
                }
            }
        }
    },
    invokers: {
        applyToc: {
            funcName: "fluid.prefs.enactors.tableOfContents.applyToc",
            args: ["{arguments}.0", "{that}"]
        }
    },
    events: {
        onCreateTOCReady: null,
        afterTocRender: null,
        onLateRefreshRelay: null
    },
    listeners: {
        onCreate: {
            listener: "{that}.applyToc",
            args: "{that}.model.value"
        }
    },
    modelListeners: {
        "value": "fluid.prefs.enactors.tableOfContents.applyToc",
        args: ["{that}", "{change}.value"]
    }
});

fluid.prefs.enactors.tableOfContents.applyToc = function (that, newValue) {
    that.applyToc(newValue);
};
```
