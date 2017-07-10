---
title: Developer Introduction to the Infusion Framework - Transforming Model Relays
layout: default
category: Tutorials
---

We've covered [simple model relays previously](DeveloperIntroductionToInfusionFramework-SubcomponentsAndModelRelaying.md) as means of enabling two-way synchronization between the models of different components. What if we have a more complex need to coordinate model changes, such as deriving a value on one component model by transforming a value from another?

Infusion's answer to this is the [explicit model relay](../ModelRelay.md#explicit-model-relay-style), a more verbose configuration of relay behaviour that can specify complex logic as part of a component.

In the code below, we add a second `fluidTutorial.helloWorld.speakHello` subcomponent, but use a style of explicit model relay that allows us to pass a value through an intermediary function when coordinating changes. In this case, we define a function that reverses a string, and our `reverseSpeakHello` subcomponent will speak the message backwards after the `speakHello` subcomponent has spoken it.

<div class="infusion-docs-note"><strong>Note:</strong> You can check out the <a href="http://codepen.io/waharnum/pen/gWGQyN?editors=1111">Live Example of the code below on CodePen</a></div>

``` javascript
var helloWorld;

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
        },
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
    gradeNames: ["fluid.textToSpeech", "fluidTutorial.helloWorld.sayHello"],
    invokers: {
        sayHello: {
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
        },
        reverseSpeakHello: {
            type: "fluidTutorial.helloWorld.speakHello",
            options: {
                // We use what is referred to as the "explicit"
                // model relay style here, one that is more verbose
                // but allows us many more options, including
                // passing the relayed input through a transforming
                // function
                modelRelay: {
                    // A keyword name for the relay rule
                    messageReverse: {
                        singleTransform: {
                            // The input value whose changes this
                            // relay rule should coordinate
                            //
                            // In this case, an IoC reference to the
                            // 'message' value of the parent component
                            input: "{helloWorld}.model.message",
                            // The function to call to transform
                            // the input
                            type: "fluidTutorial.helloWorld.reverseString",
                        },
                        // The target point on the component model
                        // where the transformed value will be relayed
                        target: "message"
                    }
                },
            }
        }

    }
});

// This new function reverses and returns a string
fluidTutorial.helloWorld.reverseString = function (str) {
    return str.split("").reverse().join("");
}

helloWorld = fluidTutorial.helloWorld({
  model: {
      message: "Hello, world!"
    }
});
```

A main goal of Infusion is to enable us where possible to express our applications as [declarative configurations](../FrameworkConcepts.md#declarative-configuration), reducing the overhead for other developers (or ourselves, after we have stepped away from the code for some time...) to understand the flow of program data.

Transforming model relays reduce the amount of custom code we need to write to fulfill a common need: responding to data changing in one part of the program in another part of the program.

We have seen previously how [model relaying](DeveloperIntroductionToInfusionFramework-SubcomponentsAndModelRelaying.md) can be used for value synchronization between parts of a program; when we add transformations to the relay syntax, we can achieve advanced coordination of program state where much of the complexity is embodied in the declarative configuration syntax.

Next: [Concluding Remarks](DeveloperIntroductionToInfusionFramework-ConcludingRemarks.md)
