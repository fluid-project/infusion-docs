---
title: ChangeApplier
layout: default
category: Infusion
---

The ChangeApplier is a core part of the architecture of Fluid Infusion, which coordinates access to
[model state](FrameworkConcepts.md) across a tree of components.
Every [model-bearing component](tutorial-gettingStartedWithInfusion/ModelComponents.md ) has a ChangeApplier automatically
constructed by the framework, which can be used either programmatically or declaratively to trigger
changes in the component's model state or register to be notified of changes. The model state in a
component tree is coordinated globally by the [Model Relay](ModelRelay.md) system as part of the
*[model skeleton](ModelRelay.md#how-model-relay-updates-propagate)* which
consists of those models which are linked together by relay specifications.

As well as being based on Fluid's model-directed thinking, the ChangeApplier is also implemented in
terms of Fluid's [Event System](InfusionEventSystem.md), which you should be familiar with before using the ChangeApplier.

### Thinking behind the ChangeApplier ###

The ChangeApplier is a natural outgrowth of Fluid's focus on (transparent) model-directed programming - see
the Framework Concepts discussion on [Model Objects](FrameworkConcepts.md#model-objects).
"Morally", a model should be "fully transparent" - meaning that it consists of standard POJOs and
is available for inspection by reading, using standard language constructs, at all times. For example,
if model is a JavaScript variable holding the overall model, accessing a field within the model is as
simple as writing a standard Javascript expression `model.field1.subfield2` etc. In practice, we don't
advise that users write JavaScript code that inspects models manually - instead, they
should use the [declarative features](ChangeApplierAPI.md#declarative-style-for-listening-to-changes) supplied by ChangeApplier both to trigger changes and react to them.

This is in contrast to many other frameworks, which generally take one of two routes - either
insisting that a model is composed of some form of more or less "magic" objects - these might be
derived from a base class or interface which is called "Model" or "Storage" - or else allowing "any
old objects" to serve as model material without providing assistance in coordinating updates.
