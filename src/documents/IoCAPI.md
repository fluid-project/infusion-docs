---
title: Infusion IoC API
category: Infusion
---

Whilst Infusion's [IoC](HowToUseInfusionIoC.md) is primarily a declarative system, operated by a declarative dialect of
JSON configuration, there are a few language-level APIs which are useful in dealing with the system. Some of these are
externalisable in that there is a reasonable semantic for operating them from outside the JavaScript VM housing the
component tree - these special APIs are grouped under the heading [Nexus API methods](#nexus-api-methods), named after
the [Nexus component](https://wiki.gpii.net/w/Nexus_API) that will shortly be built around them.

## IoC utility methods

### fluid.pathForComponent(component)

* `component: {Component}` The component whose global path is required
* Returns: `{Array of String}` The component's global path, as an array of path segments

Each instantiated component in the Infusion system has a stable base path in the system's global [component
tree](Contexts.md). Records about the component are held in Infusion's [instantiator](#fluidglobalinstantiator) where
the path and numerous other details can be looked up. This utility method accepts a currently instantiated (not
[destroyed](CoreAPI.md#fluidisdestroyedcomponent)) component and returns its path as a set of parsed array segments.
This information can be very useful for making calculations about the _geometry_ of component trees - that is, which
components are descended from which others and which are siblings, etc.

### fluid.componentForPath(path)

Retrieves a component by global path.

* `path {String|Array of String}` The global path of the component to look up
* Returns: The component at the specified path, or undefined if none is found

### fluid.queryIoCSelector(root, selector[, flat])

Query for all components matching a selector in a particular tree.

* `root {Component}` The root component at which to start the search. A reasonable choice for this can be
  [`fluid.rootComponent`](#fluidrootcomponent) although such global searches can be very slow. A more reasonable choice
  will be some particular component in the tree whose descendents are of interest.
* `selector {String}` An [IoCSS selector](IoCSS.md), in form of a string. Note that since selectors supplied to this
  function implicitly match downwards, they need not contain the "head context" followed by whitespace required in the
  distributeOptions form. E.g. simply `fluid.viewComponent` will match all viewComponents below the root.
* `flat {Boolean}` [optional] `true` if the search should just be performed at top level of the component tree. Note
  that with `flat=true` this search will scan every component in the tree and may well be very slow.

### fluid.makeGradeLinkage(linkageName, inputNames, outputNames)

Registers a grade into the system, and create a global instance of it, which ensures that any components where the
grades listed in `inputNames` co-occur (that is, occur attached to the same component) will also be supplied the grades
listed in `outputNames`. This is a shorthand for an effect that the user can achieve for themselves by constructing an
instance of a component holding a [`distributeOptions`](IoCSS.md) block globally targeting the co-occurring grades.

* `linkageName {String}` The grade name which will hold the required options distribution. The component instance's
  global name will be derived from this grade name via [`fluid.typeNameToMemberName`](#fluidtypenametomembernametypename).
* `inputNames {Array of String}` The list of grade names which must co-occur in a single component in order to trigger
  the addition of `outputNames`.
* `outputNames {String or Array of String}` The grade names which will be added to any component in which the
  `inputNames` co-occur.

### fluid.expand(material, that)

[Expands](ExpansionOfComponentOptions.md) some options material in the context of a particular component - any [IoC
References](IoCReferences.md) and expanders held at any depth in the material will be expanded to hold their resolved
contents. The source `material` will not be modified.

* `material {Object}` The configuration material to be expanded
* `that {Component}` The component in whose [context](Contexts.md) the material is to be expanded
* Returns: `{Object}` An expanded version of the input `material`.

### fluid.getForComponent(component, path)

This is a fairly interesting method. During the instantiation of an IoC component tree, the framework's "focus of
attention" moves around the tree in a data-driven way. If an [IoC reference](IoCReferences.md) is seen to a particular
path, this will direct attention to instantiate the material referenced by the path. `fluid.getForComponent` is the
method used internally by the framework in order to ensure that any referenced material has actually been instantiated
before the results from any IoC reference are filled in in the [expanded](ExpansionOfComponentOptions.md) options
material. You can use this method too, in order to make sure that any member of a component has been instantiated before
you look at it. This should not normally be necessary - and the use of this API only makes sense during a construction
"fit" - during the "semi-static period", you can assume that all members of all visible components are concrete.

This is an analogue of the API [`fluid.get`](CoreAPI.md#fluidgetmodel-path) for use during the "ginger construction
process".

* `component {Component}` The component whose resolved member is required
* `path {String|Array of String}` The path within the component which is to be resolved
* Returns: `{Any}` The fully observed value held at `path` of component `component`.

### fluid.resolveContext (context, that)

Another method for enthusiasts. Given a particular IoC [Context](Contexts.md), determine which (if any) component in the
tree it refers to, from the point of view of component `that`.

* `context {String}` The context to be resolved. For example, in an [IoC reference](IoCReferences.md) of the form
  `"{myContext}.myPath1.myPath2"`, the context is `myContext`.
* `that {Component}` The component from whose point of view the context is to be resolved
* Returns: `{Component|None}` Returns the component to which the context refers, or `undefined` if the reference cannot
  be resolved.

### fluid.parseContextReference(reference) {

Parse an [IoC reference](IoCReferences.md) of the form `"{myContext}.myPath1.myPath2"` into an object form. In this
case, for example, the output would be

```json5
{
    context: "myContext",
    path: "myPath1.myPath2"
}
```

From here it is a simple matter to resolve them in a DIY fashion with reference to the APIs `fluid.resolveContext` and
`fluid.getForComponent` or `fluid.get`.

* `reference {String}` An [IoC reference](IoCReferences.md) expressed as a String
* Returns: `{Object}` The parsed form of the reference, with the following fields:
  * `context {String}` The context portion of the IoC reference
  * `path {String}` The path portion of the IoC reference

### fluid.globalInstantiator

This path holds the global **instantiator** which holds all the records for Infusion's IoC system. Whilst any methods on
this object should not be called by applications, there are many entries in here that can aid debugging, especially the
members `instantiator.pathToComponent` which holds a mapping for every instantiated component from its global path in
the component tree, and `instantiator.idToShadow` which holds a mapping from every component's `id` to its **shadow
record** which holds many useful pieces of bookkeeping, including the `mergeOptions` structure which can be used to
inspect the details of the options merging process resulting in the component's final options.

### fluid.rootComponent

Holds the global root component for the global instantiator's component tree.

## Nexus API methods

### fluid.construct(path, options[, instantiator])

Construct a component with the supplied options at the specified path in the component tree. The parent path of the
location must already be a component.

* `path {String|Array of String}` Path where the new component is to be constructed, represented as a string or array of
  segments
* `options {Object}` Top-level options supplied to the component - must at the very least include a field `type` holding
  the component's type. Note that these are expressed in the future-compatible
  [post-FLUID-5750](https://issues.fluidproject.org/browse/FLUID-5750) format with `type` alongside the component's
  options rather than at a higher nested level as is currently required in local configuration supplied as
  [subcomponents](SubcomponentDeclaration.md).
* `instantiator {Instantiator}` [optional] The instantiator holding the component to be created - if blank, the
  [global instantiator](#fluidglobalinstantiator) will be used

### fluid.destroy(path[, instantiator])

Destroys a component held at the specified path. The parent path must represent a component, although the component
itself may be nonexistent.

* `path {String|Array of String}` Path where the component is to be destroyed, represented as a string or array of
  segments
* `instantiator {Instantiator}` [optional] The instantiator holding the component to be destroyed - if blank, the
  [global instantiator](#fluidglobalinstantiator) will be used

### fluid.typeNameToMemberName(typeName)

This method is included in the Nexus API since the effects of the [ContextAwareness](ContextAwareness.md) API
`fluid.constructSingle` need to be replicable from outside the process. This API assists users to compute the name at
which the IoC system will be expecting an "adaptation" component with a particular `typeName` to be instantiated as a
member of the global [root component](#fluidrootcomponent). Note that the period character `.` is not supported within a
component member name.

* `typeName {String}` The "principal type name" of the component which should be used to compute its global name for the
  purposes of a `fluid.constructSingle` adaptation honoured through `fluid.construct`.
* Returns: `{String}` The required member name of the global root component
