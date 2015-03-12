---
title: Using String Templates
layout: default
---

# Using String Templates #

In the Infusion [Preference Framework](../PreferencesFramework.md), a "string template" is a mechanism for resolving variables within a string.

This tutorial covers why you might use string templates, and gives a basic example of how to use string templates to:

1.  Define "templates" (strings containing variables)
2.  Define "terms", variables that will be replaced in templates.
3.  Override "terms" and "templates" from a child component.

This tutorial assumes that you are already familiar with [Infusion](../tutorial-gettingStartedWithInfusion/GettingStartedWithInfusion.md), and in particular with:

1. [Defining components](../tutorial-gettingStartedWithInfusion/BasicComponentCreation-LittleComponents.md)
2. [Defining invokers](../Invokers.md)
3. [Defining and using expanders](../ExpansionOfComponentOptions.md)

## Why do we need "string templates"?

Let's talk about a common use case, in which we want to describe the location of files (configuration files, etc.) within a component's options.  If we have a single file location, a full path is relatively easy to update.

If we have a long list of paths, people who wish to extend or even configure our component must laboriously copy the full list of file paths and customize each one.  This is likely to lead to "copy and paste" errors and unexpected behavior.  It would be better if users could specify their own home directory and have all of our file paths work relative to that new location.

String templates give us the ability to describe things like file paths using values like `%myPath/myFilename`.  The percent values are placeholders for variable content that is replaced using a call to `fluid.stringTemplate` with the right options.

## Writing a component that uses `fluid.stringTemplate`.

Here is a simple component that has a `templates` block (containing strings with variables) and a `terms` block (containing a map of variable names and replacement values).  These names are arbitrary, you can name each of these whatever is most meaningful for you component.

You could also use an `expander` to provide "convenience" variables with the transformed values, as in the following example:


```javascript
  "use strict";
  var fluid = fluid || require("infusion");
  var gpii  = fluid.registerNamespace("gpii");

  fluid.registerNamespace("gpii.sandbox.variables.simpler");
  fluid.defaults("gpii.sandbox.variables.simpler", {
      gradeNames: ["autoInit", "fluid.littleComponent"],
      transformed: {
          expander: {
              func: "{that}.parseTemplates"
          }
      },
      terms:      {
          one: "base one",
          two: "base two"
      },
      templates: {
          one: "The term named 'one' is set to '%one'.",
          two: "The term named 'two' is set to '%two'."
      },
      invokers: {
          parseTemplates: {
              funcName: "fluid.transform",
              args: ["{that}.options.templates","{that}.transformTemplate"]
          },
          transformTemplate: {
              funcName: "fluid.stringTemplate",
              args: ["{arguments}.0", "{that}.options.terms"]
          }
      }
  });

  var simpler = gpii.sandbox.variables.simpler({});
  console.log("transformed options:\n" + JSON.stringify(simpler.options.transformed, null, 2));
```

That produces output like the following:

```
  transformed options:
  {
    "one": "The term named 'one' is set to 'base one'.",
    "two": "The term named 'two' is set to 'base two'."
  }
```

What makes this all work is our `invokers` block:

```
  invokers: {
      parseTemplates: {
          funcName: "fluid.transform",
          args: ["{that}.options.templates","{that}.transformTemplate"]
      },
      transformTemplate: {
          funcName: "fluid.stringTemplate",
          args: ["{arguments}.0", "{that}.options.terms"]
      }
  }
```

The `parseTemplates` invoker calls `fluid.transform`, which runs a single function against every item in a map and returns an map containing the transformed results.  We have configured `fluid.transform` to use our `transformTemplate` invoker to process each value in our map.  The `transformTemplate` invoker calls `fluid.stringTemplate` with a list of arguments.  The first argument is expected to point to an array of templates, and the second argument is expected to point to a map of variable names and replacement values.

In our case, the map of variable names and replacement values is already contained in `{that}.options.terms`.  The first argument is supplied by`fluid.transform`, which will pass the value of each array member to our invoker.  Since `fluid.transform` will call our invoker with a single argument, we can use `{arguments}.0` to refer to the information passed by `fluid.transform` in our list of arguments.

The final piece is handled by an [`expander` block](../ExpansionOfComponentOptions.md).

```
  transformed: {
      expander: {
          func: "{that}.parseTemplates"
      }
  },
```

The `expander` block will be replaced with the value returned by our `parseTemplates` invoker, and `logState` is called with the expanded value, which in our case is a map of transformed values.  We will then have sensible output that we can work with.

### Overriding options from a child component

In the next example, we will look at creating a child component that overrides some of our variables in its default configuration.  Here's the updated code:

```javascript
  "use strict";
  var fluid = fluid || require("infusion");
  var gpii  = fluid.registerNamespace("gpii");

  fluid.registerNamespace("gpii.sandbox.variables.base");
  fluid.defaults("gpii.sandbox.variables.base", {
      gradeNames: ["autoInit", "fluid.eventedComponent"],
      terms:      {
          one: "base one",
          two: "base two"
      },
      templates: {
          one: "The term named 'one' is set to '%one'.",
          two: "The term named 'two' is set to '%two'."
      },
      listeners: {
          onCreate: [
              {
                  funcName: "gpii.sandbox.variables.base.logState",
                  args:     ["{that}", {expander: {func: "{that}.parseTemplates"}}]
              }
          ]
      },
      invokers: {
          parseTemplates: {
              funcName: "fluid.transform",
              args: ["{that}.options.templates","{that}.transformTemplate"]
          },
          transformTemplate: {
              funcName: "fluid.stringTemplate",
              args: ["{arguments}.0", "{that}.options.terms"]
          }
      }
  });

  gpii.sandbox.variables.base.logState = function (that, parsed) {
      console.log("\nMy friends call me '" + that.nickName + "'...");
      console.log("terms -> one: " + that.options.terms.one);
      console.log("terms -> two: " + that.options.terms.two);
      console.log("template one: " + that.options.templates.one);
      console.log("template two: " + that.options.templates.two);
      console.log("one, parsed : " + parsed.one);
      console.log("two, parsed : " + parsed.two);
  };

  fluid.registerNamespace("gpii.sandbox.variables.child");
  fluid.defaults("gpii.sandbox.variables.child", {
      gradeNames: ["autoInit", "gpii.sandbox.variables.base"],
      templates: {
          one: "The term named one is set to '%one', also, I am a custom template."
      },
      terms:      {
          two: "child two"
      }
  });

  gpii.sandbox.variables.child({});
```

For this example, we're using our own invoker (`logState`) to display a range of variables.  The `logState` function is called when our component is created, as configured in our `listeners` block:

```javascript
  listeners: {
      onCreate: [
          {
              funcName: "gpii.sandbox.variables.base.logState",
              args:     ["{that}", {expander: {func: "{that}.parseTemplates"}}]
          }
      ]
  },
```

We are calling our `logState` function directly, with a full list of arguments (we could also have defined an invoker).  Again, we used an `expander` to call `parseTemplates`, but `logState` doesn't know about or care about that part of the process.  It just ends up with a map of transformed values.

We also added a child component, `gpii.sandbox.variables.child`.  We have overridden one of the `terms` and one of the `templates`.  This code produces output like:

```
  My friends call me 'child'...
  terms -> one: base one
  terms -> two: child two
  template one: The term named one is set to '%one', also, I am a custom template.
  template two: The term named 'two' is set to '%two'.
  one, parsed : The term named one is set to 'base one', also, I am a custom template.
  two, parsed : The term named 'two' is set to 'child two'.
```

We could also have created an instance of the parent variable using code like:

```javascript
  gpii.sandbox.variables.base({
    templates: {
        one: "The term named one is set to '%one', also, I am a custom template."
    },
    terms:      {
        two: "configured two"
    }
  });
```

This would product output like:

```
  My friends call me 'base'...
  terms -> one: base one
  terms -> two: configured two
  template one: The term named one is set to '%one', also, I am a custom template.
  template two: The term named 'two' is set to '%two'.
  one, parsed : The term named one is set to 'base one', also, I am a custom template.
  two, parsed : The term named 'two' is set to 'configured two'.
```

This should give you a good idea how to extend or adapt existing components that use string templates.

### Working with empty values

It is important to know what happens when a term is missing or has no value.  Here's a quick example that covers a few common problems.

```javascript
  "use strict";
  var fluid = fluid || require("infusion");
  var gpii  = fluid.registerNamespace("gpii");

  fluid.registerNamespace("gpii.sandbox.variables.empty");
  fluid.defaults("gpii.sandbox.variables.empty", {
      gradeNames: ["autoInit", "fluid.littleComponent"],
      transformed: {
          expander: {
              func: "{that}.parseTemplates"
          }
      },
      terms:      {
          one: "value one",
          two: "value two"
      },
      templates: {
          one:   "The term named 'one' is set to '%one'.",
          two:   "The term named 'two' is set to '%two'.",
          three: "The term named 'three' is set to '%three'."
      },
      invokers: {
          parseTemplates: {
              funcName: "fluid.transform",
              args: ["{that}.options.templates","{that}.transformTemplate"]
          },
          transformTemplate: {
              funcName: "fluid.stringTemplate",
              args: ["{arguments}.0", "{that}.options.terms"]
          }
      }
  });

  var simpler = gpii.sandbox.variables.empty({
      terms: {
          one: null,
          two: "{empty}.options.bad.reference"
      }
  });
  console.log("transformed options:\n" + JSON.stringify(simpler.options.transformed, null, 2));
```

The output returned is:

```
  transformed options:
  {
    "one": "The term named 'one' is set to 'null'.",
    "two": "The term named 'two' is set to 'value two'.",
    "three": "The term named 'three' is set to '%three'."
  }
```

We directly set the value of the term `one` to `null`, and that value was displayed in the transformed results, just as it would if we used string concatenation with a `null` value.

Our configuration attempted to use a (bad) IoC reference to replace the value of the term `two`.  Since the reference was not resolved, the default value from our `fluid.defaults` was used instead.

There is no term defined that corresponds to the template `three`.  Variables with no corresponding `term` are left as raw percent references.  You can use the percent operator in templates without escaping it, but be aware that if anyone adds a `term` that matches the value after the percent sign, the results may be unexpected.

If you're having trouble with your transformed output, this example will hopefully help you troubleshoot further.