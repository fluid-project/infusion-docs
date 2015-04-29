---
title: ContextAwareness API
layout: default
category: API
---

The ContextAwareness API of Infusion provides a powerful suite of grades and utilities that allow a component to be responsive to aspects of its contexts in a flexible and open-ended way.
For lightweight cases of context adaptation, the [`distributeOptions`](IoCSS.md) scheme suffices, in that it enables a component to be responsive to broadcasts "advising" it from around the
component tree in a free-form and controllable away. However, when a component needs to take a clearer role in responding to potentially many kinds of requests for adaptation, where these
can be organised around two or more "axes" or "dimensions" of adaptation that can be clearly named and identified, it should opt into this more heavywight scheme by implementing the 
`fluid.contextAware` grade and perhaps also advertising some of its dimensions of adaptations in its own options. These dimensions themselves can always be extended by further contributions
to the component's options through all the usual sources - direct options, subcomponent options, and options distributions from elsewhere in the tree.

A `contextAware` component can be responsive to contexts, whose influence is organised as a set of mutually orthogonal "adaptations", where the set of adaptations itself is open to extension by 
integrators and adopters. The primary grade enabling a component to opt into this scheme is named `fluid.contextAware`. Any component derived from this grade will advertise an
area of its options named `contextAwareness` which organises the rules for its adaptation in a hierarchical way - at the top level by "adaptation" and then at the nested level by
"checks".

## Structure of members in a `adaptationRecord`

The top level structure of the `contextAwareness` record consists of a free hash of `adaptationName` strings to `adaptationRecord` structures. The `adaptationName` strings will be considered as
namespaces for the purposes of priority resolution (see the <code>priority</code> entry in the following table). The elements of the `adaptationRecord` are
described in the following table:

<table>
    <thead>
        <tr>
            <th colspan="3">Members of a <code>adaptationRecord</code> entry within the <code>contextAwareness</code> block of a <code>fluid.contextAware</code> component</th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>checks</code> (optional)</td>
            <td>Hash of <code>checkNamespace</code> to <code>checkRecord</code></td>
            <td>A free hash of namespace names for checks, to entries describing how a context check is to be made, and what <code>gradeNames</code> should result if the check is successful.</td>
        </tr>
        <tr>
            <td><code>defaultGradeNames</code> (optional)</td>
            <td><code>String</code> or <code>Array of String</code></td>
            <td>One or more <code>gradeNames</code> to be the result if none of the <code>checks</code> entries matches</td>
        </tr>
        <tr>
            <td><code>priority</code></td>
            <td><code>Priority</code> value - see [Priorities](Priorities.md) for a full explanation</td>
            <td>The priority (if any) that the <code>gradeNames</code> resulting from this dimension should have over those resulting from any other dimension. This should be an entry of the form
            <code>before:adaptationName</code> or <code>after:adaptationName</code> for one of the other dimensions attached to this component within <code>contextAwareness</code></td>
        </tr>
    </tbody>
</table>

The result of the `contextAwareness` record is that a number of the elements within `checks` will be evaluated in the visible context, and result in a number of `gradeNames` which will then be
contributed into the `gradeNames` of the instantiating component in a particular order. This order is governed by both the `priority` entry at the adaptation level as well as at the check level.

##Structure of members in a `checkRecord`

The `checkRecord` structure which is used in the first row of this table is described now:

<table>
    <thead>
        <tr>
            <th colspan="3">Members of a <code>checkRecord</code> entry within a <code>adaptationRecord</code> block of a <code>fluid.contextAware</code> component</th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>contextValue</code></td>
            <td><code>String</code> <a href="IoCReferences.md">IoC reference</a></td>
            <td>A standard IoC reference, either consisting of a bare context reference such as <code>{contextName}</code> or to a precise value such as <code>{contextName}.further.path</code> which should be sought by this check.
            If a bare context name is supplied, the checked path will default to <code>options.value</code>. If the context name does not match, the expression will evaluate to <code>undefined</code></td>
        </tr>
        <tr>
            <td><code>equals</code> (optional)</td>
            <td><code>String</code>, <code>Number</code> or <code>Boolean</code></td>
            <td>A value with which the context value fetched from <code>contextValue</code> should be checked. If omitted, this defaults to <code>true</code></td>
        </tr>
        <tr>
            <td><code>gradeNames</code> (optional)</td>
            <td><code>String</code> or <code>Array of String</code></td>
            <td>One or more <code>gradeNames</code> that will be returned out to the <code>contextAwareness</code> system if this check passes. The check will pass if the context value referenced in <code>contextValue</code> can be found, and
            matches any value supplied in <code>equals</code> (or <code>true</code> if none is supplied).</td>
        </tr>
        <tr>
            <td><code>priority</code></td>
            <td><code>Priority</code> value - see <a href="Priorities.md">Priorities</a> for a full explanation</td>
            <td>The priority (if any) that the <code>gradeNames</code> resulting from this dimension should have over those resulting from any other dimension. This should be an entry of the form
            <code>before:adaptationName</code> or <code>after:adaptationName</code> for one of the other dimensions attached to this component within <code>contextAwareness</code></td>
        </tr>
    </tbody>
</table>

### Example `contextAwareness` record

The most adaptible component in the framework is currently the [Uploader](togo/Uploader.md) which currently can respond to three "dimensions" of adaptation. Two of these,
`technology` and `liveness`,  are advertised in its own `contextAwareness` record:

```javascript
fluid.defaults("fluid.uploader", {
    gradeNames: ["fluid.viewComponent", "fluid.contextAware"],
    contextAwareness: {
        technology: {
            defaultGradeNames: "fluid.uploader.singleFile"
        },
        liveness: {
            priority: "before:technology",
            checks: {
                localDemoOption: {
                    contextValue: "{uploader}.options.demo",
                    gradeNames: "fluid.uploader.demo"
                }
            },
            defaultGradeNames: "fluid.uploader.live"
        }
    }
});
```

`technology` refers to the implementation technology of the uploader. For previous releases, this supported a Flash-based engine as well as an HTML engine targetted at a back-levelled HTML
API supported by Firefox 3.x. Although all technologies other than a modern HTML5 engine have been removed from the current framework image, the basic architecture to support other
engines still exists and could be contributed to in future. The `liveness` adaptation relates to the mocking infrastructure for the Uploader which exists at two levels. Firstly, there is 
the "demo uploader" which mocks all of the engine-side implementation, and secondly the uploader can be run in various styles of integration tests which only mock the transport level which
actually performs the file upload.

### Example of dynamically broadcasting a fresh adaptation

Finally, a third dimension of adaptation is supported by the Uploader's capability to be configured in a way that it will respond to previous instances of its own API - in particular that
delivered for Infusion 1.2, released in April 2010, and Infusion 1.3, released in November 2010. This is implemented by allowing a dynamic contribution of a fresh dimension to the uploader's
`contextAwareness` record from separate implementation files:

```javascript
fluid.defaults("fluid.uploader.compatibility.distributor.1_3", {
    distributeOptions: {
        record: {
            "1_2": {
                contextValue: "{fluid.uploader.requiredApi}.options.value",
                equals: "fluid_1_2",
                gradeNames: "fluid.uploader.compatibility.1_2"
            }
        },
        target: "{/ fluid.uploader}.options.contextAwareness.apiCompatibility.checks"
    }
});

// Actually construct a component instance performing the options broadcast into all uploaders
fluid.constructSingle([], {
    singleRootType: "fluid.uploader.compatibility.distributor",
    type: "fluid.uploader.compatibility.distributor.1_3"
});

// The grade that contextAwareness ends up contributing into the uploader, if the rule is activated
fluid.defaults("fluid.uploader.compatibility.1_2", {
    transformOptions: {
        transformer: "fluid.model.transformWithRules",
        config: fluid.compat.fluid_1_2.uploader.optionsRules
    }
});
```

The defaults block `fluid.uploader.compatibility.distributor.1_3` contains an options distribution which appeals to the existence of a third dimension in the uploader's `contextAwareness`, named
`apiCompatibility` &#8212; this can be done simply by arranging to broadcast the appropriate options into it. Once we have defined this options distribution, we actually need to construct a component
a component instance which holds and operates them &#8212; this is done via the `fluid.constructSingle` line. This utility automatically arranges for a singleton instance, uniquified at the 
component tree's top level by the type `singleRootType` which has a very similar function to the option of the same name consumed by the `fluid.resolveRootSingle` grade described in
the documentation on [Contexts](Contexts.md#global-components-fluid.resolveRoot-and-fluid.resolveRootSingle).

Having shown the basic operation of the _receiver_ of contextual information, we'll now describe the group of utilities, including `fluid.constructSingle` that we just met, which can be
used by integrators and implementors to coordinate the visibility of context names and distributions from them.

Note that the combined effect of the first two defaults blocks shown in this example can be achieved "all-in-one" by a single call to the dedicated utility `fluid.contextAware.makeAdaptation`. 

## Making contexts visible and removing them with `fluid.contextAware.makeChecks` and `fluid.contextAware.forgetChecks`

The `checkRecord` structures described in the table above, by default appeal to the existence of some components holding the boolean value <code>true</code> at an option named <code>value</code> - or
else some other value held at this path which is to be compared by equality. The `ContextAwareness` API includes two helper functions to assist integrators in issuing contexts of this form, and
removing them when they are no longer required.

These contexts can be issued with a call of the form:

```
fluid.contextAware.makeChecks(<checkStructure>);
```

The `checkStructure` argument is a hash of `contextName` strings to a `checkEntry` record which is documented in the following table:


<table>
    <thead>
        <tr>
            <th colspan="3">Members of a <code>checkEntry</code> record supplied as an argument to <code>fluid.contextAware.makeChecks</code></th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>func</code>/<code>funcName</code></td>
            <td><code>String</code> <a href="IoCReferences.md">IoC reference</a></td>
            <td>A function or function name to be evaluated to produce the context value</td>
        </tr>
        <tr>
            <td><code>value</code></td>
            <td><code>String</code>, <code>Number</code> or <code>Boolean</code></td>
            <td>The value to be supplied at the <code>value</code> path in the options tructure of the constructed context</td>
        </tr>

    </tbody>
</table>

You must supply exactly one of `func`, `funcName` or `value`.

### Example of `fluid.contextAware.makeChecks`

```
fluid.contextAware.makeChecks({
    "fluid.browser.supportsBinaryXHR": {
        funcName: "fluid.enhance.supportsBinaryXHR"
    },
    "fluid.browser.supportsFormData": {
        funcName: "fluid.enhance.supportsFormData"
    }
});
```

In the above example, the two global functions `fluid.enhance.supportsBinaryXHR` and `fluid.enhance.supportsFormData` will be executed, and their
return values added into contexts with the names `fluid.browser.supportsBinaryXHR` and `fluid.browser.supportsFormData`.

The contexts registered by ``fluid.contextAware.makeChecks`` can be erased from the system by the use of the call 

```
fluid.contextAware.forgetChecks(`contextNames`);
```

Here, `contextNames` is can hold either a `String` or `Array of String` holding the keys from the structures previously supplied to `fluid.contextAware.makeChecks`

### Example of `fluid.contextAware.forgetChecks`

For example, the checks registered in the above example `fluid.contextAware.makeChecks` call could be erased by a call to

```
fluid.contextAware.forgetChecks(["fluid.browser.supportsBinaryXHR", "fluid.browser.supportsFormData"]);
```


## Defining and broadcasting a fresh adaptation in one operation with `fluid.contextAware.makeAdaptation`

A very common use case is to define an adaptation (that is, a `distributeOptions` block which targets the `contextAwareness` area of a collection
of componentsin the tree), and then to create an instance of a single, well-known component which actually broadcasts the adaptation. This was
what we did in two steps (`fluid.defaults` plus `fluid.constructSingle`) in the above [example `contextAwareness` broadcast](#example-of-dynamically-broadcasting-a-fresh-adaptation)
can be done in a single step using the `fluid.contextAware.makeAdaptation` API. 

```
fluid.contextAware.makeAdaptation(<adaptationRecord>);
```

This accepts a single complex structure `adaptationRecord` with a number of fields that need to be filled in:

<table>
    <thead>
        <tr>
            <th colspan="3">Members of a <code>adaptationRecord</code> record supplied as an argument to <code>fluid.contextAware.makeAdaptation</code></th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>distributionName</code></td>
            <td><code>String</code></td>
            <td>A grade name &#8212; the name to be given to the <strong>fabricated grade</strong> which performs the broadcast</td>
        </tr>
        <tr>
            <td><code>targetName</code></td>
            <td><code>String</code></td>
            <td>A grade name &#8212; the name of the grade to <strong>receive the adaptation</strong></td>
        </tr>
        <tr>
            <td><code>adaptationName</code></td>
            <td><code>String</code></td>
            <td>The name of the <code>contextAwareness</code> record (the top-level <code>adaptationRecord</code>) to receive the broadcast record &#8212; this will be a simple string</td>
        </tr>
        <tr>
            <td><code>checkName</code></td>
            <td><code>String</code></td>
            <td>The name of the <code>checkRecord</code> record (<strong>within</strong> the <code>adaptationRecord</code>) to receive the broadcast record &#8212; this will be a simple string</td>
        </tr>
        
        <tr>
            <td><code>record</code></td>
            <td><code>Object</code> (<code>checkRecord</code>)</td>
            <td>The <a href="#structure-of-members-in-a-checkRecord"><code>checkRecord</code></a> which is to be broadcast &#8212; containing fields <code>contextValue</code>, <code>gradeNames</code> etc. 
            <a href="#structure-of-members-in-a-checkRecord">as described above</a></td>
        </tr>
    </tbody>
</table>

### Example of calling `fluid.contextAware.makeAdaptation`

For example, the pair of calls in the above [example `contextAwareness` broadcast](#example-of-dynamically-broadcasting-a-fresh-adaptation) could be achieved by the following single
call to `fluid.contextAware.makeAdaptation`:

```
fluid.contextAware.makeAdaptation({
    distributionName: "fluid.uploader.compatibility.distributor.1_3",
    targetName: "fluid.uploader",
    adaptationName: "apiCompatibility",
    checkName: "1_2",
    record: {
        contextValue: "{fluid.uploader.requiredApi}.options.value",
        equals: "fluid_1_2",
        gradeNames: "fluid.uploader.compatibility.1_2"
    }
});
```