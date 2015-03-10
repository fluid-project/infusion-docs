---
title: Component Configuration Options
layout: default
---

# Component Configuration Options #

Infusion components are configured using options that are defined by the component developer and customized by the integrator. While component developers are free to define whatever options are appropriate for their component, the Infusion Framework supports a number of predefined options. This page briefly describes these predefined options and provides links more information about the related Framework functionality.

Some predefined options should not be overridden by integrators: They are strictly for the use of the component developer. This is noted in the descriptions below.

## Options Supported By All Components Grades ##

The following options are supported by all component grades:

### `gradeNames` ###
<table>
  <tr>
    <th>Description</th>
    <td>An array of string <a href="ComponentGrades.md">grade names</a>.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>In addition to the grade names, the array should include the special <code>"autoInit"</code> value, which instructs the Framework to create the component creator function automatically.
        <em><strong>NOTE:</strong> <code>"autoInit"</code> is the preferred way of creating components, and will become the default for Infusion 2.0. Always use this grade name, unless you have a special reason to not want the framework to fabricate a creator function (perhaps, because your grade is not instantiable).</em></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"],
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ComponentGrades.md">Component Grades</a></td>
  </tr>
</table>

### `nickName` ###
<table>
  <tr>
    <th>Description</th>
    <td>Specifies a custom nickname for the component. The nickname is used by the Framework as an extra <a href="Contexts.md">context</a> name which can reference the component. By default, the nickname is derived from the component name.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>This option was historically used to work around various framework deficiencies that have now been corrected. It will be removed from an upcoming revision of the framework.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    nickName: "myComponentName",
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/Fluid.js#L2100-L2107">fluid.computeNickName</a></code></td>
  </tr>
</table>

### `mergePolicy` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object providing instructions for how particular options should be merged when integrator options are merged with default values.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>It is uncommon to need this option. The most common use case is to protect "exotic values" derived from some external library or framework from being corrupted by the options merging/expansion process by use of the "nomerge" policy.</td>
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

### `invokers` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object defining methods on the component whose arguments are resolved from the environment as well as the direct argument list at invocation time.</td>
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
    <td>An object defining properties to be added to the component object. These can be anything, including methods, strings, objects, etc. Definitions are evaluated as IoC expressions.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td><code>members</code> differ from <code>invokers</code> in that the arguments of members are not resolved at invocation time.
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

### `components` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing named definitions of the component's subcomponents.</td>
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
    <td><a href="tutorial-gettingStartedWithInfusion/Subcomponents.md">Tutorial: Subcomponents</a></td>
  </tr>
</table>

### `dynamicComponents` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing named definitions of the component's dynamic subcomponents</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>Some special context names may be available within the subcomponent's definition block, for example <code>{source}</code> and <code>{sourcePath}</code> or <code>{arguments}</code>. This framework facility will be replaced by a more declarative equivalent in time and should be used with caution.</td>
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
    <td><a href="tutorial-gettingStartedWithInfusion/Subcomponents.md">Tutorial: Subcomponents</a></td>
  </tr>
</table>


## Little Components ##

Components defined with a grade of `littleComponent` support all of the [common options](#options-supported-by-all-components-grades) described above, and no others. Component developers are free to define their own additional options.

See also: [Component Grades](ComponentGrades.md)

## Model Components ##

Components defined with a grade of `modelComponent/modelRelayComponent` support all of the [common options](#options-supported-by-all-components-grades) described above, as well as those defined below. Component developers are free to define their own additional options.

See also: [Component Grades](ComponentGrades.md)

### `model` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing the data model to be used by the component.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>If a <a href="ChangeApplier.md">ChangeApplier</a> is not provided using the <code><a href="#applier">applier</a></code> option, the Framework will create one for the provided model. </td>
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
        <code><a href="#applier">applier</a></code><br/>
        <code><a href="#changeapplieroptions">changeApplierOptions</a></code></td>
  </tr>
</table>

### `applier` ###
<table>
  <tr>
    <th>Description</th>
    <td>A <a href="ChangeApplier.md">ChangeApplier</a> object for the model provided with the <code><a href="#model">model</a></code> option.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>It is not necessary to provide an applier: By default, an applier will be created with <code>fluid.makeChangeApplier()</code>, using any options specified with <code><a href="#changeapplieroptions">changeApplierOptions</a></code>.

This option is most commonly used to share a common ChangeApplier between components in a component tree: the <code>applier</code> option can be used to reference the ChangeApplier of another component in the tree.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("component.name", {
    applier: "{parentComponent}.applier",
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ChangeApplierAPI.md">ChangeApplier API</a><br/>
    <code><a href="#model">model</a></code><br/>
    <code><a href="#changeapplieroptions">changeApplierOptions</a></code></td>
  </tr>
</table>

### `changeApplierOptions` ###
<table>
  <tr>
    <th>Description</th>
    <td>Options that will be passed on to <code>fluid.makeChangeApplier()</code> if a ChangeApplier is not provided using the <code><a href="#applier">applier</a></code> option.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>If a ChangeApplier is provided using the <code><a href="#applier">applier</a></code> option, this option will be ignored. </td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre><code>
fluid.defaults("component.name", {
    model: {...},
    changeApplierOptions: {
        cullUnchanged: true
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var myComp = component.name(container, {
    model: {...},
    changeApplierOptions: {
        cullUnchanged: true
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ChangeApplierAPI.md">ChangeApplier API</a><br/>
    <code><a href="#model">model</a></code><br/>
    <code><a href="#applier">applier</a></code></td>
  </tr>
</table>

## Evented Components ##

Components defined with a grade of `eventedComponent` support all of the [common options](#options-supported-by-all-components-grades) described above, as well as those defined below. Component developers are free to define their own additional options.

See also: [Component Grades](ComponentGrades.md)

### `events` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing key/value pairs that define the events the component will fire: the keys are the event names, the values define the type of the event (see <a href="InfusionEventSystem.md">Infusion Event System</a> for information on the different event types).</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>The Framework will create event firers for the listed events. It is the responsibility of the component to fire the events at the appropriate times.</td>
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
    <td>An object defining listener functions for the events supported by a component.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>Both component developers and integrators can define listeners for events.
<a href="Invokers.md">Invokers</a> and <a href="ExpansionOfComponentOptions.md">Expanders</a> can be used as listeners here. Note that as well as being a simple string holding the name of an event on this component, a listener key may also be a full <a href="IoCReferences.md">IoC Reference</a> to any other event held in the component tree (for example <code>"{parentComponent}.events.parentEvent"</code>. As well as being a simple function name, a the value associated with the key may be a <a href="InfusionEventSystem.md">Listener Record</a> or else follow the syntax of an invoker indicating that the registered listener receives a different signature from the one that the event has fired (see <a href="EventInjectionAndBoiling.md">Event injection and boiling</a>).</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>  
fluid.defaults("component.name", {
    events: {
        onSave: "preventable",
        onReady: null
    },
    listeners: {
        onSave: "component.name.saveValidatorFn"
    },
    ...
});</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>var myComp = component.name(container, {
    listeners: {
        onReady: "myNamespace.myReadyNotificationFn",
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

## View Components ##

Components defined with a grade of `viewComponent` are also model components and evented components, so they support
* all of the [common options](#options-supported-by-all-components-grades) described above,
* [`modelComponent` options](#model-components) described above,
* [`eventedComponent` options](#evented-components) described above,
* and those defined below.

Component developers are free to define their own additional options.

### `selectors` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing names CSS-based selectors identifying where in the DOM different elements can be found.</td>
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


## Renderer Components ##

Components defined with a grade of `rendererComponent` are also view components (and hence model components and evented components), so they support
* all of the [common options](#options-supported-by-all-components-grades) described above,
* [`modelComponent` options](#model-components) described above,
* [`eventedComponent` options](#evented-components) described above,
* [`viewComponent` options](#view-components) described above,
* and those defined below.

Component developers are free to define their own additional options.

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
    gradeNames: ["fluid.rendererComponent", "autoInit"],
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
    <th>Notes</th>
    <td>This option is valid both for <code>"autoInit"</code> components and for components that are initialized manually, through <code><a href="https://github.com/fluid-project/infusion/blob/infusion-1.5.x/src/framework/renderer/js/RendererUtilities.js#L190-L248">fluid.initRendererComponent</a></code>.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>fluid.defaults("cspace.login", {
    gradeNames: ["fluid.rendererComponent", "autoInit"],
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

