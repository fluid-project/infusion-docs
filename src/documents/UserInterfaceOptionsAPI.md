---
title: User Interface Options API
layout: default
category: API
---

The **User Interface Options (UI Options)** component allows users to transform the presentation of the user interface and content resources so that they are personalized to the individual user's needs.

UI Options does three things:
* places a preferences editor dialog with a set of six panels in a collapsible panel at the top of the page, accessible through a button in the upper right corner of the page;
* instantiates a cookie-based Settings Store for storing the user's preferences; and
* acts upon the user's preferences.

UI Options is a convenient way to add a simple separated-panel preferences editor to any page. The interface will automatically support the set of "starter" preferences provided by the [Preferences Framework](PreferencesFramework.md), in their default configuration.

<div class="infusion-docs-note"><strong>Note:</strong> If you require any customization of UI Options, you should consider  using the <a href="Builder.md">Builder</a> tool of the <a href="PreferencesFramework.md">Preferences Framework</a> directly.</div>

![Screen shot of the UI Options Component](images/uio-showcase.png "Screen shot of the UI Options Component")

## Creator ##

Use the following function to create a UI Options component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.uiOptions.prefsEditor(container, options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiate a separated panel version of the UI Options component, which displays the controls in a sliding panel at the top of the page.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>container</dt>
                    <dd>
                        A CSS-based selectors, single-element jQuery object, or DOM element that identifies the root DOM node where the UI Options interface should be placed.
                    </dd>
                    <dt>options</dt>
                    <dd>
                        An optional data structure that configures the UI Options component, as described below.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>The UI Options component</td>
        </tr>
        <tr>
            <th>Examples</th>
            <td>
<pre>
<code>
var myUIO = fluid.uiOptions.prefsEditor("#myContainer", {
    tocTemplate: "../../components/tableOfContents/html/TableOfContents.html"
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Notes</th>
            <td>
                The UI Options uses the page itself as a live "preview:" As users adjust controls, the page is modified accordingly.
            </td>
        </tr>
    </tbody>
</table>

## Supported Events ##

Listeners can be attached to any supported events through a component's `listeners` option. Values can be a function reference (not a string function name) or an anonymous function definition, as illustrated below:

```javascript
var myComponent = component.name("#myContainerID", {
    listeners: {
        eventName1: functionName,
        eventName2: function (params) {
            ...
        }
    }
});
```

For information on the different types of events, see [Infusion Event System](InfusionEventSystem.md).


### onReady ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the UI Options component is fully instantiated, rendered and ready to use.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>uio</dt>
                    <dd>The instantiated UI Options component.</dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

### onPrefsEditorReady ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the UI Options interface has been rendered into the iframe.

                <p><em><strong>Note:</strong> use <code>onReady</code> if the listener needs UI Options to be both rendered and ready to use.</em></p>
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>prefsEditorLoader</dt>
                    <dd>
                        The instantiated preference editor loader component.
                    </dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

## Options ##

The second argument to the creator function is the options argument. This is a JavaScript object containing name/value pairs: The name is the name of the option and the value is the desired setting. Components define their own default values for options, but integrators can override these defaults by providing new values using the options argument. For technical information about how options are merged with defaults, see [Options Merging](OptionsMerging.md).

```javascript
var uio = fluid.uiOptions.prefsEditor(".myContainer", {
    <option1Name>: <option1value>,
    <option2Name>: <option2value>
    ...
});
```

The options supported by UI Options are described below.

### tocTemplate ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>tocTemplate</code> option allows you to specify a custom relative path to the templates used by generating table of contents. This template can be found in the source tree of the Infusion distribution.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                "../../components/tableOfContents/html/TableOfContents.html"
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.uiOptions.prefsEditor("#myContainer", {
    tocTemplate: "html/myTocTemplate.html"
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>See also</th>
            <td>
                <a href="to-do/TableOfContentsAPI.md">Table of Contents API</a>
            </td>
        </tr>
    </tbody>
</table>

### terms ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>terms</code> option allows you to specify custom relative paths to the templates and message bundles used by the UI Options interface. These templates can be found in the source tree of the Infusion distribution.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre>
<code>
{
    templatePrefix: "../../framework/preferences/html/",
    messagePrefix: "../../framework/preferences/messages/"
}
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.uiOptions.prefsEditor("#myContainer", {
    terms: {
        templatePrefix: "../infusion/framework/preferences/html/",
        messagePrefix: "../infusion/framework/preferences/messages/"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### prefsEditor ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>prefsEditor</code> option allows you to specify a data structure to config the <code>prefsEditor</code> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>null</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.uiOptions.prefsEditor("#myContainer", {
    prefsEditor: {
        listeners: {
            onReady: function (internalEditor) {...}
            onReset: function (internalEditor) {...}
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### prefsEditorType ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>prefsEditorType</code> option allows you to specify a custom <code>prefsEditorLoader</code> <a href="ComponentGrades.md">grade</a> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>"fluid.pageEnhancer"</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.uiOptions.prefsEditor("#myContainer", {
    prefsEditorType: "myNamespace.myPrefsEditor"
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### enhancerType ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>enhancerType</code> option allows you to specify a custom <code>enhancer</code> <a href="ComponentGrades.md">grade</a> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>"fluid.pageEnhancer"</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.uiOptions.prefsEditor("#myContainer", {
    enhancerType: "myNamespace.myUIEnhancer"
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### storeType ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>storeType</code> option allows you to specify a custom <code>store</code> <a href="ComponentGrades.md">grade</a> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>"fluid.prefs.globalSettingsStore"</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.uiOptions.fullNoPreview("#myContainer", {
    storeType: "myNamespace.mySettingsStore"
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>See also</th>
            <td>
                <a href="to-do/CookieSettingsStore.md">Cookie Settings Store</a>
            </td>
        </tr>
    </tbody>
</table>
