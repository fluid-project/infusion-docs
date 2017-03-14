---
title: Developer Introduction to the Infusion Framework - Subcomponents and ModelRelaying
layout: default
category: Tutorials
---

A component can include other components within its configuration; these are referred to in Infusion as subcomponents. It's common to want related components to share state through their models; we can handle this through the [model relay](/infusion/development/ModelRelay.md) features.

The evolving "Hello, World!" component below splits out the two "hello" functions (console and web page) into separate subcomponents, and synchronizes the "hello" message through model relay.

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/rjWBQN?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.viewComponent"],
    model: {
        message: "Hello, World!"
    },
    selectors: {
        messageArea: ".flc-messageArea"
    },
    // Subcomponents are defined here
    components: {
        consoleHello: {
            // The type must be an existing grade
            type: "fluid.modelComponent",
            // Configuration options for a subcomponent go under the
            // 'options' key
            options: {
                model: {
                    // "{helloWorld}.model.message" is an IoC
                    // reference to the parent fluid.helloWorld
                    // component's message value
                    // The framework handles two-way synchronization
                    // between the models automatically in this form;
                    // many other forms are possible, including
                    // ones that transform a value before it is
                    // relayed
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
            }
        },
        displayHello: {
            type: "fluid.modelComponent",
            options: {
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
            }
        }
    }
});
```
