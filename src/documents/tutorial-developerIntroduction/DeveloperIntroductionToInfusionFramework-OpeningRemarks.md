---
title: Developer Introduction to the Infusion Framework - Opening Remarks
layout: default
category: Tutorials
---

<!-- _This page is still under construction. An archived version can be found on the
[Developer Introduction to the Infusion Framework](http://wiki.fluidproject.org/display/docs/Developer+Introduction+to+Infusion+Framework)
page of the [Infusion Documentation wiki](http://wiki.fluidproject.org/display/docs/Infusion+Documentation)._ -->

# Introduction

Here we will boil down some of the basic concepts of Infusion for developers who may be interested in it, but uncertain of where to start. There's a lot going on in the framework, but grasping some core ideas helps a great deal in moving forward and learning.

This introduction summarizes some topics (and leaves out many others) that are gone into at length in the longer [Framework Concepts](/infusion/development/FrameworkConcepts.md) document; developers interested in greater detail about the guiding philosophy behind Infusion should consult that document as well.

The introduction assumes you are familiar with the basics of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript) development, and with using a browser's [developer tools](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools). You should also have some experience of the [jQuery](https://jquery.com/) JavaScript library that Infusion is built on top of.

We will build and evolve a ["Hello, World!"](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program) implementation to demonstrate the core concepts, with live examples throughout using the [CodePen](http://codepen.io/) service.

<!-- Todo
## Why Infusion
-->

## Infusion's Core Concepts

* We implement our programs by designing [components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Components.html) that work together to provide the needed functionality. Components are Javascript objects adhering to certain syntax conventions that are created using the `fluid.defaults` function. While components have defaults, any of these defaults can be overriden at the time a specific instance of the component is created.
* Components use [invokers](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Invokers.html) to expose functionality "publicly", provide a consistent API for collaboration with other components or use by other code, and enable polymorphic behaviour when deriving new components from existing ones.
* All components support [events and inversion of control](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-EventsAndInversionOfControl.html); these allow our programs to be built up of loosely coupled parts, and to manage sequencing through components observing and responding to their own events or the events of other components.
* Components that need to track mutable data, state or content should be [model components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ModelsAndModelComponents.html); model components can share and synchronize their data with other model components, fire events when their models are changed, and take other actions to store and respond to state changes.
* Components that need to interact with the web page DOM to display content or interact with users are [view components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ViewsAndViewComponents.html); view components are bound to specific DOM nodes when created and support the DOM Binder convention to avoid tying an implementation too tightly to specific markup.
* Model components can use [model listeners](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ListeningToModelChanges.html) to respond to changes in model state.
* Components can include [subcomponents, and use model relaying](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-SubcomponentsAndModelRelaying.html) to keep state synchronized between different components in larger designs. Many kinds of model relays are possible aside from two-way synchronization.
* As program designs evolve, Infusion's configuration-oriented components make it easier to [restructure a design](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-RestructuringComponents.md) by splitting out functionality into multiple components and wiring them together through IoC references.
* When it becomes clear two components have similar behaviour, Infusion's design helps in [refactoring to share functionality](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-PolymorphicInvokersAndRefactoring.html) through the use of invokers and base grades.
* Infusion has strong supports for [multimodal implementations](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ExtendingDesignsWithExistingComponents.md) that allow programs to adapt themselves to new contexts for input and presentation.

Next: [Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Components.html)
