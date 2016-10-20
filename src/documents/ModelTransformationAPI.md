---
title: Model Transformation API
layout: default
category: Infusion
---


The ***model transformation*** framework is a core part of Infusion and allows you to transform an input [model](FrameworkConcepts.md#model-objects) (JSON structure) based on a set of rules.
The result will be a new model, built according to the rules specified and the input model. Many kinds of transformation can also have their *inverses* computed
and operated automatically.

Any model transformation can be supplied as part of a [model relay](ModelRelay.md#explicit-model-relay-style) rule registered in a [fluid.modelComponent](ComponentConfigurationOptions.md#model-components)'s `modelRelay`
block - the system will then constantly operate the transformation rule whenever there is a model change to keep the linked model in sync. Note that the modelRelay system does ***not*** support `xxxPath` style inputs (see below), and steer towards the use of SingleTransform rather than full transforms. For more information, see the documentation on [model relay](ModelRelay.md).

The user may also operate model transformation rules manually by use of the
`fluid.model.transformWithRules` API (see below).


## List of available transformations

Below is a list of all the available transformations in the framework. For details on each, see the individual description in the [Transformation Functions](#Transformation Functions) section.

* [fluid.transforms.value](ModelTransformationAPI.html#output-a-value-given-as-input-fluid-transforms-value-and-fluid-transforms-identity-)
* [fluid.transforms.identity](ModelTransformationAPI.html#literal-value-fluid-transforms-literalvalue-and-fluid-transforms-identity-)
* [fluid.transforms.literalValue](ModelTransformationAPI.html#literal-value-fluid-transforms-literalvalue-and-fluid-transforms-identity-)
* [fluid.transforms.stringToNumber](ModelTransformationAPI.html#fluid-transforms-stringtonumber)
* [fluid.transforms.numberToString](ModelTransformationAPI.html#fluid-transforms-numbertostring)
* [fluid.transforms.count](ModelTransformationAPI.html#count-length-of-array-fluid-transforms-count-)
* [fluid.transforms.round](ModelTransformationAPI.html#round-a-floating-point-number-fluid-transforms-round-)
* [fluid.transforms.delete](ModelTransformationAPI.html#delete-path-from-the-output-fluid-transforms-delete-)
* [fluid.transforms.firstValue](ModelTransformationAPI.html#get-first-value-of-array-fluid-transforms-firstvalue-)
* [fluid.transforms.linearScale](ModelTransformationAPI.html#scale-value-with-optional-offset-fluid-transforms-linearscale-)
* [fluid.transforms.binaryOp](ModelTransformationAPI.html#binary-operation-fluid-transforms-binaryop-)
* [fluid.transforms.condition](ModelTransformationAPI.html#conditional-transform-fluid-transforms-condition-)
* [fluid.transforms.valueMapper](ModelTransformationAPI.html#mapping-based-on-input-value-fluid-transforms-valuemapper-)
* [fluid.transforms.quantize](ModelTransformationAPI.html#mapping-a-continuous-range-into-discrete-values-fluid-transforms-quantize-)
* [fluid.transforms.inRange](ModelTransformationAPI.html#check-whether-a-number-is-in-a-given-range-fluid-transforms-inrange-)
* [fluid.transforms.arrayToSetMembership](ModelTransformationAPI.html#fluid-transforms-arraytosetmembership)
* [fluid.transforms.setMembershipToArray](ModelTransformationAPI.html#fluid-transforms-setmembershiptoarray)
* [fluid.transforms.indexArrayByKey](ModelTransformationAPI.html#creates-an-object-indexed-with-keys-from-array-entries-fluid-transforms-indexarraybykey-)
* [fluid.transforms.deindexIntoArrayByKey](ModelTransformationAPI.html#creates-an-object-indexed-with-keys-from-array-entries-fluid-transforms-deindexintoarraybykey-)
* [fluid.transforms.indexOf](ModelTransformationAPI.html#get-the-index-of-an-element-in-an-array-fluid-transforms-indexof-)
* [fluid.transforms.dereference](ModelTransformationAPI.html#get-the-value-at-an-index-of-array-fluid-transforms-dereference-)
* [fluid.transforms.stringTemplate](ModelTransformationAPI.html#create-string-from-template-fluid-transforms-stringtemplate-)
* [fluid.transforms.free](ModelTransformationAPI.html#use-any-globally-available-function-as-transform-fluid-transforms-free-)

## fluid.model.transformWithRules(source, rules[, options])

Function to manually apply transformation rules to a source model. It will return the transformed source model.

* `source {Object}` The input model to transform - this will not be modified
* `rules {Transform}` A transformation rules object containing instructions on how to transform the model (see [below](#structure-of-a-transformation-document)) for more information)
* `options {Object}` A set of options governing the kind of transformation to be operated. At present this may contain the values:
    * `isomorphic {Boolean}` If `true` indicating that the output model is to be governed by the same schema found in the input model, or
    * `flatSchema {Object: String -> String}` Holding a flat schema object which consists of a hash of EL path specifications with wildcards, to the string values "array"/"object" defining the schema to be used to construct missing trunk values. This option is unsupported.
* Returns: `{Object}` The transformed model

## Structure of a transformation document

The top-level structure of a full transformation document `{Transform}` is keyed by output [EL paths](FrameworkConcepts.md#el-paths) and looks like this:

```
{
    <output-el-path1>: <input-el-path1> OR {SingleTransform},
    <output-el-path2>: <input-el-path2> OR {SingleTransform}
    ...
}
```

A `{SingleTransform}` record is as follows:

```
{
    transform: {
        "type": <transform-type>
        ...
    }
}
```

where `transform-type` is the name of a registered transformation function. This will be a [function grade](FunctionGrades.md) derived from the base grade `fluid.transformFunction`.
Each transformation function can accept arbitrary additional options on the level of the "type" key, but many are derived from the grade `fluid.standardInputTransformFunction` which accept a standard input value named `input` (or path named `inputPath`) and/or derived from the grade `fluid.standardOutputTransformFunction`
which accept an output path named `outputPath`.

In general you should consult the below documentation for each transform function to
see the names and interpretations of its options. Many transforms will themselves accept configuration of type `{SingleTransform}` in their options, leading transform documents to have a recursive structure.

### Reserved words

The model transformation system contains some reserved words - words which have a special meaning when used as JSON keys.
In general, the reserved words of the model transformation system are:

| key | Reserved in |
|:----|:------------|
| `transform` | ___everywhere___ |
| `literalValue` | ___everywhere___ |
| `type` | inside all `transform` blocks |
| `inputPath` | inside all `standardInputTransformFunctions` |
| `input` | inside all `standardInputTransformFunctions`, `fluid.transforms.linearScale` |
| `outputPath` | inside all `standardOutputTransformFunctions`, `fluid.transforms.delete`, `fluid.transforms.valueMapper` (match and nomatch directives) |
| `values` | `fluid.transforms.firstValue` |
| `defaultInputPath` | `fluid.transforms.valueMapper` (top level) |
| `defaultOutputPath` | `fluid.transforms.valueMapper` (top level) |
| `defaultOutputValue` | `fluid.transforms.valueMapper` (top level) |
| `match` | `fluid.transforms.valueMapper` (top level) |
| `partialMatches` | "`fluid.transforms.valueMapper` (inside `match`) |
| `inputValue` | `fluid.transforms.valueMapper` (inside `match`) |
| `outputValue` | `fluid.transforms.valueMapper` (inside `match`/`noMatch`) |
| `outputUndefinedValue` | "`fluid.transforms.valueMapper` (inside `match`/`noMatch`) |
| `left` | `fluid.transforms.binaryOp` |
| `right` | `fluid.transforms.binaryOp` |
| `operator` | `fluid.transforms.binaryOp` |
| `condition` | `fluid.transforms.condition` |
| `true` | `fluid.transforms.condition` |
| `false` | `fluid.transforms.condition` |
| `factor` | `fluid.transforms.linearScale` |
| `offset` | `fluid.transforms.linearScale` |
| `ranges` | `fluid.transforms.quantize` |
| `upperBound` | (inside entries of) `fluid.transforms.quantize` |
| `output` | (inside entries of) `fluid.transforms.quantize` |
| `min` | `fluid.transforms.inRange` |
| `max` | `fluid.transforms.inRange` |
| `key` | `fluid.transforms.indexArrayByKey`, `fluid.transforms.deindexIntoArrayByKey` |
| `innerValue` | `fluid.transforms.indexArrayByKey`, `fluid.transforms.deindexIntoArrayByKey` |
| `array` | `fluid.transforms.indexOf`, `fluid.transforms.dereference` |
| `notFound` | `fluid.transforms.indexOf`, `fluid.transforms.dereference` |
| `offset` | `fluid.transforms.indexOf`, `fluid.transforms.dereference` |
| `template` | `fluid.transforms.stringTemplate` |
| `terms` | `fluid.transforms.stringTemplate` |
| `func` | `fluid.transforms.free` |
| `args` | `fluid.transforms.free` |
| `presentValue` | `fluid.transforms.arrayToSetMembership`, `fluid.transforms.setMembershipToArray` |
| `missingValue` | `fluid.transforms.arrayToSetMembership`, `fluid.transforms.setMembershipToArray` |
| `options` | `fluid.transforms.arrayToSetMembership`, `fluid.transforms.setMembershipToArray` |


Besides these, most transformations have further reserved words. These are briefly listed here, with the transformation(s) they belong too. They will be more fully described for each relevant transformation.

## Grades of transformations

Transformation can be registered with different grades (or types), which define how they handle inputs and outputs. The standard base grades recognized by the framework as follows:

### standardInputTransformFunction

These transformations take a single input which can be defined in two ways:

* `input`: As a constant or nested transform function
* `inputPath`: As a path reference to the input (model) by using the key inputPath.

If both keys are used in a transform declaration, the value found at the `inputPath` will be used if something is found there. If not, the transformer will default to using the value defined by `input`.

More details are given on `input` and `inputPath` later in this document.

### standardOutputTransformFunction:

These transformations only outputs a single value. The value of the output depends on the transformation, but the path to output to can be defined by:

* `outputPath`: An EL path to where the transformation should output its value to.

The output path provided here is always relative to the current path. See section on building the output document structure, found further down.

### standardTransformFunction:

These transformations satisfy the requirements of both `standardInputTransformFunction` and `standardOutputTransformFunction` (see above)

### multiInputTransformFunction:

These transformations allows for multiple inputs. In their default blocks, besides the gradename, they require an `inputVariables` key. The value of this should be a hash of key-value pairs, where the key is the variable name and the value is the default value to assign to the variable in case no matching constant or path is found. For each of the variables declared, the system will look up the source-model path defined by <variable>Path in the transform and the <variable> declared in the transform. They will behave in the same way as `input` and `inputPath`, where the path takes priority , so the non-path value can be used as fallback if nothing found at the path.

An example of a multiInputTransformFunction declaration:

```
fluid.defaults("fluid.transforms.weirdScale", {
    "gradeNames": [ "fluid.multiInputTransformFunction" ],
    "inputVariables": {
        "factor": 1,
        "randomSeed": 0
    }
});
```

The above declaration defines two input variables; `factor` and `randomSeed`. Taking as an example the `factor`, the first thing that will be looked up in the transform is the value of `factorPath`. If it is defined, this path will be looked up in the source-model and this will be assigned to factor if found. If it's not found, the value (expanded if necessary) of the "factor" key of the transform will be used if found. If neither is found, the default value of 1 will be assigned to factor.

The inputVariables will be available to fluid.transforms.weirdScale as the first argument in the form of an object keyed by variable names with the values as described above.

### Combining standardInputTransformFunction and multiInputTransformFunction:

A transformation can have both the grades `standardInputTransformFunction` and `multiInputTransformFunction`. This is useful if one has an variable named `input` (or `inputPath`) and want to take advantage of the frameworks built in support for standardInputTransformations, but also has other inputs that needs supporting. The behavior will be a combination of the `standardInputTransformFunction` and `multiInputTransformFunction`. In the below example, the transform function will have three inputs available to resolve, namely `factor`, `offset` and `input` (and their `*Path` equivalents), with the `input` not requiring to be expressed in the `inputVariables` declaration of the defaults block.

The input variables will be available to the `fluid.transforms.scaleValue` function in the following way: the first argument is the `input` (as for the `standardInputTransformFunction`). The remaining variables will be passed as the second argument in the form of an object keyed by variable names with the values as described in the [multiInputTransformFunction section](ModelTransformationAPI.html#multiinputtransformfunction-) above.

```
fluid.defaults("fluid.transforms.scaleValue", {
    "gradeNames": [ "fluid.standardTransformFunction", "fluid.multiInputTransformFunction" ],
    "inputVariables": {
        "factor": 1,
        "offset": 0
    }
});
```


## Building the output document structure

The ultimate goal when using the model transformation is to create an output document with some desired structure and values (based on information in some input document). Therefore it's important to know how to build the output structure of the document. There are different ways of achieving this, and these will be explained below.

### Keys in the top-level of your document are output el-paths

All keys at the top level of the transformation rules document are interpreted as output paths. Each subsequent key will also be interpreted as so\, until a `transform` or `literalValue` keyword is encountered. Anything inside a `transform` directive is interpreted according the general transformation rules (see below), and the `literalValue` keyword results in it's content being output to the current output path.

***Example***

<table><thead>
</thead><tbody>
<tr><th>source</td><th>rule</th><th>Output</th></tr>
<tr><td>
<pre><code>
{
    "my": {
        "number": 93.56
    }
}
</code></pre>
</td><td>
<pre><code>
{
    "Magnification": {
        "dataType": {
            "literalValue": "integer"
        },
        "value": {
            "transform": {
                "type": "fluid.transforms.round",
                "inputPath": "my.number"
            }
        }
    }
}
</code></pre>
</td><td>
<pre><code>
{
    "Magnification": {
        "dataType": "integer"
        "value": 94
    }
}
</code></pre>
</td>
</tr>
</tbody>
</table>

In the above example, the output structure is defined via the top-level keys: `Magnification`, `dataType` and `value`. Whenever the transformation system encounters a key, that is a non-reserved word, and that is not inside a `transform` block, it will consider that a change in the output path / output structure.

So the walking through the above rules, the first thing we encounter is `Magnification`. Since this is not a reserved word, the system will ensure that everything within that block is output relative to the path `Magnification`. The same goes for `dataType` - everything inside here will be output relative to the path `dataType` (which in turn is relative to Magnification, giving us the output path: `magnification.dataType`). `literalValue` inside dataType is a reserved word, so instead of interpreting this as a change to the output structure, it will be resolved by the model transformation system . The `literalValue` key, is a way to tell the system to literally print the value to the current output path, which as described above is at this location `Magnification.dataType`. More information about the `literalValue` keyword can be found in the below.

Like with `dataType`, the `value` key under `Magnification` means that we change the output path for anything in that block. `transform` is a keyword, so this does not affect the output path. As previously mentioned, once inside a `transform` block, keys will no longer be interpreted as output paths. This means that `type` and `input` will not affect the output path. This means that whatever the result of the rules inside the `transform` block of the `value` key block is, they will get output to `Magnification.value` path. In this case, the value 94.

### Explicitly outputting to a (relative) path

An alternative way to specifying where you want to output values is by using the `outputPath` key. The value of `outputPath` defines the relative location where you want to output the result of the transform. `outputPath` can only be specified in a transform block(i.e. at the same level as the `type` specification for the transform). `outputPath` works for most transformations (namely any transform of the class `standardOutputTransformFunction` or `standardTransformFunction`).

Returning to the example in the previous section, this could be written as:

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "number": 93.56
    }
}
</code></pre></td><td><pre><code>
{
    "transform": [
        {
            "type": "fluid.transforms.literalValue",
            "input": "integer",
            "outputPath": "Magnification.dataType"
        }, {
            "type": "fluid.transforms.round",
            "inputPath": "my.number",
            "outputPath": "Magnification.value"
        }
    ]
}
</code></pre></td><td>
<pre><code>
{
    "Magnification": {
        "dataType": "integer"
        "value": 94
    }
}
</code></pre></td>
</tr>
<tr><td><pre><code>
{
    "my": {
        "number": 93.56
    }
}
</code></pre></td><td><pre><code>
{
    "Magnification": {
        "transform": [
            {
                "type": "fluid.transforms.literalValue",
                "input": "integer",
                "outputPath": "dataType"
            }, {
                "type": "fluid.transforms.round",
                "input": "my.number",
                "outputPath": "value"
            }
        ]
    }
}
</code></pre></td><td>
<pre><code>
{
    "Magnification": {
        "dataType": "integer"
        "value": 94
    }
}
</code></pre></td>
</tr>
</tbody>
</table>


Looking at the first example, the `literalValue` transformation specifies that the result should be output to the path `Magnification.dataType`. Same for the `fluid.transforms.round` transform, where the output will be sent to the path `Magnification.value`.

The second example above, shows how the `outputPath` will be relative to the current output path. Since the entire block is keyed by `Magnification`, this becomes the current output path. When we encounter `outputPath: dataType`, this is interpreted as being relative to the `Magnification` path, and hence result in the full output path `Magnification.dataType`.


## Return values, Arrays of transforms and outputting arrays

### Return values

In general, transformations pass their result one level up, unless `outputPath` is explicitly given. This is the reason that something like the below works:

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "display": {
        "magnification": 1.5412
    }
}
</code></pre></td><td><pre><code>
{
    "Magnification": {
        "transform": {
            "type": "fluid.transforms.round",
            "input": {
                "transform": {
                    "type": "fluid.transforms.linearScale",
                    "inputPath": "display.magnification",
                    "factor": 100
                }
            },
            "outputPath": "Percent"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "Magnification": {
        "Percent": 154
    }
}
</code></pre></td>
</tr>
</tbody>
</table>

Here the result of the inner `fluid.transforms.linearScale` transform is passed to the `fluid.transforms.round` transform, which in turn outputs it to the `outputPath`. Whenever an `outputPath` is specified, the result is output to the output document instead, and hence not returned to the parent transform function (if any). Instead what is returned to the parent function is `undefined`. Generally, this behavior should be rather intuitive.


### Arrays of transforms

Things get slightly more complicated when we introduce arrays of transforms. Whenever you specify an array of transforms (i.e. `transform: [ (...) ]`), nothing will get returned to the outer transform. The consequence of this is that if you have arrays of transforms, you are required to explicitly output values via `outputPath` if you want anything output. Some examples to clarify this rule:

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "display": {
        "magnification": 1.5412
    }
}
</code></pre></td><td><pre><code>
{
    "Magnification": {
        "transform": [
            {
                "type": "fluid.transforms.literalValue",
                "input": "percent",
                "outputPath": "dataType"
            }, {
                "type": "fluid.transforms.round",
                "input": {
                    "transform": {
                        "type": "fluid.transforms.linearScale",
                        "inputPath": "display.magnification",
                        "factor": 100
                    }
                },
                "outputPath": "value"
            }
        ]
    }
}
</code></pre></td><td>
<pre><code>
{
    "Magnification": {
        "dataType": "percent"
        "value": 154
    }
}
</code></pre></td>
</tr>
<tr><td><pre><code>
{
    "display": {
        "magnification": 1.5412
    }
}
</code></pre></td><td><pre><code>
{
    "Magnification": {
        "transform": [
            {
                "type": "fluid.transforms.literalValue",
                "input": "percent"
            }, {
                "type": "fluid.transforms.round",
                "input": {
                    "transform": {
                        "type": "fluid.transforms.linearScale",
                        "inputPath": "display.magnification",
                        "factor": 100
                    }
                }
            }
        ]
    }
}
</code></pre></td><td>
<pre><code>
{}
</code></pre></td>
</tr>
</tbody>
</table>

This first example works because we have specified the `outputPath` for both transforms. If we omit these, as in the second example, nothing is output to the document. Note that the `fluid.transforms.linearScale` function does not have an `outputPath`. Instead its output is used as a return value passed to `fluid.transforms.round` - this is because the `linearScale` is not part of an array of transforms, but rather a regular entry in a transform.

### Outputting Arrays

Outputting an array in the document is very straightforward. One simply specifies it, as one would normally in javascript/json - using []. The array will be populated with the results of the content as one would expect as well. If one of the array entries has a result of undefined (e.g. due to an inputPath referencing something non-existent in input model -- see below), this would also populate a spot in the array - to ensure that indexes of results are consistent.

As an example, take the following transformation:

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "petlist": {
        "cat": "Kaspar the Titanic Cat",
        "frog": "Portuguese Steve"
    }
}
</code></pre></td><td><pre><code>
{
    "my_pets": [
        {
            "transform": {
                "type": "fluid.transforms.value",
                "inputPath": "petlist.cat"
            }
        }, {
            "transform": {
                "type": "fluid.transforms.value",
                "inputPath": "petlist.goldfish"
            }
        }, {
            "transform": {
                "type": "fluid.transforms.value",
                "inputPath": "petlist.frog"
            }
        }
    ]
}
</code></pre></td><td>
<pre><code>
{
    "my_pets": [
        "Kaspar the Titanic Cat",
        undefined,
        "Portuguese Steve"
    ]
}
</code></pre></td>
</tr>
</tbody>
</table>

Notice the `undefined` value. This is the result of the second transform (since no value was found at the `petlist.goldfish` input path, `undefined` is returned.

The difference between this and the use of arrays in the previous sections is that in the previous section the array was used as _the value for a `transform` key_. When this is not the case, an array will be interpreted as a regular array as shown in the above example.


## Static inputs and nested transforms vs. reading from input model

For any `standardInputTransformFunction`, `standardTransformFunction`, `multiInputTransformFunction` and most other transformations, there are three ways of providing inputs to be used by the transformation.
* **Using values from the input model:** This is done by referencing the path where the value to be used can be found. When doing this, the result of the transformation will vary depending on the input document provided to the transformation.
* **Passing a static value, given directly in the rules document:** In other words, one or more of the input values for the transformation is hardcoded into the transformation rule you set up. This means that the result of the transformation in question will be the same every time.
* **Nested Transformation:** One can use the output of another transformation as an input value.

The three types will be explained in detail in the below:


### Using values from the source model:

Obviously, to make model transformations useful, one needs to be able to get a different output document depending on the source model supplied to the transformations. One can read from the source model by use of the `inputPath` key in any `standardTransformFunction` or `standardInputTransformFunction`. In general, any transformation that is not of these types allow to reference the source model, usually denoted by having `Path` as part of the key name - we defer to the documentation on the individual transformations below for more details on these kinds of transforms. In this section, we will only show examples of using `inputPath`.


<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "petlist": {
        "cat": "Kaspar the Titanic Cat"
    }
}
</code></pre></td><td><pre><code>
{
    "my_pet": {
        "transform": {
            "type": "fluid.transforms.value",
            "inputPath": "petlist.cat"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "my_pet": "Kaspar the Titanic Cat"
}
</code></pre></td>
</tr>
<tr><td><pre><code>
{
    "petlist": {
        "cat": "CATTOO"
    }
}
</code></pre></td><td><pre><code>
{
    "my_pet": {
        "transform": {
            "type": "fluid.transforms.value",
            "inputPath": "petlist.cat"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "my_pet": "CATTOO"
}
</code></pre></td>
</tr>
<tr><td><pre><code>
{
    "petlist": {
        "dog": "Spot"
    }
}
</code></pre></td><td><pre><code>
{
    "my_pet": {
        "transform": {
            "type": "fluid.transforms.value",
            "inputPath": "petlist.cat"
        }
    }
}
</code></pre></td><td>
<pre><code>
{}
</code></pre></td>
</tr>
</tbody>
</table>

In the first two examples, you can see how, using the same transformation rules document, the output will vary based on the source model. The `inputPath` describes the el-path from where to fetch the input to the function. If no value is found in the given path, undefined will be the input to the transformation, and undefined returned. So if we have an input model without the path `petlist.cat`, like in the third example, the result of the literalValue transformation would be undefined, and one would receive an empty output document.


### Static Values
Any `standardTransformFunction` or `standardInputTransformFunction` supports an `input` key, which can be used for passing either static values or nest transforms ([ssee next section](ModelTransformationAPI.html#nested-transform)). Most other transforms support the same types of input - we defer to their individual documentation for more details.

As mentioned, static values are written directly into the transformation rule document, resulting in the same input to the transform each time the model transformation is run. Defining static values to transformations is very straight forward:

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "dog": "Snoopy"
}
</code></pre></td><td><pre><code>
{
    "my_pet": {
        "transform": {
            "type": "fluid.transforms.literalValue",
            "input": "Kaspar the Titanic Cat"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "my_pet": "Kaspar the Titanic Cat"
}
</code></pre></td>
</tr>
<tr><td><pre><code>
{}
</code></pre></td><td><pre><code>
{
    "my_pet": {
        "transform": {
            "type": "fluid.transforms.literalValue",
            "input": "Kaspar the Titanic Cat"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "my_pet": "Kaspar the Titanic Cat"
}
</code></pre></td>
</tr>
</tbody>
</table>

As can be seen, regardless of the input model supplied to the transformation. Every time the transformation is run, the result will be the same.


### Nested Transforms
Besides static values, the `input`  key for `standardTransformFunction`s and `standardInputTransformFunction`s supports nested transforms (the same is the case for most other transforms, see their individual documentation). Nested transforms are transformations whose output value will be used as `input` value for its parent transformation.

An `input` interprets the content as a nested transform if its value is an object containing the `transform` or `literalValue` keywords, else the value is interpreted as a static value as described above.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "display": {
        "magnification": 1.5412
    }
}
</code></pre></td><td><pre><code>
{
    "Magnification": {
        "transform": {
            "type": "fluid.transforms.round",
            "input": {
                "transform": {
                    "type": "fluid.transforms.linearScale",
                    "inputPath": "display.magnification",
                    "factor": 100
                }
            },
            "outputPath": "percent"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "Magnification": {
        "percent": 154
    }
}
</code></pre></td>
</tr>
<tr><td><pre><code>
{
    "display": {
        "magnification": 1.5412
    }
}
</code></pre></td><td><pre><code>
{
    "Magnification": {
        "transform": {
            "type": "fluid.transforms.round",
            "input": {
                "transform": {
                    "type": "fluid.transforms.linearScale",
                    "inputPath": "display.magnification",
                    "factor": 100,
                    "outputPath": "sneakyPath"
                }
            },
            "outputPath": "percent"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "Magnification": {
        "sneakyPath": 154.12
    }
}
</code></pre></td>
</tr>
</tbody>
</table>

The first example above, shows the correct usage of nested transforms when one wants to use the return value. The output here from the inner transform (i.e. `fluid.transforms.linearScale`) which is 154.12 is used as `input` for the outer `fluid.transforms.round` function.

The second example shows a case where `outputPath` has been specified in the inner transform. As described in a previous section, the consequence of this is that the transform result is output to the given path and `undefined` is returned. In the example, this means that the output of  `fluid.transforms.linearScale` is output to the specified path `sneakyPath`. The `fluid.transforms.round` will get `undefined` as `input`, which result in outputting nothing to its outputPath.

### Using static values as default fallback value

Generally, `inputPath` takes precedence over `input`. This means that if both `input` and `inputPath` are provided for a transformation, the value found in the model at `inputPath` will be used.

This can be used to provide a 'default' or fallback value. As mentioned, it is possible to use both types of inputs in your rule set in the different transforms, but it is also possible to specify both for a given transformation. The effect of this, is that the input from the model (via path) will be used if it is found, else the static value (or result of transform) will be used. The usefulness should be made clear by the below examples:

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "petlist": {
        "cat": "Kaspar the Titanic Cat"
    }
}
</code></pre></td>
<td><pre><code>
{
    "my_pet": {
        "transform": {
            "type": "fluid.transforms.value",
            "inputPath": "petlist.cat",
            "input": "I have no cat"
        }
    }
}
</code></pre></td>
<td><pre><code>
{
    "my_pet": "Kaspar the Titanic Cat"
}
</code></pre></td>
</tr>
<tr><td><pre><code>
{
    "petlist": { }
}
</code></pre></td><td><pre><code>
{
    "my_pet": {
        "transform": {
            "type": "fluid.transforms.value",
            "inputPath": "petlist.cat",
            "input": "I have no cat"
        }
    }
}
</code></pre></td><td>
<pre><code>
    "my_pet": "I have no cat"
</code></pre></td>
</tr>
</tbody>
</table>

The transformation rule stays the same, but in the second example, there is no 'cat' entry in the input model. This means that the model transformation framework will default to the value found at `input` instead. Note that the value at `input` could also be an object containing transforms.

## Inversion

The framework can generate the inverse of a document where it doesn't use nested transforms, and to the extent that individual transforms are invertible (and have their invertible function defined in the framework). One can then use the results of a transform as input to this inverse transformation and should get the original document as output.

The function used for inverting rules is: `fluid.model.transform.invertConfiguration(transformDocument)`, which takes a single input: the transformation document (or transformation rules) that should be inverted. It outputs the inverted rules (inverted transformation document).

In practice, perfect inversion of a rule is not always possible. Unless extra information is kept, or extra information added about defaulting values, etc., the inversion/lensing will be lossy (see [https://issues.fluidproject.org/browse/FLUID-5133](FLUID-5337) ).

If we call our original transformation function `F`, input document `x` and output document `y`, a general transformation is described as follows: `F(x)=y`. If we say the inverse of `F` is called `G`, we use the following vocabulary to describe different levels of inversion:

* **Lossless Invertible:** `G(y)=G(F(x))=x`
  * This is in practice almost never possible, since the generated `x` will almost always be missing some entries, or have extra entries, depending on how well all the paths in the original `x` matches the ones used by the transformation function `F` (which in turn will affect both `y` and `G`).
* **Partly Invertible:** `F(x)=F(G(F(x)))`
  * In this case, there is no promise on the output of `G` alone, but it is guaranteed that one can pipe an original input model through an `F->G` sequence an unlimited amount of times and always get the same model `y` as output.
* **Not Invertible:** `G` **does not exist (or hasn't been defined in the framework)**
  * For non-inverable functions, there is either no logical way of deciding what an inverse would mean for that function, or there is no way to reproduce the original input document from an output document.

The invertibility of each transform function will be described in conection to the individual transform function below.


## Transformation Functions:

### Literal Value (fluid.transforms.literalValue)

**Type:** standardOutputTransformFunction

**Description:** Returns the value given as `input`, without attempting to do further transformations or interpretations for that value. It will always produce the same value independent of the source model/document.

**Invertibility:** Partly invertible.

**Syntax:**
```
{
    "transform": {
        "type": "fluid.transforms.literalValue",
        "input": "some constant"
    }
}
```

#### Examples:

**Example 1: You can use literalValue if you have some constant that you want to output to the document**
<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.literalValue",
        "input": "some constant",
        "outputPath": "foo"
    }
}
</code></pre></td>
<td><pre><code>
{
    "foo": "some constant"
}
</code></pre></td>
</tr>
</tbody>
</table>


**Example 2: The content of literal value will not be transformed further**
<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.literalValue",
        "input": {
           "transform": {
              "type": "fluid.transforms.helloworld",
              "input": "I'm not interpreted"
           }
        },
        "outputPath": "foo"
    }
}
</code></pre></td><td>
<pre><code>
{
    "foo": {
        "transform": {
            "type": "fluid.transforms.helloworld",
            "input": "I'm not interpreted"
        }
    }
}
</code></pre></td>
</tr>
</tbody>
</table>


### Output a value given as input (fluid.transforms.value and fluid.transforms.identity)

**Type:** standardTransformFunction

**Description:** This transform takes an input value and outputs it. When an `inputPath` is present, the value is taken from that path. Else the value found at `input` will be output (unless it's a `transform`, in which case it will be interpreted). It is primarily used by the framework in its shorthand notation (see examples). It is a synonym to `fluid.transforms.identity`.

**Invertibility:** Partly invertible. The `input` default values are always ignored.

#### Examples:

**Example 1: Standard usage**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": "balloon"
    }
}
</code></pre></td>
<td><pre><code>
{
    "myfavorite": {
        "transform": {
            "type": "fluid.transforms.value",
            "inputPath": "my.path"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "myfavorite": "balloon"
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Short notation**

Note that this transform is implicit when using a string as a value to a key, where a `transform` directive would usually be expected.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": "balloon"
    }
}
</code></pre></td>
<td><pre><code>
{
    "myfavorite": "my.path"
}
</code></pre></td><td>
<pre><code>
{
    "myfavorite": "balloon"
}</code></pre></td>
</tr>
</tbody>
</table>


### fluid.transforms.stringToNumber

**Type:** standardTransformFunction

**Description:** Parses a string into a number. The number can be floating point or decimal. If the string is not parseable into a number, `undefined` will be returned.

**Invertibility:** Partly invertible. The `input` default values are always ignored.

#### Examples:

**Example 1: Number conversion**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": "100.91"
    }
}</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.stringToNumber",
        "inputPath": "my.path",
        "outputPath": "outie"
    }
}
</code></pre></td><td>
<pre><code>
{
    "outie": 100.91
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Non-number string**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": "i am no number"
    }
}</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.stringToNumber",
        "inputPath": "my.path",
        "outputPath": "outie"
    }
}
</code></pre></td><td>
<pre><code>
{}
</code></pre></td>
</tr>
</tbody>
</table>

### fluid.transforms.numberToString

**Type:** standardTransformFunction

**Description:** Parses a number into a string. If the input is not a number, `undefined` will be returned.

**Invertibility:** Partly invertible. It is invertible when its domain is restricted to numbers.

#### Examples:

**Example 1: Number conversion**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": 100.91
    }
}</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.numberToString",
        "inputPath": "my.path",
        "outputPath": "outie"
    }
}
</code></pre></td><td>
<pre><code>
{
    "outie": "100.91"
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Non-number string**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": "I'm a string"
    }
}</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.stringToNumber",
        "inputPath": "my.path",
        "outputPath": "outie"
    }
}
</code></pre></td><td>
<pre><code>
{}
</code></pre></td>
</tr>
</tbody>
</table>


### Count length of array (fluid.transforms.count)

**Type:** standardTransformFunction

**Description:** If the input is an array, the length of the array will be the output of this function. If the input is a primitive or object, 1 will be returned.

**Invertibility:** Not invertible.

#### Examples:

**Example 1: Counting the length of an array**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.count",
        "input": [ "foo", "bar" ],
        "outputPath": "howLong"
    }
}
</code></pre></td><td>
<pre><code>
{
    "howLong": 2
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Using path as input**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": [ "foo", "bar" ]
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.count",
        "inputPath": "my.path",
        "outputPath": "howLong"
    }
}
</code></pre></td><td>
<pre><code>
{
    "howLong": 2
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 3: Primitive value as input**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "path": "i am a string"
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.count",
        "inputPath": "my.path",
        "outputPath": "howLong"
    }
}
</code></pre></td><td>
<pre><code>
{
    "howLong": 1
}
</code></pre></td>
</tr>
</tbody>
</table>

### Round a floating point number (fluid.transforms.round)

**Type:** standardTransformFunction

**Description:** Rounds the input to the nearest decimal.

**Invertibility:** Partly invertible. The `input` default values are always ignored.

#### Examples:

**Example 1: If the input is already an array, it will stay so**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "myin": 123.41
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.round",
        "inputPath": "myin",
        "outputPath": "outie"
    }
}
</code></pre></td><td>
<pre><code>
{
    "outie": 123
}
</code></pre></td>
</tr>
</tbody>
</table>

### Get first value of array (fluid.transforms.firstValue)

**Type:** fluid.standardOuputTransformFunction

**Description:** Returns the first entry of the array that does not evaluate to undefined. The input is required to be of type array.

**Invertibility:** Not invertible

**syntax:**

```
{
    "transform": {
        "type": "fluid.transforms.firstValue",
        "values": <array of input values interpreted as transforms>
    }
}
```

#### Examples:

**Example 1: Takes first entry of an array**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "foo": "hello",
    "bar": "world"
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.firstValue",
        "values": [ "foo", "bar" ],
        "outputPath": "myfirst"
    }
}
</code></pre></td><td>
<pre><code>
{
    "myfirst": hello"
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Ignores undefined values**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "bar": "world"
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.firstValue",
        "values": [ "foo", "bar" ],
        "outputPath": "myfirst"
    }
}
</code></pre></td><td>
<pre><code>
{
    "myfirst": world"
}
</code></pre></td>
</tr>
</tbody>
</table>

### Delete path from the output (fluid.transforms.delete)

**type:** transformFunction

**Description:** Deletes a path from the output document. This is useful when outputting a large structure to the output document, but you require deletion of a certain part of that structure.

The only option that `delete` supports is `outputPath`, which points to the outputPath to be deleted.

**Invertibility:** Not invertible

**Syntax:**

```
transform: {
    "type": "fluid.transforms.delete",
    "outputPath": <the output path to delete>
}
```

#### Examples:

The `"": ""` in the transform would normally mean that the entire input model is copied without any transformations, but the delete transform ensures that the path "foo" is deleted.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "hello": "world",
    "foo": "bar"
}
</code></pre></td>
<td><pre><code>
{
    "": "",
    "transform": {
        "type": "fluid.transforms.delete",
        "outputPath": "foo"
    }
}
</code></pre></td><td>
<pre><code>
{
     "hello": "world"
}
</code></pre></td>
</tr>
</tbody>
</table>

### Mapping based on input value (fluid.transforms.valueMapper)

**type:** transformFunction

**Description:**
This is a very powerful and flexible transformation function, which maps a defined collection of input values to corresponding output values by applying a matching algorithm. The input can be partly or fully matched, the result of the mapping can be customized on a per match basis. For further explanation, see the syntax and examples sections below.

**Invertibility:** Partly invertible.

**Syntax:**
```
{
    type: "fluid.transforms.valueMapper",
    defaultInputPath: <default input path>,
    defaultOutputPath: <default output path>,
    defaultOutputValue: <default output value>,
    match: [{
        partialMatches: <accept partial match>,
        outputUndefinedValue: <output `undefined` flag>,
        inputValue: <the value to match>,
        outputValue: <output value>,
        outputPath: <output path>
    }, {
        ...
    }],
    noMatch: {
        outputUndefinedValue: <output `undefined` flag>,
        outputValue: <output value>,
        outputPath: <output path>
    }
};
```

___Top level:___
* `defaultInputPath`
 * The input path to use.
 * Any value provided here will be overwritten by any `inputPath` given in the `match` directives.
 * This is optional if `inputPath` directives are given in each of the match directives.
* `defaultOutputValue`
 * The value to output by default.
 * Used if no `outputValue` is provided for a given match.
 * Optional if `outputValue` is provided for all matches
 * The meaning of `defaultOutputValue` is NOT "the output in case no case matches" but "the `outputValue` that should be used in a case where it has not been explicitly written".
* `defaultOutputPath`
 * The output path used by default.
 * Used if no `outputPath` is provided for a given case.
 * Optional if `outputPath` is provided for all matches.

___Within `match`/`noMatch`:___
* `outputPath`
 * Path to output to if this case matches.
 * If not provided, the `defaultOutputPath` will be used.
* `outputValue`
 * Value to output to the `outputPath` if this case matches.
 * Value is interpreted as literal value unless it contains a `transforms` key.
 * If not provided, the `defaultOutputValue` will be used.
* `inputPath`
 * The input path to match against.
 * overwrites `defaultInputPath` for the given directive.
* `outputUndefinedValue`
 * This will cause the match directive to return `undefined` as an output value, even if `outputValue` and `defaultOutputValue` are specified.

___Only within `match`:___
* `inputValue`
 * The value to check the input against.
 * This can also be implicitly provided as a key in the top-level of options block.
 * Will always be interpreted literally (ie. no transforms allowed here)
* `partialMatches`
 * Boolean flag, signifying whether this directive is allowed to match partly.
 * If any exact match can be made (even if it contains a partialMatches flag), this beats a partial match. Else the best partial match (ie. deepest matching) will be selected. Else the value from `noMatch` will be used.
 * If the two best partial matches are equally good, the first one listed will be returned.

**Priority of keys at parsing**:

Some of the keys used in the ValueMapper conflict, in that they reference the same part of the transformation mechanisms. Below is a summary of which term takes priority when the valueMapper parses the keys:

* `inputPath` before `defaultInputPath`  - If an `inputPath` is provided, that value will be used, else `defaultInputPath` will be used.
* `outputPath` before `defaultOutputValue`  - The `outputPath` will be used used if provded, else `defaultOutputPath` will.
* `outputUndefinedValue` over `outputValue` over `defaultOutputValue` - If `outputUndefinedValue` is provided, it will always be used. If it is not provided, but `outputValue` is, this will be used. Finally, if neither are provided, `defaultOutputValue` is used.

**Shorthand syntax**:

ValueMapper supports the shorthand syntax shown below. Here, the `<inputX>` entries are interpreted as `inputValue` by the system. If `<outputX>` are primitive datatypes (string, number or boolean), they will be used directly as output. Else they should be objects with the same format in the longhand syntax described above - excluding support the `inputValue` option.

```
{
    type: "fluid.transforms.valueMapper",
    defaultInputPath: <default input path>,
    defaultOutputPath: <default output path>,
    defaultOutputValue: <default output value>,
    match: {
        "<input1>": <output1>,
        "<input2>": <output2>,
        ...,
        "<inputN>": <output3>
    },
    noMatch: {
        outputUndefinedValue: <output `undefined` flag>,
        outputValue: <output value>,
        outputPath: <output path>
    }
};
```

#### Examples

**Example 1: Shorthand with primitive output values**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    condition: "yes"
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        type: "fluid.transforms.valueMapper",
        defaultInputPath: "condition",
        defaultOutputPath: "CATTOO",
        match: {
            "yes": "positiveCATT",
            "no": "negativeCATT"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "CATTOO": "positiveCATT"
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Shorthand with non-primitive output values**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    condition: "no"
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        type: "fluid.transforms.valueMapper",
        defaultInputPath: "condition",
        defaultOutputPath: "defPath",
        match: {
            "yes": {
                outputPath: "myPath1",
                outputValue: "positiveCATT"
            },
            "no": {
                outputPath: "myPath1",
                outputValue: "negativeCATT"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "myPath1": "negativeCATT"
}
</code></pre></td>
</tr>
</tbody>
</table>


**Example 3: Longhand syntax with noMatch**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    whichAnimal: "CATTOO"
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        type: "fluid.transforms.valueMapper",
        defaultInputPath: "whichAnimal",
        defaultOutputValue: "selected",
        match: [
            {
                inputValue: "eagle",
                outputPath: "eagleCATT"
            }, {
                inputValue: "tiger",
                outputPath: "tigerCATT"
            }
        ],
        noMatch: {
            outputPath: "WhosThat",
            outputValue: "theNoMatchCATT"
        }
}
</code></pre></td><td>
<pre><code>
{
    "WhosThat": "theNoMatchCATT"
}
</code></pre></td>
</tr>
</tbody>
</table>


**Example 4: Longhand syntax with partial Matches**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    info: {
        "arms": 2,
        "ears": 2
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        type: "fluid.transforms.valueMapper",
        defaultInputPath: "info",
        defaultOutputPath: "creature",
        match: [{
            inputValue: {
                "legs": 2,
                "arms": 2,
                "veryhairy": false
            },
            partialMatches: true,
            outputValue: "human"
        }, {
            inputValue: {
                "legs": 2,
                "arms": 2
            },
            partialMatches: true,
            outputValue: "probably monkey"
        }, {
            inputValue: {
                "arms": 2
            },
            partialMatches: true,
            outputValue: "can handstand"
        }]
    }
}
</code></pre></td><td>
<pre><code>
{
    creature: "can handstand"
}
</code></pre></td>
</tr>
</tbody>
</table>




### Binary operation (fluid.transforms.binaryOp)

**type:** multiInputTransformFunction, standardOutputTransformFunction

**Description:**
This will do a binary operation given the two operands (`left` and `right`) and the operator. You can reference to the input model for both left and right by using `leftPath` and `rightPath`. If both `rightPath` and `right` is given, a lookup will be done of `rightPath` first, and if nothing is found the constant from `right` will be used. Same goes for `left` and `leftPath`. Both the `left` and `right` operands are required (either in their path or constant form). The operator is also required. The result of the expansion will be the result of the binary operation, and this will be returned or output to the outputPath as any other `standardOutputTransformFunction`. Valid operands are:

Arithmetic Operators (operands are required to be numbers, output will be a number):

* **+** (Addition) Adds 2 numbers.
* **-** (subtraction) subtracts 2 numbers
* **&#42;** (Multiplication) Multiplies 2 numbers.
* **/** (Division) Divides 2 numbers.
* **%** (Modulus) Computes the integer remainder of dividing 2 numbers.

Comparison Operators: (operands are required to be numbers, output will be boolean)

* **===** Returns true if the operands are equal.
* **!==** Returns true if the operands are not equal.
* **>** Returns true if left operand is greater than right operand.
* **>=** Returns true if left operand is greater than or equal to right operand.
* **<** Returns true if left operand is less than right operand.
* **<=** Returns true if left operand is less than or equal to right operand.

Logical Operators: (both operands are required to be booleans, output will be boolean)

* **&&** (Logical AND) Returns true if both logical operands are true. Otherwise, returns false.
* **||** (Logical OR) Returns true if either logical expression is true. If both are false, returns false.

**Invertibility:** Not invertible.

**Syntax:**

```
transform: {
    "type": "fluid.transforms.binaryOp",
    "left": <constant of appropriate type>,
    "right": <constant of appropriate type>,
    "operator": <the operator to use>
}
```

#### Examples

**Example 1: Standard addition**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "some": {
        "path": 200
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.binaryOp",
        "left": 100,
        "rightPath": "some.path",
        "operator": "+",
        "outputPath": "sum"
    }
}
</code></pre></td><td>
<pre><code>
{
    "sum": 300
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Fallback from path**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "some": {
        "path": 200
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.binaryOp",
        "left": 100,
        "leftPath": "some.other.path",
        "right": 0,
        "rightPath": "some.path",
        "operator": "+",
        "outputPath": "sum"
    }
}
</code></pre></td><td>
<pre><code>
{
    "sum": 300
}
</code></pre></td>
</tr>
</tbody>
</table>


### Conditional transform (fluid.transforms.condition)

**type:** `multiInputTransformFunction` , `standardOutputTransformFunction`

**Syntax:**

```
transform: {
    "type": "fluid.transforms.condition",
    "condition": <boolean value>
    "true": <optional>,
    "false": <optional>
}
```

**Description:**
Based on the boolean `condition` constant (or the path to the inputModel `conditionPath`) either the value or `true` or `false` (`truePath`/`falsePath`, respectively) will be the result of the transform. The `condition` is required and either `true` or `false` (or both) - or their path equivalents - should be defined. As usual, the '*Path' equivalents of the input variables can be used as fallbacks.

**Invertibility:** Not invertible

#### Example:

**Example 1: Standard usage**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "some": {
        "path": true
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.condition",
        "conditionPath": "some.path",
        "true": "It was true",
        "false": "It was false",
        "outputPath": "result"
    }
}
</code></pre></td><td>
<pre><code>
{
    "result": "It was true"
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Fallback from path**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.condition",
        "conditionPath": "some.path",
        "condition": true,
        "true": "It was true",
        "false": "It was false",
        "outputPath": "result"
    }
}
</code></pre></td><td>
<pre><code>
{
    "result": "It was true"
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 3: Nested transform**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "some": {
        "path": true
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.condition",
        "conditionPath": "some.path",
        "true": {
            "transform": {
                "type": "fluid.transforms.binaryOp",
                "left": 100,
                "right": 200,
                "operator": "+"
            }
        },
        "false": "It was false",
        "outputPath": "result"
    }
}
</code></pre></td><td>
<pre><code>
{
    "result": 300
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 4: Using an undefined input**

If either the `left` or `right` (or their path equivalents) evaluate to `undefined` and there is no default in case of using path, the result of the transform will be `undefined`.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "some": {
        "path": true
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.condition",
        "conditionPath": "some.path",
        "truePath": "nonexistent.path",
        "false": "It was false",
        "outputPath": "result"
    }
}
</code></pre></td><td>
<pre><code>
{}
</code></pre></td>
</tr>
</tbody>
</table>


### Scale value with optional offset (fluid.transforms.linearScale)

**type:** `multiInputTransformFunction`, `standardInputTransformFunction` and `standardOutputTransformFunction`.

**Description:** This will scale the input value using the equation: `value * factor + offset`. If `factor` is unspecified it will be interpreted as 1 and if `offset` is unspecified it will be interpreted as 0. Both `factor` and `offset` can references to the input model by using: `factorPath` and `offsetPath`, respectively. If both the path and constant for any of these values is defined, first the path is looked up, and if a value is found it will be used. Else the system will fallback to using the constant.

**Invertibility:** Partly invertible.

**Syntax:**
```
transform: {
    "type": "fluid.transforms.linearScale",
    "input": <constant of array type>,
    "factor": <the scaling factor>,
    "offset": <the offset to use for the scaling>
}
```

#### Examples:

**Example 1: all variables specified**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.linearScale",
        "input": 12,
        "factor": 10,
        "offset": 100,
        "outputPath": "mypath"
    }
}
</code></pre></td><td>
<pre><code>
{
    "mypath": 220
}
</code></pre>
</td>
</tr>
</tbody>
</table>



**Example 2: Only some variables specified**

In this example, since no value is found at `some.path`, the factor will default to 1, outputting `12*1+0=12`. If a value was instead found (say, 12) the output would've been `12*12+0=144`

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.linearScale",
        "input": 12,
        "factorPath": "some.path",
        "outputPath": "mypath"
    }
}
</code></pre></td><td>
<pre><code>
{
    "mypath": 12
}
</code></pre></td>
</tr>
</tbody>
</table>

**Example 3: Only some variables specified**

This example uses the same transformation rule as above, but in this case a value is found at factorPath, so this will be used as factor. Since `offset` is not specified, the value 0 will be used for this.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "some": {
        "path": 12
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.linearScale",
        "input": 12,
        "factorPath": "some.path",
        "outputPath": "outie"
    }
}
</code></pre></td><td>
<pre><code>
{
    "outie": 144
}
</code></pre></td></tr>
</tbody>
</table>


### Mapping a continuous range into discrete values (fluid.transforms.quantize)

**type:** standardTransformFunction

**Description:** If you have a continuous range of values (e.g. 0...*) and want to change that into discrete values, this is the transform to use. It also works as a non-linear scale of values, as you can define what ranges maps to what outputs.

The transform allows you to specify some ranges, defined by an `upperBound`. The first entry, the range will be the `upperBound` value to negative infinite. For the second entry, the range will be the range from the `upperBound` to (but excluding) the previous entry's `upperBound`. For the final entry no upper bound can be given, indicating that this range is from the previous `upperBound` to infinity.

**Syntax:**

```
"transform": {
    "type": "fluid.transforms.quantize",
    "inputPath": <path to the value to check ranges from>,
    "ranges": [
        {
            "upperBound": <the upper bound for first entry, lower bound is infinity>,
            "output": <output value (or transform) in case the input falls into this range>
        }, {
            "upperBound": <the upper bound for second entry, lower bound is the 'upperBound' value from first entry>,
            "output": <output value (or transform) in case the input falls into this range>
        }, {
            (...)
        }, {
            "output": <output value (or transform) if input is between previous upper bound and infinity>
        }
    ]
}
```

**Invertibility:** Not invertible.

### Examples:

**Example 1: Standard usage of quantize transformer**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "input": 12
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "gpii.transforms.quantize",
        "inputPath": "my.input",
        "outputPath": "mysize",
        "ranges": [
            {
                "upperBound": 11,
                "output": "small"
            }, {
                "upperBound": 13,
                "output": "normal"
            }, {
                "upperBound": 17,
                "output": "big"
            }, {
                "output": "very big"
            }
        ]
    }
}
</code></pre></td>
<td><pre><code>
{
    "mysize": "normal"
}
</code></pre></td></tr>
</tbody>
</table>

**Example 2: Standard usage of quantize transformer - hitting lower bound**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "input": 2
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.quantize",
        "inputPath": "my.input",
        "outputPath": "mysize"
        "ranges": [
            {
                "upperBound": 11,
                "output": "small"
            }, {
                "upperBound": 13,
                "output": "normal"
            }, {
                "upperBound": 17,
                "output": "big"
            }, {
                "output": "very big"
            }
        ]
    }
}
</code></pre></td><td>
<pre><code>
{
    "mysize": "small"
}
</code></pre></td></tr>
</tbody>
</table>

**Example 3: Standard usage of quantize transformer - hitting upper bound**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "input": 200
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.quantize",
        "inputPath": "my.input",
        "outputPath": "mysize"
        "ranges": [
            {
                "upperBound": 11,
                "output": "small"
            }, {
                "upperBound": 13,
                "output": "normal"
            }, {
                "upperBound": 17,
                "output": "big"
            }, {
                "output": "very big"
            }
        ]
    }
}
</code></pre></td><td>
<pre><code>
{
    "mysize": "very big"
}
</code></pre></td></tr>
</tbody>
</table>


### Check whether a number is in a given range (fluid.transforms.inRange)

**type:** standardTransformFunction

**Description:** Checks whether an `input` or `inputPath` is in a given range, outputs `true` or `false` depending on whether it is in that range. The range is indicated by `min` and `max`, both of which are inclusive. The range can be open-ended by not specifying one of these.

**Syntax:**

```
"transform": {
    "type": "fluid.transforms.inRange",
    "inputPath": <path to the value to check ranges from - input is valid as well>,
    "min": <OPTIONAL: the minimum (inclusive) of the range to check>,
    "max": <OPTIONAL: the maximum (inclusive) of the range to check>,
    "outputPath": <OPTIONAL: path to output to>
}
```

**Invertibility:** Not invertible.

### Examples:

**Example 1: Standard usage of inRange transformer**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "input": 12
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "gpii.transforms.inRange",
        "inputPath": "my.input",
        "outputPath": "isInRange",
        "min": 10,
        "max": 100
    }
}
</code></pre></td><td>
<pre><code>
{
    "isInRange": true
}
</code></pre></td></tr>
</tbody>
</table>

**Example 2: Standard usage of inRange transformer (out of range)**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "input": 110
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "gpii.transforms.inRange",
        "inputPath": "my.input",
        "outputPath": "isInRange",
        "min": 10,
        "max": 100
    }
}
</code></pre></td><td>
<pre><code>
{
    "isInRange": false
}
</code></pre></td></tr>
</tbody>
</table>

**Example 3: Open ended usage of inRange transformer**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "input": 110
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "gpii.transforms.inRange",
        "inputPath": "my.input",
        "outputPath": "isInRange",
        "min": 10
    }
}
</code></pre></td><td>
<pre><code>
{
    "isInRange": true
}
</code></pre></td></tr>
</tbody>
</table>

**Example 4: Range endpoints are inclusive**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "my": {
        "input": 100
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "gpii.transforms.inRange",
        "inputPath": "my.input",
        "outputPath": "isInRange",
        "min": 10,
        "max": 100
    }
}
</code></pre></td><td>
<pre><code>
{
    "isInRange": true
}
</code></pre></td>
</tr>
</tbody>
</table>


### Creates an object indexed with keys from array entries (fluid.transforms.indexArrayByKey)

**type:** standardTransformFunction

**Description:** This transform is one of the more specialized and complex transforms. It takes an array of objects as `input`, and outputs an object of objects. For each array entry, the value of a given key in that entry (from the `key` transform option) is used as key in the output object. The values in the output object are the remaining content of that arrays' entries.

This means that the transform requires a `key` defined - an that this should be present in each of the array-entries of the `input` - and that the values found for this key will be used to key the resulting object.

Besides the `key` and standard `input`/`inputPath` options, the indexArrayByKey transform allows optionally for a `innerValue`, which allows one do transforms on the values of the resulting output object. Note that within this `innerValue`, all `inputPath` (and other *Path declarations) are relative to the path defined by the `inputPath` of the indexArrayByKey transform.

Note: this transform was developed in relation to the XMLSettingsHandler used by the GPII auto-personalization. This translates data from XML files (which often represents "morally indexed" data in repeating array-like constructs where the indexing key is held, for example, in an attribute) to JSON format. This transform makes it easier (possible) to reference the specific elements within one of these XML arrays that are otherwise only uniquely identifiable via their content (and not their order).

**Invertibility:** Partly invertible (into [`fluid.transforms.deindexIntoArrayByKey`](ModelTransformationAPI.html#creates-an-object-indexed-with-keys-from-array-entries-fluid-transforms-deindexintoarraybykey-)).

**Syntax:**

```
transform: {
    "type": "fluid.transforms.indexArrayByKey",
    "inputPath": "some input path pointing to an array",
    "key": "the variable from array to use as key"
    "innerValue": [ (...inner transforms...) ]
}
```

#### Examples:

**Example 1: Simple Example**

In this example, the `key` provided in our transform function is `product`. This means that for each entry in our input array, we will use the value found by the `product` key (i.e. "salad" and "candy", respectively) and use that as the key in our output object. The output object will contain, for each key, the remaining entries from the array entry's object.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "foo": {
        "bar": [
            { "product": "salad", "price": 10, "healthy": "yes" },
            { "product": "candy", "price": 18, "healthy": "no" }
        ]
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.indexArrayByKey",
        "inputPath": "foo.bar",
        "key": "product",
        "outputPath": "transformed"
    }
}
</code></pre></td><td>
<pre><code>
{
    "transformed": {
        "salad": { price: 10, healthy: "yes" },
        "candy": { price: 18, healthy: "no" }
    }
}
</code></pre></td></tr>
</tbody>
</table>

**Example 2: Using InnerValue for transforms**

An optional variable to the transform is `innerValue`. Any variable or transform that needs to refer to the content of the array should be declared here. The input paths within the innerValue block will be relative to the original array entry.

For the below example, in the second (innermost) `inputPath`, we refer to `info.healthy`, which is relative to the path defined by our outer `inputPath`. As can be seen the transform defined within `innerValue` is applied to the value of the output object.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "foo": {
        "bar": [
            { "product": "salad", "info": { "price": 10, "healthy": "yes" }},
            { "product": "candy", "info": { "price": 18, "healthy": "no", "tasty": "yes" }}
        ]
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.indexArrayByKey",
        "outputPath": "transformed",
        "inputPath": "foo.bar",
        "key": "product",
        "innerValue": [{
            "transform": {
                "type": "fluid.transforms.value",
                "inputPath": "info.healthy"
            }
        }]
    }
}

</code></pre></td><td>
<pre><code>
{
    "transformed": {
        "salad": "yes",
        "candy": "no"
    }
}
</code></pre></td></tr>
</tbody>
</table>

### Create an object indexed with keys from array entries (fluid.transforms.deindexIntoArrayByKey).

**type:** standardTransformFunction

**Description:** Transforms an object of objects into an array of objects, by deindexing the object keys. The objects within the output object, will each contain a de-indexed key as an extra item, with the key for that new item being defined by the `key` parameter.

A brief illustration of this is given here:

```
input: {
    "cat": { name: "CATTOO" },
    "mouse": { name: "MAUS" }
}
output: [
    { name: "CATTOO", animal: "cat" },
    { name: "MAUS", animal: "mouse" }
]
```

In the above case, the `key` option would be `animal`. The outer key-names are added to their respective object as an entry with a key `animal`.

Besides the `key` and standard `input`/`inputPath` options, the `deindexIntoArrayByKey` transform allows optionally for a `innerValue`, which allows one do transforms on the values of the resulting output object. Note that within this `innerValue`, all `inputPath` (and other `*Path` declarations) are relative to the path defined by the `inputPath` of the `deindexIntoArrayByKey` transform.

Note: this transform was developed in relation to the XMLSettingsHandler used by the GPII auto-personalization. This translates data from XML files (which often represents "morally indexed" data in repeating array-like constructs where the indexing key is held, for example, in an attribute) to JSON format. This transform makes it easier (possible) to reference the specific elements within one of these XML arrays that are otherwise only uniquely identifiable via their content (and not their order).

**Invertibility:** Partly invertible. (into is [`fluid.transforms.indexArrayByKey`](ModelTransformationAPI.html#creates-an-object-indexed-with-keys-from-array-entries-fluid-transforms-indexarraybykey-))

**Syntax:**

```
transform: {
    "type": "fluid.transforms.deindexIntoArrayByKey",
    "inputPath": "some input path pointing to an object of objects",
    "key": "the variable to use as key for newly added entries"
    "innerValue": [ (...inner transforms...) ]
}
```

#### Examples:

**Example 1: Simple Example**

In this example, the `key` provided in our transform function is `product`. This means that each of the keys within the object given as input, will be added as a value to the corresponding object with `product` as key.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "foo": {
        "salad": { "price": 10, "healthy": "yes" },
        "candy": { "price": 18, "healthy": "no" }
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.deindexIntoArrayByKey",
        "inputPath": "foo",
        "outputPath": "bar",
        "key": "product"
    }
}
</code></pre></td><td>
<pre><code>
bar: [
    { product: "salad", price: 10, healthy: "yes" },
    { product: "candy", price: 18, healthy: "no" }
]
</code></pre></td>
</tr>
</tbody>
</table>

**Example 2: Using InnerValue for transforms**

An optional variable to the transform is `innerValue`. Any variable or transform that needs to refer to the content of the array should be declared here. The input paths within the innerValue block will be relative to the original array entry.

For the below example, in the second (innermost) `inputPath`, we refer to `info.healthy`, which is relative to the path defined by our outer `inputPath`. As can be seen the transform defined within `innerValue` is applied to the value of the output object.

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "foo": {
        "salad": { "price": 10, "healthy": "yes" },
        "candy": { "price": 18, "healthy": "no" }
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.deindexIntoArrayByKey",
        "inputPath": "foo",
        "outputPath": "bar",
        "key": "product",
        "innerValue": [{
            "transform": {
                "type": "fluid.transforms.value",
                "inputPath": "",
                "outputPath": "info.healthy"
            }

        }]
    }
}

</code></pre></td><td>
<pre><code>
{
    "bar": [
        { product: "salad", info: { price: 10, healthy: "yes" }},
        { product: "candy", info: { price: 18, healthy: "no" }}
    ]
}
</code></pre></td></tr>
</tbody>
</table>

### Get the index of an element in an array (fluid.transforms.indexOf)

**Type:** standardTransformFunction

**Description:** Returns the index of a given element in an array. This transform checks whether the given `input`/`inputPath` is in the array provided via `array`. If it is found, the index of the element is given. If it is not found, `-1` will be returned instead.

It furthermore allows for an `offset` to be provided, which will be added to the return value, and a `notFound` which will be returned in case the element is not found in the array. `notFound` is not allowed to be a positive integer, as this threatens invertibility.

The `offset` will be added to the output index, even if the element is not found.

Returns `undefined` if no array is provided.

**Invertibility:** Fully invertible (into [`fluid.transforms.dereference`](ModelTransformationAPI.html#get-the-value-at-an-index-of-array-fluid-transforms-dereference-)) with the domain of values that are present in the array.


**Syntax:**

```
{
    "type": "fluid.transforms.indexOf",
    "array": <the array to look in>,
    "input": <the value to look for>,
    "notFound": <OPTIONAL: to be returned in case the element is not found>,
    "offset": <OPTIONAL: offset to the returned index>
}
```

#### Examples:


** Example 1: standard usage**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "element": "dog"
}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.indexOf",
            "array": ["sheep", "dog"],
            "inputPath": "element"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "value": 1
}
</code></pre></td></tr>
</tbody>
</table>

** Example 2: -1 is returned if element is not found**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "element": "goat"
}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.indexOf",
            "array": ["sheep", "dog"],
            "inputPath": "element"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "value": -1
}
</code></pre></td></tr>
</tbody>
</table>

** Example 3: Usage with notFound**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "element": "goat"
}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.indexOf",
            "array": ["sheep", "dog"],
            "inputPath": "element",
            "notFound": "not there"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "value": "not there"
}
</code></pre></td></tr>
</tbody>
</table>

** Example 4: Usage with offset**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "element": "dog"
}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.indexOf",
            "array": ["sheep", "dog"],
            "inputPath": "element",
            "offset": 2
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "value": 3
}
</code></pre></td></tr>
</tbody>
</table>

** Example 5: Offset added even if element is not found**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "element": "goat"
}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.indexOf",
            "array": ["sheep", "dog"],
            "inputPath": "element",
            "offset": 2
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "value": 1
}
</code></pre></td></tr>
</tbody>
</table>

### Get the value at an index of array (fluid.transforms.dereference)

**Type:** standardTransformFunction

**Description:** Returns the value of a given index in an array. This transform looks up the index given by `input`/`inputPath` in the array provided via `array`. It returns the value found at that index.

It allows for an `offset` to be provided, which will be added to the index that is being looked up.

**Invertibility:** Partly invertible (into [`fluid.transforms.indexOf`](ModelTransformationAPI.html#get-the-index-of-an-element-in-an-array-fluid-transforms-indexof-)).

**Syntax:**

```
{
    "type": "fluid.transforms.dereference",
    "array": <the array to look in>,
    "input": <the index to look for>,
    "offset": <OPTIONAL: offset to the index being looked up>
}
```

#### Examples:


** Example 1: standard usage**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "element": 1
}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.dereference",
            "array": ["sheep", "dog"],
            "inputPath": "element"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "value": "dog"
}
</code></pre></td></tr>
</tbody>
</table>

** Example 2: Usage with offset**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "element": 0
}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.dereference",
            "array": ["sheep", "dog"],
            "inputPath": "element",
            "offset": 1
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "value": "dog"
}
</code></pre></td></tr>
</tbody>
</table>


### Create string from template (fluid.transforms.stringTemplate)

**Type:** standardOutputTransformFunction.

**Description:** Simple string template system. Takes a template string (via the `template` parameter) containing tokens in the form of "%value". Returns a new string with the tokens replaced by values specified in the `terms` parameter. Keys and values can be of any data type that can be coerced into a string. Arrays will work here as well.

Currently it does not support reading any of its values from the input model. Furthermore, both `template` and `terms` are read as literal values, and hence not further interpreted by the model transformation system.

**Invertibility:** Not invertible.

**Syntax:**

```
{
    "type": "fluid.transforms.stringTemplate",
    "template": <string template>,
    "terms": <map or array of template values>
}
```

#### Examples:

** Example 1: Usage with map of terms**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.stringTemplate",
            "template": "Paused at: %atFile of %totalFiles files (%atSize of %totalSize)",
            "terms": {
                "atFile": 12,
                "totalFiles": 14,
                "atSize": "100 Kb",
                "totalSize": "12000 Gb"
            },
            "outputPath": "finalstring"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "finalstring": "Paused at: 12 of 14 files (100 Kb of 12000Gb)"
}
</code></pre></td></tr>
</tbody>
</table>

** Example 2: Usage with array of terms**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.stringTemplate",
            "template": "Paused at: %0 of %1 files (%2 of %3)",
            "terms": [ 12, 14, "100 Kb", "12000 Gb" ],
            "outputPath": "finalstring"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "finalstring": "Paused at: 12 of 14 files (100 Kb of 12000Gb)"
}
</code></pre></td></tr>
</tbody>
</table>

### Use any globally available function as transform (fluid.transforms.free)

**Type:** transformFunction

**Description:** Proxy transform to call any globally available function. The function to be called is passed via the `func` key, and the arguments passed are to the function are passed via the `args` key. If `args` is an array, each entry will be passed as individual arguments to the function. If `args` is an object, it will be passed to the function as a single argument which is the object - this is also true for any primitive datatype.

Does not support reading any of its values from the input model, and any value passed to this transform via the `func` and `args` keys are passed into the transform as literal values (i.e. further transforms will not be parsed).

**Invertibility:** Not invertible.

**Syntax:**
```{
    "type": "fluid.transforms.free",
    "func": <function name>,
    "args": <arguments to the function>
}```

#### Examples:

** Example 1: Usage with array**

For the below example, imagine that the following function is globally available:

```
fluid.myfuncs.addThree = function (a, b, c) {
    return a + b + c;
};
```

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.free",
            "func": "fluid.myfuncs.addThree",
            "args": [9, 2, 3]
            "outputPath": "result",
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "result": 14
}
</code></pre></td></tr>
</tbody>
</table>

** Example 2: Usage with object as args**

In the following example, imagine you have the following two functions globally available:

```
fluid.myfuncs.addThree = function (a, b, c) {
    return a + b + c;
};

fluid.myfuncs.addNumbers = function (options) {
    return fluid.myfuncs.addThree.apply(null, options.numbers);
};
```

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{}
</code></pre></td>
<td><pre><code>
{
    "value": {
        "transform": {
            "type": "fluid.transforms.free",
            "func": "fluid.myfuncs.addNumbers",
            "args": {numbers: [1, 2, 3]},
            "outputPath": "result"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "result": 6
}
</code></pre></td></tr>
</tbody>
</table>

### fluid.transforms.arrayToSetMembership

**Type:** standardTransformFunction

**Description:** This transform can be used when one wants to create a set based on values available in an array. This is yet another specialized and complex transformation. Based on which values are present in the input array, an output object will be produced with predefined keys and values indicating whether a specific value was present in the array.

As an example, if one has an array listing of capabilities supported by a specific system and need an object listing all possible system capabilities with a true/false value indicating whether the specific system supports it.

**Invertibility:** Partly invertible (into [`setMembershipToArray`](ModelTransformationAPI.html#fluid-transforms-arraytosetmembership))

**Syntax:**

If `presentValue` and `missingValue` are not defined they will default to: `true` and `false`, respectively.
```
transform: {
    "type": "fluid.transforms.arrayToSetMembership",
    "inputPath": <standard inputPath>,
    "presentValue": <Value for an entry in output set if expectedArrayEntryX is present in array>,
    "missingValue": <That value given to an entry if expectedArrayEntryX is present in array>,
    "options": {
        "expectedArrayEntry1": "Key of output set 1",
        (...)
        "expectedArrayEntryN": "Key of output set N",
    }
}
```

**Examples:**

**Example 1: Standard Usage**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "controls": [ "mouse", "keyboard" ]
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.arrayToSetMembership",
        "outputPath": "detections",
        "inputPath": "controls",
        "presentValue": "supported",
        "missingValue": "not supported",
        "options": {
            "mouse": "hasMouse",
            "keyboard": "hasKeyboard",
            "trackpad": "hasTrackpad",
            "headtracker": "hasHeadtracker"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "detections": {
        "hasMouse": "supported",
        "hasKeyboard": "supported",
        "hasTrackpad": "not supported",
        "hasHeadtracker": "not supported"
    }
}
</code></pre></td></tr>
</tbody>
</table>


**Example 2: Not defining presentValue and missingValue**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "controls": [ "mouse", "keyboard" ]
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.arrayToSetMembership",
        "outputPath": "detections",
        "inputPath": "controls",
        "options": {
            "mouse": "hasMouse",
            "keyboard": "hasKeyboard",
            "trackpad": "hasTrackpad",
            "headtracker": "hasHeadtracker"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "detections": {
        "hasMouse": true,
        "hasKeyboard": true,
        "hasTrackpad": false,
        "hasHeadtracker": false
    }
}
</code></pre></td></tr>
</tbody>
</table>

### fluid.transforms.setMembershipToArray

**Type:** standardTransformFunction

**Description:** This is inverse of `fluid.transforms.arrayToSetMembership`. This transformation was developed to accommodate a use case where a boolean list of system capabilities needed to be translated to an array containing only capabilities that were true.

It takes an object with a set of keys and where the value space only consist of two values (`presentValue`, `missingValue`). This is mapped to an array that only contains entries for which the input object has a `presentValue`. The actual entries output to the array are based on a map passed as `options` to the transformation.

**Invertibility:** Partly invertible (into `arrayToSetMembership`)

**Syntax:**

If `presentValue` and `missingValue` are not defined they will default to: `true` and `false`, respectively.
```
transform: {
    "type": "fluid.transforms.setMembershipToArray",
    "inputPath": <standard inputPath>,
    "outputPath": <standard outputPath>
    "presentValue": <Value indicating that an entry should be in output array>,
    "missingValue": <Value indicating that an entry should not be in output array>,
    "options": {
        "inputObjectKey1": "outputArrayValue1",
        (...)
        "inputObjectKeyN": "outputArrayValueN",
    }
}
```

**Examples:**

**Example 1: Standard Usage**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "detections": {
        "hasMouse": "supported",
        "hasKeyboard": "supported",
        "hasTrackpad": "not supported",
        "hasHeadtracker": "not supported"
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.setMembershipToArray",
        "inputPath": "detections",
        "outputPath": "controls",
        "presentValue": "supported",
        "missingValue": "not supported",
        "options": {
            "hasMouse": "mouse",
            "hasKeyboard": "keyboard",
            "hasTrackpad": "trackpad",
            "hasHeadtracker": "headtracker"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "controls": [ "mouse", "keyboard" ]
}
</code></pre></td></tr>
</tbody>
</table>


**Example 2: Not defining presentValue and missingValue**

<table><thead>
</thead><tbody>
<tr><th>source</th><th>rule</th><th>Output</th></tr>
<tr><td><pre><code>
{
    "detections": {
        "hasMouse": true,
        "hasKeyboard": true,
        "hasTrackpad": false,
        "hasHeadtracker": false
    }
}
</code></pre></td>
<td><pre><code>
{
    "transform": {
        "type": "fluid.transforms.setMembershipToArray",
        "inputPath": "detections",
        "outputPath": "controls",
        "options": {
            "hasMouse": "mouse",
            "hasKeyboard": "keyboard",
            "hasTrackpad": "trackpad",
            "hasHeadtracker": "headtracker"
        }
    }
}
</code></pre></td><td>
<pre><code>
{
    "controls": [ "mouse", "keyboard" ]
}
</code></pre></td></tr>
</tbody>
</table>

