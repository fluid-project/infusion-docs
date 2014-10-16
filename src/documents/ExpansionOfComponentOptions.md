---
title: Expansion of Component Options
layout: default
---

## Expanders ##

Infusion component options, as written in `fluid.defaults` blocks, go through a process called **expansion** when they are used to instantiate a component. Two kinds of expansion happen during this process -

* Expansion of IoC references, written as strings in the form `{context}.path` as a result of the Value Resolution process, and
* Expansion of **expanders**, which are blocks of JSON occurring in the options with the key expander

The standard use of an expander is to designate a function to be called when instantiating the component options, which produces a value based on processing the expander arguments. This can be useful when static definition of a default option is not possible.

Expanders are specified using the keyword `expander` in the component defaults:

```javascript
fluid.defaults("component.name", {
    optionName: {
        expander: {
            ...
        }
    }
});
```

The basic form of an expander record is very similar to that of an [Invoker](Invokers.md) - it contains entries `func/funcName` together with `args` to designate the function call which will produce the required options values.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>func/funcName</td>
            <td>
                Either an <a href="IoCReferences.md">IoC reference</a> to a function (an <a href="Invokers.md">invoker</a> or other function member) or else a global function name holding the function to be invoked
            </td>
        </tr>
        <tr>
            <td>args</td>
            <td>
                An array of arguments (or single argument) to be passed to the user-provided function specified in <code>func/funcName</code>.
            </td>
        </tr>
    </tbody>
</table>

### Examples ###

This example locates the global function named `cspace.search.modelFilter` and calls it with the arguments given by resolving the context `{searchView}` - in this case, most likely the top-level component defined in defaults itself. The return value from this function is then placed in the options of the instantiated component (the `fluid.pager`) at the path `modelFilter`:

The `resultsPager` is specified as an instance of the Infusion Pager component. When this subcomponent is created, the expander will call the function `cspace.search.makeModelFilter`, passing it the parent `searchView` component as an argument. The return value will be used as the default `modelFilter` option to the Pager.

```javascript
fluid.defaults("cspace.search.searchView", {
    components: {
        resultsPager: {
            type: "fluid.pager",
            options: {
                modelFilter: {
                    expander: {
                        func: "cspace.search.makeModelFilter",
                        args: ["{searchView}"]
                    }
                }
            }
        }
   }
});
```

### The fluid.noexpand expander ###

The `fluid.noexpand` expander is a very specialised expander that normal users of the framework should not require to use. It has been retained in the framework for completeness, but its effects should normally be obtained using a mergePolicy of `noexpand`. This expander simply dumps its literal argument (held at a path named `value` or `tree`) into the component's options without expansion.

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>type</td>
            <td>
                <code>fluid.noexpand</code> (the type field must hold this literal value)
            </td>
        </tr>
        <tr>
            <td>value/tree</td>
            <td>
                This property holds some literal component configuration (either a primitive value or larger tree of JSON values) which will be inserted without expansion into the component options
            </td>
        </tr>
    </tbody>
</table>

#### Example #####

In this example, the function name `{specBuilder}.urlExpander` will NOT be resolved as an IoC reference. The value `{specBuilder}.urlExpander` will be assigned to the option named `unexpanded`.

```javascript
fluid.defaults("cspace.specBuilder", {
    components: {
        specBuilderImpl: {
            type: "cspace.specBuilderImpl",
            options: {
                unexpanded: {
                    expander: {
                        type: "fluid.noexpand",
                        value: "{specBuilder}.urlExpander"
                    }
                }
            }
        }
    }
});
```


