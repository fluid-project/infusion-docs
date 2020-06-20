---
title: Component Configuration Options
layout: default
category: Infusion
---

Infusion components are configured using options that are defined by the component developer and customized by the integrator.
While component developers are free to define whatever options are appropriate for their component, the Infusion Framework supports a number of predefined options.

The particular set of options interpreted by the framework is determined by the [Grades](ComponentGrades.md) that the component is derived from. Developers and integrators
can define further grades which respond to yet further options, which they should document if they expect the options to be generally useful.
This page briefly describes these predefined options and provides links to more information about the related framework functionality.

## Options Supported By All Components Grades ##

The following options are supported by all component grades, that is, those derived from `fluid.component`:

### `gradeNames` ###
<table>
  <tr>
    <th>Description</th>
    <td>A <code>String</code> or <code>Array of String</code> <a href="ComponentGrades.md">grade names</a>.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    gradeNames: "fluid.modelComponent",
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ComponentGrades.md">Component Grades</a></td>
  </tr>
</table>

### `invokers` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record defining methods on the component whose arguments are resolved from the environment as well as the direct argument list at invocation time.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    invokers: {
        inv1: {...},
        inv2: {...},
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="Invokers.md">Invokers</a></td>
  </tr>
</table>

### `members` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record defining properties to be added to the component object. These can be anything, including methods, strings, objects, etc. Definitions are evaluated as IoC expressions.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>Defining a method as a Function in <code>members</code> will differ from <code>invokers</code> in that the arguments of members are not resolved at invocation time. The use of such function members is not recommended except where very high invocation performance is required.
        The right-hand-side may contain an <a href="ExpansionOfComponentOptions.md">expander</a> definition, which may perhaps itself resolve onto an <a href="Invokers.md">invoker</a>.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    members: {
        member1: "{that}.options.optionsValue",
        member2: "{theOther}.dom.otherSelector",
    },
    ...
});</code>
</pre></td>
  </tr>
</table>

### `events` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record containing key/value pairs that define the events the component will fire: the keys are the event names, the values define the type of the event (see <a href="InfusionEventSystem.md">Infusion Event System</a> for information on the different event types).</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>The Framework will create event firers for the listed events. The builtin events `onCreate`, `onDestroy` and `afterDestroy` will be fired automatically by the framework.
    It is the responsibility of the component to fire user-defined events at the appropriate times.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    events: {
        onSave: "preventable",
        onReady: null
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="InfusionEventSystem.md">Infusion Event System</a></td>
  </tr>
</table>

### `listeners` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record defining listener functions for the events supported by a component.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>Both component developers and integrators can define listeners for events.
<a href="Invokers.md">Invokers</a> and the `fire` method of other events can be used as listeners here, as well as any function handle resulting from an <a href="ExpansionOfComponentOptions.md">Expanders</a>.
Note that as well as being a simple string holding the name of an event on this component, a listener key may also be a full <a href="IoCReferences.md">IoC Reference</a>
to any other event held in the component tree (for example <code>"{parentComponent}.events.parentEvent"</code>. As well as being a simple function name, the value associated with the key may be a <a href="InfusionEventSystem.md">Listener Record</a>
or else follow the syntax of an invoker indicating that the registered listener receives a different signature from the one that the event has fired (see <a href="EventInjectionAndBoiling.md">Event injection and boiling</a>).</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>examples.myListener = function (number, condition) {
    console.log("Event listener received number " + number + " and condition " + condition);
};

fluid.defaults("examples.eventedComponent", {
    gradeNames: ["fluid.component"],
    events: {
        myEvent: null
    },
    listeners: {
        "myEvent.myNamespace": "examples.myListener"
    }
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var myComp = examples.eventedComponent({
    listeners: {
        "myEvent.myNamespace": "examples.myOtherListener",
    }
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="InfusionEventSystem.md">Infusion Event System</a></td>
  </tr>
</table>

### `components` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record containing named definitions of the component's subcomponents.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>This (the <strong>subcomponent record</strong>) is one of the core sources from which the options configuring a component in a particular context. The total set of options sources are:
    <ol>
    <li>the original defaults record,</li>
    <li>the subcomponent record,</li>
    <li>direct user options (supplied to a component creator function),</li>
    <li><a href="IoCSS.md">distributed options</a>.</li>
    </ol>
    </td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    components: {
        subcomponent1: {
            type: "component.subcomp1",
            options: {...}
        },
        ...
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="SubcomponentDeclaration.md">Documentation: Subcomponents</a></td>
  <tr>
  <tr>
    <th></th>
    <td><a href="tutorial-gettingStartedWithInfusion/Subcomponents.md">Tutorial: Subcomponents</a></td>
  </tr>
</table>

### `distributeOptions` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record directing the framework to distribute options from this component to one or more other components in the component tree. Either a single record, an <code>Array</code> or <code>Object</code> holding these records is supported.
    In the <code>Object</code> form, the keys of the object will be taken to represent the <code>namespace</code of the distribution.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    gradeNames: ["fluid.component"],
    distributeOptions: {
        namespace: "myDistribution",
        record: "another.grade.name",
        target: "{that target.grade.name}.options.gradeNames"
    }
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="IoCSS.md">IoCSS for options distributions</a></td>
  </tr>
</table>

### `mergePolicy` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record providing instructions for how particular options should be merged when integrator options are merged with default values.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>It is uncommon to need this option. The most common use case is to protect "exotic values" derived from some external library or framework from being corrupted by the options merging/expansion process by use of the "nomerge" policy.
    For example, some noxious circularly-liked structure such as a node.js HTTP `request` object should be protected in such a way. The 2.0 framework will automatically protect an object which fails the `fluid.isPlainObject` test, which will exclude
    any object with a nondefault constructor or native type such as DOM elements, `TypedArray`s, Infusion components themselves, etc.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    mergePolicy: {
        option1: "noexpand",
        option2: "nomerge",
        ....
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="OptionsMerging.md">Options Merging</a></td>
  </tr>
</table>

### `dynamicComponents` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing named definitions of the component's <a href="SubcomponentDeclaration.md#dynamic-components">dynamic subcomponents</a>. Rather than exactly one subcomponent being associated with its parent from these records, there may be one subcomponent per element of an array, or one per firing of an event.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>Some special context names will be available within the subcomponent's definition block, for example <code>{source}</code> and <code>{sourcePath}</code> or <code>{arguments}</code>, derived from the material responsible for constructing the component.
    <em>This framework facility will be replaced by a more declarative equivalent in time - ask on the <a href="http://lists.idrc.ocad.ca/mailman/listinfo/fluid-work">fluid-work mailing list</a>
    or <a href="https://wiki.fluidproject.org/display/fluid/IRC+Channel">#fluid-work IRC channel</a> if you seem to find yourself needing to use it.</em></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    dynamicComponents: {
        dynamic1: {
            type: "component.subcomp1",
            source: "{context}.someArray",
            options: {...}
        },
        ...
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="SubcomponentDeclaration.md#dynamic-components">Documentation: Dynamic components</a></td>
  <tr><th></th>
    <td><a href="tutorial-gettingStartedWithInfusion/Subcomponents.md">Tutorial: Subcomponents</a></td>
  </tr>
</table>

## Model Components ##

Components defined with a grade of `fluid.modelComponent` support all of the [common options](#options-supported-by-all-components-grades) described above, as well as those defined below. Component developers are free to define their own additional options.

See also: [Component Grades](ComponentGrades.md)

### `model` ###
<table>
  <tr>
    <th>Description</th>
    <td>An record containing the data model to be used by the component.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("fluid.pager", {
    model: {
        pageIndex: undefined,
        pageSize: 10,
        totalRange: undefined
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var myPager = fluid.pager(container, {
    model: {
        pageIndex: 1
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="FrameworkConcepts.md#model-objects">Model Objects</a><br/>
        <a href="ChangeApplierAPI.md">ChangeApplier API</a><br/>
  </tr>
</table>

### `modelListeners` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record defining a set of functions wishing to be notified of changes to the `model`</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("fluid.tests.allChangeRecorder", {
    gradeNames: "fluid.tests.changeRecorder",
    modelListeners: {
        "": "{that}.record({change}.path, {change}.value, {change}.oldValue)"
    }
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ChangeApplierAPI.md#model-listener-declaration">Model Listeners</a></td>
  </tr>
</table>

### `modelRelay` ###
<table>
  <tr>
    <th>Description</th>
    <td>A set of rules or constraints linking values held in this model to those elsewhere in the component tree (or to other values within this model)</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("examples.volumeModelRelay", {
    gradeNames: ["fluid.modelComponent"],
    model: {
        volumeAsPercent: 95,
    },
    modelRelay: {
        source: "volumeAsPercent",
        target: "volumeAsFraction",
        singleTransform: {
            type: "fluid.transforms.linearScale",
            factor: 0.01
        }
    }
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ModelRelay.md">Model Relay</a></td>
  </tr>
</table>

### `changeApplierOptions` ###
<table>
  <tr>
    <th>Description</th>
    <td>Options that will be passed on to the ChangeApplier constructed for this component. There are currently no such options supported. This section is left as a placeholder, since such options,
    like lemon-soaked paper napkins, will one day be supported here again.
    </td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ChangeApplierAPI.md">ChangeApplier API</a></td>
  </tr>
</table>

## View Components ##

Components defined with a grade of `fluid.viewComponent` are also model components, so they support
* all of the [common options](#options-supported-by-all-components-grades) described above,
* [`modelComponent` options](#model-components) described above
* and those defined below.

Component developers are free to define their own additional options.

### `selectors` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record containing named CSS-based selectors identifying where in the DOM relative to the component's `container` different elements can be found.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>The Framework will create a <a href="DOMBinder.md">DOM Binder</a> that should be used to access the elements identified by selectors. The DOM Binder attaches a function to the component object called <code>locate()</code> which retrieves the element given the selector name.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("fluid.progress", {
    selectors: {
        displayElement: ".flc-progress",
        progressBar: ".flc-progress-bar",
        indicator: ".flc-progress-indicator",
        label: ".flc-progress-label",
        ariaElement: ".flc-progress-bar"
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var myEdit = fluid.progress(container, {
    selectors: {
        indicator: "div.progress-indicator",
        label: "span.progress-label"
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="DOMBinder.md">DOM Binder</a></td>
  </tr>
</table>

### `styles` ###
<table>
  <tr>
    <th>Description</th>
    <td>A record containing named CSS classes that the component will apply to its markup in order to achieve state-dependent styling effects.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>The contents of this block are not interpreted by the framework at all. The existence of this block amounts to a helpful convention that implementors of view components are recommended to use, to organise
    and advertise the CSS class names that they will apply on behalf of their users</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("demo.initGridReorderer", {
    gradeNames: ["fluid.reorderGrid"],
    styles: {
        dragging: "demo-gridReorderer-dragging",
        avatar: "demo-gridReorderer-avatar",
        selected: "demo-gridReorderer-selected",
        dropMarker: "demo-gridReorderer-dropMarker"
    },
    disableWrap: true
});</code>
</pre></td>
</tr>

</table>

In addition to the options above, a View Component also accepts an additional argument named `container` which may be supplied either as the first argument to its [Creator Function](UnderstandingInfusionComponents.md)
or else at top level in its [Subcomponent Record](SubcomponentDeclaration.md). It is not currently supported to supply this value as a standard option in the options record.

## Renderer Components ##

Components defined with a grade of `rendererComponent` are also view components (and hence model components), so they support
* all of the [common options](#options-supported-by-all-components-grades) described above,
* [`modelComponent` options](#model-components) described above,
* [`viewComponent` options](#view-components) described above,
* and those defined below.

Component developers are free to define their own additional options.

<div class="infusion-docs-note"><strong>Note:</strong> The Infusion Renderer system will be rewritten completely before the Infusion 3.0 release - the use of the current renderer and component hierarchy is not recommended.</div>

### `selectorsToIgnore` ###
<table>
  <tr>
    <th>Description</th>
    <td>An array of selector names identifying elements that will be ignored by the Renderer. These elements will be displayed exactly as provided in the template, with no processing</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("cspace.header", {
    selectors: {
        menuItem: ".csc-header-menu-item",
        label: ".csc-header-link",
        searchBox: ".csc-header-searchBox",
        logout: ".csc-header-logout",
        user: ".csc-header-user",
        userName: ".csc-header-userName"
    },
    selectorsToIgnore: ["searchBox", "logout"],
    ...
});</code>
</pre></td>
  </tr>
</table>

### `repeatingSelectors` ###
<table>
  <tr>
    <th>Description</th>
    <td>An array of selector names identifying elements that will be repeated by the Renderer based on the data being rendered. For example, the selector for a table row that will be replicated many times should appear in the list of repeating selectors.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("cspace.header", {
    selectors: {
        menuItem: ".csc-header-menu-item",
        label: ".csc-header-link",
        searchBox: ".csc-header-searchBox",
        logout: ".csc-header-logout",
        user: ".csc-header-user",
        userName: ".csc-header-userName"
    },
    repeatingSelectors: ["menuItem"],
    ...
});</code>
</pre></td>
  </tr>
</table>

### `produceTree` ###
<table>
  <tr>
    <th>Description</th>
    <td>A function that will return a <a href="RendererComponentTrees.md">Renderer Component Tree</a> for the component.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>The referenced function must accept the component object as its only parameter and return a Renderer component tree.

<em>NOTE that if both <code>produceTree</code> and <code><a href="#prototree">protoTree</a></code> are specified, only the <code>produceTree</code> function will be used; the <code>protoTree</code> will be ignored.</em></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>cspace.confirmationDialog.produceTree = function (that) {
    var tree = {
        ...
    };
    return tree;
};
fluid.defaults("cspace.confirmationDialog", {
    produceTree: cspace.confirmationDialog.produceTree,
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="#prototree">protoTree</a><br/>
    <a href="RendererComponentTrees.md">Renderer Component Tree</a></td>
  </tr>
</table>

### `protoTree` ###
<table>
  <tr>
    <th>Description</th>
    <td>A tree of Renderer <a href="ProtoComponentTypes.md">protocomponents</a>.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>
<em>NOTE that if both <code><a href="#producetree">produceTree</a></code> and <code>protoTree</code> are specified, only the <code>produceTree</code> function will be used; the <code>protoTree</code> will be ignored.</em></td>
    </td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("cspace.searchTips", {
    protoTree: {
        searchTips: {decorators: {"addClass": "{styles}.searchTips"}},
        title: {
            decorators: {"addClass": "{styles}.title"},
            messagekey: "searchTips-title"
        },
        expander: {
            repeatID: "instructions",
            type: "fluid.renderer.repeat",
            pathAs: "row",
            controlledBy: "messagekeys",
            tree: {
                messagekey: "${{row}}"
            }
        }
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var searchTips = cspace.searchTips(container, {
    protoTree: {
        searchTips: {decorators: {"addClass": "{styles}.searchTips"}},
        title: {
            decorators: {"addClass": "{styles}.title"},
            messagekey: "searchTips-title"
        },
        expander: {
            repeatID: "instructions",
            type: "fluid.renderer.repeat",
            pathAs: "row",
            controlledBy: "messagekeys",
            tree: {
                messagekey: "${{row}}"
            }
        }
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="#producetree">produceTree</a><br/>
    <a href="RendererComponentTrees.md">Renderer Component Tree</a><br/>
    <a href="ProtoComponentTypes.md">ProtoComponent Types</a></td>
  </tr>
</table>

### `resources` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object that lists resources (such as HTML files, CSS files, data files) required by the component.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>The specified resources will be loaded automatically and the file content will be stored within the resources object itself.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    resources: {
        headerTemplate: {
            href: "../templates/Header.html"
        },
        footerTemplate: {
            href: "../templates/Footer.html"
        }
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var myComp = component.name(container, {
    resources: {
        footerTemplate: {
            href: "../templates/FrontPageFooter.html"
        }
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5.x/src/framework/core/js/FluidRequests.js#L24-L50">fluid.fetchResources</a></code></td>
  </tr>
</table>

### `strings` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing named strings or string templates. The strings will be used by the Renderer.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>The Framework will create a Message Resolver and add it to the component object if the <code>strings</code> option is present.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("cspace.searchToRelateDialog", {
    gradeNames: ["fluid.rendererComponent"],
    strings: {
        createNewButton: "Create",
        title: "Add Related %recordType Record",
        closeAlt: "close button",
        relationshipType: "Select relationship type:",
        createNew: "Create new record:",
        addButton: "Add to current record"
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var myDialog = cspace.searchToRelateDialog(container, {
    strings: {
        relationshipType: "Select a relationship type from the list below:",
        createNew: "Create a new record:",
        addButton: "Add this record to the current record"
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5.x/src/framework/core/js/Fluid.js#L2441-L2451">fluid.messageResolver</a></code></td>
  </tr>
</table>

### `rendererFnOptions` ###
<table>
  <tr>
    <th>Description</th>
    <td>Options that will be passed directly to the renderer creation function, <code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5.x/src/framework/renderer/js/RendererUtilities.js#L62-L100">fluid.renderer.createRendererSubcomponent</a></code></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("fluid.tableOfContents.levels", {
    rendererFnOptions: {
        noexpand: true
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var recEditor = cspace.recordEditor(container, {
    rendererFnOptions: {
        rendererTargetSelector: "dialog"
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="RendererComponents.md">Renderer Components</a><br/>
    <code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5.x/src/framework/renderer/js/RendererUtilities.js#L62-L100">fluid.renderer.createRendererSubcomponent</a></code></td>
  </tr>
</table>

### `rendererOptions` ###
<table>
  <tr>
    <th>Description</th>
    <td>Options that will be included in the <code><a href="#rendererfnoptions">rendererFnOptions</a></code> as <code>rendererOptions</code></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("cspace.searchBox", {
    rendererOptions: {
        autoBind: false
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var search = cspace.searchBox(container, {
    rendererOptions: {
        autoBind: true
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="RendererComponents.md">Renderer Components</a><br/>
    <code><a href="#rendererfnoptions">rendererFnOptions</a></code></td>
  </tr>
</table>

### `renderOnInit` ###
<table>
  <tr>
    <th>Description</th>
    <td>A boolean flag indicating whether or not the component should render itself automatically once initialization has completed. By default, renderer components do not render themselves automatically.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("cspace.login", {
    gradeNames: ["fluid.rendererComponent"],
    renderOnInit: true,
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var login = cspace.login(container, {
    renderOnInit: false,
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5.x/src/framework/renderer/js/RendererUtilities.js#L190-L248">fluid.initRendererComponent</a></code></td>
  </tr>
</table>
