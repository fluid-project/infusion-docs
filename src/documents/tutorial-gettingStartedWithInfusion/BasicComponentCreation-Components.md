---
title: Basic Component Creation - Components
layout: default
category: Tutorials
---

---
Part of the [Getting Started with Infusion Component Design Tutorial](GettingStartedWithInfusion.md)

---

Regardless of which grade of component you use, the basic structure will be the same. We'll use the simplest grade, a **plain component**, to illustrate what this structure is. In future pages explaining other grades, you'll see the same principles.

The definition of a component involves two things:

1. declare the component **grade** and any default values for the component's **options**. Options are used by users and integrators to customize the behaviour of a component.
2. define any public **functions** (invokers) and other members that the component requires to do its work.

## Grade and Default Options

A component's grade and any default options are registered with the framework using a call to
[`fluid.defaults`](../CoreAPI.md#fluiddefaultsgradename-options), which has two parameters:
the component name and an object containing the defaults. The parent grades for the component are specified in an array or single string in the defaults called `gradeNames`. For a plain component, specify the grade as `fluid.component`:

```javascript
fluid.defaults("tutorials.simpleComponent", {
    gradeNames: "fluid.component",
    option1: "default value 1"
    // ...
});
```

### Options

Integrators can override your defaults when they instantiate the component, to customize its appearance or behaviour. The framework will take care of [merging the integrator's values](../OptionsMerging.md) with your defaults.

We'll go through some examples of options, to give you an idea of what they're all about.

#### Example: Currency Converter Options

Suppose you're creating a currency converter. You might wish to specify a default conversion rate:

```javascript
fluid.defaults("tutorials.currencyConverter", {
    gradeNames: "fluid.component",
    exchangeRate: 1.035
});
```

#### Example: Inline Edit

The Infusion [Inline Edit](../to-do/InlineEdit.md) component uses a tooltip and defines (among other things) defaults for the delay before the tooltip appears, the text to display - even whether or not to enable it at all:

```javascript
fluid.defaults("fluid.inlineEdit", {
    // ...
    useTooltip: true,
    tooltipText: "Select or press Enter to edit",
    tooltipDelay: 1000 // in milliseconds
    // ...
});
```

#### Example: Progress

The Infusion [Progress](../to-do/Progress.md) component uses jQuery animations to show and hide a progress bar. The defaults include objects that are passed to jQuery to configure the animations:

```javascript
fluid.defaults("fluid.progress", {
    // ...
    showAnimation: {
        params: {
            opacity: "show"
        },
        duration: "slow"
    }, // forwarded to $().fadeIn("slow")

    hideAnimation: {
        params: {
            opacity: "hide"
        },
        duration: "slow"
    } // forwarded to $().fadeOut("slow")
    // ...
});
```

## The Creator Function

All components have a **creator function**: a public function that is invoked to instantiate the component. The framework will instantiate the creator function for you automatically, given the component's default options.
When your component is registered as a [subcomponent](../SubcomponentDeclaration.md) of another component, the framework will also take responsibility for calling the creator function for you automatically.
In the rare case you need to construct a component directly using a JavaScript function call, Infusion components have a standardized function signature:

* plain and **model** components accept a single argument: `options`
* **view** and **renderer** components accept two arguments: `container` and `options`

We'll get into what these arguments are when we talk each type of component later in this tutorial.

### Using IoC

#### Automatic creator function generation

The [IoC - Inversion of Control](../IoCAPI.md) system will automatically generate a component creator function for you. This is accomplished by registering default options deriving from the framework component grade `fluid.component`:

```javascript
fluid.defaults("tutorials.simpleComponent", {
    gradeNames: "fluid.component",
    option1: "default value 1"
    // ...
});
```

#### Public API methods

The standard means of adding public API functions to a component is to express them as [invokers](../Invokers.md). An invoker is a declarative record added into a components defaults, under the section `invokers`:
the name of the record becomes the name of the public function which will be added. The invoker record defines the name of the public JavaScript function which should be executed when the method is called,
as well as details of where the arguments that the function accepts should be sourced from - for example:

```javascript
fluid.defaults("tutorials.simpleComponent", {
    gradeNames: "fluid.component",
    option1: "default value 1",
    // ...
    invokers: {
        publicFunction: {
            funcName: "tutorials.simpleComponent.publicFunction",
            args: "{that}"
        }
    }
});

// implementation of the public function registered as an invoker above
tutorials.simpleComponent.publicFunction = function (that) {
   // ...
};
```

You will note that the function `tutorials.simpleComponent.publicFunction` is a standard JavaScript function that could even be invoked directly from code if this were found relevant -
it need not be necessarily bound as a component method (although most component methods that accept `{that}` as an argument tend not to make sense without being provided an instance of the relevant component).

#### Example: Currency Converter

Here is the next stage of evolution of our currency converter sample, with a conversion function defined using an invoker:

```javascript
fluid.defaults("tutorials.currencyConverter", {
    gradeNames: "fluid.component",
    exchangeRate: 1.035,
    invokers: {
        convert: {
            funcName: "tutorials.currencyConverterAuto.convert",
            args: ["{that}.options.exchangeRate", "{arguments}.0"] // amount
        }
    }
});

// The conversion function
tutorials.currencyConverterAuto.convert = function (exchangeRate, amount) {
    return amount * exchangeRate;
};
```

You'll notice that in this case we have been able to avoid binding to the entire component instance in our public function, and so our standalone public function `tutorials.currencyConverterAuto.convert`
is of more general utility than just for building a component method.
This has happened because its responsibilities are particularly well-defined - you should always take the opportunity to restrict the binding behaviour of your public functions in this way whenever it is appropriate.

## Defining and firing [events](../InfusionEventSystem.md)

Many times, you will be creating a component that works in an environment where other things are operating, and it will probably need to notify those other things of key **events** in its lifecycle.
Events can be used to trigger changes in the visual appearance of a component, or actions by other components. For example:

* the Infusion [Reorderer](../to-do/Reorderer.md) component provides drag-and-drop functionality for lists, grids, etc. Its operation has several key events, such as when a move is initiated, when it's completed, etc.
* the Infusion [Uploader](../to-do/Uploader.md) component, a queued multi-file uploader, has events including when a file is successfully added to the queue, when each file starts being uploaded, when each upload completes, etc.

The Infusion Framework defines its own event system. Infusion events differ from browser events in that they are not bound to the DOM or its infrastructure. Infusion events can be used for anything, not only user-interface related events.

## Declaring events on a component

All standard Fluid components descended from `fluid.component` support events. To take advantage of this,

* specify a grade of `fluid.component`, and
* include an `events` property in your defaults, listing the events your component will fire.

```javascript
fluid.defaults("tutorials.eventedComponent", {
    gradeNames: "fluid.component",
    // ...
    events: {
        onAnAction: null,
        afterAnAction: null,
        onAnotherAction: "preventable",
        afterAnotherAction: null
    }
});
```

The contents of the `events` object is a set of key-value pairs where the key is the event name and the value is the event type.

* **Event naming conventions**: You can call your events anything you like, but Infusion has adopted the convention of prefacing events with on or after to indicate whether or not the event is being fired before some action is taken, or after the action has completed.
* **Event types**: If the event is a standard event defined on this component, you will write `null` here. Event types supported by the framework are described at the [Infusion Event System](../InfusionEventSystem.md).
  Another possibility is to inject an event appearing elsewhere in the component tree by use of an [IoC reference](../IoCReferences.md) such as `{myOtherComponent}.events.myEvent`.

### Example: Saving and Deleting

Suppose you're creating a component that is responsible for managing records of some kind, or editing documents. An application like that is going to allow users to save their edits or remove the record altogether. You might create the following events for these actions:

```javascript
// Declare the events in the defaults
fluid.defaults("tutorials.recordEditor", {
    gradeNames: "fluid.component",
    // ...
    events: {
        afterSave: null,
        onRemove: "preventable",
        afterRemove: null
    }
});
```

## Firing Events

The framework will automatically set up event firers for all of your listed events. These will be attached to an object on your component called `events` and provide an API (and reference target) for you to fire events and add or remove listeners.

### Example: Saving and Deleting

Our record editor component will likely have public methods for the saving and removing of records. We will define these methods using the framework facility for [invokers](../Invokers.md). These methods will be responsible for firing the events.

```javascript
// Declare the events in the defaults
fluid.defaults("tutorials.recordEditor", {
    gradeNames: ["fluid.component"],
    events: {
        afterSave: null,
        onRemove: "preventable",
        afterRemove: null
    },
    invokers: {
        save: {
            funcName: "tutorials.recordEditor.save",
            args: "{that}"
        },
        remove: {
            funcName: "tutorials.recordEditor.remove",
            args: "{that}"
        }
    }
});

// Add public methods that will fire events when they do things
tutorials.recordEditor.save = function (that) {
    // save stuff
    // ...
    // let anyone listening know the save has happened:
    that.events.afterSave.fire();
};

tutorials.recordEditor.remove = function (that) {
    // see if anyone listening objects to the removal:
    var prevent = that.events.onRemove.fire();
    if (prevent === false) {
        // a listener prevented the move, don't do it
    }
    else {
        // no one objects, go ahead and remove
        // ...
        // let listeners know that the remove has completed
        that.events.afterRemove.fire();
    }
};
```

Next: [Model Components](ModelComponents.md)
