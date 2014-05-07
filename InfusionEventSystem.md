Infusion Event System
=====================

Overview
--------

Infusion *events* are one of the most basic and widely used facilities in the framework. Almost every Infusion component exposes one or more events and/or listeners to events fired by itself or other components. A component opts in to the event system by mentioning `fluid.eventedComponent` or some other grade derived from it such as `fluid.viewComponent` in its list of parent [Component Grades](ComponentGrades.md).

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
    <td><strong>Type</strong></td>
    <td><strong>Description</strong></td>
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
 
myComponent.myEvent.fire(97, false); // firer of event can supply whatever arguments they like, but these should conform to some agreed signature
```

