---
title: Model Transformation API
layout: default
category: Infusion
---

The *** model transformation *** framework is a core part of Infusion and allows you to transform change an input [model](FrameworkConcepts.md#model-objects) (JSON structure) based on a set of rules. 
The result will be a new model, built according to the rules specified and the input model. Many kinds of transformation can also have their *inverses* computed
and operated automatically.

Any model transformation can be supplied as part of a [model relay](ModelRelay.md#explicit-model-relay-style) rule registered in a [fluid.modelComponent](ComponentConfigurationOptions.md#model-components)'s `modelRelay` 
block - the system will then constantly operate the transformation rule whenever there is a model change to keep the linked model in sync. The user may also operate model transformation rules manually by use of the
`fluid.model.transformWithRules` API.

The best documentation for the currently available set of transformation functions is on the [GPII wiki](https://wiki.gpii.net/index.php/Architecture_-_Available_transformation_functions) but will
in time be migrated here.

## fluid.model.transformWithRules(source, rules[, options])

* `model {Object}` The input model to transform - this will not be modified
* `rules {Transform}` A transformation rules object containing instructions on how to transform the model (see [below](#structure-of-a-transformation-document)) for more information)
* `options {Object}` A set of options governing the kind of transformation to be operated. At present this may contain the values:
    * `isomorphic {Boolean}` If `true` indicating that the output model is to be governed by the same schema found in the input model, or
    * `flatSchema {Object: String -> String}` Holding a flat schema object which consists of a hash of EL path specifications with wildcards, to the string values "array"/"object" defining the schema to be used to construct missing trunk values. This option is unsupported.
* Returns: `{Object}` The transformed model

## Structure of a transformation document

The top-level structure of a full transformation document `{Transform}` is keyed by output [EL paths](FrameworkConcepts.md#el-paths) and looks like this:

```json
{
    <output-el-path1>: <input-el-path1> OR {SingleTransform}
    <output-el-path2>: <input-el-path2> OR {SingleTransform}
    ... 
}
```

A `{SingleTransform}` record is as follows:

```json
{
    type: <transform-type>
    ...
}
```

where `transform-type` is the name of a registered transformation function. This will be a [function grade] derived from the base grade `fluid.transformFunction`. Each transformation function can accept arbitrary additional top-level
options, but many are derived from the grade `fluid.standardInputTransformFunction` which accept a standard input value named `input` (or path named `inputPath`) and/or derived from the grade `fluid.standardOutputTransformFunction`
which accept an output path named `outputPath`. In general you should consult the [documentation](https://wiki.gpii.net/index.php/Architecture_-_Available_transformation_functions) for each transform function to
see the names and interpretations of its options. Many transforms will themselves accept configuration of type `{Transform}` in their options, leading transform documents to have a recursive structure. 

### Examples

<table><thead>
<tr><td><code>source</code></td><td>rules</td><td>Output</td></tr>
</thead><tbody>
<tr><td><code>
{
    cat: "meow"
}
</code></td><td><pre><code>{
    feline: {
        transform: {
            type: "fluid.transforms.value",
            // specify only the path to transform
            inputPath: "cat"
        }
    }
}
</code></pre>
OR
<pre><code>{
    feline: "cat" // implicit transform with RH interpreted as <input-el-path>
}
</code></pre></td><td>
<code>
{
    feline: "meow"
}
</code></td>
</tr>
</tbody>
</table>