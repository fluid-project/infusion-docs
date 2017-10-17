---
title: The IoC Testing Framework
layout: default
category: Infusion
---

The IoC Testing Framework is written using our existing [jqUnit](jqUnit.md) wrapper for jQuery's [QUnit](http://qunitjs.com/) as a base.
The IoC Testing Framework is both written using Fluid's [IoC](HowToUseInfusionIoC.md) system, as well as being designed to test components
which are themselves written using IoC. This framework aims to extend our power to write tests in various directions at the same time.
As well as creating an idiomatic way of writing *integration tests* addressed at realistic-sized chunks of applications, expressed as IoC component
trees, the IoC testing framework also considerably eases the task of testing *complex event sequences* - that is, sequences of application state
that are derived from an alternating conversation between user interaction and application response.

## When to use the IoC Testing Framework ##

<div class="infusion-docs-note"><strong>Note:</strong> The IoC Testing framework is primarily for integration testing requiring asynchrony, e.g. on the client, testing that involves user interaction via the DOM, or
AJAX requests; or alternatively on the server, involving asynchronous I/O such as HTTP requests.

If your tests don't involve a number of back-to-back asynchronous interactions, it is better to express them as plain jqUnit tests.
</div>

### Integration testing within a component tree ###

The concept of *context* in Infusion IoC is derived from the entire collection of components held in an IoC component tree.
The behaviour of each component is potentially altered by all of the other components with which it is deployed.

* for a detailed guide to the operation of scope within Infusion IoC, please consult the page on [Contexts](Contexts.md).

Therefore in order to test component behaviour in context, we need a testing system whose lifecycle (in particular, the lifecycle
of setup and teardown common to all testing systems) is aligned with the lifecycle of component trees - as well as a testing system which enables testing directives to be referred to the components
under test, wherever they may be in the tree.

### Event sequence testing ###

The idiom to be used when binding event listeners which are responsible for *implementing* application behaviour is very different from that to be
used when *testing* the application behaviour. Implementation listeners are typically bound permanently - that is, for the entire
lifecycle of the component holding the listener. This is in order to make application behaviour as regular as possible, and in order to make
it as easy as possible to reason about application behaviour by excluding race conditions. However, when writing tests directed at an
event stream, typically the behaviour required for the listener to each individual event in the sequence is different - since the testing
assertion(s) held in the listener will be verifying a component state against required conditions which change with each successive event.
This requirement often makes test fixture code convoluted and brittle, holding deeply nested sequences of event binding
and unbinding operations held within listeners to other events. We need a system which allows such assertions to be expressed declaratively,
 with this sequence flattened out into a linear list of JSON elements corresponding to each successive state in the event chain.

## How to Use the IoC Testing Framework ##

Writing fixtures using the IoC Testing framework requires the test implementor to derive from two special [grades](ComponentGrades.md), `fluid.test.testEnvironment` and `fluid.test.testCaseHolder`,
which are packaged within the testing framework implementation in the
file `IoCTestUtils.js`. The tester must derive their own component types from these grades, and assemble
them into various component trees corresponding to the desired integration scenarios.

The first type of component corresponds to the overall root of the component tree under test - the *test environment*, defined in the grade
`fluid.test.testEnvironment`. The children of this component correspond to the entire "application segment" under test -
this may be as large (as an entire application) or as small (as a single component) as required in order to comprise the desired fixture.
These children are intermixed with components of the second type, the *test fixtures*, derived from the grade `fluid.test.testCaseHolder`.
These fixture components are holders for declarative JSON configuration defining the
sequence and structure of a group of test cases which are to be run.

### `modules`, `tests` and `sequence` ###

The standard structure inside a `fluid.test.testCaseHolder` has an outer layer of containment, `modules`, with members corresponding to
QUnit [modules](https://api.qunitjs.com/QUnit.module/), and within that an entry named `tests`, holding an array of structures corresponding to QUnit [test](https://api.qunitjs.com/QUnit.test/). In
ordinary use, each element `tests` then contains a member named `sequence` holding a list of [*fixture records*](#supported-fixture-records).

As well as containing a flat list of fixture records, `sequence` may also contain nested arrays of such records. These nested arrays will be
flattened into a single array by use of the utility [`fluid.flatten`](CoreAPI.md#fluidflattenarray) before being processed. This helps in
assembling complex sequences out of previously canned sequence segments. However, building up complex, reusable test sequences is best done by
use of the [`sequenceGrade`](IoCTestingFramework.md#using-sequencegrade-to-build-up-complex-reusable-test-sequences) element, instead of the `sequence` element.

### Simple Example ###

This simple example shows the testing of a simple component, `fluid.tests.cat` which defines one [event](InfusionEventSystem.md), `onMakeSound`, and an
[invoker](Invokers.md) `makeSoundLater` which fires the event asynchronously with the supplied argument. Firstly, we define the component under test:

```javascript
/** Component under test **/
fluid.defaults("fluid.tests.cat", {
    gradeNames: ["fluid.component"],
    events: {
        onMakeSound: null
    },
    invokers: {
        makeSoundLater: {
            funcName: "fluid.tests.cat.makeSoundLater",
            args: ["{that}", "{arguments}.0"]
        }
    }
});

fluid.tests.cat.makeSoundLater = function (that, sound) {
    fluid.invokeLater(function () {
        that.events.onMakeSound.fire(sound);
    });
};
```

In order to test this single component, we embed it appropriately within a *testing environment*, derived from the grade
`fluid.test.testEnvironment`, together with a component to hold the test fixtures named `fluid.tests.catTester`:

```javascript
/** Testing environment - holds both fixtures as well as components under test, exposes global test driver **/
fluid.defaults("fluid.tests.catTestTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        cat: {       // instance of component under test
            type: "fluid.tests.cat"
        },
        catTester: { // instance of test fixtures
            type: "fluid.tests.catTester"
        }
    }
});
```

Finally, we need to define the test fixture holder itself, `fluid.tests.catTester`, derived from `fluid.test.testCaseHolder`,
as well as the test fixture code itself. This contains a simple sequence of 2 elements, the first of which is an active [fixture record](#supported-fixture-records) which calls the invoker, and the
second of which is a passive fixture record which waits for the event to be fired and makes an assertion that its argument is correct:

```javascript
/** Test Case Holder - holds declarative representation of test cases **/
fluid.defaults("fluid.tests.catTester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [ /* declarative specification of tests */ {
        name: "Cat test case",
        tests: [{
            expect: 1,
            name: "Test Asynchronous Meow",
            sequence: [{
                func: "{cat}.makeSoundLater",
                args: "meow"
            }, {
                event: "{cat}.events.onMakeSound",
                listener: "fluid.tests.testCatSound"
            }]
        }
        ]
    }]
});

fluid.tests.testCatSound = function (sound) {
    jqUnit.assertEquals("CATT sound is MEO", "meow", sound);
};
```

<div class="infusion-docs-note"><strong>Note:</strong> In straightforward cases, the test environment component
(e.g. <code>fluid.tests.catTestTree</code>), and the test fixture component (e.g. <code>fluid.tests.catTester</code>) can be written
as the same component.</div>

A more complex example of the `sequence` element appears below in the [asyncTester example](#testcaseholder-demonstrating-sequence-record) below.

In order to run this test case, we can either simply construct an instance of the environment tree by calling `fluid.tests.catTestTree()`,
or submit its name to the global driver function `fluid.test.runTests` as `fluid.test.runTests("fluid.tests.catTestTree")`.
The latter method should be used when running multiple environments within the same file to ensure that their execution is properly serialised.

### Supported fixture records ###

The IoC testing system currently supports the following 6 types of fixture record, which can be assigned to two categories -
"executors", which actively trigger an action, and "binders" which register some form of listener in order to receive an event from
the tree under test. These are recognised using a "duck typing system" similar to that used in the Fluid Renderer. These records may
either form the complete payload for a test held in the `tests` section of a `TestCaseHolder`, or may appear as elements of an array held
in its `sequence` member, representing a sequence of actions (either executors or binders) to be performed by the test case.

<table class="infusion-docs-complextable">
    <tr>
        <th>Fixture name</th><th>Field name</th><th>Field type</th><th>Field description</th><th>Fixture category</th>
    </tr>
    <tr class="infusion-docs-duckrow">
        <td rowspan="2" class="infusion-docs-blockcell">Function executor</td>
        <td><code>func</code>/<code>funcName</code><a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{Function|String}</td><td>The function to be executed, represented either literally (not recommended) or as an IoC reference to a function or the global name of one. It is also possible to use the
        <a href="Invokers.md#compact-format-for-invokers">compact format for invokers</a> to encode the contents of <code>args</code> within the IoC reference <code>func</code> in simple cases.</td>
        <td rowspan="2" class="infusion-docs-blockcell">executor</td>
    </tr>
    <tr>
        <td><code>args</code> [optional]</td>
        <td><code>{Object|Array}</td>
        <td>The argument or arguments to be supplied to <code>function</code></td>
    </tr>
    <tr class="infusion-docs-duckrow">
        <td rowspan="5" class="infusion-docs-blockcell">Event listener</td>
        <td><code>event</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>Reference to the <a href="InfusionEventSystem.md">event</a> to which the listener will be bound. This may be either a standard <a href="">IoC Reference</a> to an event above the testCaseHolder,
        or else a full <a href="IoCSS.html#iocss-selectors">IoCSS reference</a> to an event anywhere in the tree.</td>
        <td rowspan="5" class="infusion-docs-blockcell">binder</td>
    </tr>
    <tr class="infusion-docs-alt-a-row">
        <td><code>listener</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>Reference to the listener to be bound to the event</td>
    </tr>
    <tr class="infusion-docs-alt-a-row">
        <td><code>args</code><a href="#alternatives"><sup>[&dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling)</td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>listenerMaker</code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function which will produce a listener to be bound</td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>makerArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td>
        <td><code>Object/Array</code></td><td>The arguments to be supplied to the listener maker function in order to produce a listener</td>
    </tr>
    <tr class="infusion-docs-duckrow">
        <td rowspan="6" class="infusion-docs-blockcell">Task</td>
        <td><code>task</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>Reference to a function returning a <a href="PromisesAPI.md">Promise</a> - such a function is known as a <a href="https://github.com/cujojs/when/blob/master/docs/api.md#task-execution">task</a>.</td>
        <td rowspan="6" class="infusion-docs-blockcell">executor</td>
    </tr>
    <tr>
        <td><code>args</code> [optional]</td>
        <td><code>{Object|Array}</td>
        <td>The argument or arguments to be supplied to the function <code>task</code></td>
    </tr>
    <tr class="infusion-docs-alt-a-row">
        <td><code>resolve</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function to be registered as an <a href="PromisesAPI.md#promisethenonresolve-onreject"><code>onResolve</code></a> callback to the promise.
        Exactly one out of the fields <code>resolve</code>, <code>reject</code> must be set.</td>
    </tr>
    <tr class="infusion-docs-alt-a-row">
        <td><code>resolveArgs</code><a href="#alternatives"><sup>[&dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td>
        <td>Arguments to be supplied to the <code>resolve</code> function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling). </td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>reject</code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function to be registered as an <a href="PromisesAPI.md#promisethenonresolve-onreject"><code>onReject</code></a> callback to the promise.
        Exactly one out of the fields <code>resolve</code>, <code>reject</code> must be set.</td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>rejectArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td>
        <td>Arguments to be supplied to the <code>reject</code> function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling). </td>
    </tr>
    <tr class="infusion-docs-duckrow">
        <td rowspan="7" class="infusion-docs-blockcell">Change event listener</td><td><code>changeEvent</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code>
            </td><td>Reference to the change event to be listened to. Must be the <code>modelChanged</code> event attached to the <a href="ChangeApplierAPI.md">ChangeApplier</a> of a component - e.g. a reference of the form <code>{component}.applier.modelChanged</code></td>
            <td rowspan="7" class="infusion-docs-blockcell">binder</td>
    </tr>
    <tr>
        <td><code>path</code></td><td><code>{String}</code></td>
        <td>A path specification matching the EL paths for which the listener is to be registered, as per the <a href="ChangeApplierAPI.md">ChangeApplier API</a>. Just one of <code>path</code> or <code>spec</code> should be used.</td>
    </tr>
    <tr>
        <td><code>spec</code></td><td><code>{Object}<code></td><td>A record holding a structured description of the required listener properties, as per the ChangeApplier API. Just one of <code>path</code> or <code>spec</code> should be used.</td>
    </tr>
    <tr class="infusion-docs-alt-a-row">
        <td><code>listener</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>The listener to be bound to the event</td>
    </tr>
    <tr class="infusion-docs-alt-a-row">
        <td><code>args</code><a href="#alternatives"><sup>[&dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling). `{change}` is not currently supported.</td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>listenerMaker</code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function which will produce a listener to be bound</td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>makerArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener maker function in order to produce a listener</td>
    </tr>
    <tr class="infusion-docs-duckrow">
        <td rowspan="3" class="infusion-docs-blockcell">jQuery event trigger</td><td><code>jQueryTrigger</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>The name of a jQuery event (<a href="http://api.jquery.com/trigger/">jQuery eventType</a>) to be triggered via a call to <a href="http://api.jquery.com/trigger/"><code>jquery.trigger</code></a></td><td rowspan="3" class="infusion-docs-blockcell">executor</td>
    </tr>
    <tr>
        <td><code>args</code> [optional]</td>
        <td><code>{Object|Array}</code></td><td>additional arguments to be supplied to <code>
            jQuery.trigger</code></td>
    </tr>
    <tr>
        <td><code>element</code></td>
        <td><code>{jQueryable}</code> (DOM element, jQuery, or selector)</td><td>The jQuery object on which the event is to be triggered</td>
    </tr>
    <tr class="infusion-docs-duckrow">
        <td rowspan="6" class="infusion-docs-blockcell">jQuery event binder</td>
        <td><code>jQueryBind</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>The name of a jQuery event for which a listener is to be registered via a call to <a href="http://api.jquery.com/one/"><code>jquery.one</code></a></td><td rowspan="6" class="infusion-docs-blockcell">binder</td>
    </tr>
    <tr>
        <td><code>element</code></td><td><code>{jQueryable}</code> (DOM element, jQuery, or selector)</td><td>The jQuery object on which a listener is to be bound</td>
    </tr>
    <tr>
        <td><code>args</code> [optional]</td>
        <td><code>{Object|Array}</code></td><td>additional arguments to be supplied to <code>jQuery.one</code></td>
    </tr>
    <tr class="infusion-docs-alt-a-row">
        <td><code>listener</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>The listener to be bound to the event</td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>listenerMaker</code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function which will produce a listener to be bound</td>
    </tr>
    <tr class="infusion-docs-alt-b-row">
        <td><code>makerArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener maker function in order to produce a listener</td>
    </tr>
</table>

In each case in this table,

* In cases where "Field type" accepts a `String` and the description reads "reference to", the field holds an [IoC reference](IoCReferences.md) to the value in question.
* <a id="ducktype"></a>Fields marked with \[*\] (grey rows) are the essential "duck typing fields" which define the type of the fixture records and are mandatory.
* <a id="alternatives"></a>Fields marked with \[&dagger;\] (red rows) and \[&Dagger;\] (green rows) are alternatives to each other - they may not be used simultaneously within the same fixture.
  For example, you must use just one of the styles `listener` or `listenerMaker` to specify an event listener, or specify just one of
  `resolve` or `reject` to a task fixture.

## More Advanced Use of the IoC Testing Framework ##

This section covers topics of interest to more advanced users of the IoC Testing Framework. These topics relate to more flexible and dynamic ways of building up test
sequence fixtures, beyond simply listing them in the fixed array named `sequence`.

### Using `sequenceGrade` to build up complex, reusable test sequences ###

A common patten is for groups of related tests to form an _ecology_, sharing some test sequence elements but with others interleaved between them
and/or some others removed or reconfigured. Working with the raw `sequence` array directly will lead to this testing code becoming fragile as the sequence array
indices will be unstable between different members of the ecology. Instead, the IoC Testing framework supports a variant element `sequenceGrade` which
uses Infusion's [priority](Priorities.md) system to allow sequences to be built up piece by piece using priority directives `after:` and `before:`
expressing their relative positions in the sequence. `sequenceGrade` can be used together with the existing `sequence` element, but is more regularly
used without it.

The element `sequenceGrade` holds a string value, designating a component [grade name](ComponentGrades.md) which has been implemented by the
test case author, descended from the standard framework grade `fluid.test.sequence`. The framework will instantiate a component with this grade as a child component of the
`testCaseHolder`, and then resolve its options path `sequenceElements`, whose keys represent namespaces and whose values are of a type `testSequenceElement`, the members of which are described in the following table:

<table>
    <thead>
        <tr>
            <th colspan="3">Members of a <code>testSequenceElement</code> entry within the <code>sequenceElements</code> block of a <code>fluid.test.sequence</code> component</th>
        </tr>
        <tr>
            <th>Member</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>gradeNames</code> (optional)</td>
            <td><code>{String|Array of String}</code></td>
            <td>One or more grade names, designating the grades of a component descended from <code>fluid.test.sequenceElement</code></td>
        </tr>
        <tr>
            <td><code>options</code> (optional)</td>
            <td><code>{Object}</code></td>
            <td>Any additional options required to construct the <code>fluid.test.sequenceElement</code></td>
        </tr>
        <tr>
            <td><code>priority</code> (optional)</td>
            <td><code>{Priority}</code> value - see <a href="Priorities.md">Priorities</a> for a full explanation</td>
            <td>The priority (if any) that the sequence element component should have over any others appearing within the same <code>elements</code> block
            of its parent <code>fluid.test.sequence</code>. The namespaces used in these priority constraints will be taken from the keys of the <code>elements</code> hash.
        </tr>
        <tr>
            <td><code>namespace</code> (optional)</td>
            <td><code>{String}</code></td>
            <td>If present, will override the key of this member of <code>elements</code> in representing the namespace of this element.
            </td>
        </tr>
    </tbody>
</table>

The members `gradeNames` and `options` in the above table collectively designate an Infusion component derived from `fluid.test.sequenceElement` &mdash; this component will be
instantiated as a child component of the `fluid.test.testCaseHolder` and its options member `sequence` will be evaluated. This member `sequence` holds one or more
[`fixture elements`](#supported-fixture-records) just as seen in the top-level [`sequence`](#modules-tests-and-sequence) element.

Any fixture elements listed at the traditional top-level `sequence` member will be grandfathered in to this system with a namespace of `sequence` &mdash; for example, a `testSequenceElement` with
a priority of `"before:sequence"` will be sorted before these elements.

#### Example of sequence building using `sequenceGrade` ####

Here is a simple example of building up a sequence of elements piece by piece, using [priority](Priorities.md) constraints of the type `after:<namespace>` and `before:<namespace>`. At the top
level, we define a compound `testEnvironment` and `testCaseHolder` that defines a single module holding a single test, referencing the grade `fluid.tests.elementPrioritySequence` as
designating the overall sequence to be built up as a `sequenceGrade`. This grade is defined with four `testSequenceElement` entries, whose namespaces are `check`, `end`, `postBeginning` and `beginning`
(deliberately defined in a different order to that which they will be executed in). These elements each specify a `priority` element to guide the order in which they should be sorted into a sequence.
If you run this example, you will see them executed in the order `beginning`, `postBeginning`, `sequence` (the grandfathered-in top-level sequence), `end` and finally `check`.

The sequence makes use of two reusable `sequenceElement` grades, `fluid.tests.elementPriority.log` which defines a sequence element which logs a console message (this fixture element uses
the [compact syntax](Invokers.md#compact-format-for-invokers) for encoding simple argument lists together with the function), and `fluid.tests.elementPriority.check` which defines
a sequence element making a jqUnit assertion which always passes.

```javascript
fluid.defaults("fluid.tests.elementPriority.log", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [{
        func: "fluid.log({that}.options.message)"
    }]
});

fluid.defaults("fluid.tests.elementPriority.check", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [{
        func: "jqUnit.assert",
        args: "I am the check, right at the end"
    }]
});

fluid.defaults("fluid.tests.elementPrioritySequence", {
    gradeNames: "fluid.test.sequence",
    sequenceElements: {
        check: {
            gradeNames: "fluid.tests.elementPriority.check",
            priority: "after:end"
        },
        end: {
            gradeNames: "fluid.tests.elementPriority.log",
            options: {
                message: "I am at the end, just before the check"
            },
            priority: "after:sequence"
        },
        postBeginning: {
            gradeNames: "fluid.tests.elementPriority.log",
            options: {
                message: "I come after the beginning"
            },
            priority: "after:beginning"
        },
        beginning: {
            gradeNames: "fluid.tests.elementPriority.log",
            options: {
                message: "I will be executed first"
            },
            priority: "before:sequence"
        }
    }
});

fluid.defaults("fluid.tests.elementPriority", {
    gradeNames: ["fluid.test.testEnvironment", "fluid.test.testCaseHolder"],
    modules: [{
        name: "Priority-driven grade budding",
        tests: [{
            expect: 1,
            name: "Simple sequence of 4 active elements",
            sequenceGrade: "fluid.tests.elementPrioritySequence",
            sequence: [{
                func: "fluid.log",
                args: "I am the original sequence, in the middle"
            }]
        }
        ]
    }]
});
```

A further author could now use [grade inheritance](ComponentGrades.md) to build on the above testing scenario to add their own element &mdash; for example, easily interleaving
an extra step before the `end` step:

```javascript
fluid.defaults("fluid.tests.derivedElementPrioritySequence", {
    gradeNames: "fluid.tests.elementPrioritySequence",
    sequenceElements: {
        beforeEnd: {
            gradeNames: "fluid.tests.elementPriority.log",
            options: {
                message: "I come just before the end"
            },
            priority: "before:end"
        }
    }
});

fluid.defaults("fluid.tests.derivedElementPriority", {
    gradeNames: ["fluid.test.testEnvironment", "fluid.test.testCaseHolder"],
    modules: [{
        name: "Derived Priority-driven grade budding",
        tests: [{
            expect: 1,
            name: "Sequence with extra element inserted before end",
            sequenceGrade: "fluid.tests.derivedElementPrioritySequence"
        }]
    }]
});
```

### Using `moduleSource` for dynamic test fixtures ###

To take complete control of the fixture building process, you can write arbitrary code returning the entire set of `modules` by replacing it with the
entry `moduleSource` which takes the same form as an [invoker](Invokers.md) record with entries `func`/`funcName` and `args`,
and returns a list of fixtures in the same format as `modules`. Again, in a real example, this would use the `sequence` form of fixtures shown at the bottom of the page.

Before choosing this option, you are encouraged to see how far you can go with the completely declarative approach involving
[`sequenceGrade`](IoCTestingFramework.md#using-sequencegrade-to-build-up-complex-reusable-test-sequences).

```javascript
// Example of the above fixture written with "moduleSource"
// Definition of modules as namespaced global so that it is available for others and processing
fluid.tests.catTesterModules = [{
    name: "Cat test case",
    tests: [{
        expect: 1,
        name: "Test Global Meow",
        type: "test",
        func: "fluid.tests.globalCatTest",
        args: "{cat}"
    }]
}];

// A helper function which just returns the global -
// realistically, it would assemble a sequence using more complex logic
fluid.tests.getCatModules = function () {
    return fluid.tests.catTesterModules;
};

fluid.defaults("fluid.tests.catTester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    moduleSource: {
        funcName: "fluid.tests.getCatModules"
    }
});
```

## A More Complex Example using `sequence` ###

This example shows sequence testing of a view component `fluid.tests.asyncTest` with genuine asynchronous behaviour (as well as synchronous
event-driven behaviour). The component under the test is an Infusion [Renderer component](tutorial-gettingStartedWithInfusion/RendererComponents.md)
which renders a button, and a model-bound text entry
field. The component defines a listener to clicks to the button which asynchronously (via `window.setTimeout`) fires to an Infusion [event](InfusionEventSystem.md) named
`buttonClicked`. Separately, the component binds listeners to change events from the text field, which are corresponded with the standard
ChangeApplier events resulting from corresponding changes to the component's model.

```javascript
/** Component under test **/
fluid.defaults("fluid.tests.asyncTest", {
    gradeNames: ["fluid.rendererComponent"],
    model: {
        textValue: "initialValue"
    },
    selectors: {
        button: ".flc-async-button",
        textField: ".flc-async-text"
    },
    events: {
        buttonClicked: null
    },
    protoTree: {
        textField: "${textValue}",
        button: {
            decorators: {
                type: "fluid",
                func: "fluid.tests.buttonChild"
            }
        }
    }
});

fluid.defaults("fluid.tests.buttonChild", {
    gradeNames: ["fluid.viewComponent"],
    events: {
        buttonClicked: "{asyncTest}.events.buttonClicked"
    },
    listeners: {
        "onCreate.bindClick": "fluid.tests.buttonChild.bindClick"
    }
});

fluid.tests.buttonChild.bindClick = function (that) {
    that.container.click(function () {
        setTimeout(that.events.buttonClicked.fire, 1);
    });
};
```

Just as with the simple cat testing example above, we embed this component together with a suitable `TestCaseHolder`
within an overall `testEnvironment`:

```javascript
fluid.defaults("fluid.tests.asyncTestTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    markupFixture: ".flc-async-root",
    components: {
        asyncTest: {
            type: "fluid.tests.asyncTest",
            container: ".flc-async-root"
        },
        asyncTester: {
            type: "fluid.tests.asyncTester"
        }
    }
});
```

### Walkthrough of the example sequence ###

Finally, we show the contents of the associated `TestCaseHolder`. In this case, the 1 test it defines holds a sequence
member prescribing a sequence of 11 states for the component, which run a total of 7 jqUnit assertions. These show
records of 5 of the types defined above - the framework ensures the correct sequence of activities (including
binding and unbinding of listeners registered in `binder` records) is operated.

The sequence first initiates rendering of the overall component with a custom global function `fluid.tests.startRendering`,
which checks that the component has rendered correctly and then initiates a click on the rendered button element.
The sequence then checks for the expected asynchronous Fluid event firing - it then synthesises a further click on the
button and checks for the same event again. It then synthesises an update to the rendered text field in the UI,
and listens to the expected ChangeEvent generated by this update. It changes the field again to a different value
and listens for the further ChangeEvent. Next, the sequence makes a direct call to a jqUnit assertion function to
verify that the component's model has been updated properly. Finally, it returns to the button, directly simulating
a click event using the `jQueryTrigger` fixture type, and listening to that event itself using the `jQueryBind` fixture type.

The TestCaseHolder makes reference to a few global utility functions which are reproduced below.

### `testCaseHolder` demonstrating `sequence` record ####

```javascript
fluid.defaults("fluid.tests.asyncTester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    newTextValue:     "newTextValue",
    furtherTextValue: "furtherTextValue",
    modules: [ {
        name: "Async test case",
        tests: [{
            name: "Rendering sequence",
            expect: 7,
            sequence: [ {
                func: "fluid.tests.startRendering",
                args: ["{asyncTest}", "{instantiator}"]
            }, {
                listener: "fluid.tests.checkEvent",
                event: "{asyncTest}.events.buttonClicked"
            }, { // manually click on the button
                jQueryTrigger: "click",
                element: "{asyncTest}.dom.button"
            }, {
                listener: "fluid.tests.checkEvent",
                event: "{asyncTest}.events.buttonClicked"
            }, { // Issue two requests via UI to change field, and check model update
                func: "fluid.tests.changeField",
                args: ["{asyncTest}.dom.textField", "{asyncTester}.options.newTextValue"]
            }, {
                 // old-fashioned "listenerMaker" - discouraged in modern code
                listenerMaker: "fluid.tests.makeChangeChecker",
                args: ["{asyncTester}.options.newTextValue", "textValue"],
                path: "textValue",
                changeEvent: "{asyncTest}.applier.modelChanged"
            }, {
                func: "fluid.tests.changeField",
                args: ["{asyncTest}.dom.textField", "{asyncTester}.options.furtherTextValue"]
            }, {
                listenerMaker: "fluid.tests.makeChangeChecker",
                makerArgs: ["{asyncTester}.options.furtherTextValue", "textValue"],
                // alternate style for registering listener
                spec: {path: "textValue", priority: "last"},
                changeEvent: "{asyncTest}.applier.modelChanged"
            }, {
                func: "jqUnit.assertEquals",
                args: ["Model updated", "{asyncTester}.options.furtherTextValue",
                    "{asyncTest}.model.textValue"]
            }, { // manually click on the button a final time with direct listener
                jQueryTrigger: "click",
                element: "{asyncTest}.dom.button"
            }, {
                jQueryBind: "click",
                element: "{asyncTest}.dom.button",
                listener: "fluid.tests.checkEvent"
            }
            ]
        }
        ]
    }]
});

fluid.tests.checkEvent = function () {
    jqUnit.assert("Button event relayed");
};

fluid.tests.changeField = function (field, value) {
    field.val(value).change();
};

fluid.tests.makeChangeChecker = function (toCheck, path) {
    return function (newModel) {
        var newval = fluid.get(newModel, path);
        jqUnit.assertEquals("Expected model value " + toCheck + " at path " + path, toCheck , newval);
    };
};

fluid.tests.startRendering = function (asyncTest, instantiator) {
    asyncTest.refreshView();
    var decorators = fluid.renderer.getDecoratorComponents(asyncTest, instantiator);
    var decArray = fluid.values(decorators);
    jqUnit.assertEquals("Constructed one component", 1, decArray.length);
    asyncTest.locate("button").click();
};
```

Such repetitive sequences of standardised fixtures are best factored into reusable grades of type `fluid.test.sequenceElement` as seen
in the [sequenceGrade example](#example-of-sequence-building-using-sequencegrade) above.

### `markupFixture` property supporting fixtures written against markup in the host document ###

This environment shows use of the optional `markupFixture` property on the `testEnvironment`. Since the IoC testing framework
operates setup/teardown on the unit of overall `testEnvironment`s, we cannot (should not) make use of QUnit's standard
markup setup/teardown operated on the hard-wired DOM node with id `qunit-fixture`, which is on the unit of individual
test cases. The `markupFixture` property is to be used where the overall environment makes use DOM material where its
markup is rendered, which should be reset to its original value between runs of different `testEnvironment`s.
The `markupFixture` property holds any jQueryable value, designating the overall root node of this DOM material. After
the `testEnvironment` has been torn down, the framework will reset the markup within this root to the contents it
enjoyed before setup of the environment.

### Sequence progress feedback in the browser ###

When run in the browser, the framework will show feedback in the
QUnit UI relating to the sequence point reached by the system. This can be used to diagnose the last successfully
reached sequence point in the case of a "hang" caused by an unexpectedly missing event in the sequence.

### Sequence hang test detection ###

If the next expected "binder" type fixture in a test sequence is not reached within a configurable interval, the console will
log a message of the following form to help the user to diagnose how far the system has progressed through the sequence:

```shell
21:26:33.262: Test case listener has not responded after 5000ms - at sequence pos 4 of 7 sequence element {
"event": "{testEnvironment}.browser.events.onLoaded",
"listener": "{testEnvironment}.browser.evaluate",
"args": [
{ Function

    },
    "md",
    "[unified listing](http://ul.gpii.net/)"
]
} of fixture Confirm that the client-side renderer can render markdown...
```

The default value of the interval is 5000ms, which can be altered by supplying a value in ms to the option `hangWait` of the `testEnvironment`.

### Running tests in the node.js server environment ###

The IoC Testing Framework can also be used to run test sequences in the node.js server environment - in this case
the above browser-related features (`markupFixture`, live sequence progress) are not provided. However, the sequence hang detection message
appears in all environments.

## Design Discussion about the Testing Framework ###

The framework was designed over October-December 2012, with initial call for implementation on the fluid-work mailing list at
[October 31st](http://lists.idrc.ocad.ca/pipermail/fluid-work/2012-October/008615.html), continuing over a sequence of community meetings, and
including a summary of work in progress on [December 5th](http://lists.idrc.ocad.ca/pipermail/fluid-work/2012-December/008652.html). The overall goals for the testing framework were presented as these:

* To facilitate the testing of demands blocks that may be issued by integrators against components deployed in a particular (complex) context
* To automate and regularise the work of "setup" and "teardown" in complex integration scenarios, by deferring this to our standard IoC infrastructure
* To simplify the often tortuous logic required when using the "nested callback style" to test a particular sequence of asynchronous requests and responses (via events) issued against a component with complex behaviour
* To facilitate the reuse of testing code by allowing test fixtures to be aggregated into what are the two standard forms for our delivery of implementation - a) pure JSON structures which can be freely interchanged and transformed, b) free functions with minimum dependence on context and lifecycle

The framework was given a substantial spring-cleaning in October 2016, implementing significant new features such as promise-based fixtures, and priority-driven
sequence grade assembly, and some support for compact invokers. A few significant bugs remain, especially when listing multiple "listener"-type fixtures
adjacent in the sequence - see [FLUID-5502](https://issues.fluidproject.org/browse/FLUID-5502). The support for model change event fixtures is also very old-fashioned and needs to be reformed - see [FLUID-6077](https://issues.fluidproject.org/browse/FLUID-6077).
