---
title: Primary Schema for Preferences Framework
layout: default
---

A Primary Schema is a JSON document that contains the information necessary to define desired preferences using the format specified by the [JSON Schema specification](http://json-schema.org/documentation.html). A Primary Schema defines such things as the type of the preference, its default value, the limits of its range (if appropriate), an enumeration of possible values (if appropriate), etc.

The format of a preference definition in the Primary Schema is as shown below:
```javascript
{
    <namespaced.preference.name>: {
        <propertyName>: <propertyValue>,
        ...
    }
}
```
The `"namespaced.preference.name"` is the string that will be used throughout the Preferences Framework to identify the particular preference. It will be used to associate panels and enactors with the preference.

## Example: Schema for Preferences Framework Starter Preferences ##

```javascript
{
    "fluid.prefs.textSize": {
        "type": "number",
        "default": 1,
        "min": 1,
        "max": 2,
        "divisibleBy": 0.1
    },
    "fluid.prefs.lineSpace": {
        "type": "number",
        "default": 1,
        "min": 1,
        "max": 2,
        "divisibleBy": 0.1
    },
    "fluid.prefs.textFont": {
        "type": "string",
        "default": "default",
        "enum": ["default", "times", "comic", "arial", "verdana"]
    },
    "fluid.prefs.contrast": {
        "type": "string",
        "default": "default",
        "enum": ["default", "bw", "wb", "by", "yb"]
    },
    "fluid.prefs.layoutControls": {
        "type": "boolean",
        "default": false
    },
    "fluid.prefs.emphasizeLinks": {
        "type": "boolean",
        "defaults": false
    },
    "fluid.prefs.inputsLarger": {
        "type": "boolean",
        "defaults": false
    }
}
```
