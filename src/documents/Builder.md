---
title: Builder
category: Infusion
---

The Infusion [Preferences Framework](PreferencesFramework.md) includes a tool called the Builder, which automatically
creates all the components you need given [primary](PrimarySchemaForPreferencesFramework.md) and
[auxiliary schemas](AuxiliarySchemaForPreferencesFramework.md). The builder constructs all the components necessary to
render the preferences editor, store preferences, and respond to changes in preferences. However, you'll generally want
to use the simpler method, [`fluid.uiOptions`](UserInterfaceOptionsAPI.md), for creating and instantiating a
[Preferences Editor](PreferencesEditor.md). In fact, the builder (`fluid.prefs.builder`), is the base grade of
`fluid.uiOptions`, and takes in the same options.

Unlike UI Options, the `fluid.prefs.builder` does not assume that it will be a `fluid.viewComponent` nor provide any
default preferences. While it might be tempting to use the builder directly when using a different set of preference
from UI Options, in reality the standard configuration overriding provided by Infusion is sufficient. The only case you
may want to consider using the builder directly is when instantiating a story only build; however, such a configuration
is rarely used. For example:

```javascript
var storeOnly = fluid.prefs.builder({
    buildType: "store",
    preferences: [
        "fluid.prefs.textSize",
        "fluid.prefs.lineSpace",
        "fluid.prefs.textFont",
        "fluid.prefs.contrast",
        "fluid.prefs.tableOfContents",
        "fluid.prefs.enhanceInputs"
    ]
});
```
