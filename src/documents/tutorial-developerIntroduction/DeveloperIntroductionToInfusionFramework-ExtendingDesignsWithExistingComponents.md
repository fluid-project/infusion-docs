---
title: Developer Introduction to the Infusion Framework - Extending Designs with Existing Components
layout: default
category: Tutorials
---

Infusion's origins are in research about how to better implement accessible, inclusive systems. Many features are designed to support the easier transformation of data into other forms of representation, so it can be experienced by audiences with diverse needs.

Our community often refers to this as *multimodal design* (in this context, a "modality" is "a particular mode in which something exists or is experienced or expressed"), and many characteristics of Infusion are about:

* increasing the capacity of a system to have different representations of the same content, or to transform content into a form preferable to the end user
* increasing the capacity of a system to have new forms of representation developed and added as needs arise for them

We currently have a "Hello, World!" component that can say "hello!"" by printing to a web page and logging to the console. What if we wanted it to talk as well?

We'll extend the code further using an existing Infusion [text to speech](/infusion/development/TextToSpeechAPI.html) component, which should work in a modern text-to-speech supporting browser:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/vgyBbe?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

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

fluid.defaults("fluid.helloWorld.speakHello", {
    // This component has all of the characteristics of sayHello,
    // except for its implementation in the invoker
    // We also "mix in" the fluid.textToSpeech component to give it
    // the capability to access the browser's text to speech interface
    gradeNames: ["fluid.textToSpeech", "fluid.helloWorld.sayHello"],
    invokers: {
        sayHello: {
            // This style of Invoker allows us to refer to another
            // existing invoker using IoC references - in this case the
            // "queueSpeech" invoker that we have access to from mixing
            // in the fluid.textToSpeech grade
            "func": "{that}.queueSpeech",
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
        },
        speakHello: {
            type: "fluid.helloWorld.speakHello",
        }
    }
});
```

<!-- TODO

## Where Next?

-->
