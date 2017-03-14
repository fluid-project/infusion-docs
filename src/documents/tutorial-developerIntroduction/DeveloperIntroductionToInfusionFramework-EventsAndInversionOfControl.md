---
title: Developer Introduction to the Infusion Framework - Events and Inversion of Control
layout: default
category: Tutorials
---

All Infusion components support highly flexible event-driven programming. All components have basic [lifecycle events](/infusion/development/ComponentLifecycle.md) such as creation and destruction, and others may be [declared](/infusion/development/InfusionEventSystem.md#declaring-an-event-on-a-component), [fired](/infusion/development/InfusionEventSystem.md#using-events-and-listeners-procedurally) and [listened](/infusion/development/InfusionEventSystem.md#registering-a-listener-to-an-event) for by the originating component or another component.

Infusion also makes extensive use of the programming concept of [Inversion of Control](/infusion/development/FrameworkConcepts.md#ioc) (IoC), a technique for organizing component dependencies and references in a distributed, flexible manner. IoC is used in many ways throughout Infusion, but an important initial concept to grasp is the use of [IoC References](/infusion/development/IoCReferences.md) when configuring components, and the concept of `{that}`.

IoC references allow us to refer to other parts of a component object (or another component entirely) in a declarative, context-specific manner, with `{that}` standing in for the current component configuration.

We can use a listener definition, the `onCreate` lifecycle event and IoC `{that}` to have a component say hello when it's ready, rather than needing to be manually called:

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
