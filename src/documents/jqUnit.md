---
title: jqUnit
layout: default
category: Infusion
---

Bundled with infusion is ***jqUnit***, a library modelled on the [xUnit](https://en.wikipedia.org/wiki/XUnit) API style. jqUnit wraps base functionality provided by the
popular [QUnit](https://qunitjs.com/). All of the QUnit base functionality remains available in a jqUnit fixture at the `QUnit` namespace, and you should consult the QUnit documentation
for details of packaging markup-based fixtures and its own API semantic. However, jqUnit is a complete wrapper and it is possible and recommended to write complete
test suites without reference to QUnit. jqUnit is based on the 1.x API of QUnit, and not the (currently unreleased) 2.x version of QUnit which is API incompatible with QUnit 1.x.

As well as the use of jqUnit in the browser, there is also a node.js module, [node-jqunit](https://github.com/fluid-project/node-jqunit) which allows the use of the same
testing API for writing node.js tests.

A more advanced piece of infrastructure is the [IoC Testing Framework](IoCTestingFramework.md) which is useful for writing asynchronous test fixtures targetting Infusion's IoC
[component trees](UnderstandingInfusionComponents.md). This is not a replacement for jqUnit but a library layered on top of it which is good for certain specialised purposes. If you are
writing plain unit tests, as well as integration tests which don't have a highly asynchronous, conversational style, you should continue to write jqUnit fixtures. If you find you are
writing large-scale integration or acceptance tests against significantly-sized parts of an application, that require sequences of asynchronous conversation, for example simulating user
GUI interaction or HTTP requests, you should use the IoC Testing Framework.

# jqUnit API

## Organising and controlling fixtures

### jqUnit.module(name, hooks)

Starts a group of related tests which will display with the module's name as a prefix. Direct passthrough for [QUnit.module](http://api.qunitjs.com/QUnit.module/)

### jqUnit.test(name, testFunc)

Registers (queues) a synchronous test fixture by providing a callback which will run it. Direct passthrough for [QUnit.test](http://api.qunitjs.com/QUnit.test/). This is equivalent
to a call to `jqUnit.asyncTest`, where the fixture ends with `jqUnit.start`.

### jqUnit.asyncTest(name, testFunc)

Registers (queues) an asynchronous test fixture by providing a callback which will run it. Direct passthrough for [QUnit.asyncTest](http://api.qunitjs.com/QUnit.asyncTest/).

### jqUnit.start()

Restarts QUnit's progress through its fixtures, which were previously suspended by a call to `jqUnit.stop()`. The idiom is that whilst the system is suspended by `stop`, the
test currently in progress is waiting for I/O and the test run will not proceed until it resumes. Note that
QUnit's suspension has the semantics of a [Counting Semaphore](https://en.wikipedia.org/wiki/Semaphore_%28programming%29#Semantics_and_implementation) in that repeated calls to
`jqUnit.stop` are possible and must be matched by an equal number of calls to `jqUnit.start` before the system will resume. Direct passthrough for [QUnit.start](http://api.qunitjs.com/QUnit.start/).

### jqUnit.stop()

Suspends QUnit's progression through its fixtures. QUnit will not continue to the next queued test fixture until it has been resumed with `jqUnit.start`. Direct passthrough for [QUnit.start](http://api.qunitjs.com/QUnit.stop/).

### jqUnit.expect(count)

Informs QUnit that it must receive a certain number of successful assertions in the current fixture, or else the fixture will fail. Note that multiple successive calls to `jqUnit.expect` within the same fixture
will be ***cumulative*** - this is different to QUnit's base behaviour for [`QUnit.expect`](http://api.qunitjs.com/expect/) where successive calls to `QUnit.expect` will overwrite the framework's expected count.

* `count: {Integer}` The number of (additional) successful assertions to be expected

## Assertion methods

jqUnit's assertion methods have the xUnit standard signature of `[message, expected, actual]` rather than QUnit's signature of `[actual, expected, message]`. In many cases they are
direct passthroughs to the QUnit equivalents, but jqUnit does implement a few useful extra assertion types. In the following documentation we do not describe the standard `message` argument
which is accepted as the first argument of every assertion. You may consider that each API section below contains an entry:

* `{message: String}` Message describing the assertion

### jqUnit.assert(message)

An assertion which unconditionally succeeds, and raises the successful assertion count by one. Equivalent to [`QUnit.ok(true, message)`](http://api.qunitjs.com/ok/).

### jqUnit.fail(message)

An assertion which unconditionally fails, and then aborts the current fixture. Equivalent to [`QUnit.ok(false, message)`](http://api.qunitjs.com/ok/).

### jqUnit.assertTrue(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is `true`. Equivalent to [`QUnit.ok(value, message)`](http://api.qunitjs.com/ok/).

### jqUnit.assertFalse(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is `false`. Equivalent to [`QUnit.ok(!value, message)`](http://api.qunitjs.com/ok/).

### jqUnit.assertUndefined(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is `undefined`.

### jqUnit.assertNotUndefined(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is not `undefined`.

### jqUnit.assertNull(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is `null`.

### jqUnit.assertNotNull(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is not `null`.

### jqUnit.assertValue(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is not `null` or `undefined`.

### jqUnit.assertNoValue(message, value)

* `value {Any}` The value to be tested

Asserts that the supplied value is either `null` or `undefined`.

### jqUnit.assertEquals(message, expected, value)

* `expected {Any}` The expected value of `value`
* `value {Any}` The value to be tested

Asserts that the supplied value is equal to the one supplied as `expected`. This will be performed by a strict equality check (`===`) - equivalent to [`QUnit.strictEqual(actual, expected, message)`](http://api.qunitjs.com/strictEqual/)

### jqUnit.assertNotEquals(message, unexpected value)

* `unexpected {Any}` The value that `value` is expected to differ from
* `value {Any}` The value to be tested

Asserts that the supplied value is not equal to the one supplied as `unexpected`. This will be performed by a strict inequality check (`!==`) - equivalent to [`QUnit.notStrictEqual(actual, expected, message)`](http://api.qunitjs.com/notStrictEqual/)

### jqUnit.assertDeepEq(message, expected, value)

* `expected {Any}` The expected value of `value`
* `value {Any}` The value to be tested

Asserts that the supplied value is equal to the one supplied as `expected`. This will be performed by a deep equality check on the basis of properties only (ignoring constructors and prototypes) - equivalent to [`QUnit.propEqual(actual, expected, message)`](http://api.qunitjs.com/propEqual/)

### jqUnit.assertDeepNeq(message, unexpected, value)

* `unexpected {Any}` The value that `value` is expected to differ from
* `value {Any}` The value to be tested

Asserts that the supplied value is not equal to the one supplied as `unexpected`. This will be performed by a deep equality check on the basis of properties only (ignoring constructors and prototypes) -
equivalent to [`QUnit.notPropEqual(actual, expected, message)`](http://api.qunitjs.com/notPropEqual/)

### jqUnit.assertCanoniseEqual(message, expected, value, canonFunc)

* `expected {Any}` The expected value of `value`
* `value {Any}` The value to be tested
* `canonFunc {Function: (value {Any}) → Any}` A [canonicalisation](https://en.wikipedia.org/wiki/Canonicalization) function which will be applied to both `expected` and `value` to reduce them
  to a common form in which they can then be compared by standard deep equality.

Asserts that the supplied value is equal to the one supplied as `expected`, by deep equality and after applying a "canonicalisation function" to remove irrelevant differences
between the two values. Useful canonicalisation functions could act i) to allow all Functions to compare equal, ii) to remove irrelevant differences in array order by sorting,
or iii) other means. Functions supplied by jqUnit include `jqUnit.canonicaliseFunctions` and `jqUnit.sortTree`.

### jqUnit.assertLeftHand(message, expected, value)

* `expected {Any}` An expected subset of `value`
* `value {Any}` The value to be tested

Assert that the actual value object is a superset (considered in terms of shallow key coincidence) of the
expected value object. The coincidence between `value` and `expected` is only in terms of top-level keys, but the comparison will
use deep equality. That is, if `value` has any top-level keys in common with `expected`, they must compare equal by deep equality - but it may
have extra top-level keys whose contents will be iignored. "Left hand" (expected) is a subset of actual.

### jqUnit.assertRightHand(message, expected, value)

* `expected {Any}` An expected superset of `value`
* `value {Any}` The value to be tested

Assert that the actual value object is a subset (considered in terms of shallow key coincidence) of the
expected value object. This is the natural converse of `jqUnit.assertLeftHand` but this assertion is rarely used - it is less useful to assert
that a payload is as expected but may be missing arbitrarily many top-level keys.

### jqUnit.expectFrameworkDiagnostic(message, toInvoke, errorTexts)

Assert that the supplied callback will produce a framework diagnostic (that is, an exception descended from `fluid.FluidError`), containing the supplied text(s)
somewhere in its error message - that is, the callback has invoked [`fluid.fail`](CoreAPI.md#fluidfailarg1-argn) with a message containing
the entries in `errorTexts`.

* `message {String}` The message prefix to be supplied for all the assertions this function issues
* `toInvoke {Function}` A no-arg function holding the code to be tested for emission of the diagnostic
  `errorTexts {String|Array of String}` Either a single string or array of strings which the `message`> field
  of the thrown exception will be tested against - each string must appear as a substring in the text

## Utilities for testing

### jqUnit.canonicaliseFunctions(value)

A canonicalisation function, helpful for use with [jqUnit.assertCanoniseEqual](jqUnit.md#jqunitassertcanoniseequalmessage-expected-value-canonfunc) - this will
take any Functions within the supplied tree and replace them with the same Function reference (`fluid.identity`)

* `value {Object}` Value to be canonicalised
* Returns: `{Object}` Deep clone of `value` with all functions replaced by the same reference

### jqUnit.sortTree(value)

A canonicalisation function, helpful if supplying a [renderer component tree](RendererComponentTrees.md) to [jqUnit.assertCanoniseEqual](jqUnit.md#jqunitassertcanoniseequalmessage-expected-value-canonfunc) -
this will sort each set of `children` in the tree recursively into a canonical order, where this order would not disturb the rendered result.

## Testing in the browser

The QUnit browser UI requires a standard set of includes and markup to render properly. In the header (adjust include paths as appropriate):

```html

    <link rel="stylesheet" media="screen" href="../../../lib/qunit/css/qunit.css" />

    <script type="text/javascript" src="../../../lib/qunit/js/qunit.js"></script>
    <script type="text/javascript" src="../../../test-core/jqUnit/js/jqUnit.js"></script>
```

and in the body of the document:

```html
    <h1 id="qunit-header">Your Test Name Here</h1>
    <h2 id="qunit-banner"></h2>
    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>

    <!-- Test HTML -->
    <div id="qunit-fixture">
    </div>
```

Mysteriously, these UI element ids and their functions are not documented on the QUnit site itself - although you can find explanations of them in some 3rd party tutorials.
Any markup used within test fixtures must be placed within the div with id `qunit-fixture` - QUnit will take care of tearing this down and restoring it in its
original condition before the start of every test.

Your test fixtures should be scheduled to start only once this markup has loaded - you can achieve this by either starting them within a [$(document).ready](https://api.jquery.com/ready/)
callback, or by writing a `<script>` block at the base of your HTML file which starts them.

`jqUnit` provides a special set of assertions and utilities for testing within the browser environment:

### jqUnit.assertNode (message, expected, node)

Checks a subtree of DOM nodes descended for a particular node against a condensed JSON representation, allowing multiple aspects of a rendered UI to be checked in a single
operation. Each attribute of each DOM node is attached as a direct property, the node's tag name is attached as `nodeName`, the node's element test is attached as `nodeText`, and then
all children are recursively attached as the property `children`. In addition, at any stage, the entire nested markup may be attached as `nodeHTML`.

As an example, the following markup:

```html
    <a href="a-link"><img src="a-source"/></a>
```

will compare equal to

```json
{
   nodeName: "a",
   href: "a-link",
   children: [
       {
       nodeName: "img",
       src: "a-source"
       }
   ]
}
```

* `expected {Object|Array}` A condensed JSON respresentation of a set of assertions to make about a subtree of DOM nodes, or an array of these
* `node {DOM|Array of DOM|jQuery}` The DOM node to be checked against `expected` - this may also be an array of DOM nodes or a jQuery object.

### jqUnit.canonicaliseDom(list)

Canonicalise a list of DOM elements (or a jQuery) by converting elements to their ids (allocated if necessary).

* `list {Array of DOM|jQuery}` An array of DOM nodes or a jQuery
* Returns: {Array of String} An array of ids for the supplied nodes, allocated via [fluid.allocateSimpleId](ViewAPI.md#fluidallocatesimpleidelement).

### jqUnit.assertDomEquals(message, expected, actual)

Compare two lists of DOM elements (or jQueries) for being equal by virtue of containing the same DOM elements in the same order. This will
be achieved by canonicalising the DOM elements onto their ids by means of the canonicalisation function `jqUnit.canonicaliseDom`

* `expected {Array of DOM|jQuery}` The expected list of DOM nodes
* `actual {Array of DOM|jQuery}` The actual list of DOM nodes to be compared with `expected`.

### jqUnit.isVisible(msg, selector)

Asserts that the DOM nodes identified by `selector` are visible, in terms of not matching the jQuery [`:hidden`](https://api.jquery.com/hidden-selector/) pseudoselector.

* `selector {jQueryable}` The selector or other jQueryable identifying the DOM nodes to be tested for visibility

### jqUnit.notVisible(msg, selector)

Asserts that the DOM nodes identified by `selector` are not visible, in terms of matching the jQuery [`:hidden`](https://api.jquery.com/hidden-selector/) pseudoselector.

* `selector {jQueryable}` The selector or other jQueryable identifying the DOM nodes to be tested for invisibility

### jqUnit.assertNodeExists (msg, selector)

Asserts that there is at least one node matching the provided selector (or other jQueryable)

* `selector {jQueryable}` The selector or other jQueryable identifying the DOM nodes to be checked for existence

### jqUnit.assertNodeNotExists (msg, selector)

Asserts that there are no nodes matching the provided selector (or other jQueryable)

* `selector {jQueryable}` The selector or other jQueryable identifying the DOM nodes to be checked for nonexistence

### jqUnit.subvertAnimations()

Overrides jQuery's animation routines to be synchronous. This can simplify tests which would otherwise have to wait for an unknown timeout for the DOM to come into
an expected state after, say, a `jQuery.hide` or `jQuery.show`.
