---
title: Developer Introduction to the Infusion Framework - Extending Designs with Existing Components
category: Tutorials
---

Infusion's origins are in research about how to better implement accessible, inclusive systems. Many features are
designed to support the easier transformation of data into other forms of representation, so it can be experienced by
audiences with diverse needs.

Our community often refers to this as *multimodal design* (in this context, a "modality" is "a particular mode in which
something exists or is experienced or expressed"), and many characteristics of Infusion are about:

* increasing the capacity of a system to have different representations of the same content, or to transform content
  into a form preferable to the end user
* increasing the capacity of a system to have new forms of representation developed and added as needs arise for them

We currently have a "Hello, World!" component that can say "hello!"" by printing to a web page and logging to the
console. What if we wanted it to talk as well?

We'll extend the code further using an existing Infusion [text to speech](../TextToSpeechAPI.md) component, which should
work in a modern text to speech supporting browser:

<div class="infusion-docs-note"><strong>Note:</strong> You can check out the <a
href="http://codepen.io/waharnum/pen/vgyBbe?editors=1111">Live Example of the code below on CodePen</a></div>

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
        sayHello: "fluid.notImplemented"
    }
});

fluid.defaults("fluidTutorial.helloWorld.consoleHello", {
    gradeNames: ["fluidTutorial.helloWorld.sayHello"],
    invokers: {
        sayHello: {
            "funcName": "fluidTutorial.helloWorld.consoleHello.sayHello",
            args: ["{that}.model.message"]
        }
    }
});

fluidTutorial.helloWorld.consoleHello.sayHello = function (message) {
    console.log(message);
};

fluid.defaults("fluidTutorial.helloWorld.displayHello", {
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


fluid.defaults("fluidTutorial.helloWorld.speakHello", {
    // This component has all of the characteristics of sayHello,
    // except for its implementation in the invoker
    // We also "mix in" the fluid.textToSpeech component to give it
    // the capability to access the browser's text to speech interface
    gradeNames: ["fluid.textToSpeech", "fluidTutorial.helloWorld.sayHello"],
    invokers: {
        sayHello: {
            // This style of Invoker allows us to refer to another
            // existing invoker using IoC references - in this case the
            // "queueSpeech" invoker that we have access to from mixing
            // in the fluid.textToSpeech grade
            "func": "{that}.queueSpeech",
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
        },
        speakHello: {
            type: "fluidTutorial.helloWorld.speakHello",
            options: {
                model: {
                    message: "{helloWorld}.model.message"
                }
            }
        }
    }
});
```

Next: [Transforming Model Relays](DeveloperIntroductionToInfusionFramework-TransformingModelRelays.md)
