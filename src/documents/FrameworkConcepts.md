---
title: Framework Concepts
layout: default
category: Infusion
---

The Fluid Infusion Framework is built on a number of important concepts. This page outlines some of the fundamental design goals of Infusion, providing terminology to help clarify these goals. Descriptions elsewhere in the documentation may also make use of particular terms in certain ways, and this page collects together some of the conceptual and background knowledge you might need to help you interpret these descriptions.

## Model Objects

The greatest goal of the framework is *transparency* &#8212; data is pure data, and markup is pure markup. Infusion doesn't impose any inheritance hierarchies or strict contracts on how you structure your data model.

In Infusion, a tree of objects has the status of being a model if it can successfully be copied by the framework utility function `fluid.copy()`. 
This function duplicates an object tree by cloning it recursively, except for immutable values such as strings, numbers, functions, etc. which are copied across. 
If everything that is important to you about the object has been successfully cloned, then it is a suitable model object.

We recommend that all objects stored in the `model` area of a component conform to an even stricter definition - that they are equivalent to their form serialised as JSON. This implies that they
consist of only the following types: `Array`, `Object`, `String`, `Number` and `Boolean`. In addition, the following values for `Number` should not be used - `Infinity`, `-Infinity` and `NaN`. The value
`undefined` also can not be safely stored within a model.

## EL Paths

In some parts of the framework, we refer to "EL expressions". This is a somewhat historical phrase that perhaps sounds like it says more than it is trying to. 
All we mean by EL expressions are dot-separated paths built from names &#8212; for example if you had defined an object `zar` with a member `boo` which has a member `baz`, 
you could access the nested JavaScript property by writing the expression `zar.boo.baz`. 
If it were held in a string value, this would become an EL expression &#8212; that is, the string `"zar.boo.baz"` is an EL expression which designates the same piece of data we just referenced. 
The framework includes machinery for interpreting such expressions held in strings rather than at the JavaScript language level. 
This is useful because it abstracts references to pieces of data from the actual data itself &#8212; and allows these references to be stored in documents separately from a running program. 
It is possible to replace one object tree with another, but still to maintain a stable reference to the same subproperty `baz`, whoever it happens to be today. 
This is particularly important in web applications where data claiming to be "your data" can suddenly arrive from anywhere (a JSON feed, some persistence, 
a particularly aggressive version management system, etc). However it got here, you know it is your data because it is at the right path.

EL expressions within Infusion can be evaluated by the framework utilities `fluid.get()` and `fluid.set()`, and also global functions can be similarly 
invoked by `fluid.invokeGlobalFunction()`. EL path expressions of this sort are fundamental to Infusion's model-oriented thinking, and the operation of the Infusion [ChangeApplier](ChangeApplier.md).

## Events

[Events](InfusionEventSystem.md) have a very plain implementation in Infusion &#8212; an event here is really just another kind of function call. Events in Infusion and aren't specific to the DOM.  
Any function signature can be an event signature, any function can be an event listener, and an event's `fire` method is a plain function handle that can be handed around just like any other function. 
There is no special kind of "Event Object" that is fired to event listeners, and anyone can easily define a new event by adding an entry in the `events` section of the options of their component. 
Events are created automatically by the framework as part of the initialisation of every [Component](tutorial-gettingStartedWithInfusion/BasicComponentCreation-Components.md). No code required.

Infusion Events are so close to the language that they are a suitable replacement/implementation for features found in other frameworks, such as the "delegates" found in Mac OS X's Cocoa environment, 
or in Microsoft's C#. Since event signatures are completely free (free as in "like a bird", not like either beer or speech), any function can potentially actually be an event listener. It is all a matter of perspective.

## MVC

Fluid Infusion is not formally a Model-View-Controller framework, although it embodies the separation of concerns that MVC implies. 
Both models and views are first-class constructs in Infusion, and are both represented by built-in framework [Grades](ComponentGrades.md). 
The weak link in MVC is the controller layer. Controllers are typically conceived of as the "glue" of an application: all the code that connects models and views together. 
Controllers are often the most brittle and least reusable part of an architecture. There's no controller layer in Infusion; Infusion takes the approach that the glue should be taken care of for you. 
Infusion applications consist, as much as possible, of pure view and model code. Even event binding itself can be performed declaratively, eliminating yet another source of controller code.

Infusion has a clear concept of a view: the [ViewComponent](tutorial-gettingStartedWithInfusion/ViewComponents.md). As mentioned above, models are central to the framework as well, 
represented by the [ModelComponent](tutorial-gettingStartedWithInfusion/ModelComponents.md) grade - every ViewComponent is automatically a ModelComponent also. 
The overall design of Fluid is aimed to reduce to zero the code at the controller level of an application. Instead, Infusion emphasizes declarative configuration, 
the powerful and flexible [Events](InfusionEventSystem.md) system, and the automated approach to data binding enabled by the [EL](#el-paths) system and the [ChangeApplier](ChangeApplier.md).

## Declarative Configuration

Less code is better. If you can represent aspects of your application as data rather than as imperative logic, there is a clear benefit to application design: data is transparent, 
and is easier to operate on and transform with algorithms. It's also easier to understand by both code in the application and by humans reading the design. 
In order to understand a data-oriented component, one merely needs to understand the layout of the data it works with, rather than looking at its implementation or understanding all the details of the contract behind its API documentation.

Standard conventions also help simplify your application architecture. Wherever possible, Infusion applies a standard layout to [commonly appearing options](ComponentConfigurationOptions.md) for a component. 
For example, there is a common convention for declaring a component's events, selectors which bind to markup for both styling as well as function, and relationship to its model. 
Each component is also supplied with a set of defaults which also take the form of declaratively-specified model data.

The Fluid [Renderer](Renderer.md) takes the concept of declarative configuration to a level not achieved with other frameworks. 
The renderer reduces the entire binding and controller function of an application to a declarative form, a [component tree](RendererComponentTrees.md). 
In this form, the user interface is extremely amenable to inspection, interpretation and re-processing.

Historically, the desire to be able to treat logic as data has strong roots, for example in the [LISP](http://en.wikipedia.org/wiki/Lisp_programming_language) community. 
However, where all application code is on a common footing, designs become tangled and hard to interpret. By providing domain-specific forms for carefully selected parts of an application's functionality, 
typically at the Controller level, the complexity of code operating on this data can be reduced and transparency increased. 
It is a productive middle ground, between all application code becoming a candidate to be data (as in LISP), and none of it (as in Java).

## IoC

IoC stands for [*Inversion of Control*](http://en.wikipedia.org/wiki/Inversion_of_control), the traditional name given to this programming concept by its early promoters, 
[Ralph Johnson](http://www.laputan.org/drc/drc.html) and [Martin Fowler](http://martinfowler.com/bliki/InversionOfControl.html). 
IoC is the technique that naturally results when trying to make sure that dependencies in a codebase are correctly organised. 
The goal is to eliminate cycles of knowledge and points of dependency weakness within an application architecture.

IoC is a crucial mechanism of avoiding tight binding between framework components in Infusion. 
The subcomponents for a top-level component can be expressed in a [declarative structure](#declarative-configuration), where a tight binding is avoided between component and subcomponent implementations. 
This enables a more flexible design, including the ability to swap out the implementation of one subcomponent for another. 
We accomplish this loose-coupling through the use of [EL](#el-paths) to hold the name of the subcomponent to be instantiated, rather than requiring the user to instantiate the subcomponent themselves directly in code.

This "don't call us, we'll call you" approach to instantiation is one of the cornerstones of IoC programming. 
Instantiation is performed by the framework after it has performed all dependent lookups, 
rather than being in the hands of users whereby they may get themselves into dependency tangles and requiring other components to have too much knowledge of the other parts of the system.

This somewhat vague-seeming description is an attempt to codify a way of thinking that can really only be internalised by repeated (and sometimes painful!) experience. 
Those unfamiliar with the benefits should read around some of the links above, and also experiment with the relationships between some framework components and their subcomponents.

## Markup agnosticism

Markup agnosticism is ubiquitous throughout Infusion. We don't bake in assumptions about the nature and structure of a user interface's markup, recognizing that components need to be customized and adapted for different context.

Markup agnosticism reflects the same basic stance that leads to IoC, [Declarative Configuration](#declarative-configuration) and Model Transparency: effective organisation of dependencies. 
In practice, users of a framework want to be able to use their own markup and customize the look and feel of existing components. 
Virtually every other client-side framework ships their widgets as "black boxes:" markup is baked into code and is invisible to the user. 
This makes it very difficult to customize the widget without cracking open the code and forking it.

The framework [DOM Binder](DOMBinder.md), a universal service which is supplied to every Fluid Component, is the primary vehicle for delivering markup agnosticism. 
The DOM Binder allows users to supply their own jQuery selectors to configure a component, allowing them to change the markup and inform the component of how to find important things in the DOM. 
This entirely removes the hard-baked assumptions about markup within a component, allowing the user to control how it looks and is structured.

Infusion's other tool for DOM agnosticism is the [Fluid Renderer](Renderer.md). By abstracting the entire process of dynamic markup generation behind a purely data-oriented component tree, 
the field is left clear for 100% control of markup down to the tag level by component users. 
An important exhibition of this control is in the [Pager](to-do/Pager.md) component. 
Other client-side table controls tend to impose a model where one logical table row corresponds to a `<tr>` tag, and one table cell corresponds to a `<td>` tag. 
The Infusion Pager, on the other hand, breaks down this association and allows a flexible association of markup to data. 
The Pager addresses the universal case of "regularly repeating markup," so that the association to `<tr>` and `<td>` may be one to many, many to one. 
Entirely different tags can even be chosen to render the "table." All layout could, for example, be performed in CSS.
