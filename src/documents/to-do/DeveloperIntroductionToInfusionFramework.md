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

```
fluid.defaults("fluid.helloWorld", {
    // gradeNames supplies an array of strings that name previously
    // defined components
    gradeNames: ["fluid.component"]
});
```

After definition, instances of the component can be created by calling the component's name as a function, with the option to pass in further configuration options as an argument:

`var helloWorld = fluid.helloWorld({});`

We will evolve this component definition throughout this introduction to demonstrate further core concepts of the framework.

### Invokers

All Infusion components support the definition of public functions using [invokers](/infusion/development/Invokers.md); among other things, invokers allow related components to have different internal implementations of a function but present a common function to be called by other code. If we imagine a "Hello, World!" component, there are a variety of ways it might say "hello". Two of them are:

* By printing to the web developer console via `console.log`
* By displaying a message on a web page

We'll define the first approach as an invoker on the "Hello, World!" component. Other styles of invokers are possible, but we'll use one here that lets us refer to functions of existing Javascript objects:

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

All Infusion components also support highly flexible event-driven programming. All components have basic [lifecycle events](/infusion/development/ComponentLifecycle.md) such as creation and destruction, and others may be [declared](/infusion/development/InfusionEventSystem.md#declaring-an-event-on-a-component), [fired](/infusion/development/InfusionEventSystem.md#using-events-and-listeners-procedurally) and [listened](/infusion/development/InfusionEventSystem.md#registering-a-listener-to-an-event) for by the originating component or another component.

Infusion also makes extensive use of the programming concept of [Inversion of Control](/infusion/development/FrameworkConcepts.md#ioc) (IoC), a technique for organizing component dependencies and references in a distributed, flexible manner. IoC is used in many ways throughout Infusion, but an important initial concept to grasp is the use of [IoC References](/infusion/development/IoCReferences.md) when configuring components, and the concept of `{that}`.

IoC references allow us to refer to other parts of a component object (or another component entirely) in a declarative, context-specific manner, with `{that}` standing in for the current component configuration.

We can use a listener definition, the `onCreate` lifecycle event and IoC `{that]` to have a component say hello when it's ready, rather than needing to be manually called:

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

`var helloWorld = fluid.helloWorld(".helloWorld", {});`

Let's turn the "Hello, World!" component into a view component that writes its message to the screen as well, assuming we have this HTML on the page:

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
        "onCreate.announceSelf": {
            "this": "console",
            "method": "log",
            // The string will be replaced by the value held at
            // the model.message path of the current component
            "args": ["{that}.model.message"]
        },
        "onCreate.writeMessage": {
            // Gets us the DOM node as a jQuery object
            "this": "{that}.dom.message",
            // This calls the 'html' function to replace the HTML at the node
            "method": "html",
            "args": ["{that}.model.message"]
        }
    }
});
```

### Listening to Model Changes

A common pattern in Infusion is to listen to changes to a component's model and then take further action to change the state of the DOM or another component. Let's implement this for the message displayed on the web page by our "Hello, World!" component:

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
        "onCreate.announceSelf": {
            "this": "console",
            "method": "log",
            "args": ["helloWorld Component is ready, initial message is:", "{that}.model.message"]
        }
    },
    modelListeners: {
        // Listen to the model.message path
        // this includes the initial setting of the model when the
        // component is created
        "message": {
            "this": "{that}.dom.message",
            "method": "html",
            "args": ["{that}.model.message"]
        }
    }
});
```

Then, from the console, we'll use the ChangeApplier functionality to change the model; notice how the modelListener we defined responds to the change and updates the message again:

`helloWorld.applier.change("message", "Goodbye, World!");`

### Subcomponents and Model Relaying

A component can include other components within its configuration; these are referred to in Infusion as subcomponents. It's common to want related components to share state through their models; we can handle this through the [model relay](/infusion/development/ModelRelay.md) features.

The evolving "Hello, World!" component below splits out the two logging functions (console and web page) into separate subcomponents, and synchronizes the message to be logged through a model relay:

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
        "onCreate.announceSelf": {
            "this": "console",
            "method": "log",
            "args": ["The helloWorld Component is ready"]
        }
    },
    // Subcomponents are defined here
    components: {
        consoleLogger: {
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
                    logMessage: "{helloWorld}.model.message"
                },
                modelListeners: {
                    "logMessage": {
                        "this": "console",
                        "method": "log",
                        // Here, "{that}" means the context of the current
                        // component configuration (consoleLogger)
                        "args": ["consoleLogger:", "{that}.model.logMessage"]
                    }
                }
            }
        },
        viewLogger: {
            type: "fluid.modelComponent",
            options: {
                model: {
                    logMessage: "{helloWorld}.model.message"
                },
                modelListeners: {
                    "logMessage": {
                        "this": "{helloWorld}.dom.messageArea",
                        "method": "html",
                        "args": ["{that}.model.logMessage"]
                    }
                }
            }
        }
    }
});
```

### Restructuring Infusion Components

Infusion's configuration-oriented components make it easier to restructure code, especially as component configuration becomes unwieldy. In the example below, we extract the two logger components into separate component definitions from the main component that includes them as subcomponents.

```
// The console logging functionality is now defined as a separate
// component
fluid.defaults("fluid.helloWorld.consoleLogger", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        logMessage: "{helloWorld}.model.message"
    },
    modelListeners: {
        "logMessage": {
            "this": "console",
            "method": "log",
            "args": ["consoleLogger:", "{that}.model.logMessage"]
        }
    }
});

// The web page logging functionality is now defined as a separate
// component
fluid.defaults("fluid.helloWorld.viewLogger", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        logMessage: "{helloWorld}.model.message"
    },
    modelListeners: {
        "logMessage": {
            "this": "{helloWorld}.dom.messageArea",
            "method": "html",
            "args": ["{that}.model.logMessage"]
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
        consoleLogger: {
            type: "fluid.helloWorld.consoleLogger"
        },
        viewLogger: {
            type: "fluid.helloWorld.viewLogger",
        }
    }
});
```

### Using Invokers for Polymorphic Behaviour



```
fluid.defaults("fluid.helloWorld.consoleLogger", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        logMessage: "{helloWorld}.model.message"
    },
    modelListeners: {
        "logMessage": "{that}.logFunction"
    },
    invokers: {
        "logFunction": {
            "this": "console",
            "method": "log",
            "args": ["consoleLogger:", "{that}.model.logMessage"]
        }
    }
});

fluid.defaults("fluid.helloWorld.viewLogger", {
    // This component needs all of the characteristics of the consoleLogger,
    // but a different implementation of logFunction; so we
    // override the invoker, but can otherwise use the consoleLogger's
    // configuration by using it as the base grade
    gradeNames: ["fluid.helloWorld.consoleLogger"],
    invokers: {
        "logFunction": {
            "this": "{helloWorld}.dom.messageArea",
            "method": "html",
            "args": ["{that}.model.logMessage"]
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
        consoleLogger: {
            type: "fluid.helloWorld.consoleLogger"
        },
        viewLogger: {
            type: "fluid.helloWorld.viewLogger",
        }
    }
});

```
