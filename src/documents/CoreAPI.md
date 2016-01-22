---
title: Infusion Core API
layout: default
category: Infusion
---

This file documents some low-level APIs which are provided by Infusion at the JavaScript level. Note that since
Infusion's more overarching aim is to enable declarative programming based on JSON structures, by means
of its [IoC](FrameworkConcepts.md#ioc) system, the documentation in this file doesn't cover very much
of Infusion's real function. Please consult pages on [Component Grades](ComponentGrades.md), 
[Component Configuration Options](ComponentConfigurationOptions.md), the [Infusion Event System](InfusionEventSystem.md),
etc. for coverage of these wider topics.

## Type checking

### fluid.isValue(value)

* `value {Any}`
* Returns: `{Boolean}`

Returns `true` if the supplied value is other than `null` or `undefined`.

### fluid.isPrimitive(value)

* `value {Any}`
* Returns: `{Boolean}`

Returns `true` if the supplied value is of a primitive JavaScript type (recognized: `String`, `Boolean`, `Number`, `Function`, and falsy values)

### fluid.isArrayable(totest)

* `totest {Any}`
* Returns: `{Boolean}`

Returns `true` if the supplied value can be treated as an array. The strategy used is an optimised
approach taken from an earlier version of jQuery - detecting whether the `toString()` version
of the object agrees with the textual form `[object Array]`, or else whether the object is a
jQuery object (the most common source of "fake arrays").

### fluid.isPlainObject(totest)

* `totest {Any}`
* Returns: `{Boolean}`

Returns `true` if the supplied object is a plain JSON-forming container - that is, it is either a plain Object
or a plain Array. 

### fluid.typeCode(totest)

* `totest {Any}`
* Returns: `{String}`

Returns `primitive`, `array` or `object` depending on whether the supplied object has
one of those types, by use of the `fluid.isPrimitive`, `fluid.isPlainObject` and `fluid.isArrayable` utilities

### fluid.isDOMNode(totest)

* `totest {Any}`
* Returns: `{Boolean}`

Returns `true` if the supplied object is a DOM node.

### fluid.isDOMish(totest)

* `totest {Any}`
* Returns: `{Boolean}`

Returns `true` if the supplied object is a DOM node or a jQuery object.

### fluid.isUncopyable(totest)

* `totest {Any}`
* Returns: `{Boolean}`

Returns `true` if it would be unwise to copy the supplied object. The framework will not attempt to copy any material which
fails this test. An object which passes `fluid.isPrimitive`, `fluid.isDOMish` or fails `fluid.isPlainObject` will pass this test.

### fluid.isComponent(totest)

* `totest {Any}`
* Returns: `{Boolean}`

Returns `true` if the supplied object is an Infusion component.

### fluid.isDestroyed(component)

* `component {Component}`
* Returns: `{Boolean}`

Returns `true` if the supplied Infusion component has been [destroyed](ComponentLifecycle.md).

### fluid.hasGrade(options, gradeName)

* `options {Object}`
* `gradeName {String}`
* Returns: `{Boolean}`

Returns `true` if the supplied options ([defaults](#fluid-defaults-gradename-options-)) are the top-level options of a component which has the supplied grade. These must be options which
have already been through options merging, since the test is a simpleminded one that simply checks whether the `gradeNames` entry in the options contains the supplied `gradeName`.

### fluid.componentHasGrade(component, gradeName)

* `component {Component}`
* `gradeName {String}`
* Returns: `{Boolean}`

Returns `true` if the supplied component has the supplied `gradeName` as a parent grade. This is a rapid check which uses the framework's internal data structures for the lookup.


## Basic implementation atoms

### fluid.identity(arg)

* `arg {Any}`
* Returns: `{Any}`

### fluid.notImplemented()

A function which raises a failure if executed. This function name can also be used as a placeholder in [Invokers](Invokers.md) and
namespaced [Listener](InfusionEventSystem.md) to create abstract (noninstantiable) [Component Grades](ComponentGrades.md).

### fluid.each(source, func)

* `source {Array|Object}` A container to be iterated over (may be null)
* `func {Function} (element {Any}, index {Number|String}) → Any`. This function will be invoked once on each member of `source` and will receive the member and its key (either an integer for an array source,
or a string for an object source) 
* Returns: none

Iterates over a supplied array or hash, invoking a function once for each member. Similar to [`jQuery.each`](http://api.jquery.com/jquery.each/) only the
arguments to `func` are the right way round and the function does not explode on nonvalues. `fluid.each` on `null` or `undefined` is a no-op.

### fluid.invokeLater(func) 

* `func {Function}` A function accepting zero arguments which is to be invoked later
* Returns: none

A standard utility to schedule the invocation of a function after the current function call stack returns. On browsers this defaults to `setTimeout(func, 1)` but in
other environments can be customised - e.g. to `process.nextTick` in node.js. In future, this could be optimised in the browser to not dispatch into the event queue.

### fluid.allocateGuid()

* Returns: `{String}` A string of about a dozen characters that has made moderate efforts to be globally unique.

Allocate a string value that will be unique within this Infusion instance (frame or process), and
globally unique with high probability (50% chance of collision after a million trials). This has the structure `prefix-id` where
`prefix` is the value of `fluid.fluidInstance` identifying this Infusion instance, and `id` is a increasing integer initialised at
1 when this infusion instance starts up.


## Creation, copying and destroying

### fluid.freshContainer(tocopy)

* `tocopy {Object|Array}`
* Returns: `{Object|Array}`

Return an empty container as the same type as the argument (either an array or hash). To be wise, the supplied argument should 
pass the `fluid.isPlainObject` test.

### fluid.copy(tocopy)

* `tocopy {Any}`
* Returns: `{Any}`

Performs a deep copy (clone) of its argument. This will guard against cloning a circular object by terminating if it reaches a path depth
greater than [`fluid.strategyRecursionBailout`](#fluid-strategyrecursionbailout). `fluid.copy` will not copy an object which passes `fluid.isUncopyable`.

### fluid.makeArray(arg)

* `arg {Any}`
* Returns: `{Array}`

Converts the supplied argument to an array (or copies it if it is already an array), by a variety of strategies:

* If it is even slightly arrayable (has a numeric `length` property), its elements will be copied into a fresh array
* If it is not slightly arrayable, it will be placed into a 1-element array
* If it is undefined, a 0-element array will be returned

### fluid.generate(n, generator[, applyFunc])

* `n {Integer}` The size of the array to be filled
* `generator {Object|Function}` Either a value to be replicated or function to be called (if the `applyFunc` argument holds `true`). In case of a function, the signature is `(i {Integer}) → Any`, accepting the index position and returning the generated element.
* `applyFunc {Boolean}` If `true`, the `generator` value is to be treated as a function
* Returns: `{Array}` An array of length `n` holding the generated elements

Fills an array of given size with copies of a value or result of a function invocation

### fluid.iota(n[, first])

* `n {Integer}` Size of the filled array to be returned
* `first {Number}` [optional, defaults to 0] First element to appear in the array
* Returns: `{Array}` An array of length `n` holding the generated elements

Returns an array of size `n`, filled with increasing integers, starting at 0 or at the value specified by `first`. The name `iota` originally stems from the 
[APL](http://stackoverflow.com/questions/9244879/what-does-iota-of-stdiota-stand-for) programming language.


### fluid.clear(target)

* `target {Object|Array}` The target to be cleared
* Returns: `{Undefined}`

Clears an object or array of its contents. For objects, each property is deleted. *** The input argument will be destructively modified ***


## Transforming and filtering

### fluid.transform(source, [fn1, fn2, ...])

* `source {Array|Object}` The initial container of objects to be transformed. If the source is neither an array nor an object, it will be returned untransformed
* `fn_i {Function} (element {Any}, index {Number|String})→Any` (arbitrary number accepted) An arbitrary number of optional further arguments,
all of type `Function`, accepting the signature `(element, index)`, where `element` is the
list member to be transformed, and `index` is its index. Each function will be
applied in turn to each member, which will be replaced by the return value from the function.
* Returns: `{Array|Object}` The finally transformed structure, where each member has been replaced by the original member acted on by the function or functions.

Return a list or hash of objects, transformed by one or more functions. Similar to
[`jQuery.map`](http://api.jquery.com/jquery.map/), but accepts an arbitrary list of transformation functions and does not explode on null sources. 
`fluid.transform` on a non-array and non-object (e.g. `null`) is a no-op.

### fluid.accumulate(list, fn, initial)

* `list {Array}` The list of objects to be accumulated over.
* `fn {Function: (object {Any}, total {Any-Total}, index {Integer}) → Any-Total}` An "accumulation function" accepting the signature `(object, total, index)` where
`object` is the list member, `total` is the "running total" object (which is the return value from the previous invocation of `fn` or else `initial`)
, and index is the index number.
* `arg {Any-Total}` The initial value for the "running total" object.
* Returns: `{Any-Total}` The final running total object as returned from the final invocation of the function on the last list member.

Scan through a list of objects, "accumulating" a value over them
(may be a straightforward "sum" or some other chained computation). "accumulate" is the name derived
from the C++ STL, other names for this algorithm are "reduce" or "[fold](https://en.wikipedia.org/wiki/Fold_%28higher-order_function%29)".

### fluid.remove_if(source, fn[, target])

* `source {Array|Object}` The array or hash of objects to be scanned over. This structure *** will be modified in place ***. Note that in the case this is an array,
iteration will run from the end of the array towards the front, so that the index of elements yet to be removed will remain stable.
* `fn {Function: (object {Any}, index {Number|String}) → Booleanish }` A predicate function determining whether an element should be
removed. This accepts the standard signature `(object, index)`. If the predicate returns a "truthy" value, the corresponding object
will be removed from the source structure.
* `target {Array|Object}` [optional] A target object of the same type as `source`, which will
receive any objects removed from it.
* Returns: `{Array|Object}` Either `target`, containing the removed elements, if it was supplied, or else `source`
modified by the operation of removing the matched elements.

Scan through a list or hash of objects, removing those which match a predicate. The source structure *** will be modified in place ***.

### fluid.getMembers(holder, path)

* `holder {Array|Object}` The container to be filtered
* `path {String|Array of String}` An [EL path](FrameworkConcepts.md#el-paths) to be fetched from each top-level member
* Returns: `{Array|Object}` A container of the same type as `holder`, with the members of `holder` deferenced by `path`.

Extracts a particular member from each top-level member of a container, returning a new container of the same type. Example:

```javascript
var cattes = [{
    name: "Huggoe"
    }, {
    name: "Arthur"
    }, {
    name: "THER CATTE"
    }
];
var names = fluid.getMembers(cattes, "name");
// names now holds ["Huggoe", "Arthur", "THER CATTE"]; 
```


### fluid.filterKeys(toFilter, keys[, exclude])

* `toFilter {Array|Object}` The object to be filtered - this will be NOT modified by the operation
* `keys {Array of String}` The list of keys to operate with
* `exclude {Boolean}` [optional] If `true`, the keys listed are removed rather than included
* Returns: `{Array|Object}` the filtered object

Accepts an object to be filtered, and a list of keys. Either all keys not present in
the list are removed (the default), or all keys present in the list are removed (`exclude: true`). The suppled object *** is not modified *** but will be shallow cloned by this operation.
 
### fluid.censorKeys(toCensor, keys)

* `toFilter {Array|Object}` The object to be filtered - this will be NOT modified by the operation
* `keys {Array of String}` The list of keys to operate with
* Returns: `{Array|Object}` A shallow clone of `toFilter` with the supplied keys removed

A convenience wrapper for `fluid.filterKeys` with the argument `exclude` set to `true`. Returns a shallow clone of the supplied object with listed keys removed.


### fluid.keys(object)

* `object {Object}` The object to have its keys listed
* Returns: `{Array}` An array holding the keys of this object.

Return the keys in the supplied object as an array. Note that this will return keys found in the prototype chain as well as "own properties", unlike the builtin [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

### fluid.values(object)

* `object {Object}` The object to have its values listed
* Returns: `{Array}` An array holding the values of this object.

Return the keys in the supplied object as an array. This will return values found in the prototype chain as well as those attached to "own properties".


### fluid.arrayToHash(array)

* `array {Array of String}` The array to be converted to a hash
* Returns: `{Object}` An object with value `true` for each key taken from a member of `array`
    
Converts an array into an object whose keys are the elements of the array, each with the value `true`

### fluid.hashToArray(hash, keyName[, func])

* `hash {Array}` The hash to be transformed into an array
* `keyName {String}` The name within the resulting array elements which will receive the string which used to form the element's key in `hash`
* `func {Function (newElement {Object), oldElement {Object}, key {String}) →  Object }` [optional] receives `(newElement, oldElement, key)` where `newElement` is the freshly cloned element (a fresh `Object obj` which just has `obj[keyName] = key`), 
`oldElement` is the original hash's element, and `key` is the key of the element in the hash. The function returns the final element that will be added to the array - it may ignore `newElement` if it pleases and make an unrelated
return. If the function makes no return, `newElement` will be used. If the function is not supplied, the old element is simply deep-cloned onto the new element (same effect as transform `fluid.transforms.objectToArray`).

Converts a hash into an array by hoisting out the object's keys into an array element via the supplied String `key`, and then transforming the elements via an optional further function `func`. Note that without some further
means of sorting the resulting array elements, the order of elements in the array will [not be defined](https://es5.github.io/#x12.6.4). Example:

```javascript
var hash = {
    "Proailurus":     25000000,
    "Pseudaelurus":   18500000,
    "Felis attica":   12000000,
    "Felis lunensis":  2500000,
    "CATT":              50000   
};
var CATTyears = fluid.hashToArray(hash, "species", function (newElement, oldElement) {
    newElement.yearsAgo = oldElement;
});
// CATTyears now contains [ {
    species: "Proailurus",
    yearsAgo: 25000000
}, { // etc.

```

### fluid.flatten(array)

* `array {Array}` The array to be flattened
* Returns: `{Array}` The flattened array.

Converts an array consisting of a mixture of arrays and non-arrays into the concatenation of any inner arrays 
with the non-array elements. The original array *** will not be modified ***. See description of [mapcat](http://martinfowler.com/articles/collection-pipeline/flat-map.html) or `flat-map`.


## Sorting and searching

### fluid.find(source, func[, deflt])

* `source {Arrayable|Object}` The list or hash of objects to be searched.
* `func {Function: (element {Any}, index {Number|String}) → Any}` A predicate function, acting on a member. A predicate which
returns any value which is not `undefined` will terminate the search.
* `deflt {Object|Undefined}` [optional] A value to be returned in the case the predicate is not satisfied on any element
a member. The default will be the natural value of `undefined`
* Returns: The first return value from the predicate function which is not `undefined`

Scan through a list or hash of objects, terminating on the first member which
satisfies a predicate function. The return is the return value from the predicate.

### fluid.find_if(source, func[, deflt])

* `source {Arrayable|Object}` The list or hash of objects to be searched.
* `func {Function: (element {Any}, index {Number}) → Boolean}` A predicate function, acting on a member. A predicate which
returns any value which is not `false` will terminate the search.
* `deflt {Object}` [optional] A value to be returned in the case no predicate function matches a
member. The default will be the natural value of `undefined`
* Returns: The first element for which the value of the predicate function is not `false`

Scan through a list or hash of objects, terminating on the first member which
matches a predicate function. The return value is the first element itself for which the predicate returns other than `false`.

### fluid.contains(tosearch, value)

* `tosearch {Object|Array}` The structure to be searched for the supplied value,
* `value {Any}` The value to be searched for
* Returns: `{Boolean|Undefined}` Returns `true` if the value was found in the container

Searches through the supplied structure, and returns `true` if the supplied value can be found, using `===` equality

### fluid.keyForValue(tosearch, value) {

* `tosearch {Object|Array}` The structure to be searched for the supplied value
* `value {Any}` The value to be found. This will be compared against the structure's members using `===` equality.
* Returns: `{String|Integer|Undefined}` The first key (an `Integer` if `tosearch` is an `Array`) whose value matches the one supplied, or `undefined` if no value matches

Searches through the supplied object for the first value which matches the one supplied.

### fluid.stableSort(array, func) 

* `array {Array of Any-Element}` The array to be sorted. *** This input array will be modified in place. ***
* `func {Function: (a {Any-Element}, b {Any-Element}) → Number}` A comparator returning >0, 0, or <0 on pairs of elements representing their sort order (same contract as [Array.sort comparator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort))

Applies a stable sorting algorithm to the supplied array and comparator (note that [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) in JavaScript is not specified
to be stable). The algorithm used will be an insertion sort, which whilst quadratic in time, will perform well
on small array sizes.

### fluid.compareStringLength(ascending)

* `ascending {Booleanish}` `true` if a comparator is to be returned which sorts strings in ascending order of length
* Returns: `{Function: (a {String}, b {String}) → Number}` The comparator function to be used for sorting

Produces a comparator function suitable for use with [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) or [fluid.stableSort](#fluid-stablesort-array-func-) to sort an array of strings by length


## Parsing and rendering

### fluid.parseInteger(string)

* `string {String}` A string to be converted to an integer
* Returns: `{Integer|NaN}` The integer value, or `NaN` if the string does not represent an integer 

Returns the converted integer if the input string can be converted to an integer. Otherwise, returns `NaN`.

### fluid.stringTemplate(template, terms)

* `template {String}` A string with embedded tokens of the form `%value`
* `terms {Object: String → Stringable}` A hash which maps tokens to their required interpolated values   

A simple string interpolation system. Accepts a template string with embedded tokens of the form `%value`. Returns a new string with the tokens replaced by the specified values.
Keys and values can be of any data type that can be coerced into a string. Tokens are not delimited in the template with any syntax - the implementation will replace the longest token which
can be sourced from `terms`.


## Handling models and paths

### fluid.get(model, path)

* `model {Any}` The model object to be indirected into. This may be `undefined`, etc. without triggering an error.
* `path {String|Array of String}` Either a period-separated [EL path](FrameworkConcepts.md#el-paths) representing a chain of properties to be navigated, or else an array of
path segments representing this
* Returns: `{Any}` The result of the indirection of the path into the supplied model

Accesses an element nested within a [model object](FrameworkConcepts.md#model-object) at the supplied (EL) path. `fluid.get` can
operate various special behaviour in encountering particular kinds of material - for example, any object with a function member named `resolvePathSegment` will
hand resolution of the next path segment to that function if there is no corresponding concrete member. If `fluid.get` navigates off the end of the available
model material, this will not trigger an error - all successive indirections will simply return `undefined`. `fluid.get` accepts various esoteric piece of configuration
allowing it to operate indirection rules encoded in arbitrary JSON material - these are imperfectly supported, contact us if you are interested.

### fluid.getImmediate(model, path) 

* `model {Any}` The model object to be indirected into. This may be `undefined`, etc. without triggering an error.
* `path {Array of String}` An array of path segments representing representing a chain of properties to be navigated
* Returns: `{Any}` The result of the indirection of the path into the supplied model

An extremely simplistic, high-performance variant of `fluid.get` that supports none of the same bells and whistles - it is only capable of navigating over concrete
object properties that are actually present in the model, and the path must have already been parsed out into an array of segments. 
It still, however, operates the same semantic as `fluid.get` for navigating over undefined values.

### fluid.set(model, path, newValue)

Writes a new value into a model at a specified path. This is performed by directly modifying the penultimately referenced model object (the one referenced by the first `n-1` 
path segments in `path`) by writing the value `newValue` to its property named after the final path segment. Other approaches to this task are possible 
(see [New New Notes on the ChangeApplier](https://wiki.fluidproject.org/display/fluid/New+New+Notes+on+the+ChangeApplier#NewNewNotesontheChangeApplier-Theseveralwaysofactuallyapplyingachange)) but the
fundamental invariant to be respected is that 

```
    fluid.get(model, fluid.set(model, path, value), path) === value
```
Even a functional programmer could admit that. A slight wrinkle, however, is the behaviour of the special path `""` or `[]`, attempting to write a value at the model 
root. This API is not capable of this and will fail in this case - since it is hampered at the language level by being unable to rewrite the object reference `model` which exists
in the scope of its caller. The `ADD` message of the [ChangeApplier](ChangeApplierAPI.md#programmatic-style-for-triggering-a-change) can be used to handle this case. Under its new semantics, the reference `model` is at a known
address in its parent component which can be rebound.

If the path `path` indirects beyond the range of concrete properties in `model`, the implementation will fill in any intermediate path levels with fresh instances of `{}` 
(in the manner of [`mkdirs`](http://stackoverflow.com/questions/9820088/difference-between-mkdir-and-mkdirs-in-java-for-java-io-file)). There are some esoteric extra arguments
for `fluid.set` which will allow this to be done in a schema-aware way, for example filling in path levels with `[]` instead - [contact us](https://wiki.fluidproject.org/display/fluid/Mailing+Lists)
if you are interested.

* `model {Object}` The model object to be indirected into. This must be an `Object`. 
* `path {String|Array of String}` Either a period-separated [EL path](FrameworkConcepts.md#el-paths) representing a chain of properties to be navigated, or else an array of
path segments representing this
* `newValue: {Any}` The value to be written into `model` at the path `path`

### fluid.model.parseEL(EL)

* `EL {String}` The EL path to be parsed
* Returns: `{Array of String}` The EL path parsed as an array of path segments

Parses a EL path expression by splitting it on the character `.`. This is a fast, low-quality implementation which assumes that no
escaping of `.` characters is necessary.

### fluid.model.composeSegments([seg1, seg2, ...])

* `seg1 ... segn {String}` The path segments to be composed
* Returns: `{String}` The EL path composed by concatenating the path segments.

Compose any number of path segments, none of which may be empty. The inverse to `fluid.model.parseEL` - this is a fast, low-quality implementation which does no escaping.

### fluid.pathUtil.parseEL(EL)

* `EL {String}` The EL path to be parsed
* Returns: `{Array of String}` The EL path parsed as an array of path segments

Parses a EL path expression by splitting it on the period character "`.`". This is an analog of `fluid.model.parseEL` that will escape the characters `.` as `\.` and `\` as `\\`, allowing
all possible paths to be expressed. In modern JavaScript VMs, it is not much slower than `fluid.model.parseEL` and should be used in all applications where paths will be 
accepted from external users. 

### fluid.pathUtil.composeSegments([seg1, seg2, ...])

* `seg1 ... segn {String}` The path segments to be composed
* Returns: `{String}` The EL path composed by concatenating the path segments.

Compose any number of path segments, none of which may be empty. This is an analog of `fluid.pathUtil.parseEL` that will escape the characters `.` as `\.` and `\` as `\\`, allowing
all possible paths to be expressed. In modern JavaScript VMs, it is not much slower than `fluid.pathUtil.composeSegments` and should be used in all applications where paths will be 
accepted from external users. 



## Logging and error handling

### fluid.log([logLevel, arg1, ... argn])

* `logLevel {LogLevel}` [optional] One of the members of the `fluid.logLevel` structure or in general some `fluid.marker` with a numeric value holding a priority
* `arg1 ... argn {Stringable}` A sequence of arguments to be logged. By default these will be handed unchanged to the multiple arguments of `console.log`. It is wise to convert these
to `String` yourself (e.g. by `JSON.stringify`) if i) this is safe, and ii) you would not be satisfied by the environment's rendering.

Log a message to a suitable environmental console (in current implementations, `console.log`). If the first argument to `fluid.log` is
one of the members of the [`fluid.logLevel`](#fluid-loglevel) structure, this will be taken as the priority of the logged message - else it 
will default to [`fluid.logLevel.INFO`](#fluid-loglevel). If the logged message priority does not exceed that set by the most recent call to the [`fluid.setLogging`](#fluid-setlogging-loglevel-) function,
the logging action will be suppressed.

### fluid.logLevel

A hash of strings to `LogLevel` constants, suitable for sending as the special, optional, first argument to `fluid.log`. These communicate a logging priority, with lower numbers
of higher priority than higher numbers. The system maintains a current "logging level" as an internal piece of state, updated by `fluid.setLogging` and `fluid.popLogging` - any
`fluid.log` statements whose supplied priority does not exceed the logging level will be inactive.

| LogLevel | Priority |Description |
|--|-:|--|
| `fluid.logLevel.FATAL`| 0 | the very highest logging level, indicating that the process must now exit immediately due to a fatal error|
| `fluid.logLevel.FAIL`| 5 | a very high logging priority, corresponding to an assertion failure, similar to that of `fluid.fail` - the system will terminate shortly if not immediately|
| `fluid.logLevel.WARN`| 10 | a moderate logging priority, corresponding to a problem which most users would wish to be notified of, but is not sufficient to halt the system|
| `fluid.logLevel.IMPORTANT` |12 | a moderate logging priority, corresponding to standard debugging messages. This is the level set by `fluid.setLogging(false)`|
| `fluid.logLevel.INFO`| 15 | a low logging level, corresponding to verbose debugging messages. This is the level set by `fluid.setLogging(true)`.|
| `fluid.logLevel.TRACE`| 20 | a very low logging level, which if enabled would produce extremely voluminous output which would significantly slow execution and consume a lot of storage. This should only be enabled for short periods of time, perhaps conditional on some triggers surrounding an event of interest.|

### fluid.setLogging(logLevel)

* `logLevel {Boolean|LogLevel}` The system logging level to be made current and to be pushed onto the top of the system's stack of logging levels.

Push a value onto the stack of the system's current logging levels. This will become the system's current logging level until there is a corresponding call to `fluid.popLogging`. The argument may either be a boolean,
in which case one of the standard logging levels (`true: fluid.logLevel.INFO` / `false: fluid.logLevel.IMPORTANT`) will be selected, or else one of the members of the `fluid.logLevel` structure or a `LogLevel` marker
in general. The stack is initialised with a single element of `fluid.logLevel.IMPORTANT`.

### fluid.popLogging()

Pops one `LogLevel` value that was pushed onto the logging level stack by a previous call to `fluid.setLogging`. This will expose the previous element on top of the stack and restore the logging level that had previously been in effect.
If the stack has only its one original element, this call is a no-op. 

### fluid.passLogLevel(testLogLevel)

* `testLogLevel {LogLevel}` The log level against which the system's current logging level is to be checked.
* Returns: `{Boolean}` - `true` if a message supplied at that log priority would be logged at the current logging level.

Accepts one of the members of the `fluid.logLevel` structure or a `LogLevel` object in general. Returns `true` if
a message supplied at that log priority would be logged at the current logging level. Clients who
issue particularly expensive log payload arguments are recommended to guard their logging statements with this

### fluid.doLog([arg1, ... argn])

The actual implementation to which `fluid.log` messages and other logging generated by the system are dispatched. Implemented to forward to `console.debug` and `console.log` but may be monkey-patched by 
clients who require an alternative implementation.

### fluid.fail([arg1, ... argn])

The framework and clients can call this method in order to signal a hard assertion failure. The current contract of `fluid.fail` is that an implementation/log error has been discovered - the
typical behaviour of the system is to halt or at the very least propagate an unhandled exception to the top process level which is likely to make the system's behaviour unstable. If this failure
resulted from bad user or external input, do not call this function but instead signal it in a milder, more implementation-specific way - for example by sending an HTTP status code or showing
a user message. As Infusion evolves to handle a more finely graded variety of dynamic authoring scenarios, this function will be broken up into variants which can signal failures of different severities.

The current system behaviour is to throw a particular subclass of the standard `Error` type, of type `fluid.FluidError`. The behaviour of `fluid.fail` can be customised by contributing handlers to
the standard event `fluid.failureEvent`

### fluid.failureEvent

* `log` - the namespace for the listener which logs the failure to a suitable environment. By default this fires to `fluid.logFailure` which forwards to `fluid.log` before also logging the state of the IoC system by
using `fluid.logActivity`
* `fail` - the namespace for the listener which enacts any failure behaviour. By default this calls `fluid.fail` but in a testing environment, for example, will react by failing any current test, or
in an HTTP server by aborting the handling of any current request with a suitable HTTP status code and message.

Every call to `fluid.fail` triggers a firing of this global event. This is a standard [Infusion Event](InfusionEventSystem.md) with several handlers installed on startup to take on various functions.
Extra handlers are registered, and the builtin handlers overriden, to customise error handling behaviour in various contexts - for example, when Infusion is running in node.js, is running a 
[jqUnit test](jqUnit.md) or is running in [Kettle](https://github.com/fluid-project/kettle) etc.
There are two currently standard namespaces for listeners to this event:

### fluid.strategyRecursionBailout

A positive integer (default value 50) above which depth the framework's processing of configuration will bail out, assuming that it has become circularly linked. This can be customised by the user
(although this is an unlikely requirement), and is read by algorithms such as [`fluid.copy`](#fluid-isdestroyed-component-) and during [options expansion](ExpansionOfComponentOptions.md).


## The global namespace

Infusion is unusual amongst modern JavaScript systems in that it maintains a single, global namespace of fully qualified implementation names. 
For example, builtin Infusion grades are stored in this namespace at paths `fluid.*` and each
project will in general allocate its own top-level name. Users are assisted to operate on this global namespace with some utility functions. Any user of Infusion who has successfully resolved the
`fluid` object can access the root object for this namespace as `fluid.global`. In the browser, the root of this namespace coincides directly
with the real global namespace, which conventionally is addressed as `window`. In a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) this object
is conventionally known as `self`. In environments like node.js where a global namespace is discouraged (but not, thankfully, actively prohibited) the global object is not directly accessible and users
will need to use these utilities or the helping reference `fluid.global`. See [`fluid.setGlobalValue`](#fluid-setglobalvalue-path-value-) for some guidelines on the use of global names.

### fluid.registerNamespace(path)

* `path {String|Array of String}` The global path at which the namespace is to be allocated
* Returns: `{Any}` Any current value held at the supplied path - or a freshly allocated `{}` to be held at that path if it was previously empty

Ensures that the supplied path has an object allocated in the global namespace, and retrieves the current value. If no value is stored, a fresh `{}` will be assigned at the path, and to all
currently empty paths leading to the global namespace root. Calls to `fluid.registerNamespace` are very common at the start of Infusion-aware `.js` files - they are analogous to `require` statements,
only they do not cause any code to be loaded by themselves - but they can grant access to implementations which have been loaded by others, or else provide an intermediate node at which to export
implementations to others.

### fluid.getGlobalValue(path)

* `path {String|Array of String}` The global path from which the value is to be fetched
* Returns: `{Any}` The value that was stored at the path, or `undefined` if there is none. 

Returns any value held at a particular global path. This may be an object or a function, depending on what has been stored there. 

### fluid.setGlobalValue(path, value)

* `path {String|Array of String}` The global path at which the value is to be set. 
* `value {Any}` The value to be written to the global path. This should in general be a function or other immutable value, and an existing value should not be overwritten. This rule can be overlooked in a genuine architectural emergency.

Write a value to a particular global path. Users are strongly discouraged from storing any mutable information at these paths, but it is accepted that in certain integration scenarios there can be little alternative. 
Please choose a properly qualified global path name that identifies your project (perhaps, derived from a [domain name](https://en.wikipedia.org/wiki/Domain_name) or [npm package name](https://docs.npmjs.com/misc/faq#why-no-namespaces))
that you have control over. The [Java package naming conventions](https://en.wikipedia.org/wiki/Java_package#Package_naming_conventions) have proved effective at heading off such problems in the past and 
we intend that Infusion global names should be handled in an analogous way. 

### fluid.invokeGlobalFunction(functionPath, args)

* `functionPath {String|Array of String}` The global path holding the function which is to be invoked
* `args {Array|Any}` The array of arguments to be supplied to the function. If `args` is not an array, `fluid.makeArray` will be called on it first. 
* Returns: {Any} Any return value from the function which was invoked

Invokes a function held at a particular global path with the supplied arguments. Equivalent to `fluid.getGlobalValue` followed by `Function.apply(null, args)`.

### fluid.invokeGradedFunction(name, spec)

* `name {String}` A global name which can be resolved to a `Function`. The defaults for this name must
resolve onto a grade derived from [`fluid.function`](FunctionGrades.md). The defaults record should also contain an entry
`argumentMap`, a hash of argument names onto indexes.
* `spec {Object}` A hash where the keys are keys of the functions `argumentMap`, and the values are the argument values to be sent to the function. The keys will be looked
up in the `argumentMap` and the values resolved into a flat list of arguments.
* Returns: `{Any}` The return value from the function

Invoke a global function by name and named arguments. A courtesy to allow declaratively encoded function calls
to use named arguments, with names encoded in the defaults for a [`fluid.function`](FunctionGrades.md), rather than bare arrays.

## Storing and retrieving defaults

Infusion's component system is organised around blocks of JSON which define [grades](ComponentGrades.md) - another way of describing a grade is as a component's *** default options ***, which 
appeals to a slightly more old-fashioned notion of what a component is. These options are registered into the system and read back from it by using the API `fluid.defaults`. If the options supplied to `fluid.defaults`
represent a [component grade](ComponentOptionsAndDefaults.md), the framework will automatically construct and register a **component creator function** in the [global namespace](#the-global-namespace) at a path
which matches the component's grade name. Note that not all defaults correspond to a component - some of them are descended from `fluid.function` in which case they represent a ***function grade*** and hold metadata
about it. Some defaults are not descended from a framework grade at all, and are designed to be used as mixins to other grades.

### fluid.defaults(gradeName[, options])

* `gradeName {String}` The fully-qualified name of the grade whose defaults are to be read or written.
* `options {Object}` [optional] The defaults which are to be registered for the grade. If this argument is omitted, the existing defaults are read and returned.
* Returns: {Object}  If the function was called with 1 argument, any defaults already registered for the component. These read defaults will already have gone through [options merging](OptionsMerging.md) and have the contents
of any parent grades resolved in them. If you want to read exactly the raw defaults information that was registered for this grade, instead use [`fluid.rawDefaults`](#fluid-rawdefaults-gradename-options-)

### fluid.rawDefaults(gradeName[, options])

* `gradeName {String}` The fully-qualified name of the grade whose defaults are to be read or written.
* `options {Object}` [optional] The defaults which are to be registered for the grade. If this argument is omitted, the existing defaults are read and returned.
* Returns: {Object} The raw defaults registered for this grade, without being resolved against parent grades by [options merging](OptionsMerging.md).
