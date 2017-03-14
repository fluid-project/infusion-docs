---
title: Developer Introduction to the Infusion Framework - Listening to Model Changes
layout: default
category: Tutorials
---

A common pattern in Infusion is to listen to changes to a component's model and then take further action to change the state of the DOM or another component. Let's implement this for the message displayed on the web page by our "Hello, World!" component, so that it will update its message whenever the model is changed:

<div class="infusion-docs-note">You can check out the [Live Example](http://codepen.io/waharnum/pen/oBYvPB?editors=1111) of the code below on [CodePen](http://codepen.io/)</div>

```
fluid.defaults("fluid.helloWorld", {
    gradeNames: ["fluid.viewComponent"],
    model: {
        message: "Hello, World!"
    },
    selectors: {
        messageArea: ".flc-messageArea"
    },
    listeners: {
        "onCreate.sayHello": "{that}.sayHello"
    },
    // Listen to the model.message path
    // this includes the initial setting of the model when the
    // component is created
    modelListeners: {
        "message": "{that}.displayHello"
    },
    invokers: {
        sayHello: {
            "this": "console",
            "method": "log",
            "args": ["{that}.model.message"]
        },
        displayHello: {
            // DOM node as a jQuery object
            "this": "{that}.dom.messageArea",
            // Calls the 'html' function to replace the HTML at the node
            "method": "html",
            "args": ["{that}.model.message"]
        }
    }
});
```

Next: [Subcomponents and Model Relaying](/tutorial-developerIntroduction/DeveloperIntroductionToInfusionFramework-SubcomponentsAndModelRelaying.html)
