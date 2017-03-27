---
title: Developer Introduction to the Infusion Framework - Invokers
layout: default
category: Tutorials
---

All Infusion components support the definition of public functions using [invokers](../Invokers.md); among other uses, invokers allow related components to have different internal implementations of a function but present a common function to be called by other code. If we imagine a "Hello, World!" component, there are a variety of ways it might say "hello". Two of them are:

* By printing to the web developer console via `console.log`
* By displaying a message on a web page

While there are [other styles of invokers possible](../Invokers.html#types-of-invokers), here we will use a style that allows us to refer to a free function (one not attached to a specific object).

<!-- TODO: expand discussion and examples of invokers per exchange at https://github.com/fluid-project/infusion-docs/pull/114#discussion_r107857678 -->

<div class="infusion-docs-note">You can check out the [Live Example of the code below on CodePen](http://codepen.io/waharnum/pen/MJbgEx?editors=1111)</div>

```
fluid.defaults("fluidTutorial.helloWorld", {
    gradeNames: ["fluid.component"],
    invokers: {
        // Creates a function on the component         
        // referred to by name 'sayHello'
        sayHello: {                        
            // The value of "funcName" is the full name of
            // a free function
            funcName: "fluidTutorial.helloWorld.consoleHello",
            // Configures the arguments to pass to the function
            args: ["Hello, World!"]
        }
    }
});

// Now we define the function to be called by the invoker;
// notice how it shares the same namespace (this is not a
// requirement, but it is recommended practice).
fluidTutorial.helloWorld.consoleHello = function (message) {
    console.log(message);
};

```

Now at the console we can create an instance of the component and call the invoker as a function to say hello:

```
> var helloWorld = fluidTutorial.helloWorld({});
> helloWorld.sayHello();
```

You will notice that the function we defined expects one argument, but we call the invoker without any arguments; this is because we've specified the argument to be supplied as part of the invoker.

Next: [Events and Inversion of Control](DeveloperIntroductionToInfusionFramework-EventsAndInversionOfControl.html)
