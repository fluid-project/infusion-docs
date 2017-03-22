---
title: Developer Introduction to the Infusion Framework - Restructuring Components
layout: default
category: Tutorials
---

Infusion's configuration-oriented components make it easier to restructure code, especially as a single component configuration becomes unwieldy and long. It's a common and expected pattern in Infusion to refactor components as a design evolves.

In the example below, we extract the two "say hello" components into separate component definitions from the main component, then include them as subcomponents of the main component. We've also added a listener to the main component to announce (once) when its creation is complete.

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/egBObY?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
// The console hello functionality is now defined as a separate
// component
fluid.defaults("fluid.helloWorld.consoleHello", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "{helloWorld}.model.message"
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
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "{helloWorld}.model.message"
    },
    modelListeners: {
        "message": "{that}.displayHello"
    },
    invokers: {
        displayHello: {
            "this": "{helloWorld}.dom.messageArea",
            "method": "html",
            "args": ["{that}.model.message"]
        }
    }
});

fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.viewComponent"],
    model: {
        message: "Hello, World!"
    },
    selectors: {
        messageArea: ".flc-messageArea"
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
        consoleLogger: {
            type: "fluid.helloWorld.displayHello",
        }
    }
});
```

Next: [Overriding Invokers and Refactoring](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-OverridingInvokersAndRefactoring.md)
