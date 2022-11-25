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

These API methods are grouped together here since they were developed alongside the need to support the
GPII [Nexus](https://wiki.fluidproject.org/display/fluid/Nexus+API), but they are of interest to others who are building
frameworks or authoring systems layered on Infusion's component tree substrate. They allow for the construction and
destruction of arbitrary components at arbitrary paths in the (single, global) component tree managed by this Infusion
instance.

### fluid.construct(path, options[, instantiator])

Construct a component with the supplied options at the specified path in the component tree. The parent path of the
location must already be a component.

* `path {String|Array of String}` Path where the new component is to be constructed, represented as a string or array
  of segments
* `options {Object}` Top-level options supplied to the component - must at the very least include a field `type` holding
  the component's type. Note that these are expressed in the future-compatible
  [post-FLUID-5750](https://issues.fluidproject.org/browse/FLUID-5750) format with `type` alongside the component's options
  rather than at  a higher nested level as is currently required in local configuration supplied
  as [subcomponents](SubcomponentDeclaration.md).
* `instantiator {Instantiator}` [optional] The instantiator holding the component to be created - if blank, the
  [global instantiator](#fluidglobalinstantiator) will be used
* Returns: `{Component}` The constructed component

### fluid.constructChild(parent, memberName, options)

Constructs a subcomponent as a child of an existing component, via a call to `fluid.construct`. If
a component already exists with the member name `memberName`, it will first be destroyed.

* `parent` {Component} Component for which a child subcomponent is to be constructed
* `memberName` {String} The member name of the resulting component in its parent
* `options` {Object} The top-level options supplied to the component, as for `fluid.construct`
* Returns: `{Component}` The constructed component

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

## Potentia API methods

These methods represent a further scheme for control over the instantiation process as operated by the
"[Nexus API methods](#nexus-api-methods)" described in the previous section, and are new in Infusion 4.0.
As well as allowing for construction and destruction of material at arbitrary paths, these "Potentia methods" allow
for the grouping of constructions and destructions into
"tree transactions" in which instantiating components will be constructed simultaneously and so may be mutually
referent. In addition, the framework rewrite which supports these in Infusion 4.0 and higher (described under
[FLUID-6148](https://issues.fluidproject.org/browse/FLUID-6148) and linked JIRAs) ensures that in the event of any
failure during the transaction, the entire construction will be cleanly backed out, leaving the remaining component
tree in a stable condition as it was before (except for any effects on component models and naturally any other
side-effects unrelated to the component tree).

These are named "potentia" methods because of their operation on a new source of state within Infusion, which has been
named "potentia II" following its presentation in our
[PPIG 2016 paper](https://github.com/amb26/papers/tree/master/ppig-2016a).
The potentia II holds the records of component creation and destruction which have been scheduled for current or future
tree transaction, but not yet acted on. Note that the current framework does not support more than one simultaneous tree
transaction. In further discussion and API methods we will name the potentia II simply as "potentia", since the potentia
I simply represents the contents of standard Infusion component [defaults](ComponentOptionsAndDefaults.md) with which
there is no risk of confusion.

### fluid.beginTreeTransaction([transactionOptions])

Begin a fresh transaction against the global component tree. Any further calls to `fluid.registerPotentia`,
`fluid.construct` or `fluid.destroy` may be contextualised by this transaction, and then committed as a single
unit via `fluid.commitPotentiae` or cancelled via `fluid.cancelTreeTransaction`.

* `transactionOptions {Object}` [optional] A set of options configuring this tree transaction. This may include fields
  * `breakAt {String}` - one of the values:
    * `shells`: signifying that this transaction should pause as soon as all component shells are constructed (see
     [FLUID-4925](https://issues.fluidproject.org/browse/FLUID-4925))
    * `observation`: signifying that this transaction should pause once the observation process of all components is
       concluded - that is, that all component options, members and invokers are evaluated.
* Returns: `{String}` The id of the freshly allocated tree transaction.

### fluid.registerPotentia(potentia, transactionId)

Signature as for `fluid.construct`. Registers the intention of constructing or destroying a component at a particular
path. The action will occur once the transaction is committed.

* `potentia {Potentia}` - A record designating the kind of change to occur. Fields:
  * `type {String}` Either `"create"` or `"destroy"`.
  * `path {String|Array of String}` Path where the component is to be constructed or destroyed, represented as a string
      or array of segments
  * `componentDepth {Number}` The depth of nesting of this record from the originally created component - defaults to 0
  * `records: {Array of Object}` A component's construction record, as they would currently appear in a component's
    "options.components.x" record
* `transactionId {String}` [optional] A transaction id in which to enlist this registration. If this is omitted, the
    current transaction will be used, if there is one - otherwise, a fresh transaction will be allocated
* Returns: `{String}` `transactionId` if it was supplied, or else any current transaction, or a freshly allocated one
    if there was none

### fluid.commitPotentiae(transactionId, isCancel)

Commit all potentiae that have been enqueued through calls to `fluid.registerPotentia` for the supplied transaction,
as well as any further potentiae which become enqueued through construction of these, potentially in multiple phases.

* `transactionId {String}` The tree transaction to be committed
* `isCancel {Boolean}`[optional] `true` if this commit action is a result of cancelling a previous transaction. In
    this case the `pendingPotentia` element of the transaction will have been derived from the `restoreRecords` of that
    transaction.
* Returns: `{Shadow|Undefined}` The shadow record for the first component to be constructed during the transaction, if
    any.

### fluid.cancelTreeTransaction(transactionId)

* Cancel the transaction with the supplied transaction id. This cancellation will undo any actions journalled in
    the transaction's `restoreRecords` by a further call to `fluid.commitPotentiae`.
* `transactionId {String}` The id of the transaction to be cancelled

## Instantiation workflow within a transaction

After the Infusion 4.0 rewrite, the instantiation of Infusion component trees is scheduled in a different way to
before. The older framework simply started from the (necessarily single) root component designated by the construction
call in progress, and cascaded in a data-driven way, following IoC references through its options and then any
designated subcomponents.
In the 4.0 framework, this instantiation proceeds in a more carefully scheduled way. The first part of the process
simply instantiates **_component shells_** for all components which participate in the transaction - that is,
the actual component object references, their `typeName`, `gradeNames` and `distributeOptions` fields, and the minimum
of their options and other material needed in order to decode these. These shells are constructed and wired together
in the correct geometry before any other instantiation proceeds. After having assembled the shells, the framework
then passes over them repeatedly in successive workflow stages --- where each component participating in the
transaction is brought to one workflow state before any one moves on to the next.

This workflow enables some further features implemented alongside the transactional potentia instantiation scheme:

### Workflow break hints:

A "breakpoint hint" may be supplied as part of the `options` member of the
[fluid.beginTreeTransaction](#fluidbegintreetransactiontransactionoptions) method. This specifies that the workflow
process should pause when it reaches a particular point. The two currently supported break points,
`shells` and `observation` are described in the API documentation for
[fluid.beginTreeTransaction](#fluidbegintreetransactiontransactionoptions). This kind of hint is imagined useful for
those implementing authoring supports for Infusion application, and allows for example for a cheap process which can
validate some aspects of an Infusion application in an interactive way --- for example, whether given IoC references
will resolve, whether all referenced grades can be found, or whether particular options distributions will hit a target.

### Workflow functions

The ability for any grade to contribute further workflow actions which the framework will execute at a configurable
part of its sequence when instantiating groups of components in which include the grade appears. These are described
in the next section.

## Workflow functions

An important new capability in the post-FLUID-6148 framework is the appearance of **_workflow functions_** which are
used to organise the activity of both existing grades such as `fluid.modelComponent` and `fluid.rendererComponent` but
also any further grades which the author wishes to enroll into this system. Note that this is an advanced capability
and is not likely to be used by authors who are not trying to implement framework-like capabilities.

The important abilities of workflow functions are to intercept the construction process across an entire tree of
instantiating components, and to contribute their own workflow at a configurable point in this process. This scheme
is expressed using component options registered in the grade's defaults under the newly recognised top-level key
`workflows`. Participating grades list the names of global free functions operating their workflow in namespaced
blocks, and control their position in the overall workflow sequence by using a `priority` field with the same syntax
and semantics as seen in other framework areas controlled by [Priorities](Priorities.md).

### Configuring a workflow function

The clearest way of showing how to configure a workflow function is to show the examples from the core framework. The relevant
definitions from the base grade `fluid.component` look as follows:

```javascript
fluid.defaults("fluid.component", {
// ...
    workflows: {
        local: {
            concludeComponentObservation: {
                funcName: "fluid.concludeComponentObservation",
                priority: "first"
            },
            concludeComponentInit: {
                funcName: "fluid.concludeComponentInit",
                priority: "last"
            }
        }
    }
});
```

This shows the configuration of two [local workflows](#local-workflows), `fluid.concludeComponentObservation` which
will execute first, and `fluid.concludeComponentInit` which will execute last. The former completes the process of
evaluating all component options, members, invokers and other top-level masterial, and the latter marks the component
as fully constructed and fires its `onCreate` event.

The definitions from `fluid.modelComponent` look as follows:

```javascript
fluid.defaults("fluid.modelComponent", {
    gradeNames: ["fluid.component"],

    workflows: {
        global: {
            resolveModelSkeleton: {
                funcName: "fluid.resolveModelSkeleton"
            }
        },
        local: {
            notifyInitModel: {
                funcName: "fluid.notifyInitModel",
                priority: "before:concludeComponentInit"
            }
        }
    }
// ...
});
```

This shows the registration of one global workflow, `fluid.resolveModelSkeleton` which since it is the only one in the core
framework has no priority annotation. It also shows the registration of a local workflow, `fluid.notifyInitModel` which
is responsible for firing any [model listeners](ChangeApplierAPI.md#declarative-style-for-listening-to-changes) which need
to be notified of initial model values as part of the [initial transaction](ModelRelay.md#the-initial-transaction). The
[priority](Priorities.md) field attached here indicates that this should happen (if no further definition intervenes) immediately
before the `concludeComponentInit` action which fires `onCreate`.

### Global workflows

There are two kinds of workflow functions which may be contributed, global and local workflows. Global workflows represent
particularly ambitious functionality which requires oversight of the entire instantiating tree, and all global workflows
execute before any local workflows. The framework currently includes just one global workflow, the one which identifies
and resolves the values of all model components throughout the instantiating tree's `model skeleton`, but further ones
will be implemented as part of the upcoming framework's markup renderer for Infusion 5.0 as described in
[FLUID-4260](https://issues.fluidproject.org/browse/FLUID-4260).

A global workflow function receives the signature:

`<global.workflow.function.name>(shadows)` where

* `shadows {Array of Shadow}` An array of _all_ component shadows participating in this transaction, sorted in order
    from the root of the component
    tree down to the leaves. Note that this includes all such components, and the implementor will need to make an
    explicit [fluid.componentHasGrade](CoreAPI.html#fluidcomponenthasgradecomponent-gradename) check in order to
    find the components of interest to it. A shadow
    record includes various book-keeping fields of interest to the framework, but of primary interest is the member
  * `that {Component}` The currently instantiating component. Much of the component's material at this point will be
    unevaluated. Any material which is required by the component must have its observation triggered via
    `fluid.getForComponent`.

### Local workflows

Local workflows execute once all global workflows have been run on the tree, and receive each component in the tree
separately. These implement less ambitious, per-component functionality. Note that these receive the components in
the **_reverse_** order to global workflow functions - that is, they receive components at the leaves of the tree
first, and root components afterwards. This is by analogy with the standard object-oriented semantic that more nested
components complete their construction before their parents.

A local workflow function receives the signature:

`<local.workflow.function.name>(shadow)` where

* `shadow {Shadow}` One shadow of a component participating in this transaction. These will be presented starting from
    the leaves of the tree
    progressing up towards its roots. Note that as with global workflow functions, _all_ shadows in the tree, and an
    explicit [fluid.componentHasGrade](CoreAPI.html#fluidcomponenthasgradecomponent-gradename) check will again be
    required. As for global workflows, the shadow's member `that` includes a partially evaluated component that may
    require calls to `fluid.getForComponent` in order to force observation of some of its material.
