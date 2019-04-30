---
title: Renderer Components
layout: default
noteRendererChangesPost15: true
category: Infusion
---

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

* create `that.model`, using `options.model` if available (creating an empty object if not)
* fetch any resources (such as HTML templates, etc.) specified in `options.resources`
* create a renderer function and attach it to your `that` object as `that.render(tree);`

## Options for Renderer Components

While developers are free to define whatever options they like for their component, a component descended from
`fluid.rendererComponent`  will also understand certain options specific to the Renderer:

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>model</code></td>
            <td>
                The <strong>data model</strong> to which value bindings expressed within the tree will be expressed
            </td>
            <td>Object</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>resources</code></td>
            <td>
                A list of resources (such as HTML files, CSS files, data files) that are required by the component.
            </td>
            <td>
                Object as required by <a
                href="https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/FluidRequests.js#L24-L50">fluid.fetchResources</a>
            </td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>resolverGetConfig</code></td>
            <td>
                Configuration functions to be applied to any data retrieved from the model
            </td>
            <td>Array of Functions</td>
            <td>The raw value will be retrieved unchanged.</td>
        </tr>
        <tr>
            <td><code>resolverSetConfig</code></td>
            <td>
                Configuration functions to be applied to any data being saved in the model
            </td>
            <td>Array of Functions</td>
            <td>The raw value will be saved unchanged.</td>
        </tr>
        <tr>
            <td><code>rendererOptions</code></td>
            <td>
                Options that will be included in the <code>rendererFnOptions</code> as <code>rendererOptions</code>
            </td>
            <td>Object</td>
            <td></td>
        </tr>
        <tr>
            <td><code>rendererFnOptions</code></td>
            <td>
                Options that will be passed directly to the renderer creation function
            </td>
            <td>Object</td>
            <td>
                See the documentation for <a
                href="https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/renderer/js/RendererUtilities.js#L62-L100">fluid.renderer.createRendererSubcomponent</a>
            </td>
        </tr>
        <tr>
            <td><code>selectors</code></td>
            <td>
                A set of named selectors that will be converted to cutpoints for use by the renderer
            </td>
            <td>Object</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>repeatingSelectors</code></td>
            <td>
                A list of any of the named selectors that reference elements that will be repeated when renderer (e.g.
                rows in a table)
            </td>
            <td>Array of Strings</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>selectorsToIgnore</code></td>
            <td>
                A list of any of the named selectors that should not be included in the renderer cutpoints
            </td>
            <td>Array of Strings</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>protoTree</code></td>
            <td>
                A data structure that represents the binding between the contents and data. Also see <a
                href="RendererComponentTrees.md">Renderer Component Trees</a> for more detail.
            </td>
            <td>Object</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>produceTree</code></td>
            <td>A user-defined function that returns protoTree</td>
            <td>Function</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>renderOnInit</code></td>
            <td>
                A flag indicating whether or not the component should render itself automatically after initialization.
            </td>
            <td>Boolean</td>
            <td>false</td>
        </tr>
    </tbody>
</table>

## Events for Renderer-bearing Components

_Note: The 3 events are fired in the order of prepareModelForRender, onRenderTree, afterRender. They are only intended
for use by experts._

### prepareModelForRender

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires before the generation of protoTree. Whatever adjustment on the model, which is the
                protoTree is generated based on, is ideal to be performed at this event.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt><dfn><code>model</code></dfn></dt>
                    <dd>
                        The internal <a href="tutorial-gettingStartedWithInfusion/ModelComponents.md">Model
                        Component</a> that is used by this renderer component.
                    </dd>
                    <dt><dfn><code>applier</code></dfn></dt>
                    <dd>
                        The internal <a href="ChangeApplier.md">Change Applier Component</a> that is used by this
                        renderer component.
                    </dd>
                    <dt><dfn><code>that</code></dfn></dt>
                    <dd>The reference to the current renderer component.</dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>None</td>
        </tr>
        <tr>
            <th>Note</th>
            <td>
                The first event to be fired before events <code>onRenderTree</code> and <code>afterRender</code>.
            </td>
        </tr>
    </tbody>
</table>

### onRenderTree

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires right before protoTree is rendered. This event is ideal for the final manipulation of
                the fully expanded protoTree.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt><dfn><code>that</code></dfn></dt>
                    <dd>
                        The reference to the current renderer component.
                    </dd>
                    <dt><dfn><code>tree</code></dfn></dt>
                    <dd>
                        Expanded renderer tree.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>None</td>
        </tr>
        <tr>
            <th>Note</th>
            <td>
                The event fired after <code>prepareModelForRender</code> and before <code>afterRender</code>.
            </td>
        </tr>
    </tbody>
</table>

### afterRender

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>This event fires after protoTree is rendered.</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt><dfn><code>that</code></dfn></dt>
                    <dd>
                        The reference to the current renderer component.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>None</td>
        </tr>
        <tr>
            <th>Note</th>
            <td>
                The event fired after <code>onRenderTree</code> and <code>afterRender</code>.
            </td>
        </tr>
    </tbody>
</table>

## Functions on "that"

### render(tree)

```javascript
that.render(tree);
```

Expands the provided `tree`, generates cutpoints, and renders the `tree`.

### produceTree()

```javascript
that.produceTree();
```

This function is only present if a `protoTree` has been provided in the options. This function can be overridden by
providing a `produceTree` in the options.

### refreshView()

```javascript
that.refreshView();
```

This function calls `that.render(that.produceTree());` This function is only present if a `protoTree` has been provided
in the options.

## Example: Rendering a select box

```javascript
fluid.defaults("fluid.examples.renderer", {
    gradeNames: ["fluid.rendererComponent"],
    selectors: {
        textFont: ".flc-examples-text-font",
        notInProtoTree: ".flc-examples-not-in-protoTree"
    },
    // "selectorsToIgnore" is an array of all the selectors
    // that are defined in "selectors" but not used in
    // "protoTree". It tells renderer not to generate cutpoints
    // for these selectors.
    selectorsToIgnore: ["notInProtoTree"],
    model: {
        textFontNames: ["Serif", "Sans-Serif", "Arial"],
        textFontList: ["serif", "sansSerif", "arial"],
        textFontValue: ""
    },
    rendererOptions: {
        autoBind: true
    },
    renderOnInit: true,
    protoTree: {
        // "textFont" is an ID that is defined in "selectors"
        // option
        textFont: {
            // "textFontNames", "textFontList", "textFontValue"
            // must be defined in "model"
            optionnames: "${textFontNames}",
            optionlist: "${textFontList}",
            selection: "${textFontValue}"
        }
    },
    resources: {
        template: {
            forceCache: true,
            url: "examples-rederer.html"
        }
    }
});


var that = fluid.examples.renderer("#options");
```

The template _"examples-rederer.html"_ looks like,

```html
<form id="options" action="">
    <label for="text-font" class="fl-label">Font style:</label>
    <select class="flc-examples-text-font" id="text-font">
    </select>
</form>
```

This example uses a renderer component to generate a drop down list box. The `protoTree` is the key option that
establishes the binding between the `selectors` and data presented in `model`.
