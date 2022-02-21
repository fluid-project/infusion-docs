---
title: Instantiating the Enhancer and Settings Store Only
category: Tutorials
---

This article describes how to use the Infusion [Preferences Framework](../PreferencesFramework.md)
to use the [Builder](../Builder.md), a tool that creates a preferences editor from schema documents.

In cases where you are adding a full-page editor to your site, you likely want the user's settings
to be applied to every other page on your site as well. On these pages, you don't want to
instantiate the preferences editor, but you do need to instantiate the page enhancer and the
[settings store](../SettingsStore.md); without these, the preferences will have no effect.

Adding the settings store and enhancer requires a two-step process:

1. Use the Builder to build the tools, then
2. Instantiate the tools built by the builder.

## Build the Settings Store and Enhancer

Build the settings store and enhancer with a call to the Preferences Framework Builder (this call also builds a
preferences editor, but you aren't required to instantiate it). The Builder can be used with either the
`auxiliarySchema` property or with an auxiliary schema grade.

<div class="infusion-docs-note">
    <strong>Note:</strong> Your auxiliary schema <strong>MUST</strong> specify a namespace. You'll need this namespace
    to access the components created by the builder.
</div>

### Example: Using the Builder with the `auxiliarySchema` Property

```javascript
var myAuxiliarySchema = {
    namespace: "my.prefs"
    // ...
};

fluid.prefs.builder({
    primarySchema: myPrimarySchema,
    auxiliarySchema: myAuxiliarySchema
});
```

### Example: Using the Builder with an Auxiliary Schema Grade

```javascript
fluid.defaults("my.auxSchemaGrade", {
    gradeNames: ["fluid.prefs.auxSchema"],
    auxiliarySchema: {
        namespace: "my.prefs"
        // ...
    }
});

fluid.prefs.builder({
    gradeNames: ["my.auxSchemaGrade"],
    primarySchema: myPrimarySchema
});
```

## Instantiate the Enhancer

Once you've run the builder, you can access the enhancer through the namespace you specified in your auxiliary schema

### Instantiating the Default Separated Panel Editor

```javascript
var enhancer = my.prefs.uie("body");
```

The `uie` method will automatically instantiate both the settings store and the page enhancer, so you only need to make
the one call. The settings store will automatically connect to the saved settings, and the enhancer will automatically
use your enactors to adjust the page according to the settings.
