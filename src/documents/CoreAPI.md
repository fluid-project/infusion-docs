---
title: Core API
layout: default
category: Infusion
---

# Infusion Core API

This file documents some low-level APIs which are provided by Infusion at the JavaScript level. Note that since
Infusion's more overarching aim is to enable declarative programming based on JSON structures, by means
of its [IoC](FrameworkConcepts.md#ioc) system, the documentation in this file doesn't cover very much
of Infusion's real function. Please consult pages on [Component Grades](#ComponentGrades.md), 
[Component Configuration Options](#ComponentConfigurationOptions.md), the [Infusion Event System](#InfusionEventSystem.md)
, etc. for coverage of these wider topics.

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

### fluid.isDestroyed(totest)

* `totest {Component}`
* Returns: `{Boolean}`

Returns `true` if the supplied Infusion component has been destroyed.



## Functional programming utilities

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
* Returns: `undefined`

Iterates over a supplied array or hash, invoking a function once for each element. Similar to [`jQuery.each`](http://api.jquery.com/jquery.each/) only the
arguments to `func` are the right way round and the function does not explode on nonvalues. `fluid.each` on `null` or `undefined` is a no-op.


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
greater than `fluid.strategyRecursionBailout`. `fluid.copy` will not copy an object which passes `fluid.isUncopyable`.

### fluid.makeArray(arg)

* `arg {Any}`
* Returns: `{Array}`

Converts the supplied argument to an array (or copies it if it is already an array), by a variety of strategies:

* If it is even slightly arrayable (has a numeric `length` property), its elements will be copied into a fresh array
* If it is not slightly arrayable, it will be placed into a 1-element array
* If it is undefined, a 0-element array will be returned

### fluid.generate(n, generator[, applyFunc])

Fills an array of given size with copies of a value or result of a function invocation
* `n {Integer}` The size of the array to be filled
* `generator {Object|Function}` Either a value to be replicated or function to be called. In case of a function, the signature is `(i {Integer}) → Any`, accepting the index position and returning the generated element.
* `applyFunc {Boolean}` If `true`, the `generator` value is to be treated as a function
* Returns: `{Array}` An array of length `n` holding the generated elements

### fluid.iota(n[, first])

Returns an array of size `n`, filled with increasing integers, starting at 0 or at the value specified by `first`. The name `iota` originally stems from the 
[APL](http://stackoverflow.com/questions/9244879/what-does-iota-of-stdiota-stand-for) programming language.

* `n {Integer}` Size of the filled array to be returned
* `first {Number}` [optional, defaults to 0] First element to appear in the array
* Returns: `{Array}` An array of length `n` holding the generated elements

### fluid.clear(target)

Clears an object or array of its contents. For objects, each property is deleted. *** The input argument will be destructively modified ***

* `target {Object|Array}` The target to be cleared
* Returns: `{Undefined}`


## Transforming and filtering

### fluid.transform(source, [fn1, fn2, ...])

Return a list or hash of objects, transformed by one or more functions. Similar to
[`jQuery.map`](http://api.jquery.com/jquery.map/), but accepts an arbitrary list of transformation functions and does not explode on null sources. 
`fluid.transform` on a non-array and non-object (e.g. `null`) is a no-op.

* `source {Array|Object}` The initial container of objects to be transformed. If the source is neither an array nor an object, it will be returned untransformed
* `fn_i {Function} (element {Any}, index {Number|String})→Any` (arbitrary number accepted) An arbitrary number of optional further arguments,
all of type `Function`, accepting the signature `(element, index)`, where `element` is the
list member to be transformed, and `index` is its index. Each function will be
applied in turn to each member, which will be replaced by the return value from the function.
* Returns: `{Array|Object}` The finally transformed structure, where each member has been replaced by the original member acted on by the function or functions.

### fluid.accumulate(list, fn, initial)

Scan through a list of objects, "accumulating" a value over them
(may be a straightforward "sum" or some other chained computation). "accumulate" is the name derived
from the C++ STL, other names for this algorithm are "reduce" or "[fold](https://en.wikipedia.org/wiki/Fold_%28higher-order_function%29)".

* `list {Array}` The list of objects to be accumulated over.
* `fn {Function: (object {Any}, total {Any-Total}, index {Integer}) → Any-Total}` An "accumulation function" accepting the signature `(object, total, index)` where
`object` is the list member, `total` is the "running total" object (which is the return value from the previous invocation of `fn` or else `initial`)
, and index is the index number.
* `arg {Any-Total}` The initial value for the "running total" object.
* Returns: `{Any-Total}` The final running total object as returned from the final invocation of the function on the last list member.


### fluid.remove_if(source, fn[, target])

Scan through a list or hash of objects, removing those which match a predicate. The source structure *** will be modified in place ***.

* `source {Array|Object}` The list or hash of objects to be scanned over.
* `fn {Function: (object {Any}, index {Number|String}) → Booleanish }` A predicate function determining whether an element should be
removed. This accepts the standard signature `(object, index)`. If the predicate returns a "truthy" value, the corresponding object
will be removed from the source structure.
* `target {Array|Object}` [optional] A target object of the same type as `source`, which will
receive any objects removed from it.
* Returns: `{Array|Object}` Either `target`, containing the removed elements, if it was supplied, or else `source`
modified by the operation of removing the matched elements.


### fluid.getMembers(holder, path)

Extracts a particular member from each top-level member of a container, returning a new container of the same type.
* `holder {Array|Object}` The container to be filtered
* `path {String|Array of String}` An [EL path](FrameworkConcepts.md#el-paths) to be fetched from each top-level member
* Returns: `{Array|Object}` A container of the same type as `holder`, with the members of `holder` deferenced by `path`.


### fluid.filterKeys(toFilter, keys[, exclude])

Accepts an object to be filtered, and a list of keys. Either all keys not present in
the list are removed, or only keys present in the list are returned. The suppled object *** is not modified *** but will be shallow cloned by this operation.
 
* `toFilter {Array|Object}` The object to be filtered - this will be NOT modified by the operation
* `keys {Array of String}` The list of keys to operate with
* `exclude {Boolean}` [optional] If `true`, the keys listed are removed rather than included
* Returns: `{Array|Object}` the filtered object


### fluid.censorKeys(toCensor, keys)

A convenience wrapper for `fluid.filterKeys` with the argument `exclude` set to `true`. Returns a shallow clone of the supplied object with listed keys removed.

* `toFilter {Array|Object}` The object to be filtered - this will be NOT modified by the operation
* `keys {Array of String}` The list of keys to operate with
* Returns: `{Array|Object}` A shallow clone of `toFilter` with the supplied keys removed


### fluid.keys(object)

Return the keys in the supplied object as an array. Note that this will return keys found in the prototype chain as well as "own properties", unlike the builtin [`Object.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)

* `object {Object}` The object to have its keys listed
* Returns: `{Array}` An array holding the keys of this object.


### fluid.values(object)

Return the keys in the supplied object as an array. This will return values found in the prototype chain as well as those attached to "own properties".

* `object {Object}` The object to have its values listed
* Returns: `{Array}` An array holding the values of this object.


### fluid.arrayToHash(array) {
    
Converts an array into an object whose keys are the elements of the array, each with the value `true`
* `array {Array of String}` The array to be converted to a hash
* Returns: `{Object}` An object with value `true` for each key taken from a member of `array`


### fluid.hashToArray(hash, keyName[, func])

Converts a hash into an array by hoisting out the object's keys into an array element via the supplied String `key`, and then transforming the elements via an optional further function `func`.

* `hash {Array}` The hash to be transformed into an array
* `keyName {String}` The name within the resulting array elements which will receive the string which used to form the element's key in `hash`
* `func {Function (newElement {Object), oldElement {Object}, key {String}) →  Object }` [optional] receives `(newElement, oldElement, key)` where `newElement` is the freshly cloned element (a fresh `Object obj` which just has `obj[keyName] = key`), 
`oldElement` is the original hash's element, and `key` is the key of the element in the hash. The function returns the final element that will be added to the array - it may ignore `newElement` if it pleases and make an unrelated
return. If the function makes no return, `newElement` will be used. If the function is not supplied, the old element is simply deep-cloned onto the new element (same effect as transform `fluid.transforms.objectToArray`).


### fluid.flatten(array)

Converts an array consisting of a mixture of arrays and non-arrays into the concatenation of any inner arrays 
with the non-array elements. The original array *** will not be modified ***. See description of [mapcat](http://martinfowler.com/articles/collection-pipeline/flat-map.html) or `flat-map`.

* `array {Array}` The array to be flattened
* Returns: `{Array}` The flattened array.


## Sorting and searching

### fluid.find(source, func[, deflt])

Scan through a list or hash of objects, terminating on the first member which
matches a predicate function. The return is the return value from the predicate.
* `source {Arrayable|Object}` The list or hash of objects to be searched.
* `func {Function: (element {Any}, index {Number|String}) → Any}` A predicate function, acting on a member. A predicate which
returns any value which is not `undefined` will terminate the search.
* `deflt {Object|Undefined}` [optional] A value to be returned in the case no predicate function matches
a member. The default will be the natural value of `undefined`
* Returns: The first return value from the predicate function which is not `undefined`

### fluid.find_if(source, func[, deflt])

Scan through a list or hash of objects, terminating on the first member which
matches a predicate function. The return value is the first element itself for which the predicate returns other than `false`.
* `source {Arrayable|Object}` The list or hash of objects to be searched.
* `func {Function: (element {Any}, index {Number}) → Boolean}` A predicate function, acting on a member. A predicate which
returns any value which is not `false` will terminate the search.
* `deflt {Object}` [optional] A value to be returned in the case no predicate function matches a
member. The default will be the natural value of `undefined`
* Returns: The first element for which the value of the predicate function which is not `false`

### fluid.contains(tosearch, value)

Searches through the supplied structure, and returns `true` if the supplied value can be found, using `===` equality

* `tosearch {Object|Array}` The structure to be searched for the supplied value,
* `value {Any}` The value to be searched for
* Returns: `{Boolean|Undefined}` Returns `true` if the value was found in the container

### fluid.keyForValue(tosearch, value) {

Searches through the supplied object for the first value which matches the one supplied.

* `tosearch {Object|Array}` The structure to be searched for the supplied value
* `value {Any}` The value to be found. This will be compared against the structure's members using `===` equality.
* Returns: `{String|Integer|Undefined}` The first key whose value matches the one supplied, or `undefined` is no value matches

### fluid.stableSort(array, func) 

Applies a stable sorting algorithm to the supplied array and comparator (note that [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) in JavaScript is not specified
to be stable). The algorithm used will be an insertion sort, which whilst quadratic in time, will perform well
on small array sizes.
* `array {Array of Any-Element}` The array to be sorted. This input array will be modified in place.
* `func {Function: (a {Any-Element}, b {Any-Element}) → Number}` A comparator returning >0, 0, or <0 on pairs of elements representing their sort order (same contract as [Array.sort comparator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort))


### fluid.compareStringLength(ascending)

Produces a comparator function suitable for use with [Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) to sort an array of strings by length

* `ascending {Boolean}` `true` if a comparator is to be returned which sorts strings in descending order of length
* Returns: `{Function: (a {String}, b {String}) → Number}` The comparator function to be used for sorting


## Parsing and rendering

### fluid.parseInteger(string)

Returns the converted integer if the input string can be converted to an integer. Otherwise, returns `NaN`.

* `string {String}` A string to be converted to an integer
* Returns: `{Integer|NaN}` The integer value, or `NaN` if the string does not represent an integer 

### fluid.model.parseEL(EL)

Parses a EL path expression by splitting it on the character `.`. This is a fast, low-quality implementation which assumes that no
escaping of `.` characters is necessary.

* `EL {String}` The EL path to be parsed
* Returns: `{Array of String}` The EL path parsed as an array of path segments


## Logging and error handling

## The global namespace

## Storing and retrieving component defaults