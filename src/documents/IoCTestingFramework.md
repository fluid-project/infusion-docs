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

<div class="infusion-docs-note"><strong>Note:</strong> The IoC Testing framework is primarily for integration testing requiring asynchrony, i.e. testing that involves either:

1. user interaction via the DOM, or
2. AJAX requests.

If your tests don't involve a number of back-to-back asynchronous interactions, it is better to express them as plain jqUnit tests.
</div>

### Integration testing within a  component tree ###

The concept of *context* in Infusion IoC is derived from the entire collection of components held in an IoC component tree.
The behaviour of each component is potentially altered by all of the other components with which it is deployed.

- for a detailed guide to the operation of scope within Infusion IoC, please consult the page on [Contexts](Contexts.md).

Therefore in order to test component behaviour in context, we need a testing system whose lifecycle (in particular, the lifecycle
of setup and teardown common to all testing systems) is aligned with the lifecycle of component trees - as well as a testing system which enables testing directives to be referred to any components within the tree in an IoC-natural way.


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

Writing fixtures using the IoC Testing framework requires the test implementor to derive from two special [grades](ComponentGrades.md) which are packaged within the testing framework implementation in the
file `IoCTestUtils.js`. The tester must derive their own component types from these grades, and assemble
them into various component trees corresponding to the desired integration scenarios.

The first type of component corresponds to the overall root of the component tree under test - the test *environment*, defined in the grade
`fluid.test.testEnvironment`. The children of this component correspond to the entire "application segment" (the context) under test -
this may be as large (as an entire application) or as small (as a single component) as required in order to comprise the desired fixture.
These children are intermixed with components of the second type, the *test fixtures*, derived from the grade `fluid.test.testCaseHolder`.
These fixture components typically contain no implementation code, but are simply holders for declarative JSON configuration defining the
sequence and structure of a group of test cases which are to be run.

## Simple Example ##

This simple example shows the testing of a simple component, `fluid.tests.cat` which defines one method. Firstly we define the component under test:

```javascript
/** Component under test **/
fluid.defaults("fluid.tests.cat", {
    gradeNames: ["fluid.component"],
    invokers: {
        makeSound: "fluid.tests.cat.makeSound"
    }
});

fluid.tests.cat.makeSound = function () {
    return "meow";
};
```

In order to test this single component, we embed it appropriately within a *testing environment*, derived from the grade
`fluid.test.testEnvironment`, together with a component to hold the test fixtures named `fluid.tests.catTester`:

```javascript
fluid.defaults("fluid.tests.myTestTree", {
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
as well as the test fixture code itself:

```javascript
fluid.defaults("fluid.tests.catTester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [ /* declarative specification of tests */ {
        name: "Cat test case",
        tests: [{
            expect: 1,
            name: "Test Global Meow",
            type: "test",
            func: "fluid.tests.globalCatTest",
            args: "{cat}"
        }
        ]
    }]
});

fluid.tests.globalCatTest = function (catt) {
    jqUnit.assertEquals("Sound", "meow", catt.makeSound());
};
```

<div class="infusion-docs-note"><strong>Note:</strong> In straightforward cases, the test environment component
(e.g. `fluid.tests.myTestTree`), and the test fixture component (e.g. `fluid.tests.catTester`) can be written
as the same component.</div>

### `modules`, `tests` and `sequence` ###

The standard structure inside a `fluid.test.testCaseHolder` has an outer layer of containment, `modules`, corresponding to a
QUnit `module`, and within that an entry named `tests`, holding an array of structures corresponding to a QUnit `testCase`. Here we define a single
`testCase` which holds a single *fixture record* which executes a global function, `fluid.tests.globalCatTest` which makes one jqUnit assertion.
This is not realistic for a normal use of the framework, which as we mentioned in the introduction only achieves its value when testing a sequence
of fixtures back to back. Normally, the entry within `tests` will instead hold an entry named `sequence` which holds an array of fixture records
representing sequence points to be attained by the test case.

As well as containing a flat list of fixture records, `sequence` may also contain nested arrays of such records. These nested arrays will be
flattened into a single array by use of the utility [`fluid.flatten`](CoreAPI.md#fluid-flatten-array-) before being processed. This helps in
assembling complex sequences out of previously canned sequence segments. However, building up complex, reusable test sequences is best done by
use of the [`sequenceGrade`](/IoCTestingFramework.md#using-sequencegrade-to-build-up-complex-reusable-test-sequences) element, instead of the `sequence` element.

An example of the `sequence` element appears below in the [asyncTester example](#testcaseholder-demonstrating-sequence-record).

In order to run this test case, we can either simply construct an instance of the environment tree by calling `fluid.tests.myTestTree()`,
or submit its name to the global driver function `fluid.test.runTests` as `fluid.test.runTests("fluid.tests.myTestTree")`.
The latter method should be used when running multiple environments within the same file to ensure that their execution is properly serialised.

### Using `moduleSource` for dynamic test fixtures ###

For highly dynamic tests, you may want to assemble your sequence elements dynamically for each test rather than list them statically. In this case,
you can replace `modules` with the entry `moduleSource` which takes the same form as an [invoker](Invokers.md) record with entries `func`/`funcName` and `args`,
and returns a list of fixtures in the same format as `modules`. Again, in a real example, this would use the `sequence` form of fixtures shown at the bottom of the page.

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
    }
];

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
### Using `sequenceGrade` to build up complex, reusable test sequences

A common patten is for groups of related tests to form an `ecology`, sharing some test sequence elements but with others interleaved between them
and/or some others removed. Working with the raw `sequence` array directly will lead to this testing code becoming fragile as the sequence array
indices will be unstable between different members of the ecology. Instead, the IoC Testing framework supports a variant element `sequenceGrade` which
uses Infusion's [priority](Priorities.md) system to allow sequences to be built up piece by piece using priority directives `after:` and `before:` 
expressing their relative positions in the sequence. `sequenceGrade` can be used together with the existing `sequence` element, but is more regularly
used without it.

The element `sequenceGrade` holds a string value, designating a component [grade name](ComponentGrades.md) which has been implemented by the
test case author, descended from the standard framework grade `fluid.test.sequence`. This grade will hold a free hash of records at its options
path `elements`, which are of a type `testSequenceElement` whose members are described in the following table:

<table>
    <thead>
        <tr>
            <th colspan="3">Members of an <code>testSequenceElement</code> entry within the <code>elements</code> block of a <code>fluid.test.sequence</code> component</th>
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


### Supported fixture records ###

The IoC testing system currently supports the following 6 types of fixture record, which can be assigned to two categories -
"executors", which actively trigger an action, and "binders" which register some form of listener in order to receive an event from
the tree under test. These are recognised using a "duck typing system" similar to that used in the Fluid Renderer. These records may
either form the complete payload for a test held in the `tests` section of a `TestCaseHolder`, or may appear as elements of an array held
in its `sequence` member, representing a sequence of actions (either executors or binders) to be performed by the test case.

<table class="mytable">
<!-- All of these styles have been retained from the original Confluence version of this table but so far it's not clear how to pass
a <style> block through the markdown processor -->
    <tr>
        <th>Fixture name</th><th>Field name</th><th>Field type</th><th>Field description</th><th>Fixture category</th>
    </tr>
    <tr class="duckrow">
        <td rowspan="2" class="blockcell">Function executor</td>
        <td><code>func</code>/<code>funcName</code><a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{Function|String}</td><td>The function to be executed, represented either literally (not recommended) or as an IoC reference to a function or the global name of one</td>
        <td rowspan="2" class="blockcell">executor</td>
    </tr>
    <tr>
        <td><code>args</code> [optional]</td>
        <td><code>{Object|Array}</td>
        <td>The argument or arguments to be supplied to <code>function</code></td>
    </tr>
    <tr class="duckrow">
        <td rowspan="5" class="blockcell">Event listener</td>
        <td><code>event</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>Reference to the <a href="InfusionEventSystem.md">event</a> to which the listener will be bound</td>
        <td rowspan="5" class="blockcell">binder</td>
    </tr>
    <tr class="alt-a-row">
        <td><code>listener</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>Reference to the listener to be bound to the event</td>
    </tr>
    <tr class="alt-a-row">
        <td><code>args</code><a href="#alternatives"><sup>[&dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling)</td>
    </tr>
    <tr class="alt-b-row">
        <td><code>listenerMaker<code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function which will produce a listener to be bound</td>
    </tr>
    <tr class="alt-b-row">
        <td><code>makerArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td><td>Object/Array</td>
        <td>The arguments to be supplied to the listener maker function in order to produce a listener</td>
    </tr>
    <tr class="duckrow">
        <td rowspan="6" class="blockcell">Task</td>
        <td><code>task</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>Reference to a function returning a <a href="PromisesAPI.md">Promise</a> - such a function is known as a <a href="https://github.com/cujojs/when/blob/master/docs/api.md#task-execution">task</a>.</td>
        <td rowspan="6" class="blockcell">executor</td>
    </tr>
    <tr>
        <td><code>args</code> [optional]</td>
        <td><code>{Object|Array}</td>
        <td>The argument or arguments to be supplied to the function <code>task</code></td>
    </tr>
    <tr class="alt-a-row">
        <td><code>resolve</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function to be registered as an <a href="PromisesAPI.md#promise-then-onresolve-onreject-"><code>onResolve</code></a> callback to the promise.
        Exactly one out of the fields <code>resolve</code>, <code>reject</code> must be set.</td>
    </tr>
    <tr class="alt-a-row">
        <td><code>resolveArgs</code><a href="#alternatives"><sup>[&dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td>
        <td>Arguments to be supplied to the <code>resolve</code> function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling). </td>
    </tr>
    <tr class="alt-b-row">
        <td><code>reject</code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function to be registered as an <a href="PromisesAPI.md#promise-then-onresolve-onreject-"><code>onRekect</code></a> callback to the promise.
        Exactly one out of the fields <code>resolve</code>, <code>reject</code> must be set.</td>
    </tr>
    <tr class="alt-b-row">
        <td><code>rejectArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td>
        <td>Arguments to be supplied to the <code>reject</code> function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling). </td>
    </tr>
    <tr class="duckrow">
        <td rowspan="7" class="blockcell">Change event listener</td><td><code>changeEvent</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code>
            </td><td>Reference to the change event to be listened to. Must be the <code>modelChanged</code> event attached to the <a href="ChangeApplierAPI.md">ChangeApplier</a> of a component - e.g. a reference of the form <code>{component}.applier.modelChanged</code></td><td rowspan="6" class="blockcell">binder</td>
    </tr>
    <tr>
        <td><code>path</code></td><td><code>{String}</code></td>
        <td>A path specification matching the EL paths for which the listener is to be registered, as per the <a href="ChangeApplierAPI.md">ChangeApplier API</a>. Just one of <code>path</code> or <code>spec</code> should be used.</td>
    </tr>
    <tr>
        <td><code>spec</code></td><td><code>{Object}<code></td><td>A record holding a structured description of the required listener properties, as per the ChangeApplier API. Just one of <code>path</code> or <code>spec</code> should be used.</td>
    </tr>
    <tr class="alt-a-row">
        <td><code>listener</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>The listener to be bound to the event</td>
    </tr>
    <tr class="alt-a-row">
        <td><code>args</code><a href="#alternatives"><sup>[&dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener function when it is called - these may contain IoC references including
        references to the context `{arguments}` as described in [Listener Boiling](EventInjectionAndBoiling.md#listener-boiling). `{change}` is not currently supported.</td>
    </tr>
    <tr class="alt-b-row">
        <td><code>listenerMaker</code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function which will produce a listener to be bound</td>
    </tr>
    <tr class="alt-b-row">
        <td><code>makerArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener maker function in order to produce a listener</td>
    </tr>
    <tr class="duckrow">
        <td rowspan="3" class="blockcell">jQuery event trigger</td><td><code>jQueryTrigger</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>The name of a jQuery event (<a href="http://api.jquery.com/trigger/">jQuery eventType</a>) to be triggered</td><td rowspan="3" class="blockcell">executor</td>
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
    <tr class="duckrow">
        <td rowspan="6" class="blockcell">jQuery event binder</td>
        <td><code>jQueryBind</code> <a href="#ducktype"><sup>[&#42;]</sup></a></td>
        <td><code>{String}</code></td><td>The name of a jQuery event for which a listener is to be registered</td><td rowspan="6" class="blockcell">binder</td>
    </tr>
    <tr>
        <td><code>element</code></td><td><code>{jQueryable}</code> (DOM element, jQuery, or selector)</td><td>The jQuery object on which a listener is to be bound</td>
    </tr>
    <tr>
        <td><code>args</code> [optional]</td>
        <td><code>{Object|Array}</code></td><td>additional arguments to be supplied to <code>jQuery.one</code></td>
    </tr>
    <tr class="alt-a-row">
        <td><code>listener</code><a href="#alternatives"><sup>[&dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>The listener to be bound to the event</td>
    </tr>
    <tr class="alt-b-row">
        <td><code>listenerMaker</code><a href="#alternatives"><sup>[&Dagger;]</sup></a></td>
        <td><code>{Function|String}</code></td><td>A function which will produce a listener to be bound</td>
    </tr>
    <tr class="alt-b-row">
        <td><code>makerArgs</code><a href="#alternatives"><sup>[&Dagger;]</sup></a> [optional]</td>
        <td><code>{Object|Array}</code></td><td>arguments to be supplied to the listener maker function in order to produce a listener</td>
    </tr>
</table>

In each case in this table,

* The "type" field may be taken as comprising a string holding an IoC specification (context-qualified EL path) for the type in question.
* <a name="ducktype"></a>Fields marked with \[*\] are the essential "duck typing fields" which define the type of the fixture records and are mandatory.
* <a name="alternatives"></a>Fields marked with \[&dagger;\] and \[&Dagger;\] are alternatives to each other - they may not be used simultaneously within the same fixture. 
For example, you must use just one of the styles `listener` or `listenerMaker` to specify an event listener, or specify just one of 
`resolve` or `reject` to as task fixture.

### A More Complex Example using `sequence` ###

This example shows sequence testing of a component `fluid.tests.asyncTest` with genuine asynchronous behaviour (as well as synchronous
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
    that.container.click(function() {
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

This environment shows use of the optional `markupFixture` property on the `testEnvironment`. Since the IoC testing framework
operates setup/teardown on the unit of overall `testEnvironment`s, we cannot (should not) make use of QUnit's standard
markup setup/teardown operated on the hard-wired DOM node with id `qunit-fixture`, which is on the unit of individual
test cases. The `markupFixture` property is to be used where the overall environment makes use DOM material where its
markup is rendered, which should be reset to its original value between runs of different `testEnvironment`s.
The `markupFixture` property holds any jQueryable value, designating the overall root node of this DOM material. After
the `testEnvironment` has been torn down, the framework will reset the markup within this root to the contents it
enjoyed before setup of the environment.

Finally, we show the contents of the associated `TestCaseHolder`. In this case, the 1 test it defines holds a sequence
member prescribing a sequence of 11 states for the component, which run a total of 7 jqUnit assertions. These show
records of 5 of the types defined above - the framework ensures the correct sequence of activities (including
binding and unbinding of listeners registered in `binder` records) is operated, as well as showing feedback in the
QUnit UI relating to the sequence point reached by the system. This can be used to diagnose the last successfully
reached sequence point in the case of a "hang" caused by an unexpectedly missing event in the sequence.

The sequence first initiates rendering of the overall component with a custom global function `fluid.tests.startRendering`,
which checks that the component has rendered correctly and then initiates a click on the rendered button element.
The sequence then checks for the expected asynchronous Fluid event - it then synthesises a further click on the
button and checks for the same event again. It then synthesises an update to the rendered text field in the UI,
and listens to the expected ChangeEvent generated by this update. It changes the field again to a different value
and listens for the further ChangeEvent. Next, the sequence makes a direct call to a jqUnit assertion function to
verify that the component's model has been updated properly. Finally, it returns to the button, directly simulating
a click event using the `jQueryTrigger` fixture type, and listening to that event itself using the `jQueryBind` fixture type.

The TestCaseHolder makes reference to a few global utility functions which are reproduced below.

#### `testCaseHolder` demonstrating `sequence` record ####

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
}

fluid.tests.startRendering = function (asyncTest, instantiator) {
    asyncTest.refreshView();
    var decorators = fluid.renderer.getDecoratorComponents(asyncTest, instantiator);
    var decArray = fluid.values(decorators);
    jqUnit.assertEquals("Constructed one component", 1, decArray.length);
    asyncTest.locate("button").click();
};
```

It's anticipated that such lengthy fixture lists will in practice themselves be generated from other more
suitable and concise forms in JSON structures, either by Fluid's [Model Transformation](to-do/ModelTransformation.md) system, or otherwise -
as well as making better use of a growing library of standardised assertion and triggering functions such as `fluid.tests.changeField`.

### Discussion about the Testing Framework ###

The framework was designed over October-December 2012, with initial call for implementation on the fluid-work mailing list at
[October 31st](http://lists.idrc.ocad.ca/pipermail/fluid-work/2012-October/008615.html), continuing over a sequence of community meetings, and
including a summary of work in progress on [December 5th](http://lists.idrc.ocad.ca/pipermail/fluid-work/2012-December/008652.html). The overall goals for the testing framework were presented as these:

* To facilitate the testing of demands blocks that may be issued by integrators against components deployed in a particular (complex) context
* To automate and regularise the work of "setup" and "teardown" in complex integration scenarios, by deferring this to our standard IoC infrastructure
* To simplify the often tortuous logic required when using the "nested callback style" to test a particular sequence of asynchronous requests and responses (via events) issued against a component with complex behaviour
* To facilitate the reuse of testing code by allowing test fixtures to be aggregated into what are becoming the 2 standard forms for our delivery of implementation - a) pure JSON structures which can be freely interchanged and transformed, b) free functions with minimum dependence on context and lifecycle

