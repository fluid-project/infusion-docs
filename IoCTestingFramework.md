# The IoC Testing Framework #

## Overview ##
The IoC Testing Framework is written using our existing jqUnit wrapper for jQuery's QUnit as a base - the kind of basic unit testing supported by these base libraries is described on the page Writing JavaScript Unit Tests. The IoC Testing Framework is both written using Fluid's IoC system, as well as being designed to test components which are themselves written using IoC. This framework aims to extend our power to write tests in various directions at the same time. As well as creating an idiomatic way of writing integration tests addressed at realistic-sized chunks of applications, expressed as IoC component trees, the IoC testing framework also considerably eases the task of testing complex event sequences - that is, sequences of application state that are derived from an alternating conversation between user interaction and application response.

**NOTE**: The IoC Testing framework is only for integration testing requiring asynchrony, i.e. testing that involves either

    user interaction via the DOM, or
    AJAX requests.

If it does not, it is much better to use more simple techniques.

### Integration testing with component tree ###

The concept of context in Infusion IoC is derived from the entire collection of components held in an IoC component tree. The behaviour of each component is potentially altered by all of the other components which are in scope from the site of the component under consideration - for a detailed guide to the operation of scope within Infusion IoC, please consult the page on Contexts. Therefore in order to test component behaviour in context, we need a testing system whose lifecycle (in particular, the lifecycle of setup and teardown common to all testing systems) is aligned with the lifecycle of component trees - as well as a testing system which enables testing directives to be referred to any components within the tree in an IoC-natural way.

### Event sequence testing ###

The idiom to be used when binding event listeners which are responsible for implementing application behaviour is very different from that to be used when testing the application behaviour. Implementation listeners are typically bound permanently - that is, for the entire lifecycle of the component holding the listener. This is in order to make application behaviour as regular as possible, and in order to make it as easy as possible to reason about application behaviour in the absence of race conditions. However, when writing tests directed at an event stream, typically the behaviour required for the listener to each individual event in the sequence is different - since the testing assertion(s) held in the listener will be verifying a component state against required conditions which change with each successive event. Carried to the fullest extent, this typically results in convoluted, brittle code, holding deeply nested sequences of event binding and unbinding operations held within listeners to other events. We need a system which allows such assertions to be expressed declaratively, with this sequence flattened out into a linear list of JSON elements corresponding to each successive state in the event chain.

### Discussion about the Testing Framework ###

The framework was designed over October-December 2012, with initial call for implementation on the fluid-work mailing list at October 31st, continuing over a sequence of community meetings, and including a summary of work in progress on December 5th. The overall goals for the testing framework were presented as these:

    To facilitate the testing of demands blocks that may be issued by integrators against components deployed in a particular (complex) context
    To automate and regularise the work of "setup" and "teardown" in complex integration scenarios, by deferring this to our standard IoC infrastructure
    To simplify the often tortuous logic required when using the "nested callback style" to test a particular sequence of asynchronous requests and responses (via events) issued against a component with complex behaviour
    To facilitate the reuse of testing code by allowing test fixtures to be aggregated into what are becoming the 2 standard forms for our delivery of implementation - a) pure JSON structures which can be freely interchanged and transformed, b) free functions with minimum dependence on context and lifecycle

## How to Use the IoC Testing Framework ##

The IoC Testing framework requires the use of two new kinds of Fluid component, which are packaged as "grades" within the implementation in the file IoCTestUtils.js. In order to make use of the framework, the tester must derive their own component types from these grades, and assemble them into various component trees corresponding to the desired integration scenarios.
The first type of component corresponds to the overall root of the component tree under test - the test environment, defined in the grade fluid.test.testEnvironment. The children of this component correspond to the entire "application segment" (the context) under test - this may be as large (as an entire application) or as small (as a single component) as required in order to comprise the desired fixture. These children are intermixed with components of the second type, the test fixtures, derived from the grade fluid.test.testCaseHolder. These fixture components typically contain no implementation code, but are simply holders for declarative JSON configuration defining the sequence and structure of a group of test cases which are to be run.

## Simple Example ##

This simple example shows the testing of a simple component, fluid.tests.cat which defines one method. Firstly we define the component under test:

```javascript
/** Component under test **/
fluid.defaults("fluid.tests.cat", {
    gradeNames: ["fluid.littleComponent", "autoInit"],
});
fluid.tests.cat.preInit = function (that) {
    that.makeSound = function () {
        return "meow";
    };
};
```

In order to test this single component, we embed it appropriately within a testing environment, derived from the grade fluid.test.testEnvironment, together with a component to hold the test fixtures named fluid.tests.catTester:

```javascript
fluid.defaults("fluid.tests.myTestTree", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
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

Finally, we need to define the test fixture holder itself, fluid.tests.catTester, derived from fluid.test.testCaseHolder, as well as the test fixture code itself:

```javascript
fluid.defaults("fluid.tests.catTester", {
    gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
    testCases: [ /* declarative specification of tests */ {
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
 