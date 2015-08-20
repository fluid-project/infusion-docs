---
title: Model Relay
layout: default
category: Infusion
---

The Infusion Model Relay system is a powerful scheme for supplying declarative configuration that specifies rules for keeping multiple pieces of model state around the component tree automatically up to date with each other's changes. 

We sometimes use the term _**model skeleton**_ to refer to a connected set of models around the component tree which are related together by relay rules. This appeals to the idea that these models form an inner core which
arrive at a set of mutually consistent model values, before they start to notify listeners out in the periphery of each component (generally, in its view layer). The system might make several passes over the model skeleton in
order to satisfy all the relay rules, and then update all [`modelListeners`](ChangeApplierAPI.md#model-listener-declaration) as a single operation &#8212; presenting them with a consistent snapshot of the state of the entire
skeleton all at once. This guarantees that no model listener ever sees a model value which is inconsistent with the relay rules which are meant to be keeping them in step, which greatly enhances the reliability and clarity of the
application design.

Every Infusion component descended from the grade `fluid.modelComponent` (a model-bearing component) supports a configuration area named `modelRelay` in which these rules can be defined.

### Two styles for configuring model relay ###

There are two primary styles of configuration for setting up model relay &#8212; firstly, using the _implicit syntax_ which just consists of [IoC References](IoCReferences.md) from the model configuration for one model-bearing component to another &#8212;
that is, in the component's configuration under the top-level model entry. Secondly, the _explicit syntax_ involves an entry in the component's top-level `modelRelay` entry expressing a more complex rule, 
most likely involving some form of [Model Transformation](to-do/ModelTransformation.md) to apply during the relay process. Both of these styles will set up a permanent and bidirectional relationship between the two models at the ends of the relay &#8212; 
the relationship will be established as the component(s) construct (during the _[initial transaction](#the-initial-transaction)_), and will persist until one of the components at the endpoints is destroyed.

### How model relay updates propagate ###

A set of models which are linked by relay rules are called a _**model skeleton**_. Whenever an update is received to any model which is part of the skeleton (via its [ChangeApplier](ChangeApplier.md)), a "transaction" 
begins in order to propagate it to all the related models to which it should be synchronised. The framework will keep propagating the change to all the models in the skeleton until they have all been brought up to date &#8212; 
however, these updates will initially occur privately, within the transaction and any external listeners will not be notified during the update process, in order to not become confused by receiving multiple notifications as the 
synchronisation occurs. Only once the framework has computed final synchronised values for all of the models in the skeleton will the transaction end, and then all listeners (via their respective ChangeAppliers) will be notified all at once.

If any of these listeners have a [`priority`](Priorities.md) field attached to the listener declaration, the framework will sort all of these listeners globally across the entire model skeleton impacted by the change, before starting to
notify them.

### The initial transaction ###

Whenever a new model-bearing component (or an entire tree of model-bearing components) constructs, there will be a particular, large style of update transaction known as an __initial transaction__.  
This is very similar to any other synchronisation transaction caused by a model relay update, although it will typically involve more data since all of the initial values of all the involved models must be taken into account &#8212; 
these result from any of the normal sources for component configuration, including [defaults](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/Fluid.js#L1519-L1539), user-supplied values, 
[distributed](IoCSS.md) options, etc. During the initial transaction, any declaratively registered listeners will observe all of the new models go through the transition from holding their primordial value of `undefined` 
to holding their correct synchronised initial values. As with any other relay update transaction, this will appear to all the observers to occur in a single step even though from the point of view of the framework it may be a 
complex process involving many passes through the components.

You can control which components have the default values for their models honoured and which ignored during the initial transaction, by using the directives `forward` and `backward` - these are discussed in the section 
[Controlling Propagation Through a Relay Rule](#controlling-propagation-through-a-relay-rule).

## Implicit model relay style ##

This is the most straightforward style for setting up model relay. This takes the form of a simple [IoC Reference](IoCReferences.md) between one component's model and other. 
Here is a component which has a child component which sets up a model relay relationship with it:

```javascript
fluid.defaults("examples.implicitModelRelay", {
    gradeNames: "fluid.modelComponent",
    model: {
         parentValue: 3
    },
    components: {
        child: {
            type: "fluid.modelComponent",
            options: {
                model: { // implicit relay rule setting up synchronisation with one field in parent's model
                    childValue: "{examples.implicitModelRelay}.model.parentValue"
                }
            }
        }
    }
});

var that = examples.implicitModelRelay();
console.log(that.child.model.childValue); // 3 - parent's value has been synchronised to child on construction
```

The IoC expression `{examples.implicitModelRelay}.model.parentValue` here refers from one field of the child's model called `childValue` to one field of the parent's model called `parentValue`. 
This sets up a permanent model relay linking these two fields. From the construction point onwards, the framework will ensure that all updates made to one field will be reflected in the other. 
The framework will naturally ensure that if either of the components at the endpoint are destroyed, the relay will be torn down.

For example, here are some further pieces of code we could write, following on from the above example &#8212; these use the programmatic [ChangeApplier API](ChangeApplierAPI.md) although in practice it is 
desirable to express as many such updates as declaratively as possible:

```javascript
that.applier.change("parentValue", 4);      // update the parent's model field to hold the value 4
console.log(that.child.model.childValue);   // 4 - The child's model value has been updated
that.child.applier.change("childValue", 5); // update the child's model to hold the value 5
console.log(that.model.parentValue);        // 5 - The parent's model value has been updated
```

## Explicit model relay style ##

This style is used when we require a [Model Transformation](to-do/ModelTransformation.md) rule to mediate between the updates synchronising one model value with another, or more control over the occasions
when the updates occur. 
The simple implicit style is only capable of "moving" the same value between one path and another. Sometimes different models choose different strategies for representing "the same value" &#8212; for example, 
one component might represent a sound volume level on a scale of 0-100, whereas another might use a range of 0-1. 
The framework is capable of accommodating this kind of difference in viewpoint by allowing the user to explicitly list a transformation rule relating one model's instance of a value with another. 
This is done using the `modelRelay` section of a component's top-level options. Here is the layout of this block:

### Model relay block layout ###

<table>
    <thead>
        <tr>
            <th>Option name</th><th>Type</th><th>Description</th><th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>source</code> (usual, but not required)</td>
            <td>String (EL Reference or short local path)</td>
            <td>The source model path to be linked by this relay rule. This option can be omitted if all arguments to the transform are presented as IoC references in its definition &#8212; as, for example, with `fluid.transforms.free`.</td>
            <td><code>"volume"</code> / <code>"{someComponent}.model.volume"</code></td>
        </tr>
        <tr>
            <td><code>target</code> (required)</td>
            <td>String (EL Reference or short local path)</td>
            <td>The target model path to be linked by this relay rule. This option must always be present.</td>
            <td><code>"volume"</code> / <code>"{someComponent}.model.volume"</code></td>
        </tr>
        <tr>
            <td><code>singleTransform</code></td>
            <td>JSON (single <a href="to-do/ModelTransformation.md">Model Transformation</a> rule)</td>
            <td>A short form which can be used where the transformation consists of just a single Model Transformation transform rule. Use either this or <code>transform</code></td>
            <td><code>
{
    type: "fluid.linearScale",
    factor: 100
}
</code>
            </td>
        </tr>
        <tr>
            <td><code>transform</code></td>
            <td>JSON (full <a href="to-do/ModelTransformation.md">Model Transformation</a> document)</td>
            <td>A long form of <code>singleTransform</code> which allows any valid Model Transformation document to be used to mediate the relay. This is an infrequently used form.</td>
            <td>See this <a href="http://wiki.gpii.net/index.php/Architecture_-_Available_transformation_functions">list of available transformation functions</a> for more information.</td>
        </tr>
        <tr>
            <td><code>forward</code> (optional)</td>
            <td>One of the strings <code>never</code>, <code>initOnly</code>, <code>liveOnly</code> or <code>always</code> (the default)</td>
            <td>Control the situations in which the <a href="#controlling-propagation-through-a-relay-rule">forward leg</a> of the transform operates - <code>initOnly</code> will have it only operated during the <a href="#the-initial-transaction">initial transaction</a> that this 
            component participates in, and <code>liveOnly</code> will only have it operated after construction of the component (at all times other than the initial transaction).</td>
            <td><code>initOnly</code></td> 
        </tr>
        <tr>
            <td><code>backward</code> (optional)</td>
            <td>One of the strings <code>never</code>, <code>initOnly</code>, <code>liveOnly</code> or <code>always</code> (the default)</td>
            <td>Control the situations in which the <a href="#controlling-propagation-through-a-relay-rule">backward leg</a> of the transform operates &#8212; assuming that it is already an invertible transformation. The same meaning for the codes as for <code>forward</code>
            <td><code>liveOnly</code></td>
        </tr>
    </tbody>
</table>

Here is an example of two components linked by explicit model relay representing the situation we described earlier:

```javascript
fluid.defaults("examples.explicitModelRelay", {
    gradeNames: "fluid.modelComponent",
    model: {
        volume: 95
    },
    components: {
        child: {
            type: "fluid.modelComponent",
            options: {
                modelRelay: {
                    source: "{examples.explicitModelRelay}.model.volume",
                    target: "volume",
                    singleTransform: {
                        type: "fluid.linearScale",
                        factor: 0.01
                    }
                }
            }
        }
    }
});

var that = examples.explicitModelRelay();
console.log(that.child.model.volume); // 0.95 - transformed during the initial transaction to sync with outer value
that.applier.change("volume", 50);
console.log(that.child.model.volume); // 0.5 - transformed to update with outer value
that.child.applier.change("volume", 1);
console.log(that.model.volume);       // 100 - inverse transformed to accept update from child component
```

In general those transformations which are _**invertible**_ are the best choice for this kind of linkage. If the transforms are not invertible (or have no inverse defined in the framework), 
the updates will propagate only in one direction. This can still be highly useful. In addition to its invertibility, the propagation of updates through a relay rule can be fine-tuned by the options
`forward` and `backward`, as described in the following section.

#### Controlling propagation through a relay rule ####

Each explicit relay rule can accept options `forward` and `backward` which allows the configurer to control the occasions on which the relay is operated in those directions &#8212; that is, `forward` representing
the direction from `source` to `target`, and `backward` representing the direction from `target` to `source`. If the transform is not
invertible, the `backward` option is ignored, and the system will behave as if it read `backward: "never"`. The control which can be exerted is over whether the relay is operated either during the
<a href="#the-initial-transaction">initial transaction</a>, the "mature life" of the component after construction, or neither, or both. The default value for these options is `"always"` which
implies that the system will always operate the relay rule if it can. 

Restricting the relay to `liveOnly` in one direction can often be useful to express the fact that whatever default value is 
configured into the model at the other end of the relay is to be ignored. This is frequently useful, since default model values typically propagate outwards from an implementation core and
are normally expected to overwrite defaults which are held in more reusable components held at the periphery. 

A rule of `never` can be useful to express the fact that a particular component
is only expected to act as a source of updates and is not prepared to act on them from the outside &#8212; it may control some kind of device, for example, which by construction cannot accept input.

A rule of `initOnly` is less often useful, but can be helpful in controlling the process whereby initial default values of more abstract kinds of models are computed.

Compare these directives with the related ones used for source guarding in [model listeners](ChangeApplierAPI.md#source-tracking-and-filtering-in-model-listener-blocks) (`init`, `relay` and `local`).

#### General notes on model relay rules ####

**NOTE**: Any plain function which accepts one argument and returns one argument is suitable to appear in the `type` field of a `transform` or `singleTransform` rule &#8212; e.g. `fluid.identity`. This is a quick and easy way
of setting up "ad hoc" transforms. If the function accepts multiple arguments, or an argument which holds a complex structure derived from several values around the model, you should instead use the transform with type
`fluid.transform.free` and encode them in its option named `args`. Note that no such transforms will be invertible &#8212; they can only propagate updates from `source` to `target`.

**NOTE**: The documentation for the <a href="http://wiki.gpii.net/index.php/Architecture_-_Available_transformation_functions">available transformation functions</a> mentions, for each input or output of the transform, 
a parallel option whose name ends in `Path` - e.g. `inputPath`, `outputPath`, `leftPath`, `rightPath`, etc. - **_these forms with `Path` are not used in relay documents_** &#8212; the relay system automatically takes up
the role of gearing values to the arguments of transforms when you write an IoC reference in any of those slots. Relay documents are just written with the simple option names, e.g. `input`, `output`, `left`, `right` etc. 

## Note on future evolution and some technicalities ##

The use of the term "transactions" to describe the process by which the model skeleton updates is not entirely consistent with its use elsewhere in the industry. 
Those interested in more semantic and detailed discussion can consult [New Notes on the ChangeApplier](http://wiki.fluidproject.org/display/fluid/New+Notes+on+the+ChangeApplier) 
which describes how the new relay-capable implementation differs from the old one, and how our approach to and thinking about coordinated model updates is different to that of other frameworks.
A more recent page of notes describing the future evolution of model relay can be found at [New New Notes on the ChangeApplier](http://wiki.fluidproject.org/display/fluid/New+New+Notes+on+the+ChangeApplier).
