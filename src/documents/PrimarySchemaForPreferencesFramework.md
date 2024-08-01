---
title: Primary Schema for Preferences Framework
category: Infusion
---

A Primary Schema is a JSON document that contains the information necessary to define desired preferences using the
format specified by the [JSON Schema specification](https://json-schema.org/docs). A Primary Schema defines
such things as the type of the preference, its default value, the limits of its range (if appropriate), an enumeration
of possible values (if appropriate), etc.

The format of a preference definition in the Primary Schema is as shown below:

```snippet
{
    <namespaced.preference.name>: {
        <propertyName>: <propertyValue>
        // ...
    }
}
```

The `"namespaced.preference.name"` is the string that will be used throughout the Preferences Framework to identify the
particular preference. It will be used to associate panels and enactors with the preference.

## Example Primary Schemas

### Number

```JSON5
{
    "fluid.prefs.lineSpace": {
        "type": "number",
        "default": 1,
        "minimum": 0.7,
        "maximum": 2,
        "multipleOf": 0.1
    }
}
```

### Boolean

```JSON5
{
    "fluid.prefs.tableOfContents": {
        "type": "boolean",
        "default": false
    }
}
```

### Enumerated

```JSON5
{
    "fluid.prefs.textFont": {
        "type": "string",
        "default": "default",
        "enum": ["default", "times", "comic", "arial", "verdana", "open-dyslexic"],
        "enumLabels": [
            "textFont-default",
            "textFont-times",
            "textFont-comic",
            "textFont-arial",
            "textFont-verdana",
            "textFont-open-dyslexic"
        ]
    }
}
```

## Primary Schema Grade

Typically primary schemas are defined within a primary schema grade. These are standard infusion
[component grades](ComponentGrades.md) taking the base grade `fluid.prefs.schema` and a `schema` option containing the
primary schema. Primary Schema grades are automatically located by the [Builder](Builder.md).

### Example

```JavaScript
fluid.defaults("fluid.prefs.schemas.lineSpace", {
    gradeNames: ["fluid.prefs.schemas"],
    schema: {
        "fluid.prefs.lineSpace": {
            "type": "number",
            "default": 1,
            "minimum": 0.7,
            "maximum": 2,
            "multipleOf": 0.1
        }
    }
});
```
