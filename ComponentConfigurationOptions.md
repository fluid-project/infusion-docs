# Component Configuration Options #

Infusion components are configured using options that are defined by the component developer and customized by the integrator. While component developers are free to define whatever options are appropriate for their component, the Infusion Framework supports a number of predefined options. This page briefly describes these predefined options and provides links more information about the related Framework functionality.

Some predefined options should not be overridden by integrators: They are strictly for the use of the component developer. This is noted in the descriptions below.

## Options Supported By All Components Grades ##

The following options are supported by all component grades:
* gradeNames
* nickName
* mergePolicy
* invokers
* members
* components
* dynamicComponents

### `gradeNames` ###
<table>
  <tr>
    <th>Description</th>
    <td>An array of string <a href="ComponentGrades.md">grade names</a>.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>In addition to the grade names, the array should include the special "autoInit" value, which instructs the Framework to create the component creator function automatically.
        *NOTE*: "autoInit" is the preferred way of creating components, and will become the default for Infusion 2.0. Always use this grade name, unless you have a special reason to not want the framework to fabricate a creator function (perhaps, because your grade is not instantiable).</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>
fluid.defaults("component.name", {
    gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"],
    ...
});
</code>
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
<code>
fluid.defaults("component.name", {
    nickName: "myComponentName",
    ...
});
</code>
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
<code>
fluid.defaults("component.name", {
    mergePolicy: {
        option1: "noexpand",
        option2: "nomerge",
        ....
    },
    ...
});
</code>
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
    <th>Notes</th>
    <td></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>
fluid.defaults("component.name", {
    invokers: {
        inv1: {...},
        inv2: {...},
    },
    ...
});
</code>
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
<code>
fluid.defaults("component.name", {
    members: {
        member1: "{that}.options.optionsValue",
        member2: "{theOther}.dom.otherSelector",
    },
    ...
});
</code>
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
    <td>This (the <em>subcomponent record</em>) is one of the core sources from which the options configuring a component in a particular context. The total set of options sources are: i) the original defaults record, ii) the subcomponent record, iii) direct user options (supplied to a component creator function), iv) <a href="IoCSS.md">distributed options</a>.</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>
fluid.defaults("component.name", {
    components: {
        subcomponent1: {
            type: "component.subcomp1",
            options: {...}
        },
        ...
    },
    ...
});
</code>
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
<code>
fluid.defaults("component.name", {
    dynamicComponents: {
        dynamic1: {
            type: "component.subcomp1",
            source: "{context}.someArray",
            options: {...}
        },
        ...
    },
    ...
});
</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="tutorial-gettingStartedWithInfusion/Subcomponents.md">Tutorial: Subcomponents</a></td>
  </tr>
</table>


## Little Components ##

Components defined with a grade of `littleComponent` support all of the common options described above, and no others. Component developers are free to define their own additional options.

See also: [ComponentGrades.md Component Grades]

## Model Components ##

Components defined with a grade of `modelComponent/modelRelayComponent` support all of the common options described above, as well as those defined below. Component developers are free to define their own additional options.

See also: [ComponentGrades.md Component Grades]

The following options are supported by model components:
* model
* applier
* changeApplierOptions

### `model` ###
<table>
  <tr>
    <th>Description</th>
    <td>An object containing the data model to be used by the component.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>If a <a href="ChangeApplier">ChangeApplier</a> is not provided using the <a href="#applier">applier</a> option, the Framework will create one for the provided model. </td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>
fluid.defaults("fluid.pager", {
    model: {
        pageIndex: undefined,
        pageSize: 10,
        totalRange: undefined
    },
    ...
});
</code>
</pre></td>
  </tr>
  <tr>
    <th>Example Override</th>
    <td><pre>
<code>
var myPager = fluid.pager(container, {
    model: {
        pageIndex: 1
    },
    ...
});
</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ModelObjects.md">Model Objects</a>
        <a href="ChangeApplierAPI.md">ChangeApplier API</a>
        <code><a href="#applier">applier</a></code>
        <code><a href="#changeApplierOptions">changeApplierOptions</a></code></td>
  </tr>
</table>

### `applier` ###
<table>
  <tr>
    <th>Description</th>
    <td>A <a href="ChangeApplier.md">ChangeApplier</a> object for the model provided with the <a href="#model">model</a> option.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>
</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="Foo.md">Foo</a></td>
  </tr>
</table>

### `changeApplierOptions` ###
<table>
  <tr>
    <th>Description</th>
    <td></td>
  </tr>
  <tr>
    <th>Notes</th>
    <td></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>
</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="Foo.md">Foo</a></td>
  </tr>
</table>

## Evented Components ##


### `invokers` ###
<table>
  <tr>
    <th>Description</th>
    <td></td>
  </tr>
  <tr>
    <th>Notes</th>
    <td></td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><pre>
<code>
</code>
</pre></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="Foo.md">Foo</a></td>
  </tr>
</table>

## View Components ##


## Renderer Components ##



