---
title: Connecting the Parts of a Preferences Editor
layout: default
category: Infusion
---

Creating a Preferences Editor using the Infusion Preferences Framework involves various pieces: schemas, Infusion components, templates, etc. This page describes what you need to do to connect all the parts together.

<div class="infusion-docs-note"><strong>Note:</strong> This page describes how to work with the infusion Preferences Framework using schemas and the builder. It does NOT describe using the alternative technique, writing grades by hand.</div>

## Primary Schema

The [Primary Schema](PrimarySchemaForPreferencesFramework.md) defines a "name" for each preference.
This is the name that will be used to store the preference in the [settingsStore](SettingsStore.md),
so we recommend that your preference names be namespaced to your application,
to avoid possible conflicts. The name is also used to tie together all the various bits:

* the auxiliary store specifies this name as the `type` for a preference block, associating the panel and the enactor with the preference;
* the panel and enactor each use the name in the `preferenceMap`, which tells the builder how to map the panel or enactor's values in the primary schema onto the panel or enactor's own model values

### Example:

```json5
{
    "type": "object",
    "properties": {
        "fluid.prefs.textSize": { // <<<=== This is the name of the preference
            "type": "number",
            "default": 1,
            "min": 1,
            "max": 2,
            "divisibleBy": 0.1
        }
    }
}
```

## Auxiliary Schema

The [Auxiliary Schema](AuxiliarySchemaForPreferencesFramework.md) defines all the information needed to build the preferences editor interface, including

* what component to use to render the preference panels,
* where to find HTML templates and string bundles,
* what component to use to act on preference settings.

The Auxiliary Schema links to the preferences specified in the Primary Schema using the preference name, which is used as the `type` in a preferences block:

```json5
{
    // ..
    "textSize": {
        "type": "fluid.prefs.textSize",  // <<<=== This type must match the name specified in the primary schema
        "panel": {
            // ..
        },
        "enactor": {
            // ..
        }
    }
}
```

The Auxiliary Schema also specifies which components should be used for the panel and enactor for a given preference, through the `type` properties:

```json5
{
    // ...
    "textSize": {
        "type": "fluid.prefs.textSize",
        "panel": {
            "type": "fluid.prefs.panel.textSize"  // <<<=== This type is the name of the panel component
            // ...
        },
        "enactor": {
            "type": "fluid.prefs.enactor.textSize"  // <<<=== This type is the name of the enactor component
            // ...
        }
    }
}
```

## Panel Component

Each [panel component](Panels.md) must include a preference map option in its defaults, called `preferenceMap`. The Preferences Framework uses the preference map to populate some of the panel's defaults using information in the [Primary Schema](PrimarySchemaForPreferencesFramework.md).

### Example:

```javascript
fluid.defaults("fluid.prefs.panel.textSize", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        "fluid.prefs.textSize": {  // <<<=== This property name must match the name specified in the primary schema
            "model.value": "default",
            "range.min": "minimum",
            "range.max": "maximum"
        }
    }
    // ...
});
```

## Enactor Component

Each enactor component must include a preference map option in its defaults, called `preferenceMap`. As with the panels, the Preferences Framework uses the preference map to populate some of the enactor's defaults using information in the [Primary Schema](PrimarySchemaForPreferencesFramework.md). The structure of the enactor's preference map is the same as that for the panel.

### Example:

```javascript
fluid.defaults("fluid.prefs.enactor.textSize", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
    preferenceMap: {
        "fluid.prefs.textSize": {  // <<<=== This property name must match the name specified in the primary schema
            "model.value": "default"
        }
    }
    // ...
});
```
