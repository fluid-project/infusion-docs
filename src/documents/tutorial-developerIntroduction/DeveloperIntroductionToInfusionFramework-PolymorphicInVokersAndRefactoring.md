---
title: Developer Introduction to the Infusion Framework - Polymorphic InVokers and Refactoring
layout: default
category: Tutorials
---

With the console and display functionality extracted as a separate components, it's easier to see that large blocks of their configuration are similar:

* they have the same model characteristics
* they both have a model listener that calls a "say hello" function
* while their invokers have different names, this isn't necessary now that they've been split out into separate component definitions

Let's refactor to avoid duplication and create a base "say hello" component that other types of "say hello" components can derive from:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/bgBbOm?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld.sayHello", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "{helloWorld}.model.message"
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
    // except for its implementation in the invoker
    gradeNames: ["fluid.helloWorld.sayHello"],
    invokers: {
        sayHello: {
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
        displayHello: {
            type: "fluid.helloWorld.displayHello",
        }
    }
});
```
