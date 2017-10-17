---
title: Subcomponent Declaration
layout: default
category: Infusion
---

In the Infusion IoC system, a component declares its subcomponents through the `components` property of its [options](ComponentConfigurationOptions.md#components).
Subcomponent declaration in a defaults block takes the following form:

```javascript
fluid.defaults("my.component.name", {
    // ...
    components: {
        subcomponent1: <subcomponent declaration>,
        subcomponent2: <subcomponent declaration>,
        subcomponent3: <subcomponent declaration>,
    }
    // ...
});
```

When the parent component is constructed, one subcomponent will be constructed for each entry in the finally elaborated form of its `components` options, and attached to the parent at the paths held as keys in the `components` structure.
In this case, executing `var component = my.component.name()` would construct three subcomponents as members of `component` named `subcomponent1`, `subcomponent2` and `subcomponent3`.

## Minimal working example ##

Here's a minimal working example:

```javascript
fluid.defaults("examples.myParent", {
    gradeNames: "fluid.component",
    components: {
        mySubcomponent: {
            type: "fluid.component"
        }
    }
});

var component = examples.myParent();
console.log("Parent component has a child of type ", component.mySubcomponent.typeName);
```

Component options can arrive at an instantiated component through various routes other than just its defaults - and so further subcomponents can arrive through all these other routes too.
For example, with [dynamic grades](ComponentGrades.md#dynamic-grades), further subcomponents can be added after the fact to any component.
Other routes for options are direct arguments to its creator function, options distributed by [distributeOptions](IoCSS.md), or by 2nd-level nested `components` entries in the subcomponent record of the defaults of a component grandparent.
Later on in this section we will see direct framework facilities for other kinds of dynamic subcomponents, those driven by dynamic data or event firing.

## Basic Subcomponent Declaration ##

The subcomponent declaration has the following form, holding the _**subcomponent record**_ as the value corresponding to the key holding the subcomponent's _**member name**_ (in this case `subcomponent1`):

```javascript
fluid.defaults("my.component.name", {
    // ...
    components: {
        subcomponent1: {
            type: "type.name",
            options: {
                // ...
            }
        }
    }
    // ...
});
```

The properties allowed at top level in the subcomponent record are as follows:

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Description</th>
            <th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>type</code></td>
            <td><code>String</code></td>
            <td>This is the grade name of the type of subcomponent to be created. May be an <a href="IoCReferences.md">IoC Reference</a>.</td>
            <td><pre><code>subcomponent1: {
    type: "my.component.gradename"
}</code></pre></td>
        </tr>
        <tr>
            <td><code>options</code> [optional]</td>
            <td><code>Object</code></td>
            <td>These are options to be passed to the subcomponent as "user options."
            <div class="infusion-docs-note"><strong>Note:</strong> These are not the default options for the subcomponent, rather these options override the defaults.
            The defaults for the component will have already been registered by the <a href="CoreAPI.md#fluiddefaultsgradename-options"><code>fluid.defaults</code></a> call(s) appropriate for its type and <a href="ComponentGrades.md">grade names</a>.</div></td>
            <td><pre><code>subcomponent1: {
    type: "fluid.mySubcomponent",
    options: {
        myOptions: "{name}.options.someOption"
        // ...
    }
}</code></pre></td>
        </tr>
        <tr>
            <td><code>createOnEvent</code> [optional]</td>
            <td><code>String</code></td>
            <td><p>Specifies an event that will trigger the creation of the subcomponent.
            This option is used when the subcomponent should not be created immediately as part of the construction process of its parent, but rather at a later time signalled by the firing of the specified event.
            If this value is a simple string, it represents an event held on the parent component - it may also take the form of an <a href="IoCReferences.md">IoC reference</a> to an event elsewhere in the component tree.</p>
            <div class="infusion-docs-note"><strong>Note:</strong> If the specified event fires multiple times, the corresponding component will be destroyed and then recreated on every firing of the event after the first time.</div></td>
            <td><pre><code>subcomponent1: {
    type: "fluid.mySubcomponent",
    createOnEvent: "someEvent"
}</code></pre></td>
        </tr>
        <tr>
            <td><code>priority</code> [optional]</td>
            <td><code>Number</code> or "first"/"last"</td>
            <td>Specifies the order <a href="Priorities.md">priority</a> of the creation of the particular subcomponent. During component tree instantiation, the framework will sort the collection of subcomponents based on the priority specified.
                <div class="infusion-docs-note"><strong>Note:</strong> The use of this option should be discouraged as it leads to fragile configuration. If you find yourself using it, please report the instance to the development team to see if a better solution can be found.</div></td>
            <td><pre><code>subcomponent1: {
    type: "fluid.mySubcomponent",
    priority: "first"
}</code></pre></td>
        </tr>
        <tr>
            <td><code>container</code> (Required only for view components)</td>
            <td><code>String</code></td>
            <td>This property is a CSS-style selector (or, more usually, an <a href="IoCReferences.md">IoC Reference</a> to an element produced by the <a href="DOMBinderAPI.md">DOM Binder</a> of some other component</a>)
            identifying the container element to be used for this subcomponent. This property is required for any <a href="tutorial-gettingStartedWithInfusion/ViewComponents.md">View components</a>.</td>
            <td></td>
        </tr>
    </tbody>
</table>

## Injected Subcomponent Declaration ##

The entire subcomponent record may be replaced by a simple IoC reference to a component held elsewhere in the component tree.
In this case the subcomponent is known as an _**injected component**_ - the already existing component reference is simply copied into the parent component's member field.
In many cases, you will not need to inject components elsewhere in the tree since they can be effectively used in
their original position by means of [IoC references](IoCReferences.md) (for reading) or [options distributions](IoCSS.md) (for modifying)

## Examples ##

### Standard Subcomponent Declaration ###

This first example shows a straightforward subcomponent declaration. `adminRecordEditor`, a component of grade `cspace.recordEditor`
(which would be a [view component](tutorial-gettingStartedWithInfusion/ViewComponents.md) grade since we make use of the `container` top-level option) is a standard subcomponent of `cspace.admin`:

```javascript
fluid.defaults("cspace.admin", {
    gradeNames: ["fluid.rendererComponent"],
    components: {
        adminRecordEditor: { // view subcomponent declaration
            type: "cspace.recordEditor",
            container: "{admin}.dom.recordEditor",
            options: {
                csid: "{admin}.selectedRecordCsid"
            }
        }
    }
});
```

### Injected Subcomponent Declaration ###

Our second example shows a component being injected from one site in the tree to another. We call the standard, original
component `concreteChild` a _concrete subcomponent_ because it is constructed in-place where it is defined. The site
to which it is injected has a path `child2.injectedComponent` in the final instantiated tree, and at that site it is
called an _injected subcomponent_ because it appears at a path other than the one where it was constructed. In memory, the
JavaScript object references at path `concreteChild` and `child2.injectedComponent` will be identical.

Injecting subcomponents can be useful in order to capture (or parameterise) variability in the relationship between two components, in
order to expose it more cleanly to a third component. For example, a component `A` may be managed by a component `B` elsewhere in the tree,
where the configurer of `A` wishes to have the freedom for `B` to be located at a variety of places - expressing this variety by binding to `B`
as an injected subcomponent referenced by an IoC reference held at member path, say, named `b`. A third component `C` can then cleanly refer to
the respective `B` simply as `A.b` without having to deal with the indirection by the IoC reference themselves.

<div class="infusion-docs-note"><strong>Note:</strong> You should use <strong>only</strong> this facility for
shipping Infusion component references around within the tree, and not copy raw component references around by hand, otherwise you will
confuse the framework's book-keeping for reference resolution.
</div>

```javascript
fluid.defaults("examples.injection.root", {
    gradeNames: "fluid.component",
    components: {
        concreteChild: {
            type: "fluid.component"
        },
        child2: {
            type: "fluid.component",
            options: {
                components: {
                    // injected component declaration
                    injectedComponent: "{examples.injection.root}.concreteChild"
                }
            }
        }
    }
});

var that = examples.injection.root();
// that.concreteChild and that.child2.injectedComponent are identical references
that.concreteChild.destroy();
// destroying the concrete child clears it from that.child2.injectedComponent too
```

### Subcomponent with `createOnEvent` ###

This example shows a subcomponent defined with the `createOnEvent` annotation. Unlike an ordinary concrete subcomponent, this
subcomponent will not be constructed at the same time as its parent. Instead, it will only be constructed once the
`onUIOptionsMarkupReady` event fires. However, it will still be destroyed along with its parent component at the standard time.

<div class="infusion-docs-note"><strong>Note:</strong> There is an important distinction between standard subcomponents defined with <code>createOnEvent</code>, and
<a href="#dynamic-components">dynamic subcomponents</a> which also may be written with <code>createOnEvent</code>. For the former, if the event fires a 2nd and subsequent time, the existing
subcomponent will be destroyed, and a fresh one created. For the latter, a fresh subcomponent is created on each event firing, and these will all accumulate until they are manually destroyed (or until the parent is destroyed)
</div>

```javascript
fluid.defaults("gpii.explorationTool.modelTransformer", {
    gradeNames: ["fluid.modelComponent", "fluid.uiOptions.modelRelay"],
    events: {
        onUIOptionsMarkupReady: null
    },
    components: {
        highContrast: { // complex subcomponent declaration with createOnEvent
            type: "gpii.explorationTool.panels.highContrast",
            container: "{uiOptions}.dom.highContrast",
            createOnEvent: "onUIOptionsMarkupReady"
        }
    }
});
```

## Dynamic components ##

A powerful facility known as _**dynamic (sub)components**_ allows you to direct the framework to construct a number of subcomponents whose number is not known in advance from a template subcomponent record. There are two principal varieties of dynamic components. The first requires the existence of a _**source array**_ for the construction - at run-time, the framework will inspect the array you refer to and construct one component from your template for each element of the array. The components which get constructed in this way can each be contextualised by both the contents of the corresponding array element as well as its index.
The second requires the existence of a _**source event**_ for the construction. The framework will construct one subcomponent for each firing of the [event](InfusionEventSystem.md) - the constructed component can be contextualised by the arguments that the event was fired with.

Both of these schemes make use of a special top-level area in a component's options, entitled `dynamicComponents`. The structure of this area is almost identical to the standard `components` area described above, with a few differences described in the dedicated subsections below.

### Naming of dynamic components ###

The actual member names given to dynamic components follows a very straightforward scheme. The very first such component created will have the same name as the `dynamicComponents` record entry. Subsequent such components will have the name `<key>-<n>` where `<key>` represents the record entry name and `<n>` holds an integer, initially with value 1, which will increment for each further dynamic component constructed using the record. In practice you should not use this information to "go looking" for dynamic components, but instead should expect to observe their effects by some scheme such as injecting events down into them to which they register listeners, or broadcasting listeners down into them by use of [distributeOptions](IoCSS.md) or [dynamic grades](ComponentGrades.md).

### Future evolution of dynamic components ###

Although this facility is powerful, the reader will note the peculiar asymmetry in the construction process - the framework may be directed to construct these components in a declarative way, but they may only be destroyed procedurally through a call to the component's `destroy()` function. An improved and properly symmetric version of this facility will be delivered as part of work on the new Fluid Renderer as described by [FLUID-5047](http://issues.fluidproject.org/browse/FLUID-5047) and related JIRAs, and the system described here will be withdrawn, as with previous "bridging technologies" such as the initFunction system.

### Dynamic subcomponents with a source array ###

This scheme for declaring a dynamic component is announced by making use of the `sources` entry at top-level in the dynamic component's component record. The following defaults block defines a component which in practice will instantiate two subcomponents, one for each element in the array `values` that it declares in its own options:

```javascript
fluid.defaults("examples.dynamicComponentRoot", {
    gradeNames: ["fluid.component"],
    values: [2, 3],
    dynamicComponents: {
        dynamic: {
            sources: "{that}.options.values",
            type: "fluid.component",
            options: {
                source: "{source}"
            }
        }
    }
});

var that = examples.dynamicComponentRoot();
var firstValue = that.dynamic.options.source; // 2
var secondValue = that["dynamic-1"].options.source; // 3
```

The `sources` entry will be expanded in the context of the parent component, and must hold a reference to an array.
Within the configuration for the dynamic component, two special IoC [context names](Contexts.md) are available.
One is named **`{source}`** and holds a reference to the particular array element which was used to expand the record into a component - in the above example, successively the values 2, and 3.
The other is named **`{sourcePath}`** and holds a reference to the array index which was used - in the above example, successively the values 0 and 1.

### Dynamic subcomponents with a source event ###

The use of this scheme for dynamic components is announced by using the standard `createOnEvent` top-level member that we met earlier when writing standard `components` subcomponent blocks.
The syntax is the same, but the semantic is different. For a standard subcomponent, `createOnEvent` will destroy and then recreate a component _**at the same path**_ on each firing of the specified event.
In contrast, for a dynamic subcomponent, `createOnEvent` will construct a _**fresh subcomponent**_ at successive different paths on each firing of the event. The naming of these paths is described in the previous section but in practice should not be a concern for the user.

```javascript
fluid.defaults("examples.dynamicEventRoot", {
    gradeNames: ["fluid.eventComponent"],
    events: {
        creationEvent: null
    },
    dynamicComponents: {
        dynamic: {
            createOnEvent: "creationEvent",
            type: "fluid.component",
            options: {
                argument: "{arguments}.0"
            }
        }
    }
});

var that = examples.dynamicEventRoot();
that.events.creationEvent.fire(2);
var firstValue = that.dynamic.options.argument; // 2
that.events.creationEvent.fire(3);
var secondValue = that["dynamic-1"].options.argument; // 3
```

In this case, the configuration for the dynamic components block exposes just the extra context name **`{arguments}`** which we have seen used both with [invokers](Invokers.md) and [event listeners](InfusionEventSystem.md) (
the `{source}` and `{sourcePath}` contexts used with array-sourced dynamic components are not visible). In this case, the context name `{arguments}` is bound onto the argument list that was used to fire the event which triggered the creation of the particular dynamic subcomponent.
The example shows the argument list successively holding the value `[2]` and then the value `[3]`.

<div class="infusion-docs-note"><strong>Note:</strong> With this scheme, it is quite likely that the user will want to arrange for the destruction of the dynamic subcomponents at some time earlier than the natural destruction time of their parent and all its children.
Using this scheme, they must arrange to do so using procedural code which manually invokes the <code>destroy()</code> method of the dynamic subcomponent they want destroyed.
As we observe above, this awkwardness will be removed when the dynamicComponents facility is replaced in a future revision of the framework that makes more powerful use of the lensing capabilities of the <a href="ModelTransformationAPI.md">Model Transformations</a> system.
</div>
