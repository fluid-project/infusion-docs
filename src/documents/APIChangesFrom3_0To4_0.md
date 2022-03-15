---
title: API Changes from 3.0 to 4.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 4.0.

## Framework Changes

### Core Framework Changes

#### DataSources

The DataSource implementation was refactored around two pseudoevents `onRead` and `onWrite` as described
in the [DataSource API](DataSourceAPI.md).

A browser implementation of `fluid.dataSource.url` has been provided, based on the [XMLHttpRequest API](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
Previously this was only supported in node.js.

#### Fluid View

A few undocumented utilities, `fluid.dom.isContainer` and `fluid.dom.getElementText` were removed. Use the
standard browser APIs [`element.contains`](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains) and
[`element.innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText) instead.

#### ResourceLoader

The `href` field in a `ResourceSpec` structure should be changed to `url`

#### Component options

All component options are immutable after component construction. A failure will occur on attempting to modify them.

### Preferences Framework / UI Options (UIO)

## Instantiation

Instantiation of UI Options and Preferences Framework has been consolidated and simplified. In Infusion 3, it was
recommended to use `fluid.uiOptions.prefsEditor` to instantiate UI Options and if a customized instance of a Preference
Editor was needed, it was recommended to use `fluid.prefs.create`. In Infusion 4 these components have been removed.
Rather a Preference Editor can be instantiated and customized as needed using `fluid.uiOptions`. By default this is
configured with the same set of starter preferences as UI Options has used in the past.

## Configuration

With `fluid.uiOptions` being more generalized than its predecessor, it no longer makes assumptions about which
preferences it will work with. This means that configuration may no longer be hoisted to the top level; preferences and
enactors are configured through the `auxiliarySchema` top level option, and the preference editor itself is configured
through the `prefsEditorLoader` or `prefsEditor` top level options.

For customizing the available set of preferences, it is no longer required to pass in auxiliary schema grades. In
Infusion 4.0 the top level option `preferences` takes an array of preference names.

### UI Options In Infusion 3.0

```JavaScript
fluid.uiOptions.prefsEditor(".flc-prefsEditor-separatedPanel", {
    lazyLoad: true,
    terms: {
        "templatePrefix": "../../src/framework/preferences/html",
        "messagePrefix": "../../src/framework/preferences/messages"
    },
    "tocTemplate": "../../src/components/tableOfContents/html/TableOfContents.html",
    "tocMessage": "../../src/framework/preferences/messages/tableOfContents-enactor.json",
    "ignoreForToC": {
        "overviewPanel": ".flc-overviewPanel"
    }
});
```

### UI Options (default) Infusion 4.0

```JavaScript
fluid.uiOptions(".flc-prefsEditor-separatedPanel", {
    auxiliarySchema: {
        terms: {
            templatePrefix: "../../src/framework/preferences/html",
            messagePrefix: "../../src/framework/preferences/messages"
        },
        "fluid.prefs.tableOfContents": {
            enactor: {
                tocTemplate: "../../src/components/tableOfContents/html/TableOfContents.html",
                tocMessage: "../../src/framework/preferences/messages/tableOfContents-enactor.json",
                ignoreForToC: {
                    overviewPanel: ".flc-overviewPanel"
                }
            }
        }
    },
    prefsEditorLoader: {
        lazyLoad: true
    }
});
```

### Preferences Framework In Infusion 3.0

```JavaScript
fluid.prefs.create(".flc-prefsEditor-separatedPanel", {
    build: {
        gradeNames: [
            "fluid.prefs.auxSchema.letterSpace",
            "fluid.prefs.auxSchema.wordSpace"
        ],
        auxiliarySchema: {
            terms: {
                templatePrefix: "../../src/framework/preferences/html",
                messagePrefix: "../../src/framework/preferences/messages"
            }
        }
    }
});
```

### UI Options (customized) In Infusion 4.0

```JavaScript
fluid.uiOptions(".flc-prefsEditor-separatedPanel", {
    preferences: [
        "fluid.prefs.letterSpace",
        "fluid.prefs.wordSpace"
    ],
    auxiliarySchema: {
        terms: {
            templatePrefix: "../../src/framework/preferences/html",
            messagePrefix: "../../src/framework/preferences/messages"
        }
    }
});
```

## Auxiliary Schema

Auxiliary Schemas are still used for defining/configuring a preference, but have been slightly restructured. Each
preference is keyed off of the preference name (e.g. `fluid.prefs.letterSpace`) rather than an alias
(e.g. `letterSpace`). This makes it easier to know the path the configure when supplying overrides. The auxillary
schemas are no longer concerned with the configuration of the Preference Editor itself, and the parts of individual
preferences can be used in a modular fashion. For example, in Infusion 3, it wasn't easy to use a subset of the
"starter" preferences.

### Example Auxiliary Schema in Infusion 3.0

```JavaScript
fluid.defaults("fluid.prefs.auxSchema.letterSpace", {
    gradeNames: ["fluid.prefs.auxSchema"],
    auxiliarySchema: {
        "namespace": "fluid.prefs.constructed",
        "terms": {
            "templatePrefix": "../../framework/preferences/html/",
            "messagePrefix": "../../framework/preferences/messages/"
        },
        "template": "%templatePrefix/SeparatedPanelPrefsEditor.html",
        "message": "%messagePrefix/prefsEditor.json",

        letterSpace: {
            type: "fluid.prefs.letterSpace",
            enactor: {
                type: "fluid.prefs.enactor.letterSpace",
                fontSizeMap: {
                    "xx-small": "9px",
                    "x-small": "11px",
                    "small": "13px",
                    "medium": "15px",
                    "large": "18px",
                    "x-large": "23px",
                    "xx-large": "30px"
                }
            },
            panel: {
                type: "fluid.prefs.panel.letterSpace",
                container: ".flc-prefsEditor-letter-space",
                template: "%templatePrefix/PrefsEditorTemplate-letterSpace.html",
                message: "%messagePrefix/letterSpace.json"
            }
        }
    }
});
```

### Example Auxiliary Schema in Infusion 4.0

```JavaScript
fluid.defaults("fluid.prefs.auxSchema.letterSpace", {
    gradeNames: ["fluid.prefs.auxSchema"],
    auxiliarySchema: {
        "fluid.prefs.letterSpace": {
            enactor: {
                type: "fluid.prefs.enactor.letterSpace",
                fontSizeMap: {
                    "xx-small": "9px",
                    "x-small": "11px",
                    "small": "13px",
                    "medium": "15px",
                    "large": "18px",
                    "x-large": "23px",
                    "xx-large": "30px"
                }
            },
            panel: {
                type: "fluid.prefs.panel.letterSpace",
                container: ".flc-prefsEditor-letter-space",
                template: "%templatePrefix/PrefsEditorTemplate-letterSpace.html",
                message: "%messagePrefix/letterSpace.json"
            }
        }
    }
});
```

## Contrast themes

Infusion 3 introduced [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) for styling the
contrast themes. Infusion 4 has expanded the use of CSS Custom Properties for all enactor styling (see:
[Integrating UI Options Styling Preferences](tutorial-userInterfaceOptions/IntegratingUIOptionsStylingPreferences.md)).
Of note, is that all of the contrast themes now supply values for all of the contrast related CSS Custom Properties.
By supplying values for all of the properties, it makes it easier to just use the new "Base" style sheets without having
to supply your own fallbacks to handle the various conditions that each css custom property would be used for.

### Light Gray Dark Gray theme in Infusion 3.0

```CSS
.fl-theme-lgdg {
    --fl-fgColor: #bdbdbb;
    --fl-bgColor: #555;
}
```

### Light Gray Dark Gray theme in Infusion 4.0

```CSS
.fl-theme-lgdg {
    --fl-fgColor: #bdbdbb;
    --fl-bgColor: #555;
    --fl-linkColor: #bdbdbb;
    --fl-selectedFgColor: revert;
    --fl-selectedBgColor: revert;
    --fl-buttonFgColor: #bdbdbb;
    --fl-buttonBgColor: #555;
}
```
