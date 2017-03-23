---
title: Developer Introduction to the Infusion Framework - Overriding Invokers and Refactoring
layout: default
category: Tutorials
---

With the console and display functionality extracted as a separate components, it's easier to see that large blocks of their configuration are similar:

* they have the same model characteristics
* they both have a model listener that calls a "say hello" function
* while their invokers have different names, this isn't necessary now that they've been split out into separate component definitions - we can use invokers to provide each component with an externally identical invoker with a different internal implementation. This is an example of [method overriding](https://en.wikipedia.org/wiki/Method_overriding).

Let's refactor to avoid duplication and create a base "say hello" component that other types of "say hello" component can derive from:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/bgBbOm?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld.sayHello", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, world!"
    },
    modelListeners: {
        "message": "{that}.sayHello"
    },
    invokers: {
        // fluid.notImplemented is a function that specifically represents
        // an unimplemented function that components deriving from this
        // grade are intended to implement; this is called an "abstract
        // method" in Java
        sayHello: "fluid.notImplemented"
    }
});

fluid.defaults("fluid.helloWorld.consoleHello", {
    // This component has all of the characteristics of sayHello,
    // except for its implementation in the invoker
    gradeNames: ["fluid.helloWorld.sayHello"],    
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

fluid.defaults("fluid.helloWorld.displayHello", {
    // This component has all of the characteristics of sayHello,
    // except for its implementation in the invoker; additionally,
    // it adds the fluid.viewComponent grade and a selector
    gradeNames: ["fluid.helloWorld.sayHello", "fluid.viewComponent"],
    selectors: {
        messageArea: ".flc-messageArea"
    },
    invokers: {
        sayHello: {
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
                model: {
                    message: "{helloWorld}.model.message"
                }
            }
        },
        dispayHello: {
            type: "fluid.helloWorld.displayHello",
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

Next: [Extending Designs with Existing Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ExtendingDesignsWithExistingComponents.md)
