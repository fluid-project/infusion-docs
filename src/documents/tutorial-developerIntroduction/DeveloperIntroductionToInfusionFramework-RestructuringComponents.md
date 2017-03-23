---
title: Developer Introduction to the Infusion Framework - Restructuring Components
layout: default
category: Tutorials
---

Infusion's configuration-oriented components make it easier to restructure code, especially as a single component configuration becomes unwieldy. It's a common and expected pattern in Infusion to refactor components as a design evolves.

In the example below, we extract the two "say hello" components into separate component definitions from the main component, then include them as subcomponents of the main component with their options appropriately configured. We'll also add a listener to the main component to announce (once) when its creation is complete.

In the process, we'll be looking at some other important characteristics of Infusion component design:

1) Building freestanding components, then wiring them together for more complex behaviours.
2) Overriding default component configuration when building up applications from separate components.


<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/egBObY?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

<!-- TODO: this is a bit of a mess right now, and the console and web page components actually aren't freestanding - they should be made freestanding components -->

```
// The console hello functionality is now defined as a separate
// component
fluid.defaults("fluid.helloWorld.consoleHello", {
    gradeNames: ["fluid.modelComponent"],    
    // We define a default message here so that
    // this component is fully independent and
    // could be used on its own
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
        "message": "{that}.displayHello"
    },
    invokers: {
        displayHello: {
            "this": "{that}.dom.messageArea",
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
            type: "fluid.helloWorld.consoleHello",
            options: {
                // We reconfigure the consoleHello
                // subcomponent used here to share
                // its message value with the
                // helloWorld component it's
                // contained within
                model: {
                    message: "{helloWorld}.model.message"
                }
            }
        },
        dispayHello: {
            type: "fluid.helloWorld.displayHello",
            // When using a viewComponent as a
            // subcomponent, we can specify the
            // selector for its container here
            container: ".helloWorld",
            options: {
                // We reconfigure the displayHello
                // subcomponent used here to share
                // its message value with the
                // helloWorld component it's
                // contained within
                model: {
                    message: "{helloWorld}.model.message"
                }
            }
        }
    }
});
```

We'll also create an instance of this component in a way that shows how any Infusion component defaults can be overridden:

```
helloWorld = fluid.helloWorld({
  model: {
      message: "Hello, restructured component world!"
    }
  });
```

Notice that the initial message is changed - an Infusion grade definition created by `fluid.defaults` is exactly that, a default definition, and is fully extensible and reconfigurable even at runtime by passing in another block of configuration.

Next: [Overriding Invokers and Refactoring](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-OverridingInvokersAndRefactoring.md)
