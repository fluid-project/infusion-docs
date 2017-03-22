---
title: Developer Introduction to the Infusion Framework - Concluding Remarks
layout: default
category: Tutorials
---

We've come to the end of our introduction to the core concepts of the Infusion framework. There are many topics we haven't covered, but with these foundational concepts, we hope you go on to further explore Infusion.

We'll summarize what we've done below, then suggest some next steps.

<div class="infusion-docs-note">If you have feedback about this tutorial, we'd be glad to hear it via our [IRC channels](https://wiki.fluidproject.org/display/fluid/IRC+Channel), [mailing lists](https://wiki.fluidproject.org/display/fluid/Mailing+Lists) or a [GitHub issue on the documentation repo](https://github.com/fluid-project/infusion-docs/issues)</div>

## Summing Up

* We implement our programs by designing [components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Components.html) that work together to provide the needed functionality. Components are Javascript objects adhering to certain syntax conventions that are created using the `fluid.defaults` function. While components have defaults, any of these defaults can be overriden at the time a specific instance of the component is created.
* Components use [invokers](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-Invokers.html) to expose functionality "publicly", provide a consistent API for collaboration with other components or use by other code, and enable function overriding when deriving new components from existing ones.
* All components support [events and inversion of control](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-EventsAndInversionOfControl.html); these allow our programs to be built up of loosely coupled parts, and to manage sequencing through components observing and responding to their own events or the events of other components.
* Components that need to track mutable data, state or content should be [model components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ModelsAndModelComponents.html); model components can share and synchronize their data with other model components, fire events when their models are changed, and take other actions to store and respond to state changes. Model components can use [model listeners](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ListeningToModelChanges.html) to respond to changes in model state.
* Components that need to interact with the web page DOM to display content or interact with users are [view components](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ViewsAndViewComponents.html); view components are bound to specific DOM nodes when created and support the DOM Binder convention to avoid tying an implementation too tightly to specific markup.
* Components can include [subcomponents, and use model relaying](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-SubcomponentsAndModelRelaying.html) to keep state synchronized between different components in larger designs. Many kinds of model relays are possible aside from two-way synchronization.
* As program designs evolve, Infusion's configuration-oriented components make it easier to [restructure a design](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-RestructuringComponents.md) by splitting out functionality into multiple components and wiring them together through IoC references.
* When it becomes clear two components have similar behaviour, Infusion's design helps in [refactoring to share functionality](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-OverridingInvokersAndRefactoring.html) by overriding invokers and creating base grades.
* Infusion has strong supports for [multimodal implementations](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-ExtendingDesignsWithExistingComponents.md) that allow programs to adapt themselves to new contexts for input and presentation.

## Where to Go Next?

* Read about the [framework concepts](/FrameworkConcepts.md) to learn more about Infusion's design goals and overall philosophy.
* Read [further documentation on Infusion](/), including many advanced topics not covered here such as [using Infusion in node.js](/NodeAPI.md), [model transformation](/ModelTransformationAPI.md) and [unit testing](/jqUnit.html).
* [Get involved](https://wiki.fluidproject.org/display/fluid/Get+Involved) in the [Fluid Project](https://wiki.fluidproject.org/pages/viewpage.action?pageId=3900010), the open-source software community that supports, works with and involves the Infusion framework.
* See examples of software built with Infusion at projects like [FLOE](http://floeproject.org/) and the [GPII](http://gpii.net/).
