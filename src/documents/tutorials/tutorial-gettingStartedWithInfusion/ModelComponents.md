---
title: Model Components
layout: default
category: Tutorials
---

---
Part of the [Getting Started with Infusion Component Design Tutorial](GettingStartedWithInfusion.md)

---

Many components manage an internal [model](../FrameworkConcepts.md#model-objects). For example:

* the Infusion [Pager](../to-do/Pager.md) component, which allows users to break up long lists of items into separate
  pages, maintains a model including what the current page is, how many items are shown per page, how the list is
  sorted, etc.
* the Infusion [UI Options](../to-do/UserInterfaceOptions.md) component uses a slider that maintains a model including
  the minimum and maximum values and the current setting

The Infusion Framework provides supports for model-bearing components. When you declare a component to be a **model
component**, the Framework will automatically construct a ChangeApplier, which wraps the model with special functions
that can be used to query and modify the model. The [ChangeApplier](../ChangeApplier.md) helps to manage changes to the
model, by maintaining lists of subscribers who can register interest in changes to different parts of it, and
coordinating updates to this component's model with updates to other component models which are linked to it. It also
allows you to add checks that can prevent changes to the model if necessary (e.g validation).

## Declaring a Model Component

To use a model with your component, you need to use the `fluid.modelComponent` grade. To do this:

* specify a grade of `fluid.modelComponent`, or a grade derived from it (such as `fluid.viewComponent`, etc.) as part of
  your component's parent grades
* Optionally, you may include a model property in your defaults holding some initial values suitable for your
  component's model

```javascript
fluid.defaults("tutorials.modelBearingComponent", {
    gradeNames: ["fluid.modelComponent"],
    // ...
    model: {
        // ...
    }
});
```

## Example: Currency Converter

We can extend our currency converter example from the previous section by storing a set of rates for different
currencies in its model, as well a user's selected currency and its value in original and converted forms:

```javascript
fluid.defaults("tutorials.currencyConverter", {
    gradeNames: "fluid.modelComponent",
    model: {
        rates: {
            euro: 0.712,
            yen: 81.841,
            yuan: 6.609,
            usd: 1.02,
            rupee: 45.789
        },
        currentSelection: "euro",
        amount: 0,
        convertedAmount: 0
    },
    events: {
        conversionUpdated: null
    },
    invokers: {
        updateCurrency: {
            changePath: "currentSelection",
            value: "{arguments}.0"
        },
        updateRate: {
            funcName: "tutorials.currencyConverter.updateRate",
            args: ["{that}", "{arguments}.0", "{arguments}.1"] // currency, newRate
        },
        updateAmount: {
            funcName: "tutorials.currencyConverter.updateAmount",
            args: ["{that}", "{arguments}.0"] // amount
        }
    },
    modelListeners: {
        convertedAmount: {
            funcName: "{that}.events.conversionUpdated.fire",
            args: "{change}.value"
        }
    }
});

tutorials.currencyConverter.updateRate = function (that, currency, newRate) {
    that.applier.change(["rates", currency], newRate);
};

tutorials.currencyConverter.updateAmount = function (that, amount) {
    var convertedAmount = amount * that.model.rates[that.model.currentSelection];
    that.applier.change("convertedAmount", convertedAmount);
};
```

## Contents of the Model and Its Relation to Other Models

The `model` record can consist of any JSON material, as well as containing [IoC references](../IoCReferences.md) to the
models and options of other components, as well as [expanders](../ExpansionOfComponentOptions.md). Any IoC references to
another component's model will set up a permanent [model relay](../ModelRelay.md) between the two models at the
endpoints of the reference. This relay will be bidirectional - any updates propagated into either of the models linked
by the relay by their respective ChangeAppliers will be relayed into the model at the other end of the link.

## Using The Change Applier

The Framework will attach both your model and its ChangeApplier to the component object as top-level properties. Your
methods can read the model directly, using `that.model.<some-path>`, but the ChangeApplier should be used to make any
changes to the model, using `that.applier.change();`.

## Example: Dated Component

As an example, let's consider a component that need to record a date. Your `model` will include a date field - if you
wished to give it an initial default value of `null` (actually this practice is not recommended - it is better to only
supply default values which are actually useful in a particular context), it could be initialised as follows:

```javascript
fluid.defaults("tutorials.modelBearingComponent", {
    gradeNames: ["fluid.modelComponent"],
    // ...
    model: {
        date: null
    }
});
```

Suppose that you want the `date` initialized to the current date at the time the component is instantiated, and you want
this to happen before other component initialization happens. You can specify an initial value for the `date` field by
use of an IoC facility known as an [expander](../ExpansionOfComponentOptions.md#expanders). This allows you to schedule
the action of any function during the initialization process and have the results entered into the component's
configuration. Our work comes in two parts - firstly, writing a global helper function which returns the current date,
named `tutorials.getCurrentDate`. The second part writes an expander within the model definition to invoke our helper
function:

```javascript
tutorials.getCurrentDate = function () {
    return new Date();
};

fluid.defaults("tutorials.datedComponent", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        date: {
            expander: {
                funcName: "tutorials.getCurrentDate"
            }
        }
    }
});
```

<div class="infusion-docs-note">

<strong>Note:</strong> There is a [compact form](../ExpansionOfComponentOptions.md#compact-format-for-expanders) for
writing an expander as a single string - we could have written the above definition instead with `date:
"@expand:tutorials.getCurrentDate()"` in place of the small JSON block inside the model.
</div>

## Example: Currency Converter

The currency converter example we presented on the previous page might be more helpful if it supported more than one
conversion rate. We can use a model to hold the available rates and to keep track of the currently-selected rate. We
define this model in the component's defaults:

```javascript
fluid.defaults("tutorials.currencyConverter", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        currentSelection: "euro",
        rates: {
            euro: 0.712,
            yen: 81.841,
            yuan: 6.609,
            usd: 1.02,
            rupee: 45.789
        }
    },
    invokers: {
        updateCurrency: {
            changePath: "currentSelection",
            value: "{arguments}.0"
        },
        updateRate: {
            funcName: "tutorials.currencyConverter.updateRate",
            args: ["{that}", "{arguments}.0", "{arguments}.1"] // currency, newRate
        },
        convert: {
            funcName: "tutorials.currencyConverter.convert",
            args: ["{that}", "{arguments}.0"] // amount
        }
    }
});


tutorials.currencyConverter.updateRate = function (that, currency, newRate) {
    that.applier.change(["rates", currency], newRate);
};

tutorials.currencyConverter.convert = function (that, amount) {
    return amount * that.model.rates[that.model.currentSelection];
};
```

Next: [View Components](ViewComponents.md)
