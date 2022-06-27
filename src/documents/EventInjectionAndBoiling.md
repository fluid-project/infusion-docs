---
title: Event Injection and Boiling
category: Infusion
---

The [Infusion Event System](InfusionEventSystem.md) explains how to declare events of various types attached to a single
component. Within a larger design, sometimes it is necessary to

1. collaborate between multiple components in a component tree on **sharing** references to event firers (**event
   injection**)
2. present an event with a particular signature fired by a component as one with a different signature in a listener
   (**event or listener boiling**)

Both of these capabilities rely on the [IoC - Inversion of Control](IoCAPI.md) system.

## Listener Boiling

### Receiving a Different Signature in the Listener

It often occurs that the signature of a function registered as a listener doesn't match the one fired by the event.
Adapting to this mismatch in configuration is sometimes referred to as **listener boiling**.
The syntax used for listener boiling is identical to that applied for defining [Invokers](Invokers.md).

Here is an example of a component which defines a single event, `simpleEvent` - the firer for it uses a signature `(int
value, boolean flag)` but we have a listener that requires a different signature `(Object that, int value)` where the first
argument consists of the component itself and the 2nd argument consists of the supplied first argument:

```javascript
examples.externalListener = function (that, value) {
    console.log("Received value ", value, " fired from component ", that);
};

fluid.defaults("examples.boiledListenerComponent", {
    gradeNames: "fluid.component",
    events: {
        simpleEvent: null
    },
    listeners: {
        simpleEvent: {
            funcName: "examples.externalListener",
            args: ["{that}", "{arguments.0"]
        }
    }
});

var that = examples.boiledListenerComponent();
that.events.simpleEvent.fire(5, true); // listener above will log 5, that
```

### Injecting a Listener to an Event Elsewhere in the Tree

Either together with or separate from the adjustment of listener signatures in the previous section, it is also possible
to attach a listener to a component elsewhere in the tree than the one where the listener configuration is written.
 Note that with this built-in syntax the listener can only be injected into (registered as a
listener to) a component which is visible as a parent or a sibling of the current component, using a standard
upward-matching [IoC Context Selector](Contexts.md). If you need the more powerful facility to inject a listener
_downwards_ (that is, to one or more components that may not yet be constructed) please see the section describing the
use of the [distributeOptions](IoCSS.md) options block.

```javascript
fluid.defaults("examples.injectedListenerParent", {
    gradeNames: "fluid.component",
    events: {
        parentEvent: null
    },
    components: {
        child: {
            type: "fluid.component",
            options: {
                listeners: {
                    "{injectedListenerParent}.events.parentEvent": "examples.externalListener"
                }
            }
        }
    }
});

var that = examples.injectedListenerParent();
that.events.parentEvent.fire(that, 5); // strikes above listener through injected listener attachment
```

_Note that both of these kinds of boiling can be applied at the same time - that is, it is possible to adjust the
signature of a listener using `args` at the same time as resolving to it elsewhere in the tree by means of an IoC
reference key. Note also that all injected listeners automatically deregistered by the framework when the component
which holds their record (e.g. the `child` component in this example) is destroyed - there is no need for the user to
call `removeListener` manually._

## Event Injection

Event injection is the wholesale injection of an event belonging to one component, to appear as an event belonging to
another. These events will share a single set of listeners which will be fired when any sharing component fires the
event, and any sharing component may add and remove listeners. This is achieved by referencing the source event to be
injected on the right hand side of the standard `events` block on the component. For example:

### Example 1

The first defaults block in this example defines a plain [component](ComponentGrades.md) which defines one concrete
event, named `parentEvent`, and one child component, with options unspecified.

The second defaults block defines defaults for `childComponent`. Here, the reference to the event `parentEvent` becomes
_shared_ between the two components. `childComponent` will appear to have a event firer named `parentEvent` which
behaves exactly as if it were defined locally (as it is in the parent component) and will share listeners with the
parent component.

```javascript
fluid.defaults("fluid.tests.parentComponent", {
    gradeNames: "fluid.component",
    events: {
        parentEvent: null
    },
    components: {
        childComponent: {
            type: "fluid.tests.childComponent"
        }
    }
});

fluid.defaults("fluid.tests.childComponent", {
    gradeNames: "fluid.component",
    events: {
        parentEvent: "{parentComponent}.events.parentEvent"
    }
});
```

<div class="infusion-docs-note">

<strong>Note:</strong> This technique is not generally recommended because of the possibility for unexpected effects
when registering listeners with [namespaces](InfusionEventSystem.md#namespaced-listeners). Since an injected event
is exactly the same event as the original, namespaced listeners registered across the different sites will be
deduplicated, meaning that only one will be registered per namespace. This is often an unexpected behaviour, so
instead a more lightweight technique of [remotely registering listeners](#injecting-a-listener-to-an-event-elsewhere-in-the-tree)
as described in the previous section is preferred. Alternatively, you may register the firer of one event as a listener
to another, or used boiled events as described in the next section.

</div>

### Alternative Choice of Scoping For Event Binding

Note that the defaults we have written in the examples above for `childComponent` prevent it from being used in contexts
where the reference `{parentComponent}` cannot be resolved. This may or may not be desirable depending on the purpose
for `childComponent`. Its purpose may only comprise being reused together with `{parentComponent}`, or it may be
intended to be more generally reusable - since this is only test/example code, this intention can't be made clear. For
completeness, we present another style of writing this configuration which expresses the other intention, that
`childComponent` should be generally reusable: this moves the reference to `parentComponent` into the tree for
`parentComponent` itself, ensuring that `childComponent` can be constructed without the parent if required.

#### Example 2

Here, the base component `childComponent` contains a standard local definition of an event named `parentEvent` which
satisfies the component's own requirements to fire this event when in isolation. The event binding on `parentEvent` is
defined in the defaults block of `parentComponent`. At the instantiation of `parentComponent`, the bound event
overwrites the definition of the local event `parentEvent`.

```javascript
fluid.defaults("fluid.tests.parentComponent", {
    gradeNames: "fluid.component",
    events: {
        parentEvent: null
    },
    components: {
        childComponent: {
            type: "fluid.tests.childComponent",
            options: {
                events:{
                    parentEvent: "{parentComponent}.events.parentEvent"
                }
            }
        }
    }
});

fluid.defaults("fluid.tests.childComponent", {
    gradeNames: "fluid.component",
    events: {
        parentEvent: null
    }
});
```

## Event Boiling

A **boiled** event is derived from another event (a **base event**) but allows the signature of the event to be
adjusted. A listener to a boiled event receives a call at the same point in time as a standard listener, but can receive
a different set of arguments than the ones which were supplied in the original call to `fire()` which triggered the
event. This modified argument set can draw values from IoC-resolved contextual values around the component tree, as well
as from the original argument set which the firer of the event supplied.

Boiled events are useful in wiring together consumers and producers of events who have different expectations - these
differences can arise, for example, through the development of the codebases being in different lifecycles - perhaps the
producer of the event is part of framework code which is not going to be updated for a long time, but has been written
with a poorly planned API which does not expose crucial information which the event consumer requires.

Suggestions are still welcomed for a more suitable name than **boiled events**. Because boiled events are distinct from
their sources, they do not suffer from the namespacing risks highlighted for injected events.

### Boiling One Single Event

A boiled event is defined in just the same place as a standard event - in the `events` block of a component's defaults.
The configuration ("right-hand side") value is more complex than that for a simple event - it needs to specify not only
the base event, but also the transformation performed on the argument list. The configured value must contain two
elements, the event property, which references the event to be boiled, and the `args` which specifies the argument list
which will be received by listeners to the boiled event. This uses the standard `{context}.pathName` format for
contextualised EL values which is used in IoC, with the addition that one extra context object is in scope - the context
`{arguments}` allows the argument list to refer to the original argument list that was presented when the base event was
fired. For example:

#### Example 3

In this code block, the component defines two events - one **basic event** named `localEvent`, and one **boiled event**
named `boiledLocal` which uses `localEvent` as a base. In this case, a listener registered to `boiledLocal` will receive
the first two arguments which were supplied when `localEvent` was fired, but swapped to appear in the opposite order.

```javascript

fluid.defaults("fluid.tests.eventBoiled", {
    gradeNames: "fluid.component",
    events: {
        boiledLocal: {
            event: "localEvent",
            args: ["{arguments}.1", "{arguments}.0"]
        },
        localEvent: null
    }
});
```

### Boiling Multiple Events

The event boiling can be used to boil multiple events that are either from the same or a different component.

#### Example 4

The example below shows boiling from a different component, the boiled event `boiledDouble` in the example will be fired
once both `parentEvent1` and `parentEvent2` from `parentComponent` are fired. The arguments supplied to `boiledDouble`
would be the first argument provided by `parentEvent1` and the second argument provided by `parentEvent2`.

```javascript
fluid.defaults("fluid.tests.parentComponent", {
    gradeNames: "fluid.component",
    events: {
        parentEvent1: null,
        parentEvent2: null
    },
    components: {
        child: {
            type: "fluid.tests.childComponent",
            options: {
                events: {
                    boiledDouble: {
                        events: {
                            event1: "{parentComponent}.events.parentEvent1",
                            event2: "{parentComponent}.events.parentEvent2"
                        },
                        args: ["{arguments}.event1.0", "{arguments}.event2.1"]
                    }
                }
            }
        }
    }
});

fluid.defaults("fluid.tests.eventChild3", {
    gradeNames: "fluid.component",
    events: {
        boiledDouble: null
    }
});
```

The same syntax can be used to boil events from the same component, where the references to source events can be
simplified by specifying the events directly without IoC references, as shown in [Example 3](#example-3), since both
source events and boiled event are residing on the same component.
