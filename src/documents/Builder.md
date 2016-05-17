---
title: Builder
layout: default
category: Infusion
---

The Infusion [Preferences Framework](PreferencesFramework.md) includes a tool called the Builder, which automatically creates all the components you need given [primary](PrimarySchemaForPreferencesFramework.md) and [auxiliary schemas](AuxiliarySchemaForPreferencesFramework.md). The builder constructs all the components necessary to render the preferences editor, store preferences, and respond to changes in preferences. However, you'll generally want to use the simpler method "fluid.prefs.create" for creating and instantiating a [Preferences Editor](PreferencesEditor.md).
```javascript
var builder = fluid.prefs.builder(<options>);
```

<div class="infusion-docs-note"><strong>Note:</strong> In this form, the namespace property of the [auxiliary schema](AuxiliarySchemaForPreferencesFramework.md) is required.</div>

### Parameters ###

<table>
<tr><td><code>options</code></td><td>(Object) The configuration options for the builder. See <a href="#options">Options</a> below for more information.</td></tr>
</table>

where `options` is a JavaScript object containing information configuring your builder.

### Return Value ###

<table>
<tr><td>Object</td><td>The builder object. See <a href="#builder-object">Builder Object</a> below for more information.</td></tr>
</table>

### Options ###

<table>
<tr><th>Name</th><th>Description</th><th>Values</th><th>Default</th></tr>
<tr>
    <td><code>gradeNames</code></td>
    <td>(Optional) A list of grade names to be used for the builder.

This option can be used to specify the names of grades that define schemas, as an alternative to specifying the schemas through the direct options. If you do not provide the <code>auxiliarySchema</code> option, you must include the grade name of a grade that includes an auxiliary schema.</td>
    <td>Array of strings</td>
    <td>none</td>
</tr>
<tr>
    <td><code>primarySchema</code></td>
    <td>(Optional) A JavaScript object providing primary schema details. See <a href="#processing-the-schemas">Processing the Schemas</a> below for more details.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
<tr>
    <td><code>auxiliarySchema</code></td>
    <td>(Optional) A JavaScript object providing auxiliary schema details. See <a href="#processing-the-schemas">Processing the Schemas</a> below for more details. If you do not specify the grade name of a grade that includes an auxiliary schema, you must include this option.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
</table>

<div class="infusion-docs-note"><strong>Note:</strong> You must provide at least one of</div>

* the `auxiliarySchema` option, or
* a `gradeName` indicating an auxiliary schema.

If you provide both, they will be merged (with the `auxiliarySchema` overriding anything in the grade schema), but you must provide at least one.

## Usage ##

The simplest usage of the builder is through the two schema options:

```javascript
var myBuilder = fluid.prefs.builder({
    primarySchema: {...},
    auxiliarySchema: {...}
});
```

### Using the Starter Preferences ###

The Preferences Framework includes primary and auxiliary schema for a set of preferences, referred to to as the "starter set." This set includes the following preferences:

* text size
* text font
* line spacing
* colour contrast
* table of contents
* inputs larger
* emphasize links

To use these preferences and the panels that come with them, simply use the Framework-provided starter auxiliary schema grade name, `fluid.prefs.auxSchema.starter`, as shown below:

```javascript
var myBuilder = fluid.prefs.builder({
    gradeNames: ["fluid.prefs.auxSchema.starter"]
});
```
You may need to override the template and message bundle path prefixes, if your relative paths are different than the defaults:

```javascript
var myBuilder = fluid.prefs.builder({
    gradeNames: ["fluid.prefs.auxSchema.starter"],
    auxiliarySchema: {
        "terms": {
            "templatePrefix": "<custom relative path to template folder>",
            "messagePrefix": "<custom relative path to messages folder>"
        }
    }
});
```
It is not necessary to specify the primary schema; The builder will automatically find the preference specifications provided by the Framework and build a primary schema (see [Processing the Schemas](#processing-the-schemas) below for more information).

#### Switching Between Native HTML and jQuery UI Widgets

It is possible when using the Preferences Framework to configure a preference for either HTML or jQuery UI-based widgets. This approach makes use of the [Context Awareness](ContextAwareness.md) features of Infusion to allow components to make the choice at creation time based on a registered check:

```javascript
// Prefer the use of native HTML widgets when available (default)
fluid.contextAware.makeChecks({
    "fluid.prefsWidgetType": {
        value: "nativeHTML"
    }
});
```

```javascript
// Prefer the use of jQueryUI widgets when available
fluid.contextAware.makeChecks({
    "fluid.prefsWidgetType": {
        value: "jQueryUI"
    }
});
```

The most basic use is shown above, but more complex ones based on browser feature detection or other means can be envisioned.

At the moment, only the TextFieldSlider widget used for text size and line spacing preferences is context-aware, and can use either the
[native HTML range input](https://www.w3.org/wiki/HTML/Elements/input/range) (rendered as a horizontal slider in modern browsers) or
the [jQuery UI Slider component](https://jqueryui.com/slider/) to create its slider. Other context-aware widgets may be added in the future.


## Auxiliary Schema Grade ##

If a grade name is used to provide the auxiliary schema, the grade must meet certain criteria:

* it must have a grade of `fluid.prefs.auxSchema`, and
* it must have an `auxiliarySchema` option defined.

```javascript
fluid.defaults("my.editor.auxSchema", {
    gradeNames: ["fluid.prefs.auxSchema"],
    auxiliarySchema: {
        // auxiliary schema specifics here
    }
});
var myBuilder = fluid.prefs.builder({
    gradeNames: ["my.editor.auxSchema"]
});
```

## Processing the Schemas ##

The Preferences Framework builds an internal, preliminary primary schema as follows:

1. It combines any schemas it finds in the `fluid.prefs.schemas` namespace;
2. It merges these with any information found in the `primarySchema` option.

This preliminary schema is then filtered based on the preferences found in the auxiliary schema to produce the subset of only preferences found in both the primary and auxiliary schemas. This set of preferences will be the final set supported by the builder.

<div class="infusion-docs-note"><strong>Note:</strong> All panels and enactors defined in the auxiliary schema will be created and rendered, but only those that have corresponding preferences in the primary schema will actually work.</div>

## Output of Builder ##

### Builder Object ###

The builder object returned by a call to `fluid.prefs.builder()` has the following properties that can be used to instantiate the constructed preferences editor:

<table>
<tr><th>Name</th><th>Type</th><th>Description</th></tr>
<tr>
    <td><code>options.assembledPrefsEditorGrade</code></td>
    <td>String</td>
    <td><a href="ComponentGrades.md">Grade name</a> of the constructed preferences editor; can be used to instantiate the <a href="PreferencesEditor.md">preferences editor</a>, <a href="to-do/UIEnhancer.md">enhancer</a> and <a href="SettingsStore.md">settings store</a> using <code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/Fluid.js#L930-L944">fluid.invokeGlobalFunction</a></code>.</td>
</tr>
<tr>
    <td><code>options.assembledUIEGrade</code></td>
    <td>String</td>
    <td><a href="ComponentGrades.md">Grade name</a> of the constructed <a href="to-do/UIEnhancer.md">enhancer</a>; can be used to instantiate the enhancer and <a href="SettingsStore.md">settings store</a> using <code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/Fluid.js#L930-L944">fluid.invokeGlobalFunction</a></code>.</td>
</tr>
</table>

### Functions ###

The builder also creates free functions that can be used to instantiate the preferences editor and enhancer. These functions are created within the namespace specified in the auxiliary schema, if specified, or in a unique namespace, `"fluid.prefs.created_UNIQUE_ID"`.

The functions created include:

* `prefsEditor()` which can be used to instantiate the preferences editor, enhancer and settings store
* `uie()` which can be used to instantiate the enhancer and settings store

## Examples ##


### Starter schemas, default namespace ###

```javascript
var myBuilder = fluid.prefs.builder({
    // use the Framework-provided starter schema grade
    gradeNames: ["fluid.prefs.auxSchema.starter"],

    // override the paths in the starter grade
    auxiliarySchema: {
        "terms": {
            "templatePrefix": "../../../framework/preferences/html/",
            "messagePrefix": "../../../framework/preferences/messages/"
        }
    }

    // by not providing a primarySchema, the 'starter' prefs will be used
});

// instantiate the default 'fat panel' version of the preferences editor
// (along with the enhancer and settings store)
fluid.invokeGlobalFunction(builder.options.assembledPrefsEditorGrade, [".fat-panel-container"]);

// alternatively, the same instantiation can be accomplished using the public function
fluid.prefs.constructed.prefsEditor(".fat-panel-container");
```

### Custom schemas, custom namespace ###

```javascript
// define a primary schema, with a single preference
var myPrefsPrimary = {
    "my.prefs.textSize": {
        type: "number",
        "default": 12,
        minimum: 8,
        maximum: 24,
        divisibleBy: 2
    }
};
// define a grade containing the auxiliary schema, specifying
// the panel and enactor for the preference
fluid.defaults("my.prefs.editor.aux", {
    gradeNames: ["fluid.prefs.auxSchema"],
    auxiliarySchema: {
        namespace: "my.prefs.editor",
        terms: {
            templatePrefix: "templates/",
            messagePrefix: "messages/"
        },
        template: "%templatePrefix/MyEditorTemplate.html",
        message: "%messagePrefix/MyEditorStrings.html",
        textSize: {
            type: "my.prefs.textSize",
            enactor: {
                type: "my.prefs.enactors.textSize" // defined elsewhere
            },
            panel: {
                type: "my.prefs.panels.textSize", // defined elsewhere
                container: ".my-text-size",
                template: "%templatePrefix/textSizeTemplate.html",
                message: "%messagePrefix/textSize.json"
            }
        }
    }
});
// create the builder using the auxiliary schema grade and the primary schema object
var myBuilder = fluid.prefs.builder({
    gradeNames: ["my.prefs.editor.aux"],
    primarySchema: myPrefsPrimary
});
// instantiate the editor, enhancer and settings store
my.prefs.editor.prefsEditor(".my-editor-container");
```
