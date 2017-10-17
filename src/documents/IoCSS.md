---
title: IoCSS
layout: default
category: Infusion
---

The Infusion Inversion of Control (IoC) system includes a simple method for distributing options from any components to any others in the component tree. This system uses
a special block named `distributeOptions` which is supported in the options of every Infusion component. The key addressing scheme needed to make this system work &#8212; the
means for determining where the target of the distribution is &#8212; is dubbed "IoCSS" because it uses a syntax and idiom very similar to that used in [CSS selectors](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#Selector).

## `distributeOptions` and IoCSS: Downward-matching CSS-like context selectors for options forwarding ##

The `distributeOptions` option is a top-level block supported by every Infusion component. It specifies how options should be distributed to components elsewhere in the tree. A typical, conservative
usage would have a component distribute only *downwards* to its own subcomponents, but it is also possible to use the considerable power of `distributeOptions` to distribute to *any component
anywhere* in the (global) component tree - naturally such power should be used with extreme discretion since it could very easily reduce a design to chaos. However, in many situations, for example
when writing powerful authoring tools, this kind of power is completely indispensible.

## Background for `distributeOptions` ##

As component trees become larger, it will often happen that a high-level component will need to specify options for a component further down the component tree. Without `distributeOptions`, component configuration can become very, what we might call, "pointy":

```javascript
// without developer's use of IoCSS, user writes

fluid.uiOptions(".my-uio-container", {
    components: {
        templateLoader: {
            options: {
                templatePrefix: "../../myTemplates"
            }
        }
    }
});
```

The example above shows a simplified version of a situation with Infusion's "[UI Options](UserInterfaceOptionsAPI.md)" component. In practice, the user of the component would have to write an even more deeply nested piece of configuration than this, if the developer had not made use of the `distributeOptions` directive in the component's options block, together with the use of "IoCSS" expressions to distribute the user's options to the right place in the component tree, as shown in the following example:

```javascript
// developer writes:

fluid.defaults("fluid.uiOptions", {
    distributeOptions: {
        source: "{that}.options.templatePrefix",
        target: "{that templateLoader}.options.templatePrefix"
    }
});

// user writes:

fluid.uiOptions(".my-uio-container", {
    templatePrefix: "../../myTemplates"
});
```

In the `distributeOptions` block above, the context `{that templateLoader}` is an IoCSS expression which designates one or more of the child components of UI Options that are to receive the user's option. The syntax and meaning of these expressions is defined below.

As well as converting the exposed options structure of a component into a more compact form, `distributeOptions` is also a powerful tool for maintaining API stability for a component or family of components.
Since the binding of IoCSS selectors such as `that templateLoader` onto child components is flexible, the component tree could be refactored in quite an aggressive way without requiring changes in either the user's configuration, or even the `distributeOptions` block itself.
If the refactoring was even more thorough (involving wholesale removal of the target component, or a change in its important grades), the developer could still maintain stability of the external user API just by changing the `distributeOptions` block.

In terms of a standard discussion on [Design Patterns](https://en.wikipedia.org/wiki/Software_design_pattern "Design Patterns"), this use of `distributeOptions` could be seen as an automated and declarative scheme for achieving the ends of the [Facade Design Pattern](https://en.wikipedia.org/wiki/Facade_pattern "Facade Design Pattern"), without the need for either user or developer code.

However, facade formation isn't the only possible function of an options distribution. They are also sufficiently powerful to encompass most uses of the so-called [Aspect-oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming) (AOP) by the
use of the target root context `/` to match (and "advise", in AOP terminology) all components in a design matching a particular specification. Unlike traditional AOP techniques, however, these options distributions do not put ultimate and final power in the hands of the wielder - since the component holding
the distribution itself can be either advised itself, or destroyed completely - thus withdrawing the "advice" from the system.

## distributeOptions format ##

The `distributeOptions` option is a top-level block supported by every Infusion component, holding an array of records, hash of records, or single record containing the following properties:

| Name | Description |
|------|-------------|
|`target`|(Required) An [IoC expression](IoCReferences.md) describing the location in the component tree where the options are to be set. The "context" part of this expression will usually consist of an **IoCSS selector** (see below for format). However, it may also in specialised cases consist of a standard "upwards" IoC context expression, indicating that options are to be distributed to a parent component (this is only meaningful in the case the parent has not finished instantiating).|
|`record`|(Mutually exclusive with `source`) A record of options to set at the target. This will be interpreted literally - however it will be [expanded](ExpansionOfComponentOptions.md) according to standard options expansion rules. General configuration will be expanded in the context of the component holding `distributeOptions` - however, configuration for listeners and invokers will be expanded at the target component.|
|`source`|(Mutually exclusive with `record`) An [IoC expression](IoCReferences.md) into the options structure of the source component, referencing what to copy to the target.|
|&nbsp;&nbsp;`removeSource`|(Only possible if `source` is used) true/false: If true, the `source` options block is removed from its original site in the options structure when it is forwarded to the `target`.|
|&nbsp;&nbsp;`exclusions`|(Only possible if `source` is used) A list of EL paths into the `source` material which should not be forwarded. Whether or not `removeSource` is used, these will be retained in their original position in the source component's options.|
|`priority`|(Optional) a [Priority specification](Priorities.md) specifying how the priority of this distribution is to be resolved with respect to any other options distributions which are targetted at the same component in the tree as this one. Typically one will write `after:otherNamespace` to indicate that this distribution should be stronger than (i.e. should merge options on top of) another distribution whose `namespace` is `otherNamespace`, or `before:otherNamespace` to indicate that this distribution should be weaker than (have option merged on top of by) a distribution whose `namespace` is `otherNamespace`.|
|`namespace`|(Optional, recommended) A `namespace` to identify this options distribution amongst others in an extended design. This can be used by the `priority` field of other distributions in order to defer to it or be deferred to by it. (The framework should also ensure to uniquify distributions with respect to namespace at the target - not currently implemented)|

In the case that a hash of these records is provided, the keys of the structure will be interpreted as the `namespace` of the distribution.

## IoCSS Selectors ##

An IoCSS selector appears in some special kinds of references in the framework, most notably in the `target` element of a `distributeOptions` block.
Informally, it can be distinguished from a standard [IoC reference](IoCReferences.md) since it contains some whitespace between its various matching segments, and a standard
IoC reference just consists of a single context name without whitespace. Some representative examples of IoCSS selectors are:

* `{that sessionManager}` - matches any component which matches the context `sessionManager` below the current component
* `{that > ownSub}` - matches any component directly a child of the current one matching a context `ownSub` (perhaps by being a member with that name)
* `{testEnvironment flowManager preferencesServer}` - firstly looks upward to find a `testEnvironment` component somewhere above the current one, and then matches a `preferencesServer` that is nested within a `flowManager`
* `{/ fluid.viewComponent}` - matches any `fluid.viewComponent` anywhere in the component tree

Each block separated by whitespace matches a component by one of the following component selector rules:

| Form | Description |
|------|-------------|
|`*`|matches any component - universal selector|
|`/`|matches the **global root component** of the entire component tree - may only be used in the head position of an IoCSS selector|
|`E` or `&E`|matches any component holding a context name of `E` - the `&` character may be omitted for the first context in a group. There is special support for the context `that` as with standard IoC context matching|
|`#myid`|matches the component with id equal to myid (of no use to developers since component ids cannot be predicted)|

Mediating each neighbouring pair of component rules is a descendent rule, of which we currently support 2:

| Form | Description |
|------|-------------|
|`E F`|Matches any `F` component that is a descendant of an `E` component|
|`E > F`|Matches any `F` component that is a direct child of an `E` component|

If you are familiar with [CSS selectors](https://en.wikipedia.org/wiki/Cascading_Style_Sheets#Selector) you can compare this set of 6 simple syntax rules with the wide
range of CSS selector rules listed in the article's [table](https://www.w3.org/TR/selectors/#selectors).

## Simple Example of distributeOptions: `record` for grade distribution ##

This is the form taken by the most commonly seen and straightforward use of `distributeOptions` - the contribution of an additional grade to
one or more subcomponents of the current component:

```javascript
fluid.defaults("kettle.use.session.io", {
    gradeNames: ["fluid.component"],
    distributeOptions: {
        record: "kettle.sessionManager.io",
        target: "{that sessionManager}.options.gradeNames"
    }
});
```

The `sessionManager`, wherever it is in the set of child components, will be granted the additional grade `kettle.sessionManager.io`.

## Complex Example: `record` ##

```javascript
fluid.defaults("fluid.moduleLayoutHandler", {
    gradeNames: ["fluid.layoutHandler"],
    // ...
    distributeOptions: {
    // unusual: not an IoCSS selector - upward-matching selector distributes options back to parent before instantiation ends
        target: "{reorderer}.options",
        record: {
            selectors: {
                movables: {
                    expander: {
                        func: "{that}.makeComputeModules",
                        args: [false]
                    }
                },
                dropTargets: {
                    expander: {
                        func: "{that}.makeComputeModules",
                        args: [false]
                    }
                },
                selectables: {
                    expander: {
                        func: "{that}.makeComputeModules",
                        args: [true]
                    }
                }
            }
        }
    }
});
```

## Example: `source` ##

```javascript
fluid.defaults("fluid.tests.uploader", {
    gradeNames: ["fluid.component"],
    components: {
        uploaderContext: {
            type: "fluid.progressiveCheckerForComponent",
            options: {componentName: "fluid.tests.uploader"}
        },
        uploaderImpl: {
            type: "fluid.tests.uploaderImpl"
        }
    },
    distributeOptions: [{
        target: "{that > uploaderImpl}.options", // Target a directly nested component matching the context "uploaderImpl"
        source: "{that}.options", // Distribute ALL of our options there, except exclusions:
        exclusions: ["components.uploaderContext", "components.uploaderImpl"] // options targetted directly at these subcomponents are left undisturbed in place

    }],
    progressiveCheckerOptions: {
        checks: [{
            feature: "{fluid.test}",
            contextName: "fluid.uploader.html5"
        }]
    }
});
```

## Example: broadcast via root to all components ##

([All Husnock, everywhere](http://en.memory-alpha.org/wiki/Husnock))

```javascript

// A `mixin grade` to contribute two listeners to every viewComponent in the system
fluid.defaults("fluid.debug.listeningView", {
    listeners: {
        onCreate: {
            funcName: "fluid.debug.viewMapper.registerView",
            args: ["{fluid.debug.viewMapper}", "{that}", "add"]
        },
        onDestroy: {
            funcName: "fluid.debug.viewMapper.registerView",
            args: ["{fluid.debug.viewMapper}", "{that}", "remove"]
        }
    }
});

fluid.defaults("fluid.debug.viewMapper", {
    gradeNames: ["fluid.component", "fluid.resolveRoot"],
    // Distribute the grade `fluid.debug.listeningView` to every viewComponent in the system
    distributeOptions: {
        record: "fluid.debug.listeningView",
        target: "{/ fluid.viewComponent}.options.gradeNames" // <- use of IoCSS root context "/"
    }
});
```
