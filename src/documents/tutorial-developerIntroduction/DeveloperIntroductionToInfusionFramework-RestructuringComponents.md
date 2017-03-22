---
title: Developer Introduction to the Infusion Framework - Restructuring Components
layout: default
category: Tutorials
---

Infusion's configuration-oriented components make it easier to restructure code, especially as a single component configuration becomes unwieldy and long. It's a common and expected pattern in Infusion to refactor components as a design evolves.

In the example below, we extract the two "say hello" components into separate component definitions from the main component, then include them as subcomponents of the main component with their options appropriately configured.

We've also added a listener to the main component to announce (once) when its creation is complete.

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/egBObY?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

<!-- TODO: this is a bit of a mess right now, and the console and web page components actually aren't freestanding - they should be made freestanding components -->

```
// The console hello functionality is now defined as a separate
// component
fluid.defaults("fluid.helloWorld.consoleHello", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, Console World!"
    },
    modelListeners: {
        "message": "{that}.sayHello"
    },
    invokers: {
        sayHello: {
            "this": "console",
            "method": "log",
            // Here, "{that}" means the context of the current
            // component configuration (consoleHello)
            "args": ["{that}.model.message"]
        },
    }
});

// The web page hello functionality is now defined as a separate
// component
fluid.defaults("fluid.helloWorld.displayHello", {
    gradeNames: ["fluid.viewComponent"],
    model: {
        message: "Hello, Web Page World!"
    },
    selectors: {
        messageArea: ".flc-messageArea"
    },
    modelListeners: {
        "message": "{that}.displayHello"
    },
    invokers: {
        displayHello: {
            "this": "{that}.container",
            "method": "html",
            "args": ["{that}.model.message"]
        }
    }
});

fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, World!"
    },
    listeners: {
        "onCreate.announceSelf": {
            "this": "console",
            "method": "log",
            "args": ["The helloWorld Component is ready"]
        }
    },
    components: {
        consoleHello: {
            type: "fluid.helloWorld.consoleHello"
        },
        dispayHello: {
            type: "fluid.helloWorld.displayHello",
            container: ".flc-messageArea"
        }
    }
});
```

Next: [Overriding Invokers and Refactoring](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-OverridingInvokersAndRefactoring.md)
