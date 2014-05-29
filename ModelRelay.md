# Model Relay #

## Overview ##

The Infusion Model Relay system is a powerful scheme for supplying declarative configuration which specifies rules for keeping multiple pieces of model state around the component tree automatically up to date with each other's changes. Because each model relay rule supplies a link between an inner core of models scattered around the component tree, around which other listeners in the periphery of each component (generally, in its view layer) only react after all updates have finished propagating in the model layer, we sometimes refer to the complete set of these linked models as the model skeleton of the component tree.

### Two Styles for Configuring Model Relay ###

There are two primary styles of configuration for setting up model relay - firstly, using the _implicit syntax_ which just consists of [IoC References](IoCReferences.md) from the model configuration for one model-bearing component to another - that is, in the component's configuration under the top-level model entry. Secondly, the _explicit syntax_ involves an entry in the component's top-level `modelRelay` entry expressing a more complex rule, most likely involving some form of [Model Transformation](ModelTransformation.md) to apply during the relay process. Both of these styles will set up a permanent and bidirectional relationship between the two models at the ends of the relay - the relationship will be established as the component(s) construct (during the _[initial transaction](#the-initial-transaction)_), and will persist until one of the components at the endpoints is destroyed.

### How Model Relay Updates Propagate ###

All of a set of models which are linked by relay rules are called a model skeleton. Whenever an update is received to any model which is part of the skeleton (via its [ChangeApplier](ChangeApplier.md)), a "transaction" begins in order to propagate it to all the related models to which it should be synchronised. The framework will keep propagating the change to all the models in the skeleton until they have all been brought up to date - however, these updates will initially occur privately, within the transaction and any external listeners will not be notified during the update process, in order to not become confused by receiving multiple notifications as the synchronisation occurs. Only once the framework has computed final synchronised values for all of the models in the skeleton will the transaction end, and then all listeners (via their respective ChangeAppliers) will be notified all at once.

### The Initial Transaction ###

Whenever a new model-bearing component (or an entire tree of model-bearing components) constructs, there will be a particular large style of update transaction known as an __initial transaction__. This is extremely similar to any other synchronisation transaction caused by a model relay update, although it will typically involve more data since all of the initial values of all the involved models must be taken into account - these result from any of the normal sources for component configuration, including [defaults](fluid.defaults.html), user-supplied values, [distributed](IoCSS.md) options, etc.. During the initial transaction, any declaratively registered listeners will observe all of the new models go through the transition from holding their primordial value of `undefined` to holding their correct synchronised initial values. As with any other relay update transaction, this will appear to all the observers to occur in a single step even though from the point of view of the framework it may be a complex process involving many passes through the components.

## Implicit Model Relay style ##

This is the most straightforward style for setting up model relay. This takes the form of a simple [IoC Reference](IoCReferences.md) between one component's model and other. Here is a component which has a child component which sets up a model relay relationship with it:

```javascript
fluid.defaults("examples.implicitModelRelay", {
    gradeNames: ["fluid.standardRelayComponent", "autoInit"],
    model: {
         parentValue: 3
    },
    components: {
        child: {
            type: "fluid.standardRelayComponent",
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

The IoC expression `{examples.implicitModelRelay}.model.parentValue` here refers from one field of the child's model called `childValue` to one field of the parent's model called `parentValue`. This sets up a permanent model relay linking these two fields. From the construction point onwards, the framework will ensure that all updates made to one field will be reflected in the other. For example, here are some further pieces of code we could write, following on from the above example - these use the programmatic [ChangeApplier API](ChangeApplierAPI.md) although in practice it is desirable to express as many such updates as declaratively as possible:

```javascript
that.applier.change("parentValue", 4); // update the parent's model field to hold the value 4
console.log(that.child.model.childValue); // 4 - The child's model value has been updated
that.child.applier.change("childValue", 5); // update the child's model to hold the value 5
console.log(that.model.parentValue); // 5 - The parent's model value has been updated
```

## Explicit Model Relay Style ##

This style is used when we require a [Model Transformation](ModelTransformation.md) rule to mediate between the updates synchronising one model value with another. The simple implicit style is only capable of "moving" the same value between one path and another. Sometimes different models choose different strategies for representing "the same value" - for example, one component might represent a sound volume level on a scale of 0-100, whereas another might use a range of 0-1. The framework is capable accommodating this kind of difference in viewpoint by allowing the user to explicitly list a transformation rule relating one model's instance of a value with another. This is done using the `modelRelay` section of a component's top-level options. Here is the layout of this block:

### Model Relay Block Layout ###

<table>
    <thead>
        <tr>
            <th>Option name</th><th>Type</th><th>Description</th><th>Example</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>source</td>
            <td>String (EL Reference or short local path)</td>
            <td>The source model path to be linked by this relay rule</td>
            <td><code>"volume"</code> / <code>"{someComponent}.model.volume"</code></td>
        </tr>
        <tr>
            <td>target</td>
            <td>String (EL Reference or short local path)</td>
            <td>The target model path to be linked by this relay rule</td>
            <td><code>"volume"</code> / <code>"{someComponent}.model.volume"</code></td>
        </tr>
        <tr>
            <td>singleTransform</td>
            <td>JSON (single <a href="ModelTransformation.md">Model Transformation</a> rule)</td>
            <td>A short form which can be used where the transformation consists of just a single Model Transformation transform rule</td>
            <td><pre>
{
    type: "fluid.linearScale",
    factor: 100
}
</pre>
            </td>
        </tr>
        <tr>
            <td>transform</td>
            <td>JSON (full <a href="ModelTransformation.md">Model Transformation</a> document)</td>
            <td>A long form which allows any valid Model Transformation document to be used to mediate the relay</td>
            <td>See this <a href="http://wiki.gpii.net/index.php/Architecture_-_Available_transformation_functions">list of available transformation functions</a> for more information.</td>
        </tr>
    </tbody>
</table>

Here is an example of two components linked by explicit model relay representing the situation we described earlier:

```javascript
fluid.defaults("examples.explicitModelRelay", {
    gradeNames: ["fluid.standardRelayComponent", "autoInit"],
    model: {
        volume: 95,
    },
    components: {
        child: {
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
});
 
var that = examples.explicitModelRelay();
console.log(that.child.model.volume); // 0.95 - transformed during the initial transaction to sync with outer value
that.applier.change("volume", 50);
console.log(that.child.model.volume); // 0.5 - transformed to update with outer value
that.child.applier.change("volume", 1);
console.log(that.model.volume); // 100 - inverse transformed to accept update from child component
```

In general those transformations which are _**invertible**_ are the best choice for this kind of linkage. If the transforms are not invertible (or have no inverse defined in the framework), the updates will propagate only in one direction. This can still be highly useful.

## Notes on Future Evolution and some Technicalities ##

For the Infusion 1.5 release we use special versions of the framework grades including the word "relay" in order to gain access to the model relay features described on this page - these are `fluid.modelRelayComponent`, `fluid.standardRelayComponent`, `fluid.viewRelayComponent` and `fluid.rendererRelayComponent` as described on [Component Grades](ComponentGrades.md). This is because the core framework implementation is in the process of being updated to this new relay-capable ChangeApplier and not all of the core components delivered with the framework have been updated to match. Before the 2.0 release the core grades will be updated, allowing the "relay" names to be replaced by the standard ones.

The use of the term "transactions" to describe the process by which the model skeleton updates is not entirely consistent with its use elsewhere in the industry. Those interested in more semantic and detailed discussion can consult [New Notes on the ChangeApplier](http://wiki.fluidproject.org/display/fluid/New+Notes+on+the+ChangeApplier) which describes how the new relay-capable implementation differs from the old one, and how our approach to and thinking about coordinated model updates is different to that of other frameworks.
