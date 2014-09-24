# DOM Binder API #

**NOTE:** A DOM Binder is automatically created by the Framework for any [view component](tutorial-gettingStartedWithInfusion/ViewComponents.md). 
**_Component developers are not expected to ever create a DOM Binder themselves._**

## Creation ##

The Framework creates a DOM Binder as follows:

```javascript
that.dom = fluid.createDomBinder (container, selectors);
```

The DOM Binder object is attached to the component as a member called `dom`.

### Parameters ###

<table>
    <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>container</code></td>
        <td>Object</td>
        <td>the root element in which to locate named elements</td>
    </tr>
    <tr>
        <td><code>selectors</code></td>
        <td>Object</td>
        <td>a collection of named jQuery selectors, of the form
<pre>
<code>
{
    name1: &lt;selector1&gt;,
    name2: &lt;selector2&gt;,
    ....
}
</code>
</pre>
Note that selector values may be specified using <a href="IoCReferences.md">IoC references</a> to other selectors or expanders.
        </td>
    </tr>
</table>


### Selector Examples ###

```javascript
{
    displayElement: ".flc-progress",
    progressBar: ".flc-progress-bar",
    indicator: ".flc-progress-indicator",
    label: ".flc-progress-label",
    ariaElement: ".flc-progress-bar"
}
```

```javascript
{
    labelSource: ".flc-reorderer-imageTitle",
    movables: {
        expander: {
            funcName: "fluid.reorderImages.createImageCellFinder",
            args: "{that}.container"
        }
    }
}
```

## Methods ##

### locate ###

```javascript
locate(name[, localContainer]);
```

Finds the named element within the specified container.

**Return:** a jQuery object.

<table>
    <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>name</code></td>
        <td>String</td>
        <td>The selector name, as declared in the component's <code>defaults</code></td>
    </tr>
    <tr>
        <td><code>localContainer</code></td>
        <td>Object</td>
        <td>Optional. The container element used to constrain the search for the element. Defaults to the component container.
        </td>
    </tr>
</table>

### fastLocate ###

```javascript
fastLocate(name[, localContainer]);
```

Finds the named element within the specified container, using the value in the DOM Binder's cache if present (i.e. the DOM itself will not be searched again). The DOM binder's cache is populated for a query, whenever a query is submitted via `locate()`.

**Return:** a jQuery object.

<table>
    <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>name</code></td>
        <td>String</td>
        <td>The selector name, as declared in the component's <code>defaults</code></td>
    </tr>
    <tr>
        <td><code>localContainer</code></td>
        <td>Object</td>
        <td>Optional. The container element used to constrain the search for the element. Defaults to the component container.
        </td>
    </tr>
</table>

### clear ###
```javascript
clear()
```

Completely clears the cache for the DOM binder for all queries. It should be used whenever, for example, the container's markup is replaced completely, or otherwise is known to change in a wholesale way.

### refresh ###

```javascript
refresh(names[, localContainer]);
```

Refreshes the cache for one or more selector names, ready for subsequent calls to `fastLocate()`. It functions exactly as for a call to `locate()` except that

* The queried results are not returned to the user, but simply populated into the cache, and
* More than one selector name (as an array) may be sent to `refresh` rather than just a single one.

<table>
    <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><code>names</code></td>
        <td>String or Array of Strings</td>
        <td>The selector name or names to refresh, as declared in the component's <code>defaults</code></td>
    </tr>
    <tr>
        <td><code>localContainer</code></td>
        <td>Object</td>
        <td>Optional. The container element used to constrain the search for the element(s). Defaults to the component container..
        </td>
    </tr>
</table>
