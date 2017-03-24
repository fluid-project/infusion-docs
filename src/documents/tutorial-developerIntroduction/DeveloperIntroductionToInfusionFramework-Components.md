---
title: Developer Introduction to the Infusion Framework - Components
layout: default
category: Tutorials
---

Programs using Infusion structure their data, functionality and interaction as various components defined using a common syntax.

Components are [JavaScript objects that have certain characteristics](../UnderstandingInfusionComponents.md). Components can be freely combined together to form new components using the [grades system](../ComponentGrades.md) ("grade" is the term used in Infusion for a sort of blueprint, in this case one that holds a component's default configuration), or organized into relationships with one another via [subcomponents](../SubcomponentDeclaration.md).

 There are three base component grades to be aware of that any new components you create with Infusion will likely have at their root:

 * [`fluid.component`](../ComponentConfigurationOptions.md#options-supported-by-all-components-grades), the simplest type with support for events and public function definition (called [invokers](../Invokers.md) in Infusion).
 * [`fluid.modelComponent`](../ComponentConfigurationOptions.md#model-components), which adds support for mutable models, model events, and model state coordination and relay between different components.
 * [`fluid.viewComponent`](../ComponentConfigurationOptions.md#view-components), which supplement model components with functionality to bind to the DOM of a web page.

Infusion's approach to component-based development emphasizes declarative configuration, loose coupling and flexible hierarchies. The framework manages component lifecycle and scoping and provides many supports to allow components to work in collaboration with one another.

A new Infusion component grade is defined using the `fluid.defaults` function and a very basic "Hello, World!" component might look like this:

<div class="infusion-docs-note">You can check out the [Live Example of the code below on CodePen](http://codepen.io/waharnum/pen/oBYvwx?editors=1111)</div>


```
// The first argument is the name of the new component, the second is the
// new component's default configuration
fluid.defaults("fluid.helloWorld", {
    // gradeNames supplies an array of strings that name previously
    // defined Infusion components; their configurations will be
    // merged together for the final "blueprint"
    //
    // In this case, we are supplying only a single grade name, but
    // if multiples were supplied, they would be combined into one
    // configuration in left to right order, with the rightmost
    // configuration taking precedence in cases where different
    // grades have the same key in the same position
    gradeNames: ["fluid.component"]
});
```

After definition, instances of the component can be created by calling the component's name as a function, with the option to pass in further configuration options as an argument:

```
var helloWorld = fluid.helloWorld();
```

Right now this component doesn't do anything, but we will evolve its definition throughout this introduction to demonstrate further core concepts of the framework.


<div class="infusion-docs-note">While we won't get into grade inheritance until later (combining existing grade definitions by supplying multiple items in the `gradeNames` array), we'll quickly note two important rules:

<ol>
<li>The order of precedence when grades configurations have keys with the same name in the same place is that the rightmost grade will take precedence.</li>
<li>Any combination including `fluid.viewComponent` or grades derived from it should be placed to the right of any non-`viewComponent` grade.</li>
</ol>

</div>

Next: [ Invokers](DeveloperIntroductionToInfusionFramework-Invokers.html)
