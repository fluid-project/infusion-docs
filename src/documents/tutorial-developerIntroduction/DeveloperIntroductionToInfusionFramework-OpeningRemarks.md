---
title: Developer Introduction to the Infusion Framework - Opening Remarks
category: Tutorials
---
Here we will boil down some of the basic concepts of Infusion for developers who may be interested in it, but uncertain
of where to start. There's a lot going on in the framework, but grasping some core ideas helps a great deal in moving
forward and learning.

This introduction summarizes some topics (and leaves out many others) that are gone into at length in the [full
framework documentation](../), and is focused on developers trying to orient themselves to the framework for the first
time.

The introduction assumes:

* You are familiar with the basics of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript).
* You know how to use a browser's [developer tools](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_are_browser_developer_tools)
  to access a console.
* Ideally, you should also have some experience with the [jQuery](https://jquery.com/) JavaScript library that Infusion
  is built atop.

We will build and evolve a ["Hello, World!"](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program) implementation
to demonstrate the core concepts, with live examples throughout using the [CodePen](https://codepen.io/) service.

## Infusion's Core Concepts

The list below summarizes each section of the tutorial and the core concept covered in it. Each section introduces a new
concept and connects it with previous ones.

1. [Components](DeveloperIntroductionToInfusionFramework-Components.md) for organizing programs out of related pieces of
   data, functionality and interaction.
2. [Invokers](DeveloperIntroductionToInfusionFramework-Invokers.md) to allow components to provide a consistent
   structure for collaboration with other components and enable overriding function behavior.
3. [Events and Inversion of Control](DeveloperIntroductionToInfusionFramework-EventsAndInversionOfControl.md) to allow
   our programs to be built out of loosely coupled parts, and to manage sequencing and lifecycle throughout that loosely
   coupled structure.
4. [Model Components](DeveloperIntroductionToInfusionFramework-ModelsAndModelComponents.md) that can track mutable data,
   state or content, and coordinate and synchronize their data with other model components and fire events when their
   state changes. [Model Listeners](DeveloperIntroductionToInfusionFramework-ModelsAndModelComponents.md#listening-to-model-changes)
   are used to respond to changes in model state.
5. [View Components](DeveloperIntroductionToInfusionFramework-ViewsAndViewComponents.md) for building connections
   between web elements and Infusion components.
6. [Subcomponents and Model Relaying](DeveloperIntroductionToInfusionFramework-SubcomponentsAndModelRelaying.md) to
   organize larger program designs and keep state synchronized between different pieces of a design.
7. [Restructuring Designs](DeveloperIntroductionToInfusionFramework-RestructuringComponents.md) more easily because
   components are defined as blocks of configuration rather than code.
8. [Refactoring Shared Functionality](DeveloperIntroductionToInfusionFramework-OverridingInvokersAndRefactoring.md) in
   designs through the use of invokers and base component grades.
9. [Extending Designs](DeveloperIntroductionToInfusionFramework-ExtendingDesignsWithExistingComponents.md) to allow
   programs to adapt themselves to new contexts for input and presentation.
10. [Transforming Model Relays](DeveloperIntroductionToInfusionFramework-TransformingModelRelays.md) to express more
   complex coordination of data between different parts of a program.

Next: [Components](DeveloperIntroductionToInfusionFramework-Components.md)
