---
title: Developer Introduction to the Infusion Framework - Models and Model Components
layout: default
category: Tutorials
---

Mutable data is typically expected to be stored on a component's [model](/infusion/development/FrameworkConcepts.md#model-objects). Component models in Infusion are altered through the [ChangeApplier](/infusion/development/ChangeApplier.md) functionality, which works to:

* coordinate shared model state between different components
* allow changes to a component's model to be listened for and responded to as though they are events

What kinds of data is suitable for storing on a component model? The advice from the framework explanation of [model objects](/infusion/development/FrameworkConcepts.md#model-objects) is:

<div class="infusion-docs-note">
We recommend that all objects stored in the `model` area of a component conform to an even stricter definition - that they are equivalent to their form serialised as JSON. This implies that they
consist of only the following types: `Array`, `Object`, `String`, `Number` and `Boolean`. In addition, the following values for `Number` should not be used - `Infinity`, `-Infinity` and `NaN`. The value
`undefined` also can not be safely stored within a model.
</div>

If there is a need to store a non-mutable variable, a non-component object or similar on a component, a typical convention is to place it within the [`members`](http://localhost:9778/ComponentConfigurationOptions.html#-members-) option block. We will not discuss this topic in the context of this tutorial.

Let's store the "Hello, World!" message on a model version of the component, and refer to it from the `sayHello` invoker using IoC:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/XpNrEr?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, World!"
    },
    listeners: {
        "onCreate.sayHello": "{that}.sayHello"
    },
    invokers: {
        sayHello: {
            "this": "console",
            "method": "log",
            "args": ["{that}.model.message"]
        }
    }
});
```
Next: [Views and View Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ViewsAndViewComponents.html)
