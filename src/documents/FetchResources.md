---
title: fluid.fetchResources
category: Infusion
---

The Infusion API `fluid.fetchResources` is a low-level API which automates the work of fetching multiple resources,
possibly asynchronously, using AJAX requests or from the current DOM. This API is deprecated and none of the framework
core or components rely on it, however it will be retained for one further release cycle since it appears in a few
pieces of example code and wrappers. The core framework grade [Resource Loader](ResourceLoader.md) should be used
by any component wishing to issue I/O as part of component loading, or else a
[DataSource](https://github.com/fluid-project/kettle/blob/main/docs/DataSources.md) for I/O which may be issued
repeatedly during a component's lifecycle.

This API is deprecated and will be removed in an upcoming revision of the framework.

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
`resourceSpec`. See the documentation for the [resourceSpec structure](ResourceLoader.md#resourcespec-structure)
accepted by ``fluid.resourceLoader`` for the structure of these.

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
            <td>The full text of the fetched resource, as a string.</td>
        </tr>
        <tr>
            <td><code>parsed</code></td>
            <td><code>Any</code></td>
            <td>The parsed representation of <code>resourceText</code> into some structured form, if a <code>dataType</code>
            entry for the <code>resourceSpec</code> entry was supplied or inferred.</td>
        </tr>
        <tr>
            <td><code>fetchError</code></td>
            <td><code>Object</code></td>
            <td>
                Filled in if the (AJAX) request to fetch the resource failed. It contains the fields <code>status</code>
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
        url: "templates/Body.html"
    },
    sidebarTemplate: {
        url: "templates/Sidebar.html"
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
        url: "html/template1.html"
    },
    template2: {
        url: "html/template1.html"
    },
    data: {
        url: "data/clientData.json"
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
