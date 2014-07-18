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

*`gradeNames`*
<table>
  <tr>
    <th>Description</th>
    <td>An array of string grade names.</td>
  </tr>
  <tr>
    <th>Notes</th>
    <td>In addition to the grade names, the array should include the special "autoInit" value, which instructs the Framework to create the component creator function automatically.
        *NOTE*: "autoInit" is the preferred way of creating components, and will become the default for Infusion 2.0. Always use this grade name, unless you have a special reason to not want the framework to fabricate a creator function (perhaps, because your grade is not instantiable).</td>
  </tr>
  <tr>
    <th>Example Definition</th>
    <td><code>fluid.defaults("component.name", {
    gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"],
    ...
});</code></td>
  </tr>
  <tr>
    <th>See also</th>
    <td><a href="ComponentGrades.md">Component Grades</a></td>
  </tr>
</table>

## Little Components ##


## Model Components ##


## Evented Components ##


## View Components ##


## Renderer Components ##



