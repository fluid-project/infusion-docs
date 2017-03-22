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

The list below summarizes each section of the tutorial and the core concept covered in it. Each section introduces a new concept and connects it with previous ones.

1. [Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Components.html) for organizing programs out of related pieces of data, functionality and interaction.

2. [Invokers](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Invokers.html) to allow components to provide a consistent structure for collaboration with other components and enable overriding function behavior.

3. [Events and Inversion of Control](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-EventsAndInversionOfControl.html) to allow our programs to be built out of loosely coupled parts, and to manage sequencing and lifecycle throughout that loosely coupled structure.

4. [Model Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ModelsAndModelComponents.html) that can not only track mutable data, state or content, but share and synchronize their data with other model components and fire events when their state changes. [Model Listeners](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ListeningToModelChanges.html) are used to respond to changes in model state.

5. [View Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ViewsAndViewComponents.html) for building connections between web elements and Infusion components.

6. [Subcomponents and Model Relaying](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-SubcomponentsAndModelRelaying.html) to organize larger program designs and keep state synchronized between different pieces of a design.

7. [Restructuring Designs](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-RestructuringComponents.md) more easily because components are defined as blocks of configuration rather than code.

8. [Refactoring Shared Functionality](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-OverridingInvokersAndRefactoring.html) in designs through the use of invokers and base component grades.

9. [Extending Designs](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ExtendingDesignsWithExistingComponents.md) to allow programs to adapt themselves to new contexts for input and presentation.

Next: [Components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Components.html)
