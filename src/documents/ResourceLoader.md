---
title: Resource Loader
category: Infusion
---

The Infusion Resource Loader `fluid.resourceLoader` is an [Infusion component](UnderstandingInfusionComponents.md)
which offers a mechanism to load multiple resources in one shot. Whilst these resources may require an asynchronous
I/O operation, `fluid.resourceLoader` can arrange to load these before component instantiation has finished.
Resources may be loaded over a variety of transports, such as HTTP/HTTPS, or
directly from the filesystem if Infusion is running under `node.js`. These resources can be HTML templates, JSON objects
or other kinds of static resources.

The resources to be loaded are configured in a free hash held in the top-level `resources` option of the component.
Each member of `resources` is a structure named `ResourceSpec` specifying a resource to be loaded.

### Minimal `fluid.resourceLoader` example

Although we show an example here of constructing the resource loader as a free-standing component,
a more typical usage would configure `fluid.resourceLoader` as a mixin to some
[subcomponent](SubcomponentDeclaration.md) in a wider component tree:

```javascript
var resourceLoader = fluid.resourceLoader({
    resources: {
        userRecord: {
            url: "https://jsonplaceholder.typicode.com/users/1",
            dataType: "json"
        }
    },
    listeners: {
        "onResourcesLoaded.log": {
            funcName: "console.log",
            args: "{that}.resources.userRecord.parsed"
        }
    }
});
```

### ResourceLoader lifecycle

Whilst the `ResourceSpec` structure by which a resource is configured to be loaded is always the same,
depending on how the resource is requested, it may be loaded via a "fast path" or a "slow path".
Any resource referenced from a component's `model` area (for a
[fluid.modelComponent](tutorial-gettingStartedWithInfusion/ModelComponents.md)), for example,
will be loaded via the "fast path" and will be available before the component's construction has completed. In fact,
it will be available before the initial value of the component's model has been computed, in time to participate in the
[initial transaction](ModelRelay.md#the-initial-transaction). Other kinds of "fast path" may be made available by
other core framework grades, for example the upcoming "new renderer".

Any resource not loaded via the "fast path" will be loaded via the "slow path" and will have its fetch triggered by
the component's `onCreate` event.

When all resources, via all routes, configured for the component, have been loaded, the resource loader fires
an `onResourcesLoaded` event with an argument of the populated `resources` structure. These will each have fields
filled in corresponding to the loaded resource, most importantly the field `parsed` holding a parsed (e.g. as JSON)
representation of the resource, and also the original fetched resource text within the field `resourceText`.
This populated structure can also be retrieved directly on the resource loader instance via the path `resources`.

<div class="infusion-docs-note"><strong>Note:</strong> If all of the component's resources have already been loaded via
the "fast path", <code>onResourcesLoaded</code> will only fire once the component's <code>onCreate</code> event has concluded.
If any resource loading fails, the event <code>onResourceError</code> will be fired for the failing resource, and
<code>onResourcesLoaded</code> will not fire.</div>

The underlying implementation of `fluid.resourceLoader` is the low-level `fluid.resourceFetcher` mini-component.
In the browser, for URL resources, this operates a native [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest),
whereas in node.js this operates the native node [HTTP](https://nodejs.org/api/http.html) or [HTTPS request API](https://nodejs.org/api/https.html).
For all transports, there is the possibility to pass arbitrary options through the ResourceLoader configuration
structure to take full control of the loading process, whilst there is a central core of portable options supported
in all environments.

### `fluid.resourceLoader` options

We name the subset of component options particularly consumed by `fluid.resourceLoader` as `resourceLoaderOptions`.
`resourceLoaderOptions` contains two top-level keys, `resourceOptions`, and `resources`, which are both optional.

Schematically, `fluid.resourceLoader` configuration looks like

```snippet
fluid.resourceLoader({
    resourceOptions: <resourceOptions>
    resources: {
        resourceKey1: <resourceSpec>
        resourceKey2: <resourceSpec>
    ....
    }
})
```

In short form, a `resourceSpec` may simply consist of a String, in which case it is interpreted as a URL. Otherwise,
it is an Object with keys described in the [section on resourceSpecs](#resourcespec-structure).

### `resourceOptions` structure

<table>
    <tr>
        <th colspan="3">Members within the <code>resourceOptions</code> structure at top level in the options
        <code>fluid.resourceLoader</code> component</th>
    </tr>
<tr><th>Name</th><th>Description</th><th>Type</th></tr>
<tr>
    <td><code>terms</code></td>
    <td>Contains a map of variable names and replacement values to compose the path to each physical file.
    The map structure complies with the format of the second <code>terms</code> argument of
    <a href="CoreAPI.html#fluidstringtemplatetemplate-terms">fluid.stringTemplate()</a> API.
    Also see <a href="./tutorial-usingStringTemplates/UsingStringTemplates.html">Using String Templates</a> for more
    information.</td>
    <td>Object</td>
</tr>
<tr>
    <td><code>locale</code></td>
    <td>Specifies the language code with the desired localization. Language codes are expected in a form
    similar to <a href="https://tools.ietf.org/html/bcp47">BCP 47 tags</a> but with a "_" instead of a "-" separating
    the language code from the country code. When specified, the resource loader will add a suffix of the locale value
    to each entry defined in the <code>resources</code> and look for them at the first attempt. If any such resource is
    not located, the resource loader follows
    <a href="ResourceLoader.html#fallback-rules-with-locale-and-defaultlocale">Fallback Rules</a> to attempt to
    find another localization.</td>
    <td>String</td>
</tr>
<tr>
    <td><code>defaultLocale</code></td>
    <td>Specifies the default language code. Provides a fallback to use if the desired localization cannot be located.
    See <code>locale</code> option for the format of language codes. Also see
    <a href="ResourceLoader.html#fallback-rules-with-locale-and-defaultlocale">Fallback Rules</a> for when
    <code>defaultLocale</code> value will be used.</td>
    <td>String</td>
</tr>
<tr>
    <td><code>dataType</code></td>
    <td>Determines the kind of parser to be used to convert the fetched text into a more structured form. There is core
    support for JSON or no parsing, and further parsers may be configured by registering appropriate parsers in the
    <code>fluid.resourceLoader.parsers</code> structure. These accept the resource text as argument, and return a
    promise representing successful or failed parsing of the resource. Note that these parsers may not throw an
    exception to represent a failed parse.
    <td>String</td>
</tr>

</table>

### `resourceSpec` structure

`resourceSpec` entries are duck typed, with a duck typing field determining the type of transport to be used to load
the resources. Each `resourceSpec` structure must contain exactly one out of the following duck typing fields,
identifying both the transport and the address of the resource to be loaded:

<table>
    <tr>
        <th colspan="3">Duck typing fields determining <code>resourceSpec</code> transport within a
        <code>resourceSpec</code> structure for a <code>fluid.resourceLoader</code> component</th>
    </tr>
<tr><th>Name</th><th>Description</th><th>Type</th></tr>
<tr>
    <td><code>url</code></td>
    <td>A relative or absolute URL to be loaded via HTTP or HTTPS. This may include interpolated terms such as
    <code>%some-term</code>
    resolved via the <code>resourceLoader</code>'s <code>terms</code> structures.</td>
    <td>String</td>
</tr>
<tr>
    <td><code>path</code></td>
    <td>A relative or absolute filesystem path to be loaded via the node.js
    <a href="https://nodejs.org/api/fs.html"><code>fs</code></a> API.
    As with <code>url</code>, this may include interpolated terms.</td>
    <td>String</td>
</tr>
<tr>
    <td><code>resourceText</code></td>
    <td>The complete literal resource text to be reported as loaded. This is useful in an infrastructural context
    where the required resource
    has already been loaded or computed via some other means, and one merely needs to inject it into the
    <code>resourceLoader</code> workflow.</td>
    <td>String</td>
</tr>
<tr>
    <td><code>promiseFunc</code></td>
    <td>A (IoC reference to a) function returning a promise which yields the required resource text. This will be
    invoked with the arguments resolved from the <code>resourceSpec</code> field <code>promiseArgs</code> which may
    also be present.
    </td>
    <td>Function</td>
</tr>
<tr>
    <td><code>dataSource</code></td>
    <td>A reference to a <code>fluid.dataSource</code> component whose <code>get</code> method will be invoked with
    the contents
    of the <code>directModel</code> field in this <code>resourceSpec</code>. Documentation for core Infusion
    DataSources will
    be ported soon, in the meantime you may refer to the docs on
    <a href="https://github.com/fluid-project/kettle/blob/main/docs/DataSources.md">
    Kettle DataSources</a> and substitute <code>kettle</code> for <code>fluid</code> in all gradeNames.
    </td>
    <td>fluid.dataSource</td>
</tr>
</table>

Two of the duck typing fields above (`url`, `path`) are "path fields" (represented in the table below by the placeholder
name `pathField`) and can contain interpolated terms, as well as
participating in the resource localisation algorithm based on path suffix. The other three (`resourceText`,
`promiseFunc` and `dataSource`) are "non-path fields" (represented in the table below by the placeholder name
`nonPathField`) and do not participate in interpolation or localisation.

<table>
    <tr>
        <th colspan="3">Members within a <code>resourceSpec</code> structure nested within the <code>resources</code>
        structure of a <code>fluid.resourceLoader</code> component</th>
    </tr>
<tr><th>Name</th><th>Description</th><th>Type</th></tr>
<tr>
    <td><code>[pathField]</code></td>
    <td>The path to a pathed resource. This may be a relative or absolute URL or filesystem path. These paths can be
    actual path strings, for example, <code>../data/template.html</code>, or
    templating strings with embedded variables that have mapped replacement values defined in the <code>term</code> option,
    for example, <code>%prefix/template.html</code>.
    The format of templating paths complies with the format of the <code>template</code> argument of
    <a href="CoreAPI.html#fluidstringtemplatetemplate-terms">fluid.stringTemplate()</a> API.
    In addition, a localised suffix may be appended before the extension, in order to compute a localised version
    of the resource from the <code>locale</code> and
<code>defaultLocale</code> options.
    <td>String</td>
</tr>
<tr>
    <td><code>[nonPathField]</code></td>
    <td>The duck typing field for a non-pathed resource. See the table above for the possibilities. Depending on the
    type of this
    field, additional options may be accepted in this <code>resourceSpec</code> structure - i.e.
    <code>promiseFunc</code> will accept <code>promiseArgs</code> and <code>dataSource</code> will accept
    <code>directModel</code>.
    <td>String</td>
</tr>
<tr>
    <td><code>options</code></td>
    <td>Contains "options" holding raw options to be forwarded to the underlying transport, e.g. XMLHttpRequest or
    the node HTTP API.</td>
    <td>Object</td>
</tr>
<tr>
    <td><code>locale</code></td>
    <td>As for <code>locale</code> of <a href="#resourceoptions-structure">resourceOptions</a>, but controlling the
    locale of this individual resource.
    <td>String</td>
</tr>
<tr>
    <td><code>dataType</code></td>
    <td>As for <code>dataType</code> of <a href="#resourceoptions-structure">resourceOptions</a>, but controlling the
    dataType of this individual resource.
    <td>String</td>
</tr>
</table>

### Fallback Rules with `locale` and `defaultLocale`

The `locale` and `defaultLocale` options within `resourceOptions` can be used to load localized resources, for example,
to load messages in different languages.

```javascript
fluid.defaults("fluid.messageLoader", {
    gradeNames: ["fluid.resourceLoader"],
    resourceOptions: {
        locale: "fr_CA",
        defaultLocale: "en_US"
    },
    resources: {
        translation: "../data/translation.json"
    }
});
```

This example requests to load a JSON file that contains translations. The `fluid.messageLoader` follows fallback rules
below to satisfy the request:

1. look for a suffixed resource corresponding to the language code specified by the `locale` option:
   `../data/translation-fr_CA.json`
2. look for a suffixed resource with the same language as the language code specified by the `locale` option:
   `../data/translation-fr.json`
3. look for a suffixed resource corresponding to the language code specified by the `defaultLocale` option:
   `../data/translation-en_US.json`
4. look for a suffixed resource with the same language as the language code specified by the `defaultLocale`
   option: `../data/translation-en.json`
5. look for a resource with the exact URL as specified through the `resources` option: `../data/translation.json`

In addition to use within top-level `resourceOptions`, `locale` may also be supplied on an individual resource, in which
case it overrides any choice from `locale` or `defaultLocale` at top level.

### Events

A `resourceLoader` component fires the following events:

<table>
<tr><th>Name</th><th>Description</th><th>Arguments</th></tr>
<tr>
    <td><code>onResourcesLoaded</code></td>
    <td>Fired when all resources are finished loading.</td>
    <td>A populated object with parsed resource text in the field <code>parsed</code> for each entry.
    This object can also be retrieved directly on the resource loader instance via the path <code>resources</code>.
    </td>
</tr>
<tr>
    <td><code>onResourceError</code></td>
    <td>Fired if a resource fails to load</td>
    <td>A populated object with fetched resource text in the field <code>resourceText</code> for each entry. If an error
    occurs during a fetch, the <code>fetchError</code> field will be populated for that entry. This object can also be
    retrieved directly on the resource loader instance via the path <code>resources</code>.
    </td>
</tr>
</table>

### Using `fluid.resourceLoader` - slow path

The example below demonstrates when and how to use the fetched resource text in an IoC component tree. In this pattern,
we postpone the instantiation of the component consuming the resources via `createOnEvent` until resources are ready.
This is appropriate for resources loaded via the "slow path". For "fast path" resources with core framework support,
this separation is not necessary.

```javascript
fluid.defaults("demo.resourcedUI", {
    gradeNames: ["fluid.viewComponent"],
    components: {
        templateLoader: {
            type: "fluid.resourceLoader",
            options: {
                resourceOptions: {
                    terms: {
                        prefix: "../data"
                    }
                },
                resources: {
                    template: "%prefix/testTemplate.html"
                },
                listeners: {
                    "onResourcesLoaded.escalate": "{resourcedUI}.events.onTemplatesReady"
                }
            }
        },
        renderUI: {
            type: "fluid.viewComponent",
            container: "{resourcedUI}.container",
            createOnEvent: "onTemplatesReady",
            options: {
                listeners: {
                    "onCreate.appendTemplate": {
                        "this": "{that}.container",
                        "method": "append",
                        args: ["{templateLoader}.resources.template.resourceText"]
                    }
                }
            }
        }
    },
    events: {
        onTemplatesReady: null
    }
});

var UI = demo.resourcedUI(".flc-UI");
```

### Using `fluid.resourceLoader` - fast path

The following example shows a direct reference from a model component to part of an asynchronously fetched resource.
This activates the "fast path" for that resource and ensures that it will be fetched before the component's model
is initialised.

```javascript

fluid.defaults("demo.fastModel", {
    gradeNames: ["fluid.modelComponent", "fluid.resourceLoader"],
    resources: {
        initModel: {
            url: "https://jsonplaceholder.typicode.com/users/1",
            dataType: "json"
        }
    },
    model: "{that}.resources.initModel.parsed.address.geo.lat"
});

var that = demo.fastModel({
    listeners: {
        "onCreate.printModel": function (that) {
            console.log("Initial model value is ", that.model);
        }
    }
});
// Prints: Initial model value is  -37.3159
```
