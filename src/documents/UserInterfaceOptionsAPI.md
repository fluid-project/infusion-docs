---
title: User Interface Options API
category: Components
---

The **User Interface Options (UI Options)** component allows users to transform the presentation of the user interface
and content resources so that they are personalized to the individual user's needs.

UI Options does three things:

* places a preferences editor dialog with a set of panels in a collapsible panel at the top of the page, accessible
  through a button in the upper right corner of the page;
* instantiates a cookie-based [Settings Store](SettingsStore.md) for storing the user's preferences; and
* acts upon the user's preferences.

UI Options is a convenient way to add a simple separated-panel preferences editor to any page. The interface will
automatically support the set of "starter" preferences provided by the [Preferences Framework](PreferencesFramework.md),
in their default configuration.

![Screen shot of the UI Options Component](/images/uio-showcase.png "Screen shot of the UI Options Component")

## Creator

Use the following function to create a UI Options component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.uiOptions(container, options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiate a separated panel version of the UI Options component, which displays the controls in a
                sliding panel at the top of the page.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>container</dt>
                    <dd>
                        A CSS-based selectors, single-element jQuery object, or DOM element that identifies the root DOM
                        node where the UI Options interface should be placed.
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
<pre class="highlight">
<code class="hljs javascript">
var myUIO = fluid.uiOptions("#myContainer", {
    auxiliarySchema: {
        terms: {
            "templatePrefix": "lib/infusion/src/framework/preferences/html"",
            "messagePrefix": "lib/infusion/src/framework/preferences/messages""
        },
        "fluid.prefs.tableOfContents": {
            enactor: {
                "tocTemplate": "lib/infusion/src/components/tableOfContents/html/TableOfContents.html"",
                "tocMessage": "lib/infusion/src/framework/preferences/messages/tableOfContents-enactor.json""
            }
        }
    }
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Notes</th>
            <td>
                UI Options uses the page itself as a live "preview:" As users adjust controls, the page is modified
                accordingly.
            </td>
        </tr>
    </tbody>
</table>

## Options

The second argument to the creator function is the options argument. This is a JavaScript object containing name/value
pairs: The name is the name of the option and the value is the desired setting. Components define their own default
values for options, but integrators can override these defaults by providing new values using the options argument. For
technical information about how options are merged with defaults, see [Options Merging](OptionsMerging.md).

```javascript
var uio = fluid.uiOptions(".myContainer", {
    option1Name: option1value,
    option2Name: option2value
    // ...
});
```

Some top level options supported by UI Options are described below.

### auxiliarySchema

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>auxiliarySchema</code> option allows you to configure the individual individual preferences
                as well as the paths to the templates and message bundles.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
{
    "loaderGrades": ["fluid.prefs.separatedPanel"],
    "generatePanelContainers": true,
    "template": "%templatePrefix/SeparatedPanelPrefsEditor.html",
    "message": "%messagePrefix/prefsEditor.json",
    "terms": {
        "templatePrefix": "../../framework/preferences/html",
        "messagePrefix": "../../framework/preferences/messages"
    }
}
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
fluid.uiOptions("#myContainer", {
    auxiliarySchema: {
        terms: {
            "templatePrefix": "lib/infusion/src/framework/preferences/html"",
            "messagePrefix": "lib/infusion/src/framework/preferences/messages""
        },
        "fluid.prefs.tableOfContents": {
            enactor: {
                "tocTemplate": "lib/infusion/src/components/tableOfContents/html/TableOfContents.html"",
                "tocMessage": "lib/infusion/src/framework/preferences/messages/tableOfContents-enactor.json""
            }
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### buildType

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                A typical instance of UI Options includes the preference editor, enhancer, and store. The
                <code>buildType</code> option allows you to instantiate a subset. For example, if you will be
                implementing the user interface independently. Due to dependencies, each option
                (<code>store</code>, <code>enhancer</code>, <code>prefsEditor</code>) will include its predecessors.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">"prefsEditor"</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
fluid.uiOptions("#myContainer", {
    buildType: "enhancer"
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

    </tbody>
</table>

### enhancer

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>enhancer</code> option allows you to specify a data structure to config the
                <code>enhancer</code> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>null</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
fluid.uiOptions.prefsEditor("#myContainer", {
    enhancer: {
        invokers: {
            updateModel: "my.update.function"
        }
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### enhancerType

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>enhancerType</code> option allows you to specify a custom <code>enhancer</code> <a
                href="ComponentGrades.md">grade</a> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">"fluid.pageEnhancer"</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight"><code class="hljs javascript">
fluid.uiOptions("#myContainer", {
    enhancerType: "my.enhancer"
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### preferences

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>preferences</code> takes an array of preference names, indicating the preferences to include.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
[
    "fluid.prefs.textSize",
    "fluid.prefs.lineSpace",
    "fluid.prefs.textFont",
    "fluid.prefs.contrast",
    "fluid.prefs.tableOfContents",
    "fluid.prefs.enhanceInputs"
]
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
fluid.uiOptions.prefsEditor("#myContainer", {
    preferences: [
        "fluid.prefs.letterSpace",
        "fluid.prefs.wordSpace",
    ]
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### prefsEditor

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>prefsEditor</code> option allows you to specify a data structure to config the
                <code>prefsEditor</code> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>null</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
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

### prefsEditorLoader

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>prefsEditorLoader</code> option allows you to specify a data structure to config the
                <code>prefsEditorLoader</code> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>null</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
fluid.uiOptions.prefsEditor("#myContainer", {
    prefsEditorLoader: {
        lazyLoad: true
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### storeType

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>storeType</code> option allows you to specify a custom <code>store</code> <a
                href="ComponentGrades.md">grade</a> component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>"fluid.prefs.globalSettingsStore"</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight">
<code class="hljs javascript">
fluid.uiOptions.prefsEditor("#myContainer", {
    storeType: "myNamespace.mySettingsStore"
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>See also</th>
            <td>
                <a href="SettingsStore.md#fluidprefscookiestore">Cookie Settings Store</a>
            </td>
        </tr>
    </tbody>
</table>

## Supported Events

Listeners can be attached to any supported events through a component's `listeners` option. Values can be a function
reference (not a string function name) or an anonymous function definition, as illustrated below:

```javascript
var myComponent = component.name("#myContainerID", {
    listeners: {
        eventName1: functionName,
        eventName2: function (params) {
            // ...
        }
    }
});
```

For information on the different types of events, see [Infusion Event System](InfusionEventSystem.md).

### onReady

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

### onPrefsEditorReady

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the UI Options interface has been rendered into the iframe.
                <div class="infusion-docs-note">
                    <strong>Note:</strong> use <code>onReady</code> if the listener needs UI Options to be both rendered
                    and ready to use.
                </div>
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
