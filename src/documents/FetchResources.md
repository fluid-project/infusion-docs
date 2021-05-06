---
title: fluid.fetchResources
category: Infusion
---

The Infusion API `fluid.fetchResources` is a low-level API which automates the work of fetching multiple resources,
possibly asynchronously, using AJAX requests or from the current DOM. This functionality is more compactly encoded by
more modern idioms depending on [Promises](PromisesAPI.md) but this historical API remains since several core Infusion
components, such as the [Resource Loader](ResourceLoader.md) and the [Preferences Framework](PreferencesFramework.md)
still depend on it. This API is deprecated and will be removed in an upcoming revision of the framework.

## Arguments to fluid.fetchResources

The API accepts three arguments - `resourceSpecs`, `callback` and `options`. The first contains a free hash of keys to
resource specification objects describing the resources to be fetched. The second is a function which will receive this
structure with the field `resourceText` filled in if the resources could be fetched. The last argument contains optional
options guiding the fetch process.

```snippet
fluid.fetchResources(resourceSpecs, callback[, options]);
```

<table>
    <thead>
        <tr>
            <th colspan="3">Arguments to <code>fluid.fetchResources</code></th>
        </tr>
        <tr>
            <th>Argument</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>resourceSpecs</code></td>
            <td><code>resourceSpecs</code>Hash of <code>resourceName</code> to <code>resourceSpec</code></td>
            <td>
                A free hash of resource names to <a href="#resource-specification"><code>resourceSpec</code></a>
                structures. <b><strong>Note that this structure will be modified by the action of the
                function</strong></b>
            </td>
        </tr>
        <tr>
            <td><code>callback</code></td>
            <td><code>Function(resourceSpecs)</code></td>
            <td>A function which will accept the filled-in resourceSpecs object</td>
        </tr>
        <tr>
            <td><code>options</code> (optional)</td>
            <td><code>Object</code></td>
            <td>
                An optional structure giving further options guiding the fetch process. This includes members
                <code>amalgamateClasses</code>, <code>defaultLocale</code> which are not documented here.
            </td>
        </tr>
    </tbody>
</table>

## Resource Specification

The values in the `resourceSpecs` hash sent as the first argument to `fluid.fetchResources` are records of type
`resourceSpec`, with the following members:

<table>
    <thead>
        <tr>
            <th colspan="3">Elements in a <code>resourceSpec</code> on input to <code>fluid.fetchResources</code></th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>href</code></td>
            <td><code>String</code></td>
            <td>
                A full resolvable URL holding a template or template fragment. This will be fetched via AJAX and used to
                populate the <code>resourceText</code> entry. NOTE that if this value is provided, the
                <code>nodeId</code> will be ignored.
            </td>
        </tr>
        <tr>
            <td><code>nodeId</code></td>
            <td><code>String</code></td>
            <td>
                The id of a node within the current document holding a template, for which the <code>innerHTML</code> is
                to be treated as a template. NOTE that if <code>href</code> is provided, this value will be ignored.
            </td>
        </tr>
    </tbody>
</table>

On conclusion of the `fluid.fetchResources` call, the following additional fields will be filled in (as well as some
undocumented fields)

<table>
    <thead>
        <tr>
            <th colspan="3">Elements in a <code>resourceSpec</code> on output from <code>fluid.fetchResources</code></th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>resourceText</code></td>
            <td><code>String</code></td>
            <td>The full text of the fetched resources, as a string.</td>
        </tr>
        <tr>
            <td><code>fetchError</code></td>
            <td><code>Object</code></td>
            <td>
                Filled in if the AJAX request to fetch the resource failed. It contains the fields <code>status</code>
                holding the HTTP response status, <code>textStatus</code> holding the textual version of status, and
                <code>errorThrown</code> holding details of any exception that was thrown
            </td>
        </tr>
    </tbody>
</table>

## Examples

This shows a simple usage of fetchResources which fetches some templates and injects their contents into the DOM without
error checking:

```javascript
var myResourceSpecs = {
    bodyTemplate: {
        href: "templates/Body.html"
    },
    sidebarTemplate: {
        href: "templates/Sidebar.html"
    }
};
var myCallback = function (returnedResourceSpecs) {
    // very simple: inject the fetched HTML into the DOM
    $(".bodyNode").html(returnedResourceSpecs.bodyTemplate.resourceText);
    $(".sidebarNode").html(returnedResourceSpecs.sidebarTemplate.resourceText);
};
fluid.fetchResources(myResourceSpecs, myCallback);
```

This shows a more complex example which checks for errors from the fetch process and logs them:

```javascript
var myResourceSpecs = {
    template1: {
        href: "html/template1.html"
    },
    template2: {
        href: "html/template1.html"
    },
    data: {
        href: "data/clientData.json"
    }
};

var myCallback = function (returnedResourceSpecs) {
    for (var key in returnedResourceSpecs) {
        // check for errors before proceeding
        if (returnedResourceSpecs[key].fetchError) {
            // log the failed fetch
            fluid.log("Error loading resource " + returnedResourceSpecs[key].href);
            fluid.log("status: " + returnedResourceSpecs[key].fetchError.status +
                    ", textStatus: " + returnedResourceSpecs[key].fetchError.textStatus +
                    ", errorThrown: " + returnedResourceSpecs[key].fetchError.errorThrown);
        } else {
            // process successfully loaded resource
            // ...
        }
    }
};
fluid.fetchResources(myResourceSpecs, myCallback);
```
