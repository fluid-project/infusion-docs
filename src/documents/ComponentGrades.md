---
title: Component Grades
layout: default
category: Infusion
---

A component **grade** extends the notion of component defaults ([fluid.defaults](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/Fluid.js#L1519-L1539)). In fact, every **fluid.defaults** directive introduces a **grade** into the system of Fluid Infusion components, which can be built on to derive further grades/components. This derivation occurs by mentioning the name of the original grade within the **gradeNames** section of the derived component.

Developers can create their own **fluid.defaults / grades** as well as use them to build upon each other, and compose them as needed.

The Infusion Framework already contains several predefined component grades that normally form the initial building blocks for external components and grades. The following table describes these grades and how they relate to each other.

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
                A "little" component is the most basic component: it supports options merging with defaults (<a href="tutorial-gettingStartedWithInfusion/BasicComponentCreation-LittleComponents.md">Little Components</a>), as well as
                that instantiating event firers based on default framework events (onCreate, onDestroy, onDetach) 
                and events declared in the options (<a href="tutorial-gettingStartedWithInfusion/EventedComponents.md">Tutorial - Evented Components</a>. All Fluid components are derived from this grade, and in general all things not derived from this grade are non-components (e.g. plain functions, or model transformation transforms, etc.)
            </td>
        </tr>
        <tr>
            <td><code>fluid.modelComponent</code></td>
            <td>
                A "model" component is a little component that additionally provides supports for a component's model, defined in the components options, and operations on it (<a href="tutorial-gettingStartedWithInfusion/ModelComponents.md">Tutorial - Model Components</a>).
            </td>
        </tr>
        <tr>
            <td><code>fluid.viewComponent</code></td>
            <td>
                A "view" component is a fluid.modelComponent is bound to a DOM container node, holds a <a href="DOMBinder.md">DOM Binder</a> and supports a view (<a href="tutorial-gettingStartedWithInfusion/ViewComponents.md">Tutorial - View Components).
            </td>
        </tr>
        <tr>
            <td><code>fluid.rendererComponent</code></td>
            <td>
                A "renderer" component is a view component that also bears a renderer. There are additional features provided by this component grade specified on the <a href="RendererComponents.md#useful-functions-and-events">Useful functions and events</a> section of the <a href="tutorial-gettingStartedWithInfusion/RendererComponents.md">Tutorial - Renderer Components</a> page
            </td>
        </tr>
        <tr>
            <td><code>autoInit</code></td>
            <td>
                <p>
                    A special directive grade that instructs the framework to automatically construct a globally named creator function (with the same name as the grade) responsible for the construction of the component. NOTE: for the Infusion 2.0 release this grade will become redundant as it will be the default for every grade
                </p>
                <p>
                    <em>
                        <strong>NOTE:</strong> for the Infusion 2.0 release this grade will become redundant as it will be the default for every grade
                    </em>
                </p>
            </td>
        </tr>
    </tbody>
</table>

## Specifying Parent Grades ##

A component's grades should be specified using the `gradeNames` option in the components defaults block, as shown in the examples below. The `gradeNames` option holds a `String` or `Array of String`.

<div class="infusion-docs-note"><strong>Note:</strong> In the examples below, the <code>autoInit</code> flag is not actually a grade, but is added to the <code>gradeNames</code> array to control how the component is created. See <a href="#initializing-graded-components">Initializing Graded Components</a> below for more information about the <code>autoInit</code> flag. The <code>autoInit</code> flag will soon become the default. Always use the <code>autoInit</code> flag, unless you have a very good reason not to.</div>

```javascript
fluid.defaults("fluid.uploader.demoRemote", {
    gradeNames: ["fluid.component", "autoInit"],
    ...
});
```

```javascript
fluid.defaults("cspace.messageBarImpl", {
    gradeNames: ["fluid.rendererComponent", "autoInit"],
    ...
});
```

```javascript
fluid.defaults("cspace.util.relationResolver", {
    gradeNames: ["fluid.modelComponent", "autoInit"],
    ...
});
```

## Initializing Graded Components ##

The Framework offers support for automatic initialization of graded component through `autoInit`. When the `autoInit` flag is added to the `gradeNames` array, the Framework will create the creator function automatically - 
the developer does not need to write a creator function.

To use the `autoInit` flag, add it to the array of `gradeNames`, as shown below:

```javascript
fluid.defaults("fluid.uploader.fileQueueView", {
    gradeNames: ["fluid.viewComponent", "autoInit"],
    ...
});

// The framework has automatically generated this function since the component is autoInit
var that = fluid.uploader.fileQueueView( ... );
```

<div class="infusion-docs-note"><strong>Note:</strong> The <code>autoInit</code> flag should always be used if you expect the grade to be directly instantiated as a component. It can be omitted if the only use of the grade is as an "add-on" ("<a href="https://en.wikipedia.org/wiki/Mixin">mixin</a>") to another grade hierarchy.</div>

## Combining Grades ##

Since the `fluid.defaults` directive introduces a grade into the system, various components can be composed to create new ones. Options, fields and methods introduced by the ancestor grades will be merged. 
The merging happens, firstly in hierarchical order (grades comprising the ancestor grade are resolved before the actual component grades resolution) and secondly in the right-to-left order (defaults from the grade on the left taking precedence over the defaults from the grade on the right, more details can be found at the JIRA [FLUID-5085](http://issues.fluidproject.org/browse/FLUID-5085)). For example:

```javascript
fluid.defaults("examples.componentOne", {
    gradeNames: ["fluid.modelComponent", "autoInit"],
    model: {
        field1: true
    },
    option1: "TEST"
});



fluid.defaults("examples.componentTwo", {
    gradeNames: ["fluid.modelComponent", "autoInit"],
    model: {
        field1: false,
        field2: true
    },
    option2: "TEST2"
});

fluid.defaults("examples.combinedComponent", {
    gradeNames: ["examples.componentOne", "examples.componentTwo", "autoInit"]
    // The resulting defaults for component examples.combinedComponent 
    // will behave as if the following had been written:
    // model: {
    //     field1: true,
    //     field2: true
    // },
    // option1: "TEST",
    // option2: "TEST2"
});
```

<div class="infusion-docs-note"><strong>Note:</strong> All the material from the component defaults will be merged by the framework, including records such as <code>events</code>, <code>listeners</code>, <code>members</code>, <code>components</code>, <code>invokers</code> and <code>model</code>. Some of these, e.g. <code>listeners</code> will receive custom merging algorithms sensitive to their context - for example showing awareness of <a href="InfusionEventSystem.md">listener namespaces</a>.</div>

## Dynamic Grades ##

Grades supplied as arguments to a constructing component in the `gradeNames` field will be added into the grade list of the particular component instance, as if a new `fluid.defaults` block had been issued creating a new "type" in the system - however, the main `type` of the component will not change. This facility could be thought of as a form of "type evolution" or [Schema evolution](http://scholarworks.umass.edu/cgi/viewcontent.cgi?article=1041&context=cs_faculty_pubs). All dynamic grades take precedence over (that is, are merged in after) all static grades.

### Delivering a dynamic gradeName as a direct argument: ###

There are numerous ways that these additional gradeNames could be delivered - for example, as a direct argument to a component's creator function:

```javascript
var myCombinedComponent = examples.componentOne({
    gradeNames: "examples.componentTwo"
});
// creates a component that behaves exactly (except for its typeName)
// as if it was created via examples.combinedComponent() above
```

### Delivering a dynamic gradeName via a subcomponent record: ###

Another possibility is to supply the additional gradeNames via a [subcomponent record](tutorial-gettingStartedWithInfusion/Subcomponents.md) - for example

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

### Delivering a dynamic gradeName via an options distribution: ###

Perhaps one of the most powerful possibilities is to distribute dynamic gradeNames to one or more components via a [distributeOptions](IoCSS.md) record:

```javascript
fluid.defaults("examples.distributingRootComponent", {
    distributeOptions: {
        record: "examples.componentTwo",
        target: "{that examples.componentOne}.options.gradeNames"
    },
    components: {
        myCombinedComponent1: {
            type: "examples.componentOne",
        },
        myCombinedComponent2: {
            type: "examples.componentOne",
        }
    }
});
```

In the above example, every subcomponent of `examples.distributingRootComponent` which had a grade content of `examples.componentOne` would automatically have [mixed](https://en.wikipedia.org/wiki/Mixin) in a grade of `examples.componentTwo`, causing them all to behave as if they were instances of `examples.combinedComponent`.

## Raw Dynamic Grades ##

Another very powerful framework facility is the use of raw dynamic grades. In this scheme, the gradeNames list for any component may include any standard [IoC reference](IoCReferences.md) which may resolve to either a String or Array of Strings directly holding one or more grade names, or else a zero-arg function which can be invoked to obtain such a value. In this way, the developer can specify additional grade names based on dynamic material (potentially not known at the time of definition) such as a function (method or invoker) or a property in component options. Note that use of this facility should be discouraged in favour of any of the other techniques on this page - e.g. standard dynamic grades or grade linkage - in future versions of the framework the use of raw dynamic grades may impose a big performance penalty.

For example:

```javascript
fluid.defaults("fluid.componentWithDynamicGrade", {
    gradeNames: ["fluid.component", "autoInit", "{that}.getDynamicGradeName"],
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

