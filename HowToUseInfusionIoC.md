# How to Use Infusion IoC #

The author of an Infusion component describes the structure of part of an IoC **component tree** that is rooted at a particular component, by describing what subcomponents the component has.

## Declaring Subcomponents ##

A parent component declares what subcomponents it requires through the components block of the parent component's default options using [fluid.defaults](fluidDefaults.md). This list of subcomponents will be examined when the parent component ask the Framework to create subcomponents, as described below in [Creating Subcomponents](#creating-subcomponents).

In this example, the default type for the subcomponent, `mySubComponent1`, of `myComponentName` is specified as type name `subComponent1Name`.

```javascript
fluid.defaults("myNamespace.myComponentName", {
    gradeNames: ["autoInit", ...],
    ...
    components: {
        mySubComponent1: {
            type: "subComponent1Name"
        },
        mySubComponent2: {
            type: "subComponent2Name"
        },
    },
    ...
});
```

For more information on how components can declare subcomponents, see [Subcomponent Declaration](SubcomponentDeclaration.md). For details on the `fluid.defaults()` function, please see its API page.

Any [IoC References](IoCReferences.md) which appear in the definition of a component tree will be resolved onto their targets in the component tree as it constructs. This process occurs in a data-driven way - if the reference is resolved onto a part of the component tree which has not yet constructed at the point of the reference, the framework will shift its workflow to instantiating the target of the reference in order to resolve it.