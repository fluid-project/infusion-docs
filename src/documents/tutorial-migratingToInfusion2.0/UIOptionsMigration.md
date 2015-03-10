---
title: UI Options 2.0 Migration
layout: default
---

# UI Options 2.0 Migration #


## Namespace Changes ##

Rename "fluid.prefs.enactors" to "fluid.prefs.enactor"

## Component Grade Changes ##

_**Note:** According to the [comment](https://github.com/fluid-project/infusion/blob/master/src/framework/core/js/FluidView.js#L38-L39) on the implementation for relay components, in Infusion 2.0, relay components will be renamed back to its original names. If the rename has been made, this section can be ignored._

* Replace "fluid.modelComponent" with "fluid.modelRelayComponent"
* Replace "fluid.standardComponent" with "fluid.standardRelayComponent"
* Replace "fluid.viewComponent" with "fluid.viewRelayComponent"
* Replace "fluid.rendererComponent" with "fluid.rendererRelayComponent"

## Model Sharing Changes ##

### In 1.5 ###

In Infusion 1.5, sharing models between non-relay components requires the change applier to be shared as a member option along with the model:

```javascript
fluid.default("fluid.parent", {
    gradeNames: ["fluid.standardComponent", "autoInit"],
    components: {
        child: {
            type: "fluid.standardComponent",
            options: {
                members: {
                    applier: "{parent}.applier"
                },
                model: "{parent}.model"
            }
        }
    }
});
```

### In 2.0 ###

In Infusion 2.0 where relay components are introduced, sharing models no longer requires the change applier to be shared:

```javascript
fluid.default("fluid.parent", {
    gradeNames: ["fluid.standardRelayComponent", "autoInit"],
    components: {
        child: {
            type: "fluid.standardRelayComponent",
            options: {
                model: "{parent}.model"
            }
        }
    }
});
```
