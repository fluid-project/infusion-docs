---
title: Developer Introduction to the Infusion Framework - Restructuring Components
layout: default
category: Tutorials
---

Infusion's configuration-oriented components make it easier to restructure code, especially as a single component
configuration becomes unwieldy. It's a common and expected pattern in Infusion to refactor components as a design
evolves.

In the example below, we extract the two "say hello" components into separate component definitions from the main
component, then include them as subcomponents of the main component with their options appropriately configured. We'll
also add a listener to the main component to announce (once) when its creation is complete.

In the process, we'll be looking at some other important characteristics of Infusion component design:

1. Building freestanding components, then wiring them together for more complex behaviours.
2. Overriding default component configuration when building up applications from separate components.

<div class="infusion-docs-note"><strong>Note:</strong> You can check out the <a
href="http://codepen.io/waharnum/pen/egBObY?editors=1111">Live Example of the code below on CodePen</a></div>

```javascript
// The console hello functionality is now defined as a separate
// component
fluid.defaults("fluidTutorial.helloWorld.consoleHello", {
    gradeNames: ["fluid.modelComponent"],
    // We define a default message here so that
    // this component is fully independent and
    // could be used on its own
    model: {
        message: "Hello, Console World!"
    },
    modelListeners: {
        message: "{that}.sayHello"
    },
    invokers: {
        sayHello: {
            funcName: "fluidTutorial.helloWorld.consoleHello.sayHello",
            // Here, "{that}" means the context of the current
            // component configuration (consoleHello)
            args: ["{that}.model.message"]
        }
    }
});

// We'll update the name of the associated function at the same time.
fluidTutorial.helloWorld.consoleHello.sayHello = function (message) {
    console.log(message);
};

// The web page hello functionality is now defined as a separate component.
fluid.defaults("fluidTutorial.helloWorld.displayHello", {
    gradeNames: ["fluid.viewComponent"],
    // We define a default message here so that
    // this component is fully independent and
    // could be used on its own
    model: {
        message: "Hello, Web Page World!"
    },
    selectors: {
        messageArea: ".flc-messageArea"
    },
    modelListeners: {
        message: "{that}.displayHello"
    },
    invokers: {
        displayHello: {
            "this": "{that}.dom.messageArea",
            method: "html",
            args: ["{that}.model.message"]
        }
    }
});

fluid.defaults("fluidTutorial.helloWorld", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, World!"
    },
    listeners: {
        "onCreate.announceSelf": {
            "this": "console",
            method: "log",
            args: ["The helloWorld Component is ready"]
        }
    },
    components: {
        consoleHello: {
            type: "fluidTutorial.helloWorld.consoleHello",
            options: {
                model: {
                    message: "{helloWorld}.model.message"
                }
            }
        },
        displayHello: {
            type: "fluidTutorial.helloWorld.displayHello",
            container: ".helloWorld",
            options: {
                model: {
                    message: "{helloWorld}.model.message"
                }
            }
        }
    }
});
```

We'll also create an instance of this component in a way that shows how any Infusion component defaults can be
overridden:

```javascript
var helloWorld = fluidTutorial.helloWorld({
    model: {
        message: "Hello, restructured component world!"
    }
});
```

Notice that the initial message is changed - an Infusion grade definition created by `fluid.defaults` is exactly that, a
default definition, and is fully extensible and reconfigurable even at runtime by passing in another block of
configuration.

Next: [Overriding Invokers and Refactoring](DeveloperIntroductionToInfusionFramework-OverridingInvokersAndRefactoring.md)
