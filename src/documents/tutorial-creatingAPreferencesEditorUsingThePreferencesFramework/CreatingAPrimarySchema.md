---
title: Creating a Primary Schema
layout: default
---

# Creating a Primary Schema #

---
Part of the [Creating a Preferences Editor Using the Preferences Framework Tutorial](CreatingAPreferencesEditorUsingThePreferencesFramework.md)

This article describes how to use the Infusion [Preferences Framework](../PreferencesFramework.md)
to create a [Primary Schema](../PrimarySchemaForPreferencesFramework.md), a JSON document that defines preferences.

---

The Primary Schema defines the settings themselves: their type (e.g. boolean, string, number), their default values and any other information necessary to define them, depending on their type: ranges, enumerations, etc.

See also [Primary Schema for Preferences Framework](../PrimarySchemaForPreferencesFramework.md).

The Primary Schema is defined as a single JSON document or JavaScript Object listing all settings, and is passed to the builder. The key in the schema definitions is a string that will be used throughout the Preferences Framework to associated all the components related to the setting: panels, enactors, etc. The string can be anything, so long as it is used consistently, but keep in mind that it will be used in the persistent storage for the user's preference, and will be shared with other technologies that may wish to define enactors to respond to it. We recommend that it be thoughtfully namespaced and human-understandable.

## Example: Selected UI Options Preferences ##

```javascript
fluid.prefs.primarySchema = {
    "fluid.prefs.lineSpace": {
        "type": "number",
        "default": 1,
        "minimum": 1,
        "maximum": 2,
        "divisibleBy": 0.1
    },
    "fluid.prefs.textFont": {
        "type": "string",
        "default": "",
        "enum": ["", "Times New Roman", "Comic Sans", "Arial", "Verdana"]
    },
    "fluid.prefs.tableOfContents": {
        "type": "boolean",
        "default": false
    }
};
```

## Example: Video Player Extra Preferences ##

```javascript
fluid.videoPlayer.primarySchema = {
    "fluid.videoPlayer.captions": {
        type: "boolean",
        "default": false
    },
    "fluid.videoPlayer.captionLanguage": {
        type: "string",
        "default": "en",
        "enum": ["en", "fr"]
    },
    "fluid.videoPlayer.transcripts": {
        type: "boolean",
        "default": false
    },
    "fluid.videoPlayer.transcriptLanguage": {
        type: "string",
        "default": "en",
        "enum": ["en", "fr"]
    }
};
```
