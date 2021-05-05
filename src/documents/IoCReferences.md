---
title: IoC References
category: Infusion
---

The Infusion IoC Framework uses a basic syntax for referencing objects in the current [context](Contexts.md).

References always take the syntactic form `{context-name}.some.path.segments`, which we name as the type `<reference>` -
the meaning and form of the context name can vary and have a different meaning in different contexts:

<table id="reference-table">
    <thead>
        <tr>
            <th colspan="2">Different permitted forms for a &lt;reference&gt; string</th>
        </tr>
        <tr>
            <th>Syntax</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>{&lt;componentRef&gt;}.&lt;path to member&gt;</code></td>
            <td>
                <ul>
                    <li>
                        <code>&lt;componentRef&gt;</code> is a reference to a component via one of its context names. It
                        may be:
                        <ul>
                            <li><code>that</code>, to reference the current component e.g. <code>{that}</code></li>
                            <li>
                                the fully qualified name of the component's type or one of its <a
                                href="ComponentGrades.md">grade names</a> e.g. <code>{fluid.pagedTable}</code>
                            </li>
                            <li>
                                the <strong>short name</strong> of the component's type or one of its
                                <strong>gradeNames</strong>, i.e. the last segment of the fully namespaced name, e.g.
                                <code>{pagedTable}</code>
                            </li>
                            <li>
                                the component's <strong>member name</strong>, i.e. the name used when defining a
                                subcomponent in a components block
                            </li>
                            <li>
                                an entire <code>&lt;reference&gt;</code> string in itself. This is useful in highly
                                dynamic cases where the context name should be determined from some other options
                                material, e.g. <code>{{that}.options.targetContext}</code>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <code>&lt;path to member&gt;</code> is an EL path into the referenced component's members (this
                        path may be empty)
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>{arguments}.&lt;index&gt;</code></td>
            <td>
                <ul>
                    <li>
                        <code>{arguments}</code> refers to the array of arguments passed to a function. This form is
                        used in the definition of <a href="Invokers.md">Invokers</a>
                    </li>
                    <li>
                        &lt;index&gt; is the 0-based numeric index of the desired argument
                        <div class="infusion-docs-note"><strong>Note:</strong>
                            The <code>arguments</code> context name can only be used in contexts where arguments are in
                            scope - for example, as part of the arguments to an <a
                            href="InfusionEventSystem.md#registering-a-listener-to-an-event">event listener</a> or <a
                            href="Invokers.md">invoker</a>, or within component configuration that is being instantiated
                            as part of a <a
                            href="SubcomponentDeclaration.md#dynamic-subcomponents-with-a-source-event">dynamic
                            component with a source event </a>.
                        </div>
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>{source}.&lt;path to member&gt;</code></td>
            <td>
                <ul>
                    <li>
                        <code>{source}</code> refers to the particular instance of the <code>sources</code> array which
                        was used to instantiate a particular <a
                        href="SubcomponentDeclaration.md#dynamic-components">dynamic component</a>. This context name is
                        not valid outside a dynamic component definition.
                    </li>
                </ul>
            </td>
        </tr>
        <tr>
            <td><code>{&lt;iocss expression&gt;}.&lt;path to member&gt;</code></td>
            <td>
                <ul>
                    <li>
                        <code>&lt;iocss expression&gt;</code> is an <a href="IoCSS.md">IoCSS</a> expression referencing
                        a component.
                    </li>
                    <li>
                        <code>&lt;path to member&gt;</code> is an EL path into the referenced component's members.
                        <div class="infusion-docs-note"><strong>Note:</strong>
                            Full IoCSS expressions are not valid in all contexts. They can primarily be used in the
                            <code>target</code> field of the <a
                            href="IoCSS.md#distributeoptions-format"><code>distributeOptions</code></a> record.
                        </div>
                    </li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

## Where To Use IoC References

IoC references may be used almost anywhere within a component's options, for example:

* in the [subcomponent definitions](SubcomponentDeclaration.md),
* in [invoker](Invokers.md) specifications,
* in [options distributions](IoCSS.md),
* in [listeners specifications](InfusionEventSystem.md#registering-a-listener-to-an-event), including as the left hand
  side key specifying an event in a listeners block.
* in [events specifications](InfusionEventSystem.md#declaring-an-event-on-a-component), including as the left hand side
  key specifying an event in an events block
* or indeed almost anywhere else

## How IoC References are resolved

For a conventional IoC reference (of the style `<componentRef>` rather than the style `<iocss expression>`), a search is
begun upwards from the site of the reference in the component tree to find the first component which matches the context
name. The following diagram shows a possible such reference site in green:

<!--
    Diagram source within Google Drawings at:
    https://docs.google.com/drawings/d/14ESiMe0q8_lzVsAE-CkUvZdU42A_rs0_IfYg54pNFjA/edit
-->

![IoC Context Resolution](images/IoC-scope.svg "IoC Context Resolution")

The set of components which are in scope for resolution from this site are shown in yellow (circles) and orange
(diamonds) in this diagram. These are components which are either

1. an ancestor of the component holding the reference site, or
2. a sibling of such a component.
3. a component anywhere in the tree which has been marked with the grade
   [fluid.resolveRoot](Contexts.md#global-components-fluidresolveroot-and-fluidresolverootsingle) - these are the ones
   shown in orange diamonds

The context reference matches a component if it matches via the 2nd, 3rd or 4th rules in the first row of the [above
table](#reference-table) - **either** it agrees with a fully-qualified grade or type name of a component, **or** it
agrees with the last path segment of such a name, **or** it agrees with the component's member name. If no context name
matches anywhere in the tree, the reference expression resolves to `undefined`. In this case, if the path segments
following the context name in the reference expression are not empty, the framework will throw an error.

Components which are not in scope for resolution from the reference site (shown as a green pentagon) are shown as blue
squares.

## Examples of {&lt;componentRef&gt;}

In the example below, the IoC reference `{that}` refers to the component in which it is being used.

```javascript
fluid.defaults("fluid.prefs.separatedPanel", {
    gradeNames: ["fluid.prefs.prefsEditorLoader"],
    listeners: {
        onCreate: {
            funcName: "fluid.prefs.prefsEditorLoader.hideReset",
            args: ["{that}"]
        }
    }
});
```

This could equally be written using the short name of the `fluid.prefs.separatedPanel` component, as shown below:

```javascript
fluid.defaults("fluid.prefs.separatedPanel", {
    gradeNames: ["fluid.prefs.prefsEditorLoader"],
    listeners: {
        onCreate: {
            funcName: "fluid.prefs.prefsEditorLoader.hideReset",
            args: ["{separatedPanel}"]
        }
    }
});
```

The above two examples are equivalent.

In the example below, the IoC expression `{fluid.prefs.enactor.tableOfContents}` refers to the component being defined
by the `defaults` block. The short name `tableOfContents` must not be used here, because it would not be unique: It
would be unclear whether the nickname was referring to `fluid.prefs.enactor.tableOfContents` or `fluid.tableOfContents`.

```javascript
fluid.defaults("fluid.prefs.enactor.tableOfContents", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
    components: {
        tableOfContents: {
            type: "fluid.tableOfContents",
            container: "{fluid.prefs.enactor.tableOfContents}.container",
            options: {
                // ...
            }
        }
    }
});
```

Another way to avoid the ambiguity mentioned above would be to use the member name, which is the name used when defining
the subcomponent in the components block. In the example below `{toc}` refers to the name used to define the
subcomponent in the component block.

```javascript
fluid.defaults("fluid.prefs.enactor.tableOfContents", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
    components: {
        toc: {
            type: "fluid.tableOfContents",
            container: "{fluid.prefs.enactor.tableOfContents}.container",
            options: {
                components: {
                    type: "fluid.tableOfContents.levels",
                    container: "{toc}.dom.tocContainer"
                }
            }
        }
    }
});
```

## Examples of {&lt;componentRef&gt;}.&lt;path to member&gt;

The example below includes several IoC references. All of them are inside a subcomponent declaration and all include
`{controllers}`, which in this case is a reference to the parent component. Specifically:

* `{controllers}.model` is a reference to the model that is a member of the parent component - note that this reference
  sets up a permanent [model relay](ModelRelay.md) between these two models;
* the IoC expressions in the subcomponent's events block are references to events defined on the parent component's
  event block;
* `{controllers}.dom.scrubberContainer` is a reference to one of the selectors defined on the parent component.

```javascript
fluid.defaults("fluid.videoPlayer.controllers", {
    gradeNames: ["fluid.viewComponent"],
    selectors: {
        scrubberContainer: ".flc-videoPlayer-scrubberContainer"
    },
    events: {
        onScrub: null,
        onStartScrub: null,
        afterScrub: null
    },
    components: {
        scrubber: {
            type: "fluid.videoPlayer.controllers.scrubber",
            container: "{controllers}.dom.scrubberContainer",
            options: {
                model: "{controllers}.model",
                events: {
                    onScrub: "{controllers}.events.onScrub",
                    afterScrub: "{controllers}.events.afterScrub",
                    onStartScrub: "{controllers}.events.onStartScrub"
                }
            }
        }
    }
});
```

## Examples of `{arguments}.n`

The example below uses the `{arguments}.n` syntax to deliver the first and second arguments passed to listeners to the
`onMove` event to the `fluid.moduleLayout.onMoveListener` function.

```javascript
fluid.defaults("fluid.moduleLayoutHandler", {
    gradeNames: ["fluid.layoutHandler"],
    events: {
        onMove: "{reorderer}.events.onMove"
    },
    listeners: {
        onMove: {
            funcName: "fluid.moduleLayout.onMoveListener",
            args: ["{arguments}.0", "{arguments}.1", "{that}.layout"]
        }
    }
});
```

## Examples of {&lt;iocss expression&gt;}

The example below uses an [IoCSS](IoCSS.md) expression `{that > moreText}.options.selectors.images`. The expression
refers to the `images` selector in the `moreText` subcomponent that is a direct descendent of the current component.

```javascript
fluid.defaults("gpii.explorationTool.enactors.showMoreText", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor"],
    selectors: {
        images: "img, [role~='img']"
    }
});
fluid.defaults("gpii.explorationTool.enactorSet", {
    gradeNames: ["fluid.uiEnhancer.starterEnactors"],
    components: {
        moreText: {
            type: "gpii.explorationTool.enactors.showMoreText"
        }
    },
    distributeOptions: {
        source: "{that}.options.moreTextSelector",
        removeSource: true,
        target: "{that > moreText}.options.selectors.images"
    }
});
```

## More Examples

### Example 1

```javascript
// Range Annotator
fluid.defaults("fluid.pagedTable.rangeAnnotator", {
    gradeNames : ["fluid.component"],
    listeners : {
        "{pagedTable}.events.onRenderPageLinks" : {
            funcName : "fluid.pagedTable.rangeAnnotator.onRenderPageLinks",
            args : ["{pagedTable}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
// Paged Table
fluid.defaults("fluid.pagedTable", {
    gradeNames : ["fluid.pager", "fluid.table"],
    components : {
        rangeAnnotator : {
            type : "fluid.pagedTable.rangeAnnotator"
        }
    }
    // ...
});
```

The above example defines a `rangeAnnotator`, which is used as a subcomponent of a pagedTable. This definition uses
several IoC references:

* the expression "{pagedTable}.events.onRenderPageLinks" is used to refer to the onRenderPageLinks event of the
  pagedTable component
* the IoC references:
  * `{pagedTable}.events.onRenderPageLinks` refers to the `pagedTable` component
  * `{arguments}.0` and `{arguments}.1` refer to the first and second arguments supplied when the source event is fired
    `onRenderPageLinks`

### Example 2

```javascript
fluid.defaults("fluid.videoPlayer.languageControls.eventBinder", {
    gradeNames: ["fluid.component"],
    listeners: {
        "{button}.events.onPress": "{menu}.toggleView"
    }
});
```

The above example uses two IoC references:

* `{button}.events.onPress` refers to the `onPress` even of the `button` component
* `{menu}.toggleView` refers to the `toggleView` method of the `menu` component

### Example 3

```javascript
fluid.defaults("fluid.uploader", {
    gradeNames: ["fluid.viewComponent"],
    components: {
        uploaderImpl: {
            type: "fluid.uploaderImpl"
        }
    },
    distributeOptions: {
        source: "{that}.options",
        removeSource: true,
        exclusions: ["components.uploaderContext", "components.uploaderImpl"],
        target: "{that > uploaderImpl}.options"
    }
});
```

The above example uses IoC references in the `distributeOptions` block:

* `{that}.options` identifies the `options` block of the current `that` (i.e. `fluid.uploader`)
* `{that > uploaderImpl}.options` identifies the `uploaderImpl` subcomponent of the current `that` (`fluid.uploader`)
  (see [IoCSS](IoCSS.md) for more information about this notation)

## Reserved IoC Names

The following context names are reserved within the IoC system:

* that
* arguments
* source
* sourcePath
* change
* instantiator

As a result, you should typically avoid defining types that use these names as the final segment (e.g `todoList.source`
or `todoList.panel.that`), since it will be impossible to resolve references to these components in many contexts.
