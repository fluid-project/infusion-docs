---
title: Developer Introduction to the Infusion Framework - Events and Inversion of Control
category: Tutorials
---

All Infusion components support highly flexible event-driven programming. All components have basic [lifecycle
events](../ComponentLifecycle.md) such as creation and destruction, and others may be
[declared](../InfusionEventSystem.md#declaring-an-event-on-a-component),
[fired](../InfusionEventSystem.md#using-events-and-listeners-procedurally) and
[listened](../InfusionEventSystem.md#registering-a-listener-to-an-event) for by the originating component or another
component.

Infusion also makes extensive use of the programming concept of [Inversion of Control](../FrameworkConcepts.md#ioc)
(IoC), a technique for organizing component dependencies and references in a distributed, flexible manner. IoC is used
in many ways throughout Infusion, but an important initial concept to grasp is the use of [IoC
References](../IoCReferences.md) when configuring components, and the concept of `{that}`.

IoC references allow us to refer to other parts of a component object (or another component entirely) in a declarative,
context-specific manner, with `{that}` standing in for the current component configuration.

We can use a listener definition, the `onCreate` lifecycle event and IoC `{that}` to have a component say hello when
it's ready, rather than needing to be manually called:

<div class="infusion-docs-note"><strong>Note:</strong> You can check out the <a
href="https://codepen.io/waharnum/pen/LxbPQZ?editors=1111">Live Example of the code below on CodePen</a></div>

``` javascript
fluid.defaults("fluidTutorial.helloWorld", {
    gradeNames: ["fluid.component"],
    listeners: {
        // Configures the component to call its own 'sayHello' function
        // when it's created
        //
        // On the left side, "onCreate.sayHello":
        // 1) Configures the listener to listen for
        // the onCreate lifecycle event
        // 2) Adds an a namespace of 'sayHello' to
        // allow multiple listeners to be attached to the
        // same event without collision
        //
        // On the right side, this configures the listener
        // to use the sayHello invoker
        "onCreate.sayHello": "{that}.sayHello"
    },
    invokers: {
        sayHello: {
            funcName: "fluidTutorial.helloWorld.consoleHello",
            args: ["Hello, World!"]
        }
    }
});
```

Next: [Model Components](DeveloperIntroductionToInfusionFramework-ModelsAndModelComponents.md)
