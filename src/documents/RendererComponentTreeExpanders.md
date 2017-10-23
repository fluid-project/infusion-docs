---
title: Renderer Component Tree Expanders
layout: default
noteRendererChangesPost15: true
category: Infusion
---

The Renderer offers some utility functions for simplifying the tree-creation process. These functions are called **expanders** because they expand information you provide into a full component tree. These expanders are specified in the prototree itself by name and and are provided options to control the expansion process. For example:

```javascript
var protoTree = {
    expander: {
        type: "fluid.renderer.repeat",
        repeatID: "recordType",
        controlledBy: "recordlist.name",
        pathAs: "elementPath",
        tree: { value: "${{elementPath}}" }
    }
};
```

This prototree above uses the `fluid.renderer.repeat` expander (described in more detail below), which repeats the provided `tree` based on the data found in data model at the path specified by `controlledBy`. The expander saves the developer the work of having to create a prototree with an array of Bound components with a **":"** at the end of the ID (indicating a repeated element), one for each piece of data in the data model:

```javascript
var protoTree = {
    recordType: {
        children: [
            { "recordType:": "${recordlist.name.0}" },
            { "recordType:": "${recordlist.name.1}" },
            { "recordType:": "${recordlist.name.2}" },
            { "recordType:": "${recordlist.name.3}" }
            // ...
        ]
    }
};
```

## Using Expanders

Expanders are specified as wrappers around a component specification in the component tree: Instead of the usual `componentID: {specification}` form, the keyword `expander` is used, as shown below:

```javascript
var tree = {
    expander: {
        type: "fluid.renderer.repeat",
        repeatID: "tab:"
        // ...
    }
};
```

You can also specify multiple expanders within a prototree by providing an array of expander specification in the `expander` field, as shown below:

```javascript
var tree = {
    expander: [
        {
            type: "fluid.renderer.repeat",
            repeatID: "tab:"
            // ...
        },
        {
            type: "fluid.renderer.selection.inputs",
            selectID: "language"
            // ...
        }
        // ...
    ]
};
```

## Available Expanders

### Repetition Expander

The repetition expander takes care of replicating part of the prototree as many times as are required based on the data in the the model.

The following fields are supported by the `fluid.renderer.repeat` expander:

<table>
    <thead>
        <tr>
            <th>Field</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>tree</code></td>
            <td>A prototree snippet to use for the repeated data</td>
            <td>Object</td>
            <td></td>
        </tr>
        <tr>
            <td><code>controlledBy</code></td>
            <td>EL path of repeated data in model</td>
            <td>String</td>
            <td></td>
        </tr>
        <tr>
            <td><code>repeateID</code></td>
            <td>the id to use</td>
            <td>String</td>
            <td></td>
        </tr>
        <tr>
            <td><code>pathAs</code></td>
            <td>
                (<em>Optional</em>) The string that will be used in the tree to represent an instance of the repeated data in the data model.
            </td>
            <td>String</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>type</code></td>
            <td>The type of the expander</td>
            <td><code>fluid.renderer.repeate</code></td>
            <td>N/A</td>
        </tr>
        <tr>
            <td><code>valueAs</code></td>
            <td>(<em>Optional</em>)</td>
            <td>String</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>ifEmpty</code></td>
            <td>(<em>Optional</em>)</td>
            <td>Boolean</td>
            <td>false</td>
        </tr>
    </tbody>
</table>

#### Example

In this example, the `fluid.renderer.repeat` expander is being used to declare a tree for a set of tabs. The `controlledBy` property indicates that the data model field of tabs contains the data to be used.

```javascript
cspace.tabsList.modelToTree = function (model, options) {
    var tree = {
        expander: {
            type: "fluid.renderer.repeat",
            repeatID: "tab:",
            controlledBy: "tabs",
            pathAs: "tabInfo",
            tree: {
                tabLink: {
                    target: "${{tabInfo}.href}",
                    linktext: {
                        messagekey: "${{tabInfo}.name}"
                    }
                }
            }
        }
    };
    return tree;
};
```

### Selection To Inputs Expander

The simple **Select** protocomponent format shown on the [ProtoComponent Types](ProtoComponentTypes.md) page is sufficient for a `<select>` element, but radio buttons and check boxes must _also_ have entries for each button or box. The **selection to inputs** expander will automatically generate these entries based on the options available in the select.

The following fields are supported by the `fluid.renderer.selection.inputs` expander:

<table>
    <thead>
        <tr>
            <th>Field</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>type</code></td>
            <td>The type of the expander</td>
            <td><code>fluid.renderer.selection.inputs</code></td>
            <td>N/A</td>
        </tr>
        <tr>
            <td><code>selectId</code></td>
            <td>The ID of the selection itself.</td>
            <td>String</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>inputId</code></td>
            <td>The ID of the input element associated with the select.</td>
            <td>String</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>rowId</code></td>
            <td>
                The ID of the template for the row that is to be repeated for each possible selection.
            </td>
            <td>String</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>labelId</code></td>
            <td>The ID of the label for the input element.</td>
            <td>String</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>tree</code></td>
            <td>
                (<em>Optional</em>) The prototree snippet containing the selection that is to be expanded
            </td>
            <td>Object</td>
            <td>none</td>
        </tr>
    </tbody>
</table>

#### Example

```javascript
var tree = {
    expander: {
        type: "fluid.renderer.selection.inputs",
        rowID: "layout",
        labelID: "layoutLabel",
        inputID: "layoutChoice",
        selectID: "layout-checkbox",
        tree: {
            selection: "${layouts.selection}",
            optionlist: "${layouts.choices}",
            optionnames: "${layouts.names}"
        }
    }
};
```

### Condition Expander

The condition expander provides a mechanism for selecting between two alternative renderer component sub-trees based on the outcome of a condition e.g. the boolean evaluation of a value, or the return value of a function call.

The following fields are supported by the `fluid.renderer.condition` expander:

<table>
    <thead>
        <tr>
            <th>Field</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>type</code></td>
            <td>The type of the expander</td>
            <td><code>fluid.renderer.condition</code></td>
            <td>N/A</td>
        </tr>
        <tr>
            <td><code>condition</code></td>
            <td>
                An object that can be evaluated as true or false, or a function that returns a boolean.
            </td>
            <td>Object or Function</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>trueTree</code></td>
            <td>
                (<em>Optional</em>) A component sub-tree to be used in the case that the <code>condition</code> evaluates to <code>true</code>.
            </td>
            <td>Object</td>
            <td>none</td>
        </tr>
        <tr>
            <td><code>falseTree</code></td>
            <td>
                (<em>Optional</em>) A component sub-tree to be used in the case that the <code>condition</code> evaluates to <code>false</code>.
            </td>
            <td>Object</td>
            <td>none</td>
        </tr>
    </tbody>
</table>

#### Examples

In the following example, the `condition` is `that.options.showDeleteButton`. The renderer will evaluate the component's `showDeleteButton` option and if it is `true` will use the component tree specified by `trueTree`. Note that no `falseTree` is provided. If the option is `false` or not present, nothing will be rendered.

```json5
{
    expander: {
        type: "fluid.renderer.condition",
        condition: that.options.showDeleteButton,
        trueTree: {
            deleteButton: {
                decorators: [{
                    type: "attrs",
                    attributes: {
                        value: that.options.strings.deleteButton
                    }
                }, {
                    type: "jQuery",
                    func: "prop",
                    args: {
                        disabled: that.checkDeleteDisabling
                    }
                }]
            }
        }
    }
}
```

In the following example, the `condition` is the return value of a call to `that.showMediumImage()`. If the function returns `true`, the image should be shown, and the `trueTree` component subtree will be used to render it. If the return value is `false`, the image should not be shown, and the `falseTree` subtree will be used to properly render the **empty space** instead of an image.

```json5
{
    expander: {
        type: "fluid.renderer.condition",
        condition: that.showMediumImage(),
        trueTree: {
            mediumImage: {
                decorators: [{
                    type: "addClass",
                    classes: that.options.styles.mediumImage
                }, {
                    type: "attrs",
                    attributes: {
                        alt: that.options.strings.mediumImage,
                        src: that.options.recordModel.fields
                               && that.options.recordModel.fields.blobs
                                 && that.options.recordModel.fields.blobs.length > 0 ?
                            that.options.recordModel.fields.blobs[0].imgMedium : ""
                    }
                }]
            },
            mediaSnapshot: {
                decorators: [{
                    type: "addClass",
                    classes: that.options.styles.mediaSnapshot
                }]
            }
        },
        falseTree: {
            mediaSnapshot: {}
        }
    }
}
```

In the following example, the `condition` is a call to the function `cspace.header.assertMenuItemDisplay()` with a particular argument taken from the `itemName` subcomponent. If the function call returns `true`, the renderer component subtree specified by `trueTree` will be used.

```json5
{
    expander: {
        type: "fluid.renderer.condition",
        condition: {
            funcName: "cspace.header.assertMenuItemDisplay",
            args: "${{itemName}.hide}"
        },
        trueTree: {
            label: {
                target: "${{item}.href}",
                linktext: {
                    messagekey: "${{item}.name}"
                }
            }
        }
    }
}
```
