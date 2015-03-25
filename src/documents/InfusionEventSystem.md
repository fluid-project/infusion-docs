---
title: Infusion Event System
layout: default
---

Infusion Event System
=====================

Overview
--------

Infusion ***events*** are one of the most basic and widely used facilities in the framework. Almost every Infusion component exposes one or more events and/or listeners to events fired by itself or other components. A component opts in to the event system by mentioning `fluid.eventedComponent` or some other grade derived from it such as `fluid.viewComponent` in its list of parent [Component Grades](ComponentGrades.md).

An Infusion event (or more precisely, a particular firing of an Infusion event) represents

1. a particular instant in time (corresponding to when it is fired)
2. a particular array of JavaScript objects, forming its arguments or signature (sometimes called its *payload*).

An Infusion event can be fired at any time, and any collection of JavaScript objects can be supplied as its payload - that is, any JavaScript function call can serve as the initiation point where an event is fired.

Rather than firing and listening to events in raw JavaScript code, we recommend using the framework to encode firing and listening to events declaratively. We'll show how this syntax works first, and then later show procedural equivalents and more details.

Declaring an event on a component
---------------------------------

A top-level options block named **`events`** is supported on every component derived from the core framework grade `fluid.eventedComponent`. The keys in this block represent the event name, and the values represent the type of the event. Currently only two event types are supported, represented by the values `null` and `preventable` (this second value is almost never used). This table explains the meaning of the two values:

<table>
  <thead>
    <tr>
      <td><strong>Type</strong></td>
      <td><strong>Description</strong></td>
    </tr>
  </thead>
  <tr>
    <td><code>null</code></td>
    <td>
      The standard right hand side in an <code>events</code> structure - this indicates a standard event which may have any number of listeners and with no other special semantic
    </td>
  </tr>
  <tr>
    <td><code>preventable</code></td>
    <td>
      The event represents a <em>preventable</em> action. 
      The listeners may each return a boolean value of <code>false</code>, representing both 
      <ul>
        <li>that further listeners should fail to be queried, and </li>
        <li>that the operation represented by the event should be cancelled.</li>
      </ul>
      This is similar to the default semantics on browser events.
    </td>
  </tr>
</table>

For every such entry in the `events` section of a component's options, the framework will construct a corresponding ***event firer*** with the same name in the `events` section of the constructed component. The most common use of an event firer is to call its member named `fire` with some set of arguments. Here is a simple, self-contained example:

```javascript 
fluid.defaults("examples.eventedComponent", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    events: {
        myEvent: null
    }
});
 
var myComponent = examples.eventedComponent();
 
myComponent.myEvent.fire(97, false); // firer of event can supply whatever arguments they like, 
// but these should conform to some agreed signature
```

As a real-world example, here is a block of configuration taken from Infusion's [Reorderer](to-do/Reorderer.md) component: 

```javascript
events: {
    onShowKeyboardDropWarning: null,
    onSelect: null,
    onBeginMove: "preventable",
    onMove: null,
    afterMove: null,
    onHover: null, // item, state
    onRefresh: null
}
```

This indicates that the Reorderer supports 6 events of the listed types, of which one, `onBeginMove` represents a *preventable* event - a listener may countermand the `beginMove` effect by returning `true` when the event is received. The implementor has helpfully annotated the signature which is fired by the `onHover` event - in general since JavaScript doesn't have a type system this has to be done informally. If you have a Reorderer instance stored in a variable named `thatReorderer`, for example, the `onSelect` event could be fired with a call like `thatReorderer.onSelect.fire(item)`. The `fire` method of the event is a plain function which can be detached and treated as a general callback - for example, this sequence is valid:

```javascript
var myCallback = myComponent.myEvent.fire;
myCallback(42, true);
```
 

In general you shouldn't fire any of a component's events unless invited to by its documentation - you may disrupt its state. However, registering listeners to a component's events is always safe.

Registering a listener to an event
----------------------------------

Both as part of defaults, and also as supplied instantiation options, a fluid component can accept a structure named `listeners`. In the simplest form, the keys of the `listeners` structure are taken from the set of `events` present in the component's [Grade](ComponentGrades.md), and the values are either single listener specifications or arrays of listener specifications. A ***listener specification*** can take a number of forms - either being written as a simple String or Function, or as a full JSON object.The standard way of declaring a listener using Infusion's [IoC](to-do/IoCInversionOfControl.md) system is to supply the name of a global function using the member **`funcName`** or to supply a [reference](IoCReferences.md) to a function handle (usually an [Invoker](Invokers.md)) somewhere in the component tree using the member **`func`**. If your listener would like to receive different arguments than the ones that the event was fired with, you can supply references to these using the member **`args`**. You can consult the page [Event injection and boiling](EventInjectionAndBoiling.md) for the use of these more complex listener specifications. If you are happy with the existing arguments you can write a simple definition as a String or Function holding the value that would have been written in `func/funcName`. Here is a simple example of a listener definition, expanding our example from earlier:

```javascript
examples.myListener = function (number, condition) {
    console.log("Event listener received number " + number + " and condition " + condition);
};
 
fluid.defaults("examples.eventedComponent", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    events: {
        myEvent: null
    },
    listeners: {
        myEvent: "examples.myListener"
    }
});
  
var myComponent = examples.eventedComponent();
myComponent.myEvent.fire(97, false);
// console logs "Event listener received number 97 and condition false"
```

You should use the String forms for listener specifications rather than raw Function objects. This enables your component's options to consist of standard JSON which is more easily stored and manipulated.

###Namespaced listeners

There are two more complex options for the keys held by listeners - firstly, the listener name may be qualified with a ***namespace*** following a period character `.` - this follows the jQuery convention for namespaced events. For example, the key `myEvent.myNamespace` could be used above - this still attaches the listener to exactly the same event, the one named `myEvent`, but in this case the framework will make sure that only *one* listener will ever be attached to `myEvent` which mentions the same namespace `myNamespace`. Event namespaces are useful in order to specify functional roles for listeners, and to insist that only one listener can ever fill this role at the same time. It is a good idea to namespace your listeners whenever you can.

Here is an example again from Infusion's Reorderer component:

```javascript
listeners: {
    "onShowKeyboardDropWarning.setPosition": "fluid.moduleLayout.defaultOnShowKeyboardDropWarning"
}
```

represents that the function with the global name `fluid.moduleLayout.defaultOnShowKeyboardDropWarning` should be attached as a listener to the event `onShowKeyboardDropWarning` under the namespace `setPosition`. `setPosition` is a name which encodes the purpose of the listener for readers of the component - it is the one to be notified whenever the position of an item changes. Any integrator of this component can override exactly this listener by supplying the same namespace in their own listener specification.


###Listeners to events held elsewhere

Rather than a simple string, the key in a `listeners` structure can hold any [IoC Reference](IoCReferences.md) which resolves to an event anywhere in the component tree - that is, even one belonging to a different component. In this case the listener on the right hand side will be attached to that event rather than one of this component's own events. The framework will make sure to automatically deregister the listener when this component is destroyed. Many more complex cases are possible, including the wholesale injection of events from one component to another, and the creation of new events derived from existing ones. You can consult the page [Event injection and boiling](EventInjectionAndBoiling.md) for more details.


Using events and listeners procedurally
---------------------------------------

Traditional procedural APIs corresponding to all the above declarations exist. However, they are not encouraged for typical users of the framework. 

###Constructing an event firer procedurally

The Fluid event system is operated by instances of an *event firer* which are created by a call to `fluid.event.makeEventFirer()`. It is recommended that users don't construct event firers by hand but instead rely on the framework's facilities for automatically constructing these given event blocks in [component options](ComponentConfigurationOptions.md). The signature of `fluid.event.makeEventFirer` is not stable and will be revised in the 2.0 release of Infusion:

```javascript
var myFirer = fluid.event.makeEventFirer(unicast, preventable, name);
```

<table>
  <thead>
    <tr>
      <td>Argument</td>
      <td>Type</td>
      <td>Description</td>
    </tr>
  </thead>
  <tr>
    <td><code>unicast</code> (optional) DEPRECATED</td>
    <td><code>boolean</code></td>
    <td>
      If <code>true</code>, this event firer is a <em>unicast</em> event firer.
    </td>
  </tr>
  <tr>
    <td><code>preventable</code> (optional)</td>
    <td><code>boolean</code></td>
    <td>
      If <code>true</code>, this event firer represents a <em>preventable</em> action (see <a href="InfusionEventSystem.md#declaring-an-event-on-a-component">Declaring an event on a component</a>).
    </td>
  </tr>
  <tr>
    <td><code>name</code> (optional)</td>
    <td><code>string</code></td>
    <td>
      A name for this event firer, useful for diagnostic and debugging purposes
    </td>
  </tr>
</table>

###Using an event firer procedurally

Once an event firer is constructed, it can be called with the following methods (these do form a stable API):

<table>
  <thead>
    <tr>
      <td>Method</td>
      <td>Arguments</td>
      <td>Description</td>
    </tr>
  </thead>
  <tr>
    <td><code>addListener</code></td>
    <td><code>listener: Function,String,
listener specification
</code></td>
    <td>
      Registers the supplied listener with this firer. The listener represents a function of a particular signature which is determined between the firer and listener of an event. The namespace parameter is an optional String which defines a key representing a particular <em>function</em> of the listener. At most one listener may be registered with a firer with a particular key. This is a similar system to that operated by the JQuery namespaced events system. For an event firer which is of type <code>unicast</code>, the namespace argument will be ignored and will default to a fixed value.

A complex object may be supplied holding a listener specification. The structure of this object does not form a stable API.
    </td>
  </tr>
  <tr>
    <td><code>removeListener</code></td>
    <td><code>listener: String/Function</code></td>
    <td>
      Supplies either the same listener object which was previously supplied to <code>addListener</code>, or else the String representing its namespace key. The designated listener will be removed from the list of registered listeners for this fierer.
    </td>
  </tr>
  <tr>
    <td><code>fire</code></td>
    <td>(arbitrary)</td>
    <td>
      Fires an event to all the registered listeners. They will each be invoked with the exact argument list which is supplied to <code>fire</code> itself. If this is a <em>preventable</em> event, <code>fire</code> may return <code>true</code> indicating that a listener has requested to prevent the effect represented by this event.
    </td>
  </tr>
  <tr>
    <td><code>destroy</code></td>
    <td>none</td>
    <td>	
      Destroys this event firer. If an event is currently in the process of firing, no further listeners will be notified after the current listener returns. Any firing action performed in the future on this firer will be a no-op.
    </td>
  </tr>
</table>

