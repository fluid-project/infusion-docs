# Renderer Decorators #

_**Note:** The renderer will undergo significant changes post Infusion 1.5_

## Overview ##

Decorators allow users of the Renderer to attach various things, such as functions, class names, etc., to the components at render time. A number of different types of decorators are currently supported.

## Using Decorators ##

To use a decorator, include it in the component tree for the component in question, using the `decorators` field. This field contains an array of objects providing configuration information for the desired decorators. The contents of each object will vary based on the decorator type. For example, the `addClass` decorator will specify a string of class names, the jQuery decorator will specify a function name and a list of parameters.

Decorators are specified using a notation similar to that of [Subcomponents](tutorial-gettingStartedWithInfusion/Subcomponents.md) in an `options` structure. They include a `type` field and whatever other fields are necessary, based on the type:

```javascript
{
    ID: "my-id",
    value: aValue,
    decorators: [{
        type: "typeName",
        field: value,
        field: value
    }]
}
```

## Supported Decorators ##

The following table provides an overview of the currently-supported decorators. The sections that follow discuss each decorator in turn.

<table>
    <thead>
        <tr>
            <th>Decorator Type</th>
            <th>Field Name</th>
            <th>Field Type</th>
            <th>Field Description</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2">
                <a href="#jquery-decorator">
                    <code>jQuery</code> or <code>$</code>
                </a>
            </td>
            <td><code>func</code></td>
            <td>String</td>
            <td>jQuery function to be invoked</td>
            <td rowspan="2">
                <pre><code>
                    decorators: [{
                        type: "jQuery",
                        func: "click",
                        args: function() { $(this).hide(); }
                    }]
                </code></pre>
            </td>
        </tr>
        <tr>
            <td><code>args</code></td>
            <td>Array of Object</td>
            <td>Arguments to the jQuery function</td>
        </tr>
        <tr>
            <td>
                <a href="#addclass-decorator">
                    <code>addClass</code>
                </a>
            </td>
            <td><code>classes</code></td>
            <td>String</td>
            <td>Space-separated list of CSS class names</td>
            <td>
                <pre><code>
                    decorators: [{
                        type: "addClass",
                        classes: "fl-widget fl-centred"
                    }]
                </code></pre>
            </td>
        </tr>
        <tr>
            <td>
                <a href="#removeclass-decorator">
                    <code>removeClass</code>
                </a>
            </td>
            <td><code>classes</code></td>
            <td>String</td>
            <td>Space-separated list of CSS class names</td>
            <td>
                <pre><code>
                    decorators: [{
                        type: "removeClass",
                        classes: "fl-hidden"
                    }]
                </code></pre>
            </td>
        </tr>
        <tr>
            <td rowspan="4">
                <a href="#fluid-decorator">
                    <code>fluid</code>
                </a>
            </td>
            <td><code>func</code></td>
            <td>String</td>
            <td>Global function name to be invoked</td>
            <td rowspan="4">
                <pre><code>
                    decorators: [{
                        type: "jQuery",
                        func: "click",
                        args: function() { $(this).hide(); }
                    }]
                </code></pre>
            </td>
        </tr>
        <tr>
            <td><code>container</code></td>
            <td>jQuery-able</td>
            <td>
                Designator for the container node at which to base the component
            </td>
        </tr>
        <tr>
            <td><code>options</code></td>
            <td>Object</td>
            <td>Configuration options for the component</td>
        </tr>
        <tr>
            <td><code>args</code></td>
            <td>Array</td>
            <td>Raw argument list to override container and options</td>
        </tr>
        <tr>
            <td>
                <a href="#identify-decorator">
                    <code>identify</code>
                </a>
            </td>
            <td><code>key</code></td>
            <td>String</td>
            <td>
                The key, or nickname for the decorated node - its allocated id will be stored in <code>idMap</code> under this key
            </td>
            <td>
                <pre><code>
                    decorators: [{
                        type: "identify",
                        key: "mySpecialName"
                    }]
                </code></pre>
            </td>
        </tr>
        <tr>
            <td>
                <a href="#attrs-decorator">
                    <code>attrs</code>
                </a>
            </td>
            <td><code>attributes</code></td>
            <td>Object</td>
            <td>The attribute map to be applied to the rendered node</td>
            <td>
                <pre><code>
                    decorators: [{
                        type: "attrs",
                        attributes: ""
                    }]
                </code></pre>
            </td>
        </tr>
        <tr>
            <td rowspan="2">
                <a href="#event-decorator">
                    <code>event</code>
                </a>
            </td>
            <td><code>event</code></td>
            <td>String</td>
            <td>Name of event handler to be bound</td>
            <td rowspan="2">
                <pre><code>
                    decorators: [{
                        type: "event",
                        event: "click",
                        handler: myHandler
                    }]
                </code></pre>
            </td>
        </tr>
        <tr>
            <td><code>handler</code></td>
            <td>Function</td>
            <td>Handler function to be bound</td>
        </tr>
    </tbody>
</table>

### `jQuery` Decorator ###

Perhaps the most frequently used decorator is the jQuery decorator. This will accept any jQuery function and its arguments, and invoke that function, as the rendered markup is placed into the document. Here is an example of specifying a UILink component together with a jQuery-bound `click()` handler:

```javascript
decorators: [{
    type: "jQuery",
    func: "click",
    args: function() { $(this).hide(); }
}]
```

Any number of decorators of any types could be accommodated in the `decorators` list.

An alternative name for the jQuery decorator is `$` - this can be used interchangeably for `jQuery` as a type name.

### `addClass` Decorator ###

The `addClass` decorator allows a CSS class to be attached to the rendered node. It has just one argument/member, which is a space-separated list of CSS classes in just the same form that would have been accepted by `jQuery.addClass`.

Here is a simple component which has been decorated with two CSS classes:

```javascript
{
    ID: "my-menu",
    value: "Cheeses",
    decorators: {
        type: "addClass",
        classes: "fl-listmenu fl-activemenu"
    }
}
```

### `removeClass` Decorator ###

The `removeClass` decorator allows a CSS class to be removed from the rendered node. It has just one argument/member, which is a space-separated list of CSS classes. It is identical in syntax to the `addClass` decorator, but opposite in function.

Here is a simple component for which we will remove a CSS class:

```javascript
{
    ID: "my-menu",
    value: "Cheeses",
    decorators: {
        type: "removeClass",
        classes: "fl-listmenu"
    }
}
```

### `identify` decorator ###

Useful in more intricate scenarios, where the rendered nodes need to be easily and quickly retrievable, perhaps where events bound to one node need to manipulate another, or when nodes are part of a wider relation, such as table cells and their headers. The model behind the `identify` decorator, is that the node is given a free _nickname_ by the user, by which its final HTML id, and hence the node itself, can be quickly looked up later. This works in conjunction with a lookup table named `idMap` which is passed in the options structure to the renderer driver. As rendering progresses, the final HTML id allocated to the node is stored in `idMap` under the key provided to the `identify` decorator.

Here is a short sequence showing a possible use of `identify`:

```javascript
var tree = {
    ID: "data-row:",
    decorators: {
        identify: "this-catt",
        }
    };
var idMap = {};
fluid.selfRender($(".paged-content-2"), tree, {idMap: idMap});
fluid.jById(idMap["this-catt"]).show();
```

Whilst component tree nodes are allocated a `fullID` in a regular way by a stable algorithm involving their `ID` values and structure, this may not always relate them in a stable way in the global document - firstly, trees may be processed and reaggregated, which might change their ID or containment structure, and secondly, they may come to collide with already existing IDs in the document and hence come to be relabelled further. The "identify nickname" system lets developers to get at exactly the nodes they are interested in, in a simple, stable and efficient way.

## `fluid` Decorator ##

This is a highly powerful decorator, that completes the **active** functionality supplied by the `jQuery` and `identify` decorators. Use of the `fluid` decorator allows any [Fluid Component](Components.md) to be scheduled to be instantiated against the rendered markup, as it is added to the target document. These decorators promote markup agnosticism, as well as developer efficiency – without them, one would be left to rescan the just-rendered markup once again, in order to convert it from raw markup to an active interface. With these decorators and the component tree, one has a surface with which to talk about the **function** of the interface whilst leaving design and markup issues in their own space.

The full form of the decorator takes three members, `func`, `container` and `args`, mirroring the instantiation syntax of a standard Fluid Component - as described in [Fluid Component API](FluidComponentAPI.md), this takes the form:

```javascript
fluid.componentName = function(container, options);
```

In this case, the equivalent decorator instantiation takes the form:

```javascript
{
    decorators: {
        type: "fluid",
        func: "fluid.componentName",
        container: container,
        options: options
    }
}
```

_Note that rather than specifying `container` and `options` separately, one can instead set the member `args` to consist of the entire argument list - this might be useful for instantiating a non-Fluid component that does not conform to the general syntax. For example, the decorator above could be given a member `args: [container, options]`. The `args` member takes precendence if specified._

There is no specially dehydrated form for the `fluid` decorator – however, like all renderer decorators it may be dehydrated to the extent of having its `type` field folded onto a key field on `decorators` if there is just one decorator of a particular type.

### `attrs` Decorator ###

The `attrs` director is simple and crude - it allows freeform access to all of the attributes of the rendered node. Since this is not likely to result in a very markup-agnostic relationship, its use is only recommended in special situations. Its direct equivalent on the server-side was [UIFreeAttributeDecorator](https://source.caret.cam.ac.uk/rsf/projects/RSFUtil/trunk/src/uk/org/ponder/rsf/components/decorators/UIFreeAttributeDecorator.java). The decorator takes a value named `attributes` which is a free hash of keys to values, which will be applied _"on top of"_ the target node as it is rendered, overwriting any values which were inherited from the original markup template.

```javascript
{
    ID: "component-names",
    value: "Reorderer",
    decorators: {
        attrs: {title: "Reorderer Component"}
    }
}
```

_Note specifying a value of `null` will remove the attribute._

### `event` Decorator ###

The final implemented decorator, `event`, allows direct access to the functionality of binding a raw browser event to the rendered node. This is not generally recommended, since this is more safely and portably achieved using `jQuery`. However, it is possible this might be a useful function in some special situation. The decorator has a member called `handler` which is directly assigned to be the native event handler for the event named `event`.

For example, this decorator:

```javascript
decorators: {
    type: "event",
    event: "onClick",
    handler: function() {
        alert("You are using some grubby browser-level functionality");
    }
}
```

_This could be attached to bind (and hence overwrite) the onClick handler for the target rendered node. Don't do this at home._
