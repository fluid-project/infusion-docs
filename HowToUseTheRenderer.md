# How To Use The Renderer #

_**Note:** The renderer will undergo significant changes post Infusion 1.5_

## Recommended Ways of Using the Renderer ##

### Renderer Component ###

If you are creating a component that requires the use of the Renderer, you should use the `fluid.rendererComponent` grade as a [parent grade](ComponentGrades.md) in your component's defaults block:

```javascript
fluid.defaults("my.component", {
    gradeNames: ["fluid.rendererComponent", "autoInit"],
    ... // put your options here

});

var that = my.component();
```

This new function automates the work of constructing a component creator function, applying the Renderer, fetching templates, configuring cutpoints based on the DOM binder, as well as localisation via the string bundle.

This function will:

* create `that.model`, using options.model if available (creating an empty object if not)
* fetch any resources (such as HTML templates, etc.) specified in `options.resources`
* create a renderer function and attach it to your `that` object as `that.render(tree);`

For detailed information on how to use this method, see [Renderer Components](RendererComponents.md).


### `fluid.render` ###

If you are not using `fluid.rendererComponent`, you can use the primary renderer function, [fluid.render](fluid.render.md):

```javascript
var template = fluid.render(source, target, tree, options);
```

This function can be used at any time to render a component tree. This function will render the component tree into the `target` node, using the `source` (which either references a DOM node or contains a string) as the template.

For detailed information on how to use this function, see [fluid.render](fluid.render.md).

### `fluid.selfRender` ###

This function is similar to [fluid.render](fluid.render.md), except that it assumes that the markup used to source the template is within the target node:

```javascript
var template = fluid.selfRender(node, tree, options);
```

For detailed information on how to use this function, see [fluid.selfRender](fluid.selfRender.md).

## Other Renderer Functions ##

In addition to these primary ways of using the Renderer, there are a several other functions that are useful in certain circumstances. These are described here.

### `fluid.rerender` ###

For detailed information on how to use this function, see [fluid.reRender](fluid.reRender.md).

### `fluid.fetchResources` ###

For detailed information on how to use this function, see [fluid.fetchResources](fluid.fetchResources.md).
