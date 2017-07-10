---
title: Developer Introduction to the Infusion Framework - Overriding Invokers and Refactoring
layout: default
category: Tutorials
---

With the console and display functionality extracted as separate components, it's easier to see that large blocks of their configuration are similar:

* they have the same model characteristics
* they both have a model listener that calls a "say hello" function
* while their invokers have different names, this isn't necessary now that they've been split out into separate component definitions - we can use invokers to provide each component with an externally identical invoker with a different internal implementation. This is an example of [method overriding](https://en.wikipedia.org/wiki/Method_overriding).

Let's refactor to avoid duplication and create a base "say hello" component that other types of "say hello" component can derive from:

<div class="infusion-docs-note"><strong>Note:</strong> You can check out the <a href="http://codepen.io/waharnum/pen/bgBbOm?editors=1111">Live Example of the code below on CodePen</a></div>

``` javascript
fluid.defaults("fluidTutorial.helloWorld.sayHello", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, world!"
    },
    modelListeners: {
        message: "{that}.sayHello"
    },
    invokers: {
        // fluid.notImplemented is a function that specifically represents
        // an unimplemented function that components deriving from this
        // grade are intended to implement; this is called an "abstract
        // method" in Java
        sayHello: "fluid.notImplemented"
    }
});

fluid.defaults("fluidTutorial.helloWorld.consoleHello", {
    // This component has all of the characteristics of sayHello,
    // except for its implementation in the invoker
    gradeNames: ["fluidTutorial.helloWorld.sayHello"],    
    invokers: {
        sayHello: {
            "funcName": "fluidTutorial.helloWorld.consoleHello.sayHello",
            // Here, "{that}" means the context of the current
            // component configuration (consoleHello)
            args: ["{that}.model.message"]
        },
    }
});

fluidTutorial.helloWorld.consoleHello.sayHello = function (message) {
    console.log(message);
};

fluid.defaults("fluidTutorial.helloWorld.displayHello", {
    // This component has all of the characteristics of sayHello,
    // except for its implementation in the invoker; additionally:
    //
    // 1) It adds the fluid.viewComponent grade to the gradeNames
    // array to give it the DOM binding capabilities of a viewComponent;
    // when multiple grade name are supplied in the array, their
    // configurations are combined in left to right order, with the
    // rightmost configuration taking precedence if there is a
    // duplication of keys at the same place in the configuration
    //
    // 2) It adds a selector for the messageArea
    gradeNames: ["fluidTutorial.helloWorld.sayHello", "fluid.viewComponent"],
    selectors: {
        messageArea: ".flc-messageArea"
    },
    invokers: {
        sayHello: {
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

Next: [Extending Designs with Existing Components](DeveloperIntroductionToInfusionFramework-ExtendingDesignsWithExistingComponents.md)
