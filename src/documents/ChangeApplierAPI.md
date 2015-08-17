---
title: ChangeApplier API
layout: default
category: Infusion
---

This section explains and documents the various Javascript API calls for instantiating and working with [ChangeApplier](ChangeApplier.md)s. 
In practice, users will use the ChangeAppliers which are automatically constructed for every [Model Component](tutorial-gettingStartedWithInfusion/ModelComponents.md) as its top-level member applier and will not construct their own. 
Furthermore, a good deal of the use made of ChangeAppliers will take the form of [Declarative Configuration](FrameworkConcepts.md#declarative-configuration) rather than 
literal JavaScript API calls - many declarative uses were supported in Infusion 1.5 and even more will be supported in Infusion 2.0. This page presents both programmatic calls and their declarative equivalents where they exist.

## Registering interest in model changes using a ChangeApplier ##

### Declarative style for listening to changes ###

The declarative style for registering interest in change events uses an entry in the `modelListeners` options area of a `modelComponent`. These listeners are attached to the applier during the construction process of the entire component (and its surrounding tree) and so will therefore become notified as part of the [initial transaction](ModelRelay.md#the-initial-transaction) - they will therefore get to observe the model changing state from its primordial value of undefined to holding their initial resolved value. This is the **recommended** way of listening to model changes using the ChangeApplier system.

Each record in the modelListeners block has the format `<modelPathReference>: <modelListener declaration>`. The left and right hand sides of this definition will be explained in the subsequent sections:

#### Model Path References ####

A `<modelPathReference>` has the form:

<table>
    <thead>
        <tr>
            <th colspan="3">Syntax definition for <code>&lt;modelPathReference&gt;</code> - the key in <code>modelListeners</code> options block for a <code>modelComponent</code></th>
        </tr>
        <tr>
            <th>Syntax</th>
            <th>Meaning</th>
            <th>Examples</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Simple String</td>
            <td>Reference to a model path in this component</td>
            <td>
                <ul>
                    <li><code>"modelPath"</code></li>
                    <li><code>"modelPath.&#42;"</code></li> <!-- the character * is destroyed by marked's gfm mode, but not by github markdown itself -->
                    <li><code>""</code></li>
                    <li><code>"&#42;"</code></li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>IoC Reference</td>
            <td>Reference to a model path in another component</td>
            <td>
                <ul>
                    <li><code>"{otherComponent}.model.modelPath"</code></li>
                    <li><code>"{otherComponent}.model.modelPath.&#42;"</code></li>
                    <li><code>"{otherComponent}.model"</code></li>
                    <li><code>"{otherComponent}.model.&#42;"</code></li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

The four examples presented in the _"Examples"_ column are parallel for the two cases - they respectively match changes occurring in the same parts of the target model, only in the first row they match into the model attached to this component (the same one in which the `modelListeners` record appears) and in the second row they match into the model attached to another component - one referenced by the [Context Expression](Contexts.md) `otherComponent`.

#### Model Listener Declaration ####

A model listener declaration block has exactly the same form and meaning as any of the record types supported by [Invokers](Invokers.md) and [Listeners](EventInjectionAndBoiling.md#listener-boiling) -
including the one-string compact syntax documented with [Invokers](Invokers.md#compact-format), and the use of [Priorities](Priorities.md). There are two extra features that are supported in
model listener blocks that are not supported in standard listener declarations. These are the special context name `change`, and the ability to filter a change based on its _source_.


#### The special context `change` ####
An extra [context name](Contexts.md) is available in a model listener block by the name of `change`. This is bound to the particular change event which triggered this listener. This context behaves as an object with the following fields:

<table>
    <thead>
        <tr>
            <th colspan="3">Members of the <code>{change}</code> object bound in a model listener declaration</th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>{change}.value</code></td>
            <td>Any type</td>
            <td>The new value which is now held at the model path matched by this model listener block</td>
        </tr>
        <tr>
            <td><code>{change}.oldValue</code></td>
            <td>Any type</td>
            <td>The previous value which was held at the matched model path, before it was overwritten by the change being listened to</td>
        </tr>
        <tr>
            <td><code>{change}.path</code></td>
            <td>String</td>
            <td>The path at which this change occurred. In general this will be the same as the path registered as the <code>modelPathReference</code> for this block - however it may be one segment longer if a wildcard path was used (see section on <a href="#wildcards-in-model-path-references">wildcards</a>)</td>
        </tr>
    </tbody>
</table>

#### Source tracking and filtering in model listener blocks ####

Each transaction holding one or more changes is associated with a particular _source_. Model listeners can use two special directives, `excludeSource` and `includeSource` in order to register their
interest or disinterest in receiving changes from particular sources. The default behaviour is to receive all changes from all sources. The values of these fields are single strings representing sources,
or arrays of these strings. The three currently supported sources are `init`, `relay` and `local` - custom user-defined sources may be supported in the future.

<table>
    <thead>
        <tr>
            <th colspan="3">Fields of a model listener declaration operating source filtering</th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>excludeSource</code></td>
            <td>String/Array of String</td>
            <td>A source or set of sources for which this listener should not receive notifications</td>
        </tr>
        <tr>
            <td><code>includeSource</code></td>
            <td>String/Array of String</td>
            <td>A source or set of sources for which this listener should receive notifications. If <code>excludeSource</code> is empty, <em>only</em> changes from these sources will be received. If <code>excludeSource</code> is not empty, these values will take priority.</td>
        </tr>
    </tbody>
</table>

The values of sources supported as values in `excludeSource` and `includeSource` are as follows:

<table>
    <thead>
        <tr>
            <th colspan="2">Values for sources supported as entries in <code>excludeSource</code> and <code>includeSource</code> as part of a model listener declaration</th>
        </tr>
        <tr>
            <th>Source</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>init</code></td>
            <td>The change arising from the <em>initial transaction</em>. During this change, the listener will observe the value of the model changing from <code>undefined</code> to its consistent initial value, during the
            overall process of component construction</td>
        </tr>
        <tr>
            <td><code>relay</code></td>
            <td>A change resulting from <a href="ModelRelay.md"><em>model relay</em></a> from another linked component in the model skeleton, elsewhere in the component tree.</td>
        </tr>
        <tr>
            <td><code>local</code></td>
            <td>A change directly triggered via the ChangeApplier on this component - either via a declarative record holding <code>changePath</code>, or programmatically using an <code>applier.change()</code> call</td>
        </tr>
    </tbody>
</table>

Example featuring source filtering:

```javascript
fluid.defaults("examples.sourceExample1", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        things: "initial value"
    },
    modelListeners: {
        things: {
            funcName: "console.log",
            excludeSource: "init",
            args: "{change}.value"
        }
    }
});

var that = examples.sourceExample1();
that.applier.change("things", "new value");
```

This example will not log the transition from the initial model state of `undefined` to the console. It will, however, log the value `new value` triggered via the ChangeApplier API.

**NOTE**: The current implementation of the ChangeApplier has a bug ([FLUID-5519](http://issues.fluidproject.org/browse/FLUID-5519)) which will often cause a model listener to be notified
before much of the surrounding component has constructed. This can be annoying, since the model listener may want to rely on other infrastructure (e.g. invokers, etc.) that it cannot
be sure have been constructed. For this reason, `excludeSource: "init"` is a useful way of stabilising this behaviour until the implementation is fixed (fix will be
delivered as part of [FLUID-4925](http://issues.fluidproject.org/browse/FLUID-4925)).

#### Wildcards in model path references ####

The last path segment of a model path reference may or may not be `"*"`. Whether it is `"*"` or not, the reference matches exactly the same set of changes - the only difference is in how they are reported. A path reference of `"things"` will match all changes occurring below this path segment, and report all those occurring within a single transaction as a single change. A path reference of `"things.*"` will match the same changes, but will report one change for each immediately nested path segment touched by the changes. For example, the following definition will log just one

```javascript
fluid.defaults("examples.pathExample1", {
    gradeNames: ["fluid.modelComponent"],
    modelListeners: {
        things: {
            funcName: "fluid.log",
            args: ["{change}.value", "{change}.path"]
        }
    }
});

var that = examples.pathExample1();
that.applier.change("things", {a: 1, b: 2});
// this logs {a: 1, b: 2}, "things" to the console
```

However, the following example which just differs in the listener path (swapping `"things"` for `"things.*"`) will log two changes:

```javascript
fluid.defaults("examples.pathExample2", {
    gradeNames: ["fluid.modelComponent"],
    modelListeners: {
        "things.*": {
            funcName: "fluid.log",
            args: ["{change}.value", "{change}.path"]
        }
    }
});

var that = examples.pathExample2();
that.applier.change("things", {a: 1, b: 2}); // logs 2 lines
// Line 1: 1, "things.a"
// Line 2: 2, "things.b"
```

The standard way to be notified of any changes to the model in a single notification is to use a model path reference consisting of the empty string `""`. Use of `"*"` will react to the same changes, but will report multiple notifications for compound modifications as in the above example.

It is not currently possible to supply more than one wildcard segment per path reference, or to supply the wildcard at any position in the string other than as the last path segment.

### Programmatic style for listening to changes###

The programmatic style for registering interest in model changes uses an API exposed by the ChangeApplier on its member `modelChanged` that is very similar to that exposed by a standard [Infusion Event](InfusionEventSystem.md) - the difference is that the `addListener` method accepts an extra 1st argument, `pathSpec` - this holds the same model path reference documented in the previous section on declarative binding:

```javascript
applier.modelChanged.addListener(pathSpec, listener, namespace)
applier.modelChanged.removeListener(listener)
```

**NOTE**: _This style of listening to changes is **discouraged**, but may be the right choice in some applications_. For example - the listener to be attached may not be available
at the time the component is constructed. Note that programmatically attached listeners will miss observation of the initial transaction as well as any other model changes that have occurred up to the point where they are registered.

The listener is notified after the change (or set of coordinated changes) has already been applied to the model - it is too late to affect this process and so this event is not _preventable_. The signature for these listeners is

```javascript
function listener(value, oldValue, pathSegs, changeRequests)
```

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>value</code></td>
            <td>The new (current) model value held at the path for which this listener registered interest</td>
        </tr>
        <tr>
            <td><code>oldValue</code></td>
            <td>A "snapshot" of the previous model value held at that path</td>
        </tr>
        <tr>
            <td><code>pathSegs</code></td>
            <td>An array of <code>String</code> path segments holding the path at which <code>value</code> and <code>oldValue</code> are/were held</td>
        </tr>
        <tr>
            <td><code>changeRequests</code></td>
            <td>A single <code>ChangeRequest</code> object or an array of them (see below) which were responsible for this change (may be empty)</td>
        </tr>
    </tbody>
</table>

Users will in most cases only be interested in the first argument in this signature.

## Triggering a change using a ChangeApplier ##

### Declarative style for triggering a change###

The declarative style for triggering model changes involve a kind of IoC record (a _change record_) that is supported in various places in component configuration, in particular as part of the definition of both [Invokers](Invokers.md) and [Listeners](Events.md) of an IoC-configured component. 
This style of record is recognised by its use of the special member `changePath` which determines which path in which component model will receive the change.

<table>
    <thead>
        <tr>
            <th colspan="3">Change record for firing changes by declarative binding</th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>changePath</code></td>
            <td><code>&lt;modelPathReference&gt;</code> (String)</td>
            <td>
                The reference to the model path in a model somewhere in the component tree where the change is to be triggered. This has the same syntax as the model path references documented above for declarative listening, only wildcard forms are not supported. Four examples:
                <ul>
                    <li><code>"modelPath"</code></li>
                    <li><code>""</code></li>
                    <li><code>"{otherComponent}.model.modelPath"</code></li>
                    <li><code>"{otherComponent}.model"</code></li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>value</code></td>
            <td>Any type</td>
            <td>The value which should be stored at the path referenced by <code>changePath</code>. If this contains compound objects (built with <code>{}</code>), these will be merged into the existing values in the model. If this contains arrays (built with <code>[]</code>) these will overwrite existing values at that path.</td>
        </tr>
        <tr>
            <td><code>type</code></td>
            <td>String (optional)</td>
            <td>If this holds the value <code>DELETE</code>, this change will remove the value held at <code>changePath</code>. In this case, <code>value</code> should not be supplied. This is the recommended way of removing material from a model - it has the effect of the <code>delete</code> primitive of the JavaScript language. Sending changes holding a <code>value</code> of <code>null</code> or <code>undefined</code> does not have the same effect, as per the JavaScript language spec.</td>
        </tr>
    </tbody>
</table>

#### Example of declarative triggering of changes ####

In the below example, we construct an invoker that will set the entire model of the current component to whatever value is supplied as its first argument - this is achieved by giving its record a `changePath` of `""` and binding its `value` to `{arguments}.0`:

```javascript
fluid.defaults("examples.changeExample", {
    gradeNames: ["fluid.modelComponent"],
    model: "initialValue",
    invokers: {
        changer: {
            changePath: "",
            value: "{arguments}.0"
        }
    }
});

var that = examples.changeExample();
that.changer("finalValue");
console.log(that.model); // "finalValue"
```

### Programmatic style ###

There are two calls which can be used to fire a change request - one informal, using immediate arguments, and a more formal method which constructs a concrete `changeRequest` object.

```javascript
applier.change(path, value, type)
```

<table>
    <thead>
        <tr>
            <th>Path</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>path</code></td>
            <td>String</td>
            <td>An EL path into the model where the change is to occur.</td>
        </tr>
        <tr>
            <td><code>value</code></td>
            <td>Any type</td>
            <td>An object which is to be added into the model</td>
        </tr>
        <tr>
            <td><code>type</code></td>
            <td>(optional) <code>"ADD"</code> or <code>"DELETE"</code></td>
            <td>A key string indicating whether this is an <code>ADD</code> request (the default) or a <code>DELETE</code> request (a request to unlink a part of the model)</td>
        </tr>
    </tbody>
</table>

The semantics and values are exactly the same as described in the section on declarative triggering above - with the difference that IoC references may not be supplied for `path`.

```javascript
applier.fireChangeRequest(changeRequest)
```

where a **changeRequest** is an object holding the above named parameters in named fields - e.g. `{path: "modelPath", value: "newValue"}` `change` and `fireChangeRequest` reach exactly the same implementation - the only difference is in the packaging of the arguments. For `change` they are spread out as a sequence of 3 arguments, whereas for `fireChangeRequest`, they are packaged up as named fields (`path`, `value` and `type`) of a plain JavaScript object. Such an object is called a **"ChangeRequest"** and is a convenient package for these requests to pass around in in an event pipeline within the framework.

The programmatic style for **firing** changes is less strongly discouraged than the programmatic style for **listening** to changes is - since it does not run into the same lifecycle issues that programmatic listeners do. However, the declarative style for triggering changes should be used wherever it can.

### Example of two styles of declarative model listener registration ###

Users can freely define very fine or coarse-grained listeners for changes in a model using the ChangeApplier. Here are some examples using the new declarative model listener registration syntax in Infusion 1.5:

```javascript
fluid.defaults("my.component", {
    gradeNames: ["fluid.modelComponent", "fluid.component"],

    invokers: {
        printChange: {
            "this": "console",
            method: "log",
            args: ["{arguments}.0"]
        }
    },

    model: {
        cats: {
            hugo: {
                name: "Hugo",
                colours: ["white", "brown spots"]
            },
            clovis: {
                name: "THE CATTT!",
                colours: ["white", "black spots", "black moustache"]
            }
        }
    },

    modelListeners: {
        // Will fire individual change events whenever any part of "cats.hugo" changes.
        // {change}.value will correspond to each changed path within "hugo".
        "cats.hugo.*" {
            funcName: "{that}.printChange",
            args: [{change}.value]
        },

        // Will fire a single composite change event whenever any part of "cats.clovis" changes.
        // {change}.value will contain the new state of the "clovis" object.
        "cats.clovis": {
            funcName: "{that}.printChange",
            args: [{change}.value]
        }
    }
});

// Example usage.
var c = my.component();
c.applier.change("cats.hugo", {
    name: "Hugonaut",
    colours: ["hard to tell"]
});
> "Hugonaut"
> ["hard to tell"]

c.applier.change("cats.clovis.name", "THER CATTT!");
> {name: "THER CATTT!", colours: ["white", "black spots", "black moustache"]}
```

## Low-level ChangeApplier APIs ##

These are not recommended for typical users of the framework, and are not stable.

### Instantiating a ChangeApplier ###

Instantiating a ChangeApplier manually is not recommended in current versions of the framework. Its implementation is tightly bound into its location in 
an IoC component tree and should be constructed by the IoC system itself.

### Operating transactions manually ###

A user may be interested in economising on notifications to model updates; by batching these up into a single transaction, there will
just be a single notification of each listener which is impacted around the model skeleton. This facility is unstable and will be 
rewritten prior to the final Infusion 2.0 release.

A transaction can be opened using the `initiate()` method of the applier function which returns a transaction object:

```javascript
var myApplier = myModelComponent.applier;
var myTransaction = myApplier.initiate();
```

The transaction object exposes an API which agrees with the ChangeApplier's own API for triggering changes, which can be used to trigger changes within the transaction:

```javascript
myTransaction.fireChangeRequest(requestSpec1);
myTransaction.fireChangeRequest(requestSpec2);
...
```

The transaction can be completed using the `commit()` function of the transaction object:

```javascript
myTransaction.commit();
```

A single `modelChanged` event will be fired on completion of the commit, regardless of the number of change requests.
