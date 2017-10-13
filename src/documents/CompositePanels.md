---
title: Composite Panels
layout: default
category: Infusion
---

Composite panels allow you to combine several small panels – subpanels – into one larger panel. Subpanels are defined normally in an [auxiliary schema](AuxiliarySchemaForPreferencesFramework.md); Composite panels define a list of subpanels that should be included in the composite panel.

<div class="infusion-docs-note"><strong>Note:</strong> Subpanels <strong>must</strong> contain only one preference.</div>

## Grades ##

Composite panels must be defined with the `fluid.prefs.compositePanel` [grade](ComponentGrades.md), as shown in the following code block:

```javascript
fluid.defaults("my.panels.composite", {
    gradeNames: ["fluid.prefs.compositePanel"],
    ...
});
```

It is expected that composite panels will be quite simple in most cases, functioning strictly as a container for subpanels. All they typically need are any selectors and prototrees needed for a label, heading, or anything general to the entire composite panel.

Subpanels are defined with the `fluid.prefs.panel` grade, the same grade used for defining regular panels.

```javascript
fluid.defaults("my.panels.subanel", {
    gradeNames: ["fluid.prefs.panel"],
    ...
});
```

## Composite Panel Definition ##

A composite panel is defined in the auxiliary schema, in a special block called `groups`, which has the following general format:

```javascript
groups: {
    <composite panel name>: {
        "container": <selector of element in preferences editor where panel should be rendered>,
        "template": <path and filename of composite panel template>,
        "message": <path and filename of composite panel message file>,
        "type": <grade name of composite panel>,
        "panels": [<list of subpanels to include in this composite panel>]
    },
    <composite panel name>: {...},
    ...
}
```

In the code block above, the `panels` list is an array of names. These are derived from the keys in the auxiliary schema that associate panels with preferences.

## Templates ##

A composite panel and its subpanels each have their own HTML template. The composite panel template must contain elements that will serve as containers for the subpanels.

## Auxiliary Schema Declarations ##

The subpanel declarations in the auxiliary schema will reference the selectors for these elements.

## Message Bundles ##

A composite panel and its subpanels can each have their own JSON message file.

## Examples ##

Composite panel HTML template:

```html
<div class="my-composite-panel">
    <div class="subpanel-1-container"></div>
    <div class="subpanel-2-container"></div>
</div>
```

Auxiliary schema section defining panels:

```javascript
preference1: {
    "type": "fluid.prefs.preference1",
    "panel": {
        "type": "fluid.prefs.panel.subpanel1",
        // Reference to the selector defined in the composite panel template for subpanel1
        "container": ".subpanel-1-container",
        "template": "%prefix/subpanel1.html",
        "message": "%prefix/subpanel1.json"
    }
},
preference2: {
    "type": "fluid.prefs.preference2",
    "panel": {
        "type": "fluid.prefs.panel.subpanel2",
        // Reference to the selector defined in the composite panel template for this subpanel2
        "container": ".subpanel-2-container",
        "template": "%prefix/subpanel2.html",
        "message": "%prefix/subpanel2.json"
    }
},
groups: {
    composite1: {
        "container": ".my-composite-1",
        "template": "%prefix/composite1.html",
        "message": "%prefix/composite1.json",
        "type": "fluid.prefs.panel.composite1",
        "panels": ["preference1", "preference2"]
    }
}
```
