---
title: Define a namespace and create a closure
layout: default
category: Tutorials
---

---
Part of the [Getting Started with Infusion Component Design Tutorial](GettingStartedWithInfusion.md)

---

Infusion code generally follows a few conventions that we recommend, and that we'll use in this tutorial. We'll start
with two of them:

1. namespacing, and
2. closures

### Namespacing

We define a namespace for our code: a single global variable that becomes the container for the code. This means there's
less chance of bad interactions with other code: Anything we want to be public will be attached to this object, so all
of our code will be qualified by the namespace.

### Closures

By wrapping the code inside an anonymous function, we can separate private and public functions. Only objects or
functions that are attached to the global namespace object will be publicly available. Anything else inside the
anonymous function will be invisible to the rest of the world. In general, we recommend against the use of private
definitions since they inhibit other developers from getting value from your code. Write every function and piece of
data as a public member of your namespace, with a suitable comment if you don't intend them to form a stable part of
your API. Of course, make sure not to write any mutable shared state in public - in general, you should make sure any
mutable state is packaged as part of a [Model-bearing Component](ModelComponents.md).

## General Structure

So what does this look like in general?

```javascript
(function ($, fluid) {
    fluid.registerNamespace("mynamespace");

    // a private function, only accessible to other things
    // inside this closure - this is discouraged
    var privateFunc = function () {
        // ...
    };

    // a public function, attached to the namespace - this is recommended
    mynamespace.publicFunc = function () {
        // ...
    };

})(jQuery, fluid_2_0);
```

You might like to think of the
[`fluid.registerNamespace`](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/Fluid.js#L957-L966)
call as equivalent to a line such as `var mynamespace = mynamespace || {};` written at the global scope. It is less
cumbersome and more expressive of your intention, as well as easily allowing you to declare nested namespaces in one
definition. Use this framework utility unless your requirements are very sophisticated.

The parameters to the anonymous function, `$` and `fluid`, will be used as shorthand for the arguments that were passed
in: `jQuery` and `fluid_2_0` respectively. This allow us, for example, to upgrade to the next version of Infusion (e.g.
`fluid_2_1`) simply by changing the one argument, instead of having to change every single use of the word `fluid`. It
also allows us to have multiple versions of Infusion running at the same time, but acting independently.

### Example

So what might this look like in your currency converter application? Well, you might call the global namespace
`currency` and create a public function called `converter` that can be used by anyone to instantiate a converter
component:

```javascript
(function ($, fluid) {
    fluid.registerNamespace("currency");
    // put any private things the currency converter will need here


    // EITHER: the converter creation function - this is discouraged
    currency.converter = function () {
        // ...
    };
    // OR: a creator function automatically managed by Infusion - this is recommended
    fluid.defaults("currency.converter", {
        // ...
    });

})(jQuery, fluid_2_0);
```

Next: [Pick a Component Type](PickAComponentType.md)
