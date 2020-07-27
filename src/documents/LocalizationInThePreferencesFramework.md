---
title: Localization in the Preferences Framework
layout: default
category: Infusion
---

Localization in the Preferences Framework makes use of Message Bundles: JSON files containing the strings that are to be
used in the interface.

## Message Bundles

Message Bundles are JSON files containing key/value pairs representing the message key and the localized text associated
with it. Each set of localized text should be contained in its own Message Bundle.

```json
{
    "slidingPanelShowText": "+ Show Display Preferences",
    "slidingPanelHideText": "- Hide"
}
```

Message Bundles cannot contain arrays. Instead a namespace should be used to group message keys together. This will
require extra processing when using the messages. (See [Using Message Bundles](#using-message-bundles) below)

<div class="infusion-docs-note">
    <strong>Note:</strong> The namespace should <strong>not</strong> include ".", which is used for path parsing.
</div>

```json
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

## Required Components

### MessageLoader

The messageLoader is an instance of a `fluid.prefs.resourceLoader` responsible for retrieving all of the Message Bundles
added to the Prefs Editor (See [Adding Message Bundles](#adding-message-bundles) below). Message Bundles are
automatically distributed to the Prefs Editor and Panels based on the configuration supplied in the [auxiliary
schema](AuxiliarySchemaForPreferencesFramework.md). However, to access the Message Bundle from other components on the
IoC tree, the IoC reference `{messageLoader}.resources.<messageBundle>.resourceText` can be used. Additionally the
`defaultLocale` and `locale` options are used to specify which localization to fetch for each bundle. (See: [Specifying
a localization](#specifying-a-localization) below)

### MsgLookup

The `fluid.prefs.msgLookup` grade is required for any component through which a message lookup is performed. The
msgLookup grade wires up the `msgLookup` IoC reference and the `lookup` method for retrieving messages from the Message
Bundle (See: [Using Message Bundles](#using-message-bundles)). The msgLookup's message resolution is mediated by a
`fluid.messageResolver` subcomponent and it is to this subcomponent that the `messageBase` option, containing the
fetched Message Bundle, is set.

For a `fluid.prefs.panel` component, all of the `fluid.prefs.msgLookup` configuration is prewired. For other components
to make use of this functionality, the following configuration is needed:

- add `fluid.prefs.msgLookup` as a [parent grade](ComponentGrades.md#specifying-parent-grades)
- add an instance of `fluid.messageResolver` as a subcomponent with the member name `msgResolver`
- link the messageBase to the fetched Message Bundle.
  - e.g. using an IoC reference to the [messageLoader](#messageloader):
    `{messageLoader}.resources.<messageBundle>.resourceText`
- for an instance of `fluid.rendererComponent` it is also necessary to use the messageResolver's `resolve` method as the
  `messageLocator`

#### Adding MsgLookup to a Component

<div class="infusion-docs-note">

<strong>Note:</strong> Renderer components require additional configuration. (See: [Adding MsgLookup to a Renderer
Component](#adding-msglookup-to-a-renderer-component))
</div>

```javascript
fluid.defaults("my.component", {
    gradeNames: ["fluid.prefs.msgLookup", "fluid.component"],
    components: {
        msgResolver: {
            type: "fluid.messageResolver"
        }
    },
    // should contain the strings loaded from a Message Bundle
    // e.g. messageBase: "{messageLoader}.resources.messageBundleName.resourceText"
    messageBase: {},
    distributeOptions: {
        source: "{that}.options.messageBase",
        target: "{that > msgResolver}.options.messageBase"
    }
});
```

#### Adding MsgLookup to a Renderer Component

```javascript
fluid.defaults("my.renderer.component", {
    gradeNames: ["fluid.prefs.msgLookup", "fluid.rendererComponent"],
    components: {
        msgResolver: {
            type: "fluid.messageResolver"
        }
    },
    rendererOptions: {
        messageLocator: "{msgResolver}.resolve"
    },
    // should contain the strings loaded from a Message Bundle
    // e.g. messageBase: "{messageLoader}.resources.messageBundleName.resourceText"
    messageBase: {},
    distributeOptions: {
        source: "{that}.options.messageBase",
        target: "{that > msgResolver}.options.messageBase"
    }
});
```

## Adding Message Bundles

Message Bundles can be specified through the [auxiliary schema](AuxiliarySchemaForPreferencesFramework.md). The
Preferences Framework will load all of the Message Bundles and automatically distribute them to the panels.

### Example Auxiliary Schema

```json5
{
    "namespace": "fluid.prefs.constructed",
    "terms": {
        "templatePrefix": "../../../framework/preferences/html",
        "messagePrefix": "../../../framework/preferences/messages"
    },
    "template": "%templatePrefix/SeparatedPanelPrefsEditor.html",
    "message": "%messagePrefix/prefsEditor.json", // Message Bundle for the preference editor itself
    "textSize": {
        "type": "fluid.prefs.textSize",
        "enactor": {
            "type": "fluid.prefs.enactor.textSize"
        },
        "panel": {
            "type": "fluid.prefs.panels.textSize",
            "container": ".flc-prefs-text-size",
            "template": "%templatePrefix/PrefsEditorTemplate-textSize.html",
            "message": "%messagePrefix/textSize.json" // Message Bundle for the fluid.prefs.panels.textSize component
        }
    },
    "lineSpace": {
        "type": "fluid.prefs.lineSpace",
        "enactor": {
            "type": "fluid.prefs.enactor.lineSpace",
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
            "template": "%templatePrefix/PrefsEditorTemplate-lineSpace.html",
            "message": "%messagePrefix/lineSpace.json" // Message Bundle for the fluid.prefs.panels.lineSpace component
        }
    }
}
```

## Using Message Bundles

### In the ProtoTrees

When using a `fluid.rendererComponent`, strings from the Message Bundles are rendered into the templates through a
`protoTree`, using the `messagekey` with a message key from the Message Bundle:

<table>
    <thead>
        <tr>
            <th>Example use in a ProtoTree</th>
            <th>JSON Message Bundle</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td valign="baseline"><pre class="highlight"><code class="hljs javascript">{fluid.defaults("fluid.prefs.panels.linksControls", {
    // ...
    protoTree: {
        label: {messagekey: "linksLabel"},
        linksChoiceLabel: {messagekey: "linksChoiceLabel"},
        inputsChoiceLabel: {messagekey: "inputsChoiceLabel"},
        links: "${links}",
        inputsLarger: "${inputsLarger}"
    }
});</code></pre></td>
            <td valign="baseline"><pre class="highlight"><code class="hljs javascript">{{
    "linksLabel": "Links &amp; buttons",
    "linksChoiceLabel": "Underline and bold",
    "inputsChoiceLabel": "Enlarge buttons, menus, text-fields, and other inputs"
}</code></pre></td>
        </tr>
    </tbody>
</table>

### IoC References

Message Bundles can also be resolved directly through an [IoC reference](IoCReferences.md) making use of the `msgLookup`
property, which is automatically created for any panel component. This process is quite similar to how IoC references to
selectors are resolved.

```javascript
fluid.defaults("fluid.slidingPanel", {
    // ...
    strings: {
        showText: "{that}.msgLookup.slidingPanelShowText",
        hideText: "{that}.msgLookup.slidingPanelHideText"
    }
    // ...
});
```

There are other, more complex cases where an array of strings is required (for example, for a set of radio buttons or a
drop-down). In these cases, a `stringArrayIndex` in the components options needs to be specified. This defines the
following:

1. which strings to include
2. the order in which they should be returned.

It is accessed the same way that an individual string is referenced, except that reference should point to the key in
the `stringArrayIndex` instead of a single string name. In the example below, the `stringArrayIndex` is used to define
the `theme` string bundle, and the `theme` string bundle is referenced within the `protoTree.expander.tree`
('`optionnames: "${{that}.msgLookup.theme}"`'):

```javascript
fluid.defaults("fluid.prefs.panel.contrast", {
    // ...
    stringArrayIndex: {
        // the theme values correspond to message keys in the Message Bundle.
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
    // ...
});
```

The values in the `theme` array, within `stringArrayIndex`, directly correspond to namespaced message keys from the
Message Bundle.

```json
{
    "contrast-default": "Default",
    "contrast-bw": "Black on white",
    "contrast-wb": "White on black",
    "contrast-by": "Black on yellow",
    "contrast-yb": "Yellow on black",
    "contrast-lgdg": "Low contrast"
}
```

### Direct Access

The strings can also be accessed directly, outside of the context of IoC references or renderer protoTrees (for example,
in an invoker function), by making function calls to the internal string bundle `lookup()` method.

```javascript
that.msgLookup.lookup(value); // where value is either the string name or the key in the stringArrayIndex to lookup.
```

## Specifying a Localization

The messageLoader is implemented using [fluid.resourceLoader](ResourceLoader.md). It takes `defaultLocale` and `locale`
options for specifying which localized Message Bundle to fetch. The `locale` option specifies the localization desired.
By default it is sourced from the prefsEditorLoader's settings object, `"{prefsEditorLoader}.settings.locale"`. The
`defaultLocale` provides a fallback to use if the desired localization cannot be located. By default it is sourced from
the prefsEditorLoader's `defaultLocale` option.

See [fluid.resourceLoader options](ResourceLoader.html#options) for the accepted form of `locale` and
`defaultLocale`.

See [fluid.resourceLoader fallback rules](ResourceLoader.html#fallback-rules-with-locale-and-defaultlocale) for fallback
rules when attempting to locate a localization.

### Bundle Naming

The Message Bundles should conform to the following naming convention to facilitate discovery by the messageResolver:
`<bundle name>_<language code>_<country code>.json`

The following are all valid Message Bundle names and will work with the above [Fallback
Rules](ResourceLoader.html#fallback-rules-with-locale-and-defaultlocale):

- prefsEditor_fr_CA.json
- prefsEditor_fr.json
- prefsEditor.json
