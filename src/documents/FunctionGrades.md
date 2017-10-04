---
title: Function Grades
layout: default
category: Infusion
---

Most [grades](ComponentGrades.md) represent Infusion components - these are derived from the base grade `fluid.component`. However, some grades describe plain JavaScript functions - these are derived from the base grade `fluid.function`.
The purpose of the Fluid API call [fluid.defaults](CoreAPI.md#fluiddefaultsgradename-options) could be understood as providing *metadata* about some element of the system. In the case of a full component grade, this metadata is sufficient
to allow the framework to automatically construct the creator function for the component. In the case of a function grade which describes an already existing function with a global name, the metadata supplies hints to the user about
how to call the function and its purpose.

## Registering a global function

A global function is registered within infusion at a stable place in its global namespace by working with the core API functions [fluid.registerNamespace](CoreAPI.md#fluidregisternamespacepath) and
[fluid.setGlobalValue](CoreAPI.md#fluidsetglobalvaluepath-value) - in practice the latter is rarely used, in favour of directly setting members on namespace objects.

If you are working in the browser, the global object (traditionally named `window`) coincides with Fluid's global object (which can be retrieved from `fluid.global` - assuming that you have already managed to resolve the `fluid` object itself).
If you are working in node.js, you need to make calls to [fluid.registerNamespace](CoreAPI.md#fluidregisternamespacepath) to bring parts of the global namespace into visibility as variables local to your file.

A typical sequence could look like this:

```javascript
var examples = fluid.registerNamespace("examples");

examples.linearMap = function (m, x, c) {
    return m * x + c;
}
```

This registers a global function named `examples.linearMap` into the global namespace.

## Registering defaults for a global function

This function can be used as-is - however, one piece of metadata we could supply it might be an * argument map * allowing it to
be invoked with named rather than positional arguments. We could do this as follows:

```javascript
fluid.defaults("examples.linearMap", {
    gradeNames: "fluid.function",
    argumentMap: {
        "m": 0,
        "x": 1,
        "c": 2
    }
});
```

## Invoking a global function with named arguments

We can then invoke our function using [`fluid.invokeGradedFunction`](CoreAPI.md#fluidinvokegradedfunctionname-spec) as follows:

```javascript
var result = fluid.invokeGradedFunction("examples.linearMap", {
    m: 1.5,
    x: 2,
    c: 1
}); // computes result of 4
```

This is a small but occasionally useful courtesy - especially when invoking functions from material encoded in configuration rather than in code.

## Framework function grades

All of the pure function grades (that is, non-component grades) defined in the framework represent [*model transformation functions*](ModelTransformationAPI.md#grades-of-transformations) derived from `fluid.transformFunction`.
These grades are `fluid.standardInputTransformFunction`, `fluid.standardOutputTransformFunction`, `fluid.multiInputTransformFunction`, `fluid.standardTransformFunction` and `fluid.lens`.
