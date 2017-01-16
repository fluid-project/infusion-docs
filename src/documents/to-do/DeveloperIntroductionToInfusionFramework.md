---
title: Developer Introduction to the Infusion Framework
layout: default
category: Tutorials
---

<!-- _This page is still under construction. An archived version can be found on the
[Developer Introduction to the Infusion Framework](http://wiki.fluidproject.org/display/docs/Developer+Introduction+to+Infusion+Framework)
page of the [Infusion Documentation wiki](http://wiki.fluidproject.org/display/docs/Infusion+Documentation)._ -->

# Introduction

Here we will boil down some of the basic concepts of Infusion for developers who may be interested in it, but uncertain of where to start. There's a lot going on in the framework, but grasping some core ideas helps a great deal in moving forward and learning.

This introduction summarizes some topics (and leaves out others) that are gone into at length in the longer [Framework Concepts](/infusion/development/FrameworkConcepts.md) document; developers interested in greater detail about the guiding philosophy behind Infusion should consult that document as well.

The introduction assumes you are familiar with the basics of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript) development, and with using a browser's [developer tools](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools). You should also have some experience of the [jQuery](https://jquery.com/) JavaScript library that Infusion is built on top of.

We will present an increasingly complicated "Hello, World!" implementation to demonstrate the core concepts, with live examples throughout using the [CodePen](http://codepen.io/) service.

## Infusion's Core Concepts

### Components

Programs using Infusion structure their data, functionality and interaction as various components defined using a common syntax.

Components are [regular JavaScript objects that have certain characteristics](/infusion/development/UnderstandingInfusionComponents.md). Components can be freely combined together to form new components using the [grades system](/infusion/development/ComponentGrades.md), or organized into relationships with one another via [subcomponents](/infusion/development/SubcomponentDeclaration.md).

 There are three base components to be aware of that any new components you create with Infusion will likely have at their root:

 * [`fluid.component`](/infusion/development/ComponentConfigurationOptions.md#options-supported-by-all-components-grades), the simplest type with support for events and public function definition (called [invokers](/infusion/development/Invokers.md) in Infusion).
 * [`fluid.modelComponent`](/infusion/development/ComponentConfigurationOptions.md#model-components), which adds support for mutable state, model events, and state coordination and relay between different components.
 * [`fluid.viewComponent`](/infusion/development/ComponentConfigurationOptions.md#view-components), which supplement model components with functionality to bind to the DOM of a web page.

Component-based development emphasizes declarative configuration, loose coupling and flexible hierarchies.

A new Infusion component is defined using the `fluid.default` function and a very basic "Hello, World!" component might look like this:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/oBYvwx?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>


```
// The first argument is the name of the new component, the second is the
// new component's default configuration
fluid.defaults("fluid.helloWorld", {
    // gradeNames supplies an array of strings that name previously
    // defined Infusion components
    gradeNames: ["fluid.component"]
});
```

After definition, instances of the component can be created by calling the component's name as a function, with the option to pass in further configuration options as an argument:

```
var helloWorld = fluid.helloWorld({});
```

Right now this component doesn't do anything new, but we will evolve its definition throughout this introduction to demonstrate further core concepts of the framework.

### Invokers

All Infusion components support the definition of public functions using [invokers](/infusion/development/Invokers.md); among other things, invokers allow related components to have different internal implementations of a function but present a common function to be called by other code. If we imagine a "Hello, World!" component, there are a variety of ways it might say "hello". Two of them are:

* By printing to the web developer console via `console.log`
* By displaying a message on a web page

We'll define the first approach as an invoker on the "Hello, World!" component. Other styles of invokers are possible, but we'll use one here that lets us refer to functions of existing Javascript objects:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/MJbgEx?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.component"],
    invokers: {
        sayHello: {
            // Configures this invoker to use the console object
            "this": "console",
            // Configures this invoker to use the log function of the console
            // object
            "method": "log",
            // Configures the arguments to pass to the method
            "args": ["Hello, World!"]
        }
    }
});
```

Now we can create an instance of the component and call the invoker as a function to say hello:

```
var helloWorld = fluid.helloWorld({});
helloWorld.sayHello();
```

### Events and Inversion of Control

All Infusion components support highly flexible event-driven programming. All components have basic [lifecycle events](/infusion/development/ComponentLifecycle.md) such as creation and destruction, and others may be [declared](/infusion/development/InfusionEventSystem.md#declaring-an-event-on-a-component), [fired](/infusion/development/InfusionEventSystem.md#using-events-and-listeners-procedurally) and [listened](/infusion/development/InfusionEventSystem.md#registering-a-listener-to-an-event) for by the originating component or another component.

Infusion also makes extensive use of the programming concept of [Inversion of Control](/infusion/development/FrameworkConcepts.md#ioc) (IoC), a technique for organizing component dependencies and references in a distributed, flexible manner. IoC is used in many ways throughout Infusion, but an important initial concept to grasp is the use of [IoC References](/infusion/development/IoCReferences.md) when configuring components, and the concept of `{that}`.

IoC references allow us to refer to other parts of a component object (or another component entirely) in a declarative, context-specific manner, with `{that}` standing in for the current component configuration.

We can use a listener definition, the `onCreate` lifecycle event and IoC `{that]` to have a component say hello when it's ready, rather than needing to be manually called:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/LxbPQZ?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.component"],
    listeners: {
        // Tells the component to call its own 'sayHello' function
        // when it's created
        "onCreate.sayHello": "{that}.sayHello"
    },
    invokers: {
        sayHello: {
            "this": "console",
            "method": "log",
            "args": ["Hello, World!"]
        }
    }
});
```

### Models and Model Components

Mutable data is expected to be stored on a component's [model](/infusion/development/FrameworkConcepts.md#model-objects). Component models in Infusion are altered through the [ChangeApplier](/infusion/development/ChangeApplier.md) functionality, which works to:

* coordinate shared model state between different components
* allow changes to a component's model to be listened for and responded to as though they are events

Let's store the "Hello, World!" message on a model version of the component, and refer to it from the `sayHello` invoker using IoC:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/XpNrEr?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        message: "Hello, World!"
    },
    listeners: {
        "onCreate.sayHello": "{that}.sayHello"
    },
    invokers: {
        sayHello: {
            "this": "console",
            "method": "log",
            "args": ["{that}.model.message"]
        }
    }
});
```

### Views and View Components

View components are used to establish a binding between a specific DOM node on a web page and a specific instance of an Infusion component. View components serve an important role in relaxing the coupling between a component and any page markup it renders through the use of the [DOM Binder](/infusion/development/DOMBinder.md), making it easier to change component markup without changing component implementation.

View components require the specification of a page container for the component when creating them, as the first argument to the creator function:

`var helloWorld = fluid.helloWorld(".flc-helloWorld", {});`

Let's turn the "Hello, World!" component into a view component that writes its message to the screen as well, assuming we have this HTML on the page:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/MJbgVR?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
<div class="helloWorld">
    <div class="flc-messageArea"></div>
</div>
```

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.viewComponent"],
    model: {
        message: "Hello, World!"
    },
    selectors: {
        messageArea: ".flc-messageArea"
    },
    listeners: {
        "onCreate.sayHello": "{that}.sayHello",
        "onCreate.displayHello": "{that}.displayHello"
    },
    invokers: {
        sayHello: {
            "this": "console",
            "method": "log",
            "args": ["{that}.model.message"]
        },
        displayHello: {
            // DOM node as a jQuery object
            "this": "{that}.dom.messageArea",
            // Calls the 'html' function to replace the HTML at the node
            "method": "html",
            "args": ["{that}.model.message"]
        }
    }
});
```

### Listening to Model Changes

A common pattern in Infusion is to listen to changes to a component's model and then take further action to change the state of the DOM or another component. Let's implement this for the message displayed on the web page by our "Hello, World!" component, so that it will update its message whenever the model is changed:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/oBYvPB?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.viewComponent"],
    model: {
        message: "Hello, World!"
    },
    selectors: {
        messageArea: ".flc-messageArea"
    },
    listeners: {
        "onCreate.sayHello": "{that}.sayHello"
    },
    // Listen to the model.message path
    // this includes the initial setting of the model when the
    // component is created
    modelListeners: {
        "message": "{that}.displayHello"
    },
    invokers: {
        sayHello: {
            "this": "console",
            "method": "log",
            "args": ["{that}.model.message"]
        },
        displayHello: {
            // DOM node as a jQuery object
            "this": "{that}.dom.messageArea",
            // Calls the 'html' function to replace the HTML at the node
            "method": "html",
            "args": ["{that}.model.message"]
        }
    }
});
```

Then, from the console, we'll use the ChangeApplier to change the model; notice how the modelListener we defined responds to the change and updates the message again:

`helloWorld.applier.change("message", "Goodbye, World!");`

### Subcomponents and Model Relaying

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

### Restructuring Infusion Components

Infusion's configuration-oriented components make it easier to restructure code, especially as component configuration becomes unwieldy. In the example below, we extract the two "say hello" components into separate component definitions from the main component, then include them as subcomponents of the main component. We've also added a listener to the main component to announce (once) when it is finished creation.

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

### Using Invokers for Polymorphic Behaviour and Refactoring to Reuse Configuration

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

### Adding Further Ways of Saying Hello

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

### Summing Up

This elaborate "Hello, World!" implementation has slowly introduced some of Infusion's core features. To summarize:

* We implement our programs by designing [components](#components) that work together to provide the needed functionality. Components are Javascript objects adhering to certain syntax conventions that are created using the `fluid.defaults` function. While components have defaults, any of these defaults can be overriden at the time a specific instance of the component is created.
* Components use [invokers](#invokers) to expose functionality "publicly", provide a consistent API for collaboration with other components or use by other code, and enable polymorphic behaviour when deriving new components from existing ones.
* All components support [events and inversion of control](#events-and-inversion-of-control); these allow our programs to be built up of loosely coupled parts, and to manage sequencing through components observing and responding to their own events or the events of other components.
* Components that need to track mutable data, state or content should be [model components](#models-and-model-components); model components can share and synchronize their data with other model components, fire events when their models are changed, and take other actions to store and respond to state changes.
* Components that need to interact with the web page DOM to display content or interact with users are [view components](##views-and-view-components); view components are bound to specific DOM nodes when created and support the DOM Binder convention to avoid tying an implementation too tightly to specific markup.
* Model components can use [model listeners](#listening-to-model-changes) to respond to changes in model state.
* Components can include [subcomponents](#subcomponents-and-model-relaying), and use [model relaying](#subcomponents-and-model-relaying) to keep state synchronized between different components in larger designs. Many kinds of model relays are possible aside from two-way synchronization.
* As program designs evolve, Infusion's configuration-oriented components make it easier to [restructure a design](#restructuring-infusion-components) by splitting out functionality into multiple components and wiring them together through IoC references.
* When it becomes clear two components have similar behaviour, Infusion's design helps in [refactoring to share functionality](##using-invokers-for-polymorphic-behaviour-and-refactoring-to-reuse-configuration) through the use of invokers and base grades.
* Infusion has strong supports for [multimodal implementations](#adding-further-ways-of-saying-hello) that allow programs to adapt themselves to new contexts for input and presentation.
