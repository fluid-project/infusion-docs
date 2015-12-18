---
title: Preferences Editor
layout: default
category: Infusion
---

One of the primary functions of the Infusion [Preferences Framework](PreferencesFramework.md) is to allow you to create a Preferences Editor: a collection of adjusters that users can use to set their interface preferences.

The Preferences Framework provides a utility that creates and instantiates a preferences editor in a single step, given [primary](PrimarySchemaForPreferencesFramework.md) and [auxiliary](AuxiliarySchemaForPreferencesFramework.md) schemas.

```javascript
var prefsEditor = fluid.prefs.create(container[, options]);
```

### Parameters ###
<table>
<tr>
    <td><code>container</code></td>
    <td>(required) (String) A CSS-style selector that will contain the preferences editor markup.</td>
</tr>
<tr>
    <td><code>options</code></td>
    <td>(optional) (Object) Configuration options. See <a href="#options">Options</a> below for more information.</td>
</tr>
</table>

### Return Value ###

<table>
<tr>
    <td><strong>Object</strong></td>
    <td>(Object) The preferences editor instance.</td>
</tr>
</table>

### Options ###

<table>
<tr><th>Name</th><th>Description</th><th>Values</th><th>Default</th></tr>
<tr>
    <td><code>build</code></td>
    <td>(Optional) Configuration options for the builder; see <a href="#builder-options">Builder Options</a> below for more information.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
<tr>
    <td><code>prefsEditor</code></td>
    <td>(Optional) Configuration options for the preferences editor itself. See <a href="#prefseditor-options">PrefsEditor Options</a> below for more information.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
</table>

#### Builder Options ####

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
    <td>(Optional) A JavaScript object providing primary schema details. See <a href="PrimarySchemaForPreferencesFramework.md">Primary Schema for Preferences Framework</a> for more details.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
<tr>
    <td><code>auxiliarySchema</code></td>
    <td>(Optional) A JavaScript object providing auxiliary schema details. See <a href="AuxiliarySchemaForPreferencesFramework.md">Auxiliary Schema for Preferences Framework</a> for more details. If you do not specify the grade name of a grade that includes an auxiliary schema, you must include this option.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
</table>

<div class="infusion-docs-note"><strong>Note:</strong> You <strong>must</strong> provide at least one of</div>

* the `auxiliarySchema` option, or
* a gradeName indicating an auxiliary schema.

If you provide both, they will be merged (with the `auxiliarySchema` overriding anything in the grade schema), but you must provide at least one.

#### PrefsEditor Options ####

<table>
<tr><th>Name</th><th>Description</th><th>Values</th><th>Default</th></tr>
<tr>
    <td><code>storeType</code></td>
    <td>(Optional) The string name of a <a href="ComponentGrades.md">grade</a> of a Settings Store.</td>
    <td>Integrators can define their own store grade by deriving from the built-in default grade <code>"fluid.prefs.store"</code> as a base grade and providing custom <code>get</code> and <code>set</code> methods.</td>
    <td><code>"fluid.prefs.cookieStore"</code></td>
</tr>
<tr>
    <td><code>enhancerType</code></td>
    <td>(Optional) The string name of a <a href="ComponentGrades.md">grade</a> of a <a href="to-do/UIEnhancer.md">UI Enhancer</a>.</td>
    <td>Integrators can define their own enhancer grade by using the built-in default grade <code>"fluid.pageEnhancer"</code> as a base grade.</td>
    <td><code>"fluid.pageEnhancer"</code></td>
</tr>
<tr>
    <td><code>terms</code></td>
    <td>(Optional) A object containing relative paths to directories containing the template files and the message bundles. This value will overwrite the <code>terms</code> value supplied by <a href="AuxiliarySchemaForPreferencesFramework.md">auxiliary schemas</a>.</td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td><code>prefsEditor</code></td>
    <td>(Optional) The data structure that configures the internal <code>prefsEditor</code> component.</td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td><code>uiEnhancer</code></td>
    <td>(Optional) The data structure that configures the <code>uiEnhancer</code> component. See <a href="to-do/UIEnhancer.md">UI Enhancer</a> for what is accepted in the data structure.</td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td><code>store</code></td>
    <td>(Optional) The data structure that configures the <code>store</code> component.</td>
    <td></td>
    <td></td>
</tr>
<tr>
    <td><code>listeners</code></td>
    <td>(Optional) A data structure defining listener functions for supported events. See <a href="InfusionEventSystem.md">Infusion Event System</a> for more information about registering event listeners.</td>
    <td>The Preferences Framework supports one event:

<code>onReady</code>: Fires after the preferences editor is rendered and ready to use.</td>
    <td></td>
</tr>
</table>

## Usage ##

The simplest way to create a separated panel preferences editor is to provide the primary and auxiliary schema using the options:
```javascript
var prefsEditor = fluid.prefs.create("#myPrefsEditor", {
    build: {
        primarySchema: {...},
        auxiliarySchema: {...}
    }
});
```

The preferences editor will be instantiated and rendered into the container specified as the first argument to `fluid.prefs.create()`.

## Examples ##

```javascript
 fluid.prefs.create("#myPrefsEditor", {
    build: {
        gradeNames: ["fluid.prefs.auxSchema.starter"],
        auxiliarySchema: {
            "loaderGrades": "fluid.prefs.fullPreview",
            "template": "prefsEditorPreview.html",
            "tableOfContents": {
                "enactor": {
                    "tocTemplate": "../../../components/tableOfContents/html/TableOfContents.html"
                }
            }
        }
    }
});
```
