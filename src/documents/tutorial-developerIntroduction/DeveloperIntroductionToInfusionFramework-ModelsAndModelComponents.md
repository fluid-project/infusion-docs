---
title: Developer Introduction to the Infusion Framework - Models and Model Components
layout: default
category: Tutorials
---

Mutable data is expected to be stored on a component's [model](/infusion/development/FrameworkConcepts.md#model-objects). Component models in Infusion are altered through the [ChangeApplier](/infusion/development/ChangeApplier.md) functionality, which works to:

* coordinate shared model state between different components
* allow changes to a component's model to be listened for and responded to as though they are events

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
