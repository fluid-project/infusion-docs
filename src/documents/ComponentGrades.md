---
title: Component Grades
category: Infusion
---

A **grade** is a block of configuration (representable as JSON) with a global name. A new grade is typically registered
into an Infusion runtime by a call to the function [`fluid.defaults`](CoreAPI.md#fluiddefaultsgradename-options),
supplying both the global name (the **grade name**) and the configuration block.

Here's a simple example of defining a new grade, derived from the base framework grade `fluid.component`:

```javascript
fluid.defaults("examples.myGrade", {
    gradeNames: "fluid.component"
});
```

Each such grade can be built on to derive further grades/components. This derivation occurs by mentioning the name of
the original grade (e.g. `examples.myGrade`) within the **gradeNames** section of the derived component.

Most grades you will deal with are **component grades** derived from `fluid.component`. However, for some purposes you
may also deal with [**function grades**](FunctionGrades.md) which are derived from `fluid.function`.

## The framework's built-in component grades

The Infusion Framework already contains several predefined component grades that normally form the initial building
blocks for external components and grades. The following table describes these grades and how they relate to each other.

<table>
    <thead>
        <tr>
            <th>Grade Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>fluid.component</code></td>
            <td>
                A plain <code>fluid.component</code> is the most basic component: it supports options merging with
                defaults (<a href="tutorial-gettingStartedWithInfusion/BasicComponentCreation-Components.md">Components</a>),
                as well as instantiating event firers based on default framework events (<code>onCreate</code>,
                <code>onDestroy</code>, <code>afterDestroy</code>) and events declared in the options
                (<a href="tutorial-gettingStartedWithInfusion/BasicComponentCreation-Components.md">Tutorial - Creating
                Components</a>). All Infusion components are derived from this grade, and in general all things not
                derived from this grade are non-components (e.g. plain functions, or model transformation transforms,
                etc.)
            </td>
        </tr>
        <tr>
            <td><code>fluid.modelComponent</code></td>
            <td>
                A <em>model</em> component is a component that additionally provides supports for a component's model,
                and operations on it (<a href="tutorial-gettingStartedWithInfusion/ModelComponents.md">Tutorial - Model Components</a>).
                These operations are mediated by a machine known as a <a href="ChangeApplierAPI.md"><code>ChangeApplier</code></a>
                which is automatically constructed for a model component. As well as exposing a programmatic API, this
                also allows for declarative constraints and relationships to be enforced by means of the
                <a href="ModelRelay.md">model relay</a> system.
            </td>
        </tr>
        <tr>
            <td><code>fluid.viewComponent</code></td>
            <td>
                A <em>view</em> component is a <code>fluid.modelComponent</code> that is bound to a DOM container node,
                holds a <a href="DOMBinder.md">DOM Binder</a> and supports a view
                (<a href="tutorial-gettingStartedWithInfusion/ViewComponents.md">Tutorial - View Components</a>).
            </td>
        </tr>
        <tr>
            <td><code>fluid.resourceLoader</code></td>
            <td>
                A <em>resource loader</em> component can configure the loading of any number of asynchronously available
                resources, possibly before component startup is complete. Since <code>fluid.resourceLoader</code> is a
                mixin grade, it may be added to a <code>fluid.modelComponent</code>, <code>fluid.viewComponent</code>
                or any other variety of Infusion component. A dedicated documentation page is available for
                <a href="ResourceLoader.md"><code>fluid.resourceLoader</code></a>.
            </td>
        </tr>
        <tr>
            <td><code>fluid.rendererComponent</code></td>
            <td>
                A <em>renderer</em> component is a view component that also bears a renderer.
                There are additional features provided by this component grade specified on the
                <a href="tutorial-gettingStartedWithInfusion/RendererComponents.md#useful-functions-and-events">
                Useful functions and events</a> section of the
                <a href="tutorial-gettingStartedWithInfusion/RendererComponents.md">Tutorial - Renderer Components</a>
                page.
                <div class="infusion-docs-note"><strong>Note:</strong>The current Infusion renderer is deprecated and
                will be replaced in the Infusion 5.0 release.</div>
            </td>
        </tr>
    </tbody>
</table>

## Specifying Parent Grades

The parent grades of a newly defined grade should be specified using the `gradeNames` option in the defaults block, as
shown in the examples below. If no `gradeNames` are specified, the framework will not construct a component creator
function, but the grade may still function as a "mixin" grade when mentioned as the parent of another component
(or non-component). The `gradeNames` option holds a `String` or `Array of String`.

```javascript
fluid.defaults("fluid.uploader.demoRemote", {
    gradeNames: ["fluid.component"]
    // ...
});
```

```javascript
fluid.defaults("cspace.messageBarImpl", {
    gradeNames: ["fluid.rendererComponent"]
    // ...
});
```

```javascript
fluid.defaults("cspace.util.relationResolver", {
    gradeNames: ["fluid.modelComponent"]
    // ...
});
```

## Initializing Components

The framework will automatically construct a creator function for any component which is derived (even indirectly) from
`fluid.component`:

```javascript
fluid.defaults("fluid.uploader.fileQueueView", {
    gradeNames: ["fluid.viewComponent"]
    // ...
});

// The framework has automatically generated this function since the grade is a component grade
var that = fluid.uploader.fileQueueView({
    // ...
});
```

## Combining Grades

Since the `fluid.defaults` directive introduces a grade into the system, various components can be composed to create
new ones. Options, fields and methods introduced by the ancestor grades will be merged. The merging happens, firstly in
hierarchical order (grades comprising the ancestor grade are resolved before the actual component grades resolution)
and secondly in the left-to-right order (defaults from the grade on the right taking precedence over the defaults from
the grade on the left). Those interested in fine details should note that this is a very different scheme to the
[C3 linearization algorithm](https://en.wikipedia.org/wiki/C3_linearization) that is commonly used for resolving
multiple inheritance. Other than preventing infinite cycles of resolution, the framework will allow the same grade to
appear any number of times in the list of grades, and each time it will be effective in overriding definitions occurring
in grades to the left in the same `gradeNames` list.

Here is a simple example:

```javascript
fluid.defaults("examples.componentOne", {
    gradeNames: "fluid.modelComponent",
    model: {
        field1: false,
        field2: true
    },
    option: "TEST1"
});

fluid.defaults("examples.componentTwo", {
    gradeNames: "fluid.modelComponent",
    model: {
        field1: true
    },
    option: "TEST2"
});

fluid.defaults("examples.combinedComponent", {
    gradeNames: ["examples.componentOne", "examples.componentTwo"]
    // The resulting defaults for component examples.combinedComponent
    // will behave as if the following had been written:
    // model: {
    //     field1: true,
    //     field2: true
    // },
    // option: "TEST2"
});
```

<div class="infusion-docs-note">

<strong>Note:</strong> All the material from the component defaults will be merged by the framework, including records
such as <code>events</code>, <code>listeners</code>, <code>members</code>, <code>components</code>, <code>invokers</code>
and <code>model</code>. Some of these, e.g. <code>listeners</code> will receive custom merging algorithms sensitive to
their context - for example showing awareness of <a href="InfusionEventSystem.md#namespaced-listeners">listener
namespaces</a>.
</div>

<div class="infusion-docs-note">

<strong>Note:</strong> In the current framework, all grades derived from `fluid.viewComponent` (as well as
`fluid.rendererComponent`, etc.) must be listed **AFTER** all those that are not. This problem will be resolved in a
future framework release.
</div>

## Dynamic Grades

Grades supplied as arguments to a constructing component in the `gradeNames` field will be added into the grade list of
the particular component instance, as if a new `fluid.defaults` block had been issued creating a new "type" in the
system - however, the main `type` of the component will not change. This facility could be thought of as a form of "type
evolution" or
[Schema evolution](http://scholarworks.umass.edu/cgi/viewcontent.cgi?article=1041&context=cs_faculty_pubs). All dynamic
grades take precedence over (that is, are merged in after) all static grades.

### Delivering a dynamic gradeName as a direct argument:

There are numerous ways that these additional gradeNames could be delivered - for example, as a direct argument to a
component's creator function:

```javascript
var myCombinedComponent = examples.componentOne({
    gradeNames: "examples.componentTwo"
});
// creates a component that behaves exactly (except for its typeName)
// as if it was created via examples.combinedComponent() above
```

### Delivering a dynamic gradeName via a subcomponent record:

Another possibility is to supply the additional gradeNames via a
[subcomponent record](tutorial-gettingStartedWithInfusion/Subcomponents.md) - for example

```javascript
fluid.defaults("examples.rootComponent", {
    components: {
        myCombinedComponent: { // This component also behaves (except for typeName)
            // as if was created via examples.combinedComponent
            type: "examples.componentOne",
            options: {
                gradeNames: "examples.componentTwo"
            }
        }
    }
});
```

### Delivering a dynamic gradeName via an options distribution:

Perhaps one of the most powerful possibilities is to distribute dynamic gradeNames to one or more components via a
[distributeOptions](IoCSS.md) record:

```javascript
fluid.defaults("examples.distributingRootComponent", {
    distributeOptions: {
        record: "examples.componentTwo",
        target: "{that examples.componentOne}.options.gradeNames"
    },
    components: {
        myCombinedComponent1: {
            type: "examples.componentOne"
        },
        myCombinedComponent2: {
            type: "examples.componentOne"
        }
    }
});
```

In the above example, every subcomponent of `examples.distributingRootComponent` which had a grade content of
`examples.componentOne` would automatically have [mixed in](https://en.wikipedia.org/wiki/Mixin) a grade of
`examples.componentTwo`, causing them all to behave as if they were instances of `examples.combinedComponent`.

## Raw Dynamic Grades

Another very powerful framework facility is the use of raw dynamic grades. In this scheme, the gradeNames list for any
component may include any standard [IoC reference](IoCReferences.md) which may resolve to either a `String` or `Array of
String` directly holding one or more grade names, or else a zero-arg function which can be invoked to obtain such a
value. In this way, the developer can specify additional grade names based on dynamic material (potentially not known at
the time of definition) such as a function (method or invoker) or a property in component options. Note that use of this
facility should be discouraged in favour of any of the other techniques on this page - e.g. standard dynamic grades or
context awareness - in future versions of the framework the use of raw dynamic grades may impose a big performance
penalty.

For example:

```javascript
fluid.defaults("fluid.componentWithDynamicGrade", {
    gradeNames: ["fluid.component", "{that}.getDynamicGradeName"],
    invokers: {
        getDynamicGradeName: "fluid.componentWithDynamicGrade.getDynamicGradeName"
    }
});

// When resolved our fluid.componentWithDynamicGrade will have all the functionality of a fluid.modelComponent grade.
// NOTE: developers can also return an array of grade names. These grade names can be custom grade names.
// NOTE: This facility is fragile and should be used as a scheme for "last-ditch polymorphism"
fluid.componentWithDynamicGrade.getDynamicGradeName = function () {
    return "fluid.modelComponent";
};
```
