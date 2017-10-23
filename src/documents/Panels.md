---
title: Panels
layout: default
category: Infusion
---

A Panel is an [Infusion component](UnderstandingInfusionComponents.md) that present adjusters, or controls, to the user to allow them to adjust the preference settings. Panels are [Renderer components](RendererComponents.md) that work with an HTML template.

A Panel can contain any number of adjusters. If you need to combine several small panels into a larger panel, use [Composite Panels](CompositePanels.md).

Panel defaults must include certain things:

* the `fluid.prefs.panel` [grade](ComponentGrades.md)
* a preferences map (only when using [schemas](PrimarySchemaForPreferencesFramework.md))
* Renderer requirements, including selectors and prototree

Each of these is explained below.

## Grade

Panels must be defined using the `fluid.prefs.panel` [grade](ComponentGrades.md), as shown in the following code block:

```javascript
fluid.defaults("my.pref.panel", {
    gradeNames: ["fluid.prefs.panel"]
    // ...
});
```

Panels are, by default, [renderer components](RendererComponents.md), which automatically provide support for DOM binding, for a model and for events. Other grades can be combined with the Panel grade, if necessary. For example, if you are defining several panels which share common functionality, you can create a single grade that includes that functionality and uses the `fluid.prefs.panel` grade, then use your common grade for your panels, as illustrated in the following code sample:

```javascript
// shared grade, defining common functionality
fluid.defaults("my.pref.panelGrade", {
    gradeNames: ["fluid.prefs.panel"]
    // common defaults
});

// one specific panel, which uses the shared grade
fluid.defaults("my.pref.panel2", {
    gradeNames: ["my.pref.panelGrade"]
    // defaults specific to panel 1
});

// another specific panel, which uses the shared grade
fluid.defaults("my.pref.panel2", {
    gradeNames: ["my.pref.panelGrade"]
    // defaults specific to panel 2
});
```

## Preference Map (Schema Only)

<div class="infusion-docs-note"><strong>IMPORTANT NOTE:</strong> Preference Maps are **only** required if you are working with [schemas](PrimarySchemaForPreferencesFramework.md)). If you are using grades instead (only necessary in rare cases), you do **not** need a preference map.</div>

A Preference Map is an option that allows you to map the information in the [Primary Schema](PrimarySchemaForPreferencesFramework.md) into your Panel. For each relevant preference defined in the primary schema, the preference map specifies where in the current component's options the value should be store. This is used to pull the default preference value into the Panel's model, as well as any other relevant information.

The format of a preference map is shown in the following code sample:

```snippet
preferenceMap: {
    <key from primary schema>: {
        <path in panel's model where value should be held>: <key in primary schema where value held>
        <path in panel's model where value should be held>: <key in primary schema where value held>
        // ...
    },
    <key from primary schema>: {
        <path in panel's model where value should be held>: <key in primary schema where value held>
    }
    // ...
}
```

The content of a Panel's preference map will be dependent on the preferences being controlled and their types. The following example shows the preference map used in the Preference Framework's text font panel, which displays a drop-down menu listing different font choices. The preference map indicate:

* the "`default`" field in the primary schema should be stored in the Panel's `model.value` property
* the "`enum`" field in the primary schema should be stored in the Panel's `controlValues.textFont` property

```javascript
fluid.defaults("fluid.prefs.panel.textFont", {
    gradeNames: ["fluid.prefs.panel.classSwapper"],
    preferenceMap: {
        "fluid.prefs.textFont": {
            "model.value": "default",
            "controlValues.textFont": "enum"
        }
    }
    // ...
});
```

The following example shows the preference map used in the Preference Framework's text size panel, which displays a slider. The preference map indicates where in the primary schema to find the default, minimum and maximum values, and where in the Panel to store those values:

```javascript
fluid.defaults("fluid.prefs.panel.textSize", {
    gradeNames: ["fluid.prefs.panel.classSwapper"],
    preferenceMap: {
        "fluid.prefs.textSize": {
            "model.value": "default",
            "range.min": "minimum",
            "range.max": "maximum"
        }
    }
    // ...
});
```

## Renderer Requirements

For detailed information about the Infusion Renderer, see [Renderer](Renderer.md) and its sub-pages. What follows is a brief overview of the renderer requirements of a Preferences Framework Panel.

### Selectors

The `selectors` options is a list of names CSS-style selectors. They identify the elements in the HTML template that the Renderer will bind to the Panel's model values.

#### Example: A checkbox adjuster

```javascript
fluid.defaults("fluid.prefs.panel.layoutControls", {
    gradeNames: ["fluid.prefs.panel"],
    selectors: {
        toc: ".flc-prefsEditor-toc",
        label: ".flc-prefsEditor-toc-label",
        tocDescr: ".flc-prefsEditor-toc-descr"
    },
    protoTree: {
        label: {messagekey: "tocLabel"},
        tocDescr: {messagekey: "tocDescr"},
        toc: "${toc}"
    }
});
```

### Prototree (or produceTree function)

The `protoTree` option defines the Renderer component tree – the instructions to the Renderer for how to render the data. In general, it consists of one property per selector, defining how that particular element in the template should be used. The property will define which element in the data model to use, or a message key in a message bundle if the element is a label. See the [Renderer](Renderer.md) documentation for information on how to define Renderer protoTrees.

#### Example: A checkbox adjuster

```javascript
fluid.defaults("fluid.prefs.panel.layoutControls", {
    gradeNames: ["fluid.prefs.panel"],
    selectors: {
        toc: ".flc-prefsEditor-toc",
        label: ".flc-prefsEditor-toc-label",
        tocDescr: ".flc-prefsEditor-toc-descr"
    },
    protoTree: {
        label: {messagekey: "tocLabel"},
        tocDescr: {messagekey: "tocDescr"},
        toc: "${toc}"
    }
});
```

In rare cases, it may not be possible to specify the protoTree in a declarative manner. In these cases, use the `produceTree` option to declare the name of a function that will generate the required protoTree.

## Models and Model Changes

Panels are, by default, Infusion [model components](tutorial-gettingStartedWithInfusion/ModelComponents.md): They automatically have a top-level property called `model` which holds the Panel's internal model representing the preference it acts upon. It is not necessary for you to define this property directly; its structure will be inferred from the preferences map. If you are working with grades instead of with schemas, the model will be inferred from the rules supplied for the Panel.

## Examples

### Example: A checkbox adjuster

```javascript
fluid.defaults("demo.panels.speak", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        "demo.speakText": {
            "model.speakText": "default"
        }
    },
    selectors: {
        bool: ".mpe-speakText",
        choiceLabel: ".mpe-speakText-choice-label"
    },
    protoTree: {
        choiceLabel: {messagekey: "speakText"},
        bool: "${speakText}"
    }
});
```

### Example: A drop-down adjuster

```javascript
fluid.defaults("demo.panels.language", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        "demo.language": {
            "model.lang": "default",
            "controlValues.langStrings": "enum"
        }
    },
    selectors: {
        language: ".mpe-dropDown",
        label: ".mpe-dropDown-label"
    },
    stringArrayIndex: {
        langs: ["langs-zho", "langs-spa", "langs-eng", "langs-hin", "langs-ara", "langs-por", "langs-ben", "langs-rus"]
    },
    protoTree: {
        label: {messagekey: "langLabel"},
        language: {
            optionnames: "${{that}.stringBundle.langs}",
            optionlist: "${{that}.options.controlValues.langStrings}",
            selection: "${lang}"
        }
    }
});
```

### Example: Two adjusters: a textfieldSlider and a set of radio buttons

```javascript
fluid.defaults("demo.panels.vol", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        // pref map for the slider
        "demo.volume": {
            "model.volume": "default",
            "range.min": "minimum",
            "range.max": "maximum"
        },
        // pref map for the radio button
        "demo.volPosition": {
            "model.volPos": "default",
            "controlValues.volPos": "enum"
        }
    },
    selectors: {
        // selectors for the slider
        label: ".mpe-slider-label",
        multiplier: ".mpe-slider-multiplier",
        vol: ".mpe-slider",

        // selectors for the radio buttons
        posLabel: ".mpe-radio-label",
        volPosRow: ".mpe-radioRow",
        volPosLabel: ".mpe-radioLabel",
        volPosInput: ".mpe-radioInput"
    },
    selectorsToIgnore: ["vol"],
    components: {
        // The subcomponent for rendering the slider
        vol: {
            type: "fluid.textfieldSlider",
            container: "{that}.dom.vol",
            createOnEvent: "onDomBind",
            options: {
                model: {
                    value: "{demo.panels.vol}.model.volume"
                },
                range: "{demo.panels.vol}.options.range",
                sliderOptions: "{demo.panels.vol}.options.sliderOptions"
            }
        }
    },
    protoTree: {
        // protoTree for rendering slider labels
        label: {messagekey: "volLabel"},
        multiplier: {messagekey: "volMultiplier"},

        // protoTree for the radio buttons
        posLabel: {messagekey: "volPosLabel"},
        expander: {
            type: "fluid.renderer.selection.inputs",
            rowID: "volPosRow",
            labelID: "volPosLabel",
            inputID: "volPosInput",
            selectID: "volControlPosition",
            tree: {
                optionnames: "${{that}.stringBundle.volPos}",
                optionlist: "${{that}.options.controlValues.volPos}",
                selection: "${volPos}"
            }
        }
    }
});
```
