Localization in the Preferences Framework
=========================================

Overview
--------

Localization in the Preferences Framework makes use of message bundles: JSON files containing the strings that are to be used in the interface. The Preferences Framework combines any message bundles into a single bundle and makes that bundle available to the components that need to use the strings.

Message Bundles
---------------

Message bundles are JSON files containing key/value pairs representing the message key and the localized text associated with it. Each set of localized text should be contained in its own message bundle.

```javascript
{
    "slidingPanelShowText": "+ Show Display Preferences",
    "slidingPanelHideText": "- Hide"
}
```

Message bundles cannot contain arrays. Instead a namespace should be used to group message keys together. This will require extra processing when using the messages. (See [Using Message Bundles](#using-message-bundles) below). Note that the namespace should *not* include ".", which is used for path parsing.

```javascript
{
    "contrast-default": "Default",
    "contrast-bw": "Black on white",
    "contrast-wb": "White on black",
    "contrast-by": "Black on yellow",
    "contrast-yb": "Yellow on black",
    "contrast-lgdg": "Low contrast",
    "contrastLabel": "Colour & Contrast"
}
```

Preferences Editor Component Hierarchy
--------------------------------------

Understanding how to access message bundles is helped by understanding the general structure of the components of a preferences editor. The diagram below illustrates this structure and shows where the messages can be accessed. The rest of this page provides specific details about how to specify message bundles and how to retrieve strings.

![Figure 1: Structure of preferences editor components](images/PrefsFrameworkLocalization.png)

### PrefsEditorLoader

All versions of preferences editors (separated panel, full page with preview and full page without preview) are instances of a "PrefsEditorLoader" component. The PrefsEditorLoader coordinates the work of its three subcomponents: MessageLoader, TemplateLoader and PrefsEditor. In particular, the PrefsEditorLoader

- parses and assembles JSON strings loaded by the MessageLoader,
- runs the assembled JSON through the [message resolver](http://wiki.fluidproject.org/display/docs/fluid.messageResolver) to create the lookup function, and
- attaches the message resolver bundle as a member, accessible through `that.msgResolver`.

To access the message bundle from other components on the IoC tree, use `{prefsEditorLoader}.msgResolver`.

### PrefsEditor

PrefsEditor is the host component that holds all the actual panel (or adjuster) components as subcomponents. By default, the message bundle is *not* passed down to PrefsEditor. If your PrefsEditor component will need direct access to the message bundle, provide it at the instantiation of any PrefsEditor instance, as shown in the following example:

```javascript
fluid.prefs.separatedPanel("#myPrefsEditor", {
    prefsEditor: {
        msgResolver: "{prefsEditorLoader}.msgResolver"
    }
});
```

If the message bundle is provided to PrefsEditor this way, access it within the PrefsEditor component using `{that}.options.msgResolver`.

### Panels

The message bundle is attached to each panel component as the `parentBundle` option. To access it from within a panel, use `{that}.options.parentBundle`.

Adding Message Bundles
----------------------

Message bundles can be specified in one of two ways:

1. through the [auxiliary schema](AuxiliarySchemaForPreferencesFramework.md) (if schemas are being used), or
1. directly to the `messageLoader` (if grades are being used).

The Preferences Framework will load and combine all of the Message Bundles into a single Message Bundle which is bound to the `prefsEditorLoader` component at the `msgResolver` property (as described above).

Any panel that has the grade `fluid.prefs.defaultPanel` will have access to the combined Message Bundle at its `parentBundle` option (as described above). When using the auxiliary schema, all panels are assigned the grade `fluid.prefs.defaultPanel` by the Framework.
 
### Example Auxiliary Schema

```javascript
{
    "namespace": "fluid.prefs.constructed",
    "templatePrefix": "../../../framework/preferences/html/",
    "template": "%prefix/SeparatedPanelPrefsEditor.html",
    "messagePrefix": "../../../framework/preferences/messages/",
    "message": "%prefix/prefsEditor.json", // message bundle for the preference editor itself
    "textSize": {
        "type": "fluid.prefs.textSize",
        "enactor": {
            "type": "fluid.prefs.enactors.textSize"
        },
        "panel": {
            "type": "fluid.prefs.panels.textSize",
            "container": ".flc-prefs-text-size",
            "template": "%prefix/PrefsEditorTemplate-textSize.html",
            "message": "%prefix/textSize.json"
        }
    },
    "lineSpace": {
        "type": "fluid.prefs.lineSpace",
        "enactor": {
            "type": "fluid.prefs.enactors.lineSpace",
            "fontSizeMap": {
                "xx-small": "9px",
                "x-small": "11px",
                "small": "13px",
                "medium": "15px",
                "large": "18px",
                "x-large": "23px",
                "xx-large": "30px"
            }
        },
        "panel": {
            "type": "fluid.prefs.panels.lineSpace",
            "container": ".flc-prefs-line-space",
            "template": "%prefix/PrefsEditorTemplate-lineSpace.html",
            "message": "%prefix/lineSpace.json" // message bundle for the fluid.prefs.panels.lineSpace component
        }
    }
}
```

### Example Message Loader Specification

```javascript
fluid.defaults("my.messageLoader", {
    gradeNames: ["fluid.prefs.resourceLoader", "autoInit"],
    templates: {
        magnification: "%prefix/magnification.json",
        cursorSize: "%prefix/cursorSize.json"
    }
});
fluid.prefs.separatedPanel("#myPrefsEditor", {
    ...
    messageLoader: {
        gradeNames: ["my.messageLoader", "autoInit"]
    },
    ...
});
```

Using Message Bundles
---------------------

### In the ProtoTrees

Strings from the Message Bundles are rendered into the templates through the protoTrees, using the `messagekey`, the name of the string in the bundle:

<table>
    <thead>
        <tr>
            <th>Example use in a ProtoTree</th>
            <th>JSON message bundle</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td valign="baseline"><pre><code>fluid.defaults("fluid.prefs.panels.linksControls", {
    ...
    protoTree: {
        label: {messagekey: "linksLabel"},
        linksChoiceLabel: {messagekey: "linksChoiceLabel"},
        inputsChoiceLabel: {messagekey: "inputsChoiceLabel"},
        links: "${links}",
        inputsLarger: "${inputsLarger}"
    }
});</code></pre></td>
            <td valign="baseline"><pre><code>{
    "linksLabel": "Links &amp; buttons",
    "linksChoiceLabel": "Underline and bold",
    "inputsChoiceLabel": "Enlarge buttons, menus, text-fields, and other inputs"
}</code></pre></td>
        </tr>
    </tbody>
</table>

### IoC References

Message Bundles can also be resolved directly through an [IoC reference](IoCReferences.md) making use of the `msgLookup` property, which is automatically created for any panel component. This process is quite similar to how IoC references to selectors are resolved.

```javascript
fluid.defaults("fluid.slidingPanel", {
    ...
    strings: {
        showText: "{that}.msgLookup.slidingPanelShowText",
        hideText: "{that}.msgLookup.slidingPanelHideText"
    }
    ...
});
```

There are other, more complex cases where an array of strings is required (for example, for a set of radio buttons or a drop-down). In these cases, a `stringArrayIndex` in the components options needs to be specified. This defines both

1. which strings to include and
1. the order in which they should be returned.

It is accessed the same way that an individual string is referenced, except that reference should point to the key in the `stringArrayIndex` instead of a single string name. In the example below, the `stringArrayIndex` is used to define the `theme` string bundle, and the `theme` string bundle is referenced within the `protoTree.expander.tree` ('`optionnames: "${{that}.msgLookup.theme}"`'):

```javascript
    fluid.defaults("fluid.prefs.panel.contrast", {
    ...
    stringArrayIndex: {
        theme: ["contrast-default", "contrast-bw", "contrast-wb", "contrast-by", "contrast-yb", "contrast-lgdg"]
    },
    protoTree: {
        label: {messagekey: "contrastLabel"},
        expander: {
            type: "fluid.renderer.selection.inputs",
            rowID: "themeRow",
            labelID: "themeLabel",
            inputID: "themeInput",
            selectID: "theme-radio",
            tree: {
                optionnames: "${{that}.msgLookup.theme}", // IoC reference to the array of strings
                optionlist: "${{that}.options.controlValues.theme}",
                selection: "${value}"
            }
        }
    }
    ...
});
```

### Direct Access

The strings can also be accessed directly, outside of the context of IoC references or renderer protoTrees (for example, in an invoker function), by making function calls to the internal string bundle `lookup()` method.

```javascript
that.msgLookup.lookup(value); // where value is either the string name or the key in the stringArrayIndex to lookup.
```
