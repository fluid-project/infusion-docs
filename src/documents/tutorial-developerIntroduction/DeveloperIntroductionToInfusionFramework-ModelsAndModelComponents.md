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

## Creating Model Components

First, let's store the "Hello, World!" message on the component model rather than having it directly in the invoker's arguments, and refer to it from the `sayHello` invoker using IoC syntax. In the process, we'll change it from a basic `fluid.component` to a `fluid.modelComponent`.

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/XpNrEr?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.modelComponent"],
    // Stores a string value with the key 'message'
    // on the component model
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
            // Refers to the model.message value of
            // the component in the invoker argument
            "args": ["{that}.model.message"]
        }
    }
});
```

## Listening to Model Changes

Second, let's move from using an event listener to say "Hello, World!" to using a model listener. Model listeners are similar conceptually to event listeners, but they respond to changes in a component's model rather than to component events.

A common pattern in Infusion is to listen to changes to a component's model and then take some further action, such as invoking a function involving the changed model state. We'll implement this below so that the component invokes its `sayHello` function with the message content each time it changes.

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/oBYvPB?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, World!"
    },
    modelListeners: {
        // On the left side, configures a
        // model listener listening to the
        // 'message' value
        //
        // On the right side, configures the
        // listener to call the component's
        // 'sayHello' invoker whenever the
        // value changes
        "message": "{that}.sayHello"
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

## Using the Change Applier

From the console we can now use the `changeApplier` functionality available to all model components to update the model's `message`. We should see the new message logged to the console each time, because the `modelListener` we've defined will be called each time the `message` content changes.

```
> helloWorld.applier.change("message", "Hello, brave new Infusion world!");
> "Hello, brave new Infusion world!"

> helloWorld.applier.change("message", "Goodbye! See you again soon.");
> "Goodbye! See you again soon."
```

Next: [Views and View Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ViewsAndViewComponents.html)
