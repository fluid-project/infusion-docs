---
title: How To Use The Renderer
layout: default
noteRendererChangesPost15: true
category: Infusion
---

There are several different ways to use the Infusion [Renderer](Renderer.md), including the recommended Renderer
Component and various Renderer functions.

## Recommended Ways of Using the Renderer

### Renderer Component

If you are creating a component that requires the use of the Renderer, you should use the `fluid.rendererComponent`
grade as a [parent grade](ComponentGrades.md) in your component's defaults block:

```javascript
fluid.defaults("my.component", {
    gradeNames: ["fluid.rendererComponent"]
    // put your options here
});

var that = my.component();
```

This function automates the work of constructing a component creator function, applying the Renderer, fetching
templates, configuring cutpoints based on the DOM binder, as well as localisation via the string bundle.

This function will:

* create `that.model`, using options.model if available (creating an empty object if not)
* fetch any resources (such as HTML templates, etc.) specified in `options.resources`
* create a renderer function and attach it to your `that` object as `that.render(tree);`

For detailed information on how to use this method, see [Renderer Components](RendererComponents.md).

### fluid.render

If you are not using `fluid.rendererComponent`, you can use the primary renderer function,
[fluid.render](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/renderer/js/fluidRenderer.js#L1551-L1570):

```javascript
var template = fluid.render(source, target, tree, options);
```

This function can be used at any time to render a component tree. This function will render the component tree into the
`target` node, using the `source` (which either references a DOM node or contains a string) as the template.

For detailed information on how to use this function, see
[fluid.render](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/renderer/js/fluidRenderer.js#L1551-L1570).

### fluid.selfRender

This function is similar to
[fluid.render](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/renderer/js/fluidRenderer.js#L1551-L1570),
except that it assumes that the markup used to source the template is within the target node:

```javascript
var template = fluid.selfRender(node, tree, options);
```

For detailed information on how to use this function, see
[fluid.selfRender](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/renderer/js/fluidRenderer.js#L1572-L1588).

## Other Renderer Functions

In addition to these primary ways of using the Renderer, there are a several other functions that are useful in certain
circumstances. These are described here.

### fluid.reRender

For detailed information on how to use this function, see
[fluid.reRender](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/renderer/js/fluidRenderer.js#L1480-L1527).

### fluid.fetchResources

For detailed information on how to use this function, see
[fluid.fetchResources](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/FluidRequests.js#L24-L50).
