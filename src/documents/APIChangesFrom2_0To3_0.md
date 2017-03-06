---
title: API Changes from 2.0 to 3.0
layout: default
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 3.0.

## Framework Changes ##

### Core Framework Changes ###

This section describes major APIs that were in common use. For information about less widely-used features removed in 3.0, consult [Deprecations in 2.0](DeprecatedIn2_0.md).


### Preferences Framework ###

#### Panel Changes ####

##### Preference Map #####

The keyword `"default"` was used to setup a model relay between an internal model and the preferences state. If no existing preference was store, the value was taken from the `"default"` property of the related primary schema. As of 3.0.0 the new keyword is `"value"`.

###### In 2.0 ######

```json
{
    "preferenceMap": {
        "fluid.prefs.tableOfContents": {
            "model.toc": "default"
        }
    },
}
```

###### In 3.0 ######

```json
{
    "preferenceMap": {
        "fluid.prefs.tableOfContents": {
            "model.toc": "value"
        }
    },
}
```
