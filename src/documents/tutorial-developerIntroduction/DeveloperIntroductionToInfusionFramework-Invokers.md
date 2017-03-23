---
title: Developer Introduction to the Infusion Framework - Invokers
layout: default
category: Tutorials
---

All Infusion components support the definition of public functions using [invokers](/infusion/development/Invokers.md); among other things, invokers allow related components to have different internal implementations of a function but present a common function to be called by other code. If we imagine a "Hello, World!" component, there are a variety of ways it might say "hello". Two of them are:

* By printing to the web developer console via `console.log`
* By displaying a message on a web page

We'll define the first approach as an invoker on the "Hello, World!" component. Other styles of invokers are possible (such as ones referring to a function by name), but we'll use one here that lets us refer to a function of an existing Javascript object, such as `console`.

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/MJbgEx?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.component"],
    invokers: {
        // Creates a function on the component         
        // referred to by name 'sayHello'
        sayHello: {
            // Configures this invoker to use the console object
            // The value of "this" should be a variable name
            // referring to an existing object
            //
            // On the framework implentation side, the invoker uses
            // Function.prototype.apply(), hence the use of "this"
            // to refer to the object the function is intended to
            // be called on (the "console" object in this case)
            //
            // see  [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply] for more about the "this" concept
            // in Javascript
            "this": "console",
            // Configures this invoker to use the log function of the console
            // object
            "method": "log",
            // Configures the arguments to pass to the method
            "args": ["Hello, World!"]
        }
    }
});
```

Now at the console we can create an instance of the component and call the invoker as a function to say hello:

```
> var helloWorld = fluid.helloWorld({});
> helloWorld.sayHello();
```

Next: [Events and Inversion of Control](DeveloperIntroductionToInfusionFramework-EventsAndInversionOfControl.html)
