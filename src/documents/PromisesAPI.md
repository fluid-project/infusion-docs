---
title: Infusion Promises API
layout: default
category: Infusion
---
[Promises](https://en.wikipedia.org/wiki/Futures_and_promises) are a now widespread programming construct aiming to
simplify coding of complex workflows involving values which may be available asynchronously (perhaps as a result of
requiring I/O) or fallibly. JavaScript enjoys numerous competing libraries implementing this feature, such as
[when.js](https://github.com/cujojs/when), [Q](http://documentup.com/kriskowal/q) and
[Bluebird](https://github.com/petkaantonov/bluebird) as well as even multiple competing promise standards, such as
[Promises/A+](https://promisesaplus.com/) and others from [CommonJS](http://wiki.commonjs.org/wiki/Promises). Promises
are even built into an upcoming version of the JavaScript language itself,
[ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Infusion required an extremely simple implementation which can evolve independently, as well as begin the process of
merging with the general declarative facilities of [Infusion IoC](HowToUseInfusionIoC.md) and hence become invisible as
code. The implementation described here is a transitional, mostly procedural system on its way to being summarised as
configuration - as numerous Infusion features have been in their turn over the years.

## Notes on interoperability

As commented [below](#commentary-on-requirements), Infusion promises have taken a different set of tradeoffs to many of
those elsewhere in the industry. In terms of interoperability, Infusion promises are at least universally recognised as
a "[foreign thenable](https://github.com/cujojs/when/blob/master/docs/api.md#when)" and hence can be easily adapted into
promises of any of the other libraries. In terms of promise algorithms, since Infusion promises meet a weaker contract
than usual, Infusion promises cannot safely be supplied to the promise algorithms of other libraries without adaptation.
However, promises from foreign libraries can easily be used within Infusion's algorithms.

## Core Promises API

In our implementation/interpretation, a promise is, in terms of familiar constructions such as
[events](InfusionEventSystem.md),

* A linked pair of event firers, named `resolve` and `reject`
* At most one of these two events can be fired, at most one time in total
* Any listeners registered to either of the events after the point of firing will be able to recover the (unique) fired
  value at the point of registration

Note that this description does not adequately account for the features of specification-conformant promises more widely
used in the industry - since these implement chaining and asynchronous behaviours which we do not implement.

### fluid.promise()

* Returns: `{Promise}`

Construct a fresh promise. This is the only point at which fresh promises are constructed within the core API. The
structure of the returned `{Promise}` object comprises the following four members:

### promise.then(onResolve, onReject)

Adds handlers to either or both of the `resolve` or `reject` actions of the promise. Note that if the promise has
already been rejected or resolved, the appropriate handler will be notified immediately on this registration.

* `onResolve: {Function ({Any}) →  {None}}` A callback to receive the successfully resolved value of the promise
* `onReject: {Function ({Error}) →  {None}}` A callback to receive a rejection of the promise, in the case its
  resolution fails.

### promise.resolve(value)

Resolves the promise successfully, yielding the value `value` to any listeners which were previously registered as the
first argument of `promise.then`. Any further attempts to call either `resolve` or `reject` will signal an assertion
failure.

* `value: {Any}` The value to be supplied as the resolution value of the promise

### promise.reject(error)

Rejects the promise, yielding the error `error` to any listeners which were previously registered as the second
argument of `promise.then`. Any further attempts to call either `resolve` or `reject` will signal an assertion failure.

* `error: {Object|Error}` The value to be supplied as the rejection reason for the promise. It is recommended that this
  be an object with a boolean entry `isError: true` and a String `message` summarising the reason for the rejection.

### promise.disposition

The current disposition of the promise may be inspected at any time. This is a `String` value which encodes which, if
any, of `resolve` or `reject` have been received by the promise. At the fresh construction of the promise, the member
`disposition` holds the value `undefined`. If the promise has received `resolve`, `disposition` will hold the string
`"resolve"`, or if the promise has received `reject`, `disposition` will hold the string `"reject"`.

## Commentary on requirements

As well as evolvability and enormous simplicity, we had a couple of other somewhat soft requirements - readability, and
debuggability. Modern promise specifications actually **require** that fresh promises are constructed at every chaining
point, and that every promise resolves asynchronously even if its resolving value is available synchronously. Our
implementation guarantees that no promise is constructed unless there is an explicit call to the constructor
`fluid.promise()`. Thus it is easy to see at a glance exactly how many promises are in play in a given piece of code.
Secondly, our implementation will synchronously relay a value which is available synchronously - this means that in the
debugger, or other source of stack traces, the maximal size of stack will be visible to account for the cause of the
promise resolution.

Plenty of arguments exist against these choices - in fact, these choices place us firmly in the category of people who
"don't really understand promises and think of them as glorified ... callback aggregators". In the meantime, we have
work to do. Infusion is about the elimination of code, and so we only have limited time to spend thinking about how to
make the code we do have conform to a faulty ideal of what we dreamed that the virtues of conventional, synchronous code
might once have been. However, it's worth noting that there is at least [one
virtue](#promiseaccumulaterejectionreasonerror) of conventional, synchronous code that is recaptured by no other promise
system but ours. Also, this [github issue](https://github.com/promises-aplus/promises-spec/issues/4) attached to the A+
promises specification is a useful source of convincing argumentation that the decision in favour of universally
asynchronous resolution is flawed.

As a further landmark for discussion, note that in terms of the following very illuminating [category
theoretic](http://brianmckenna.org/blog/category_theory_promisesaplus) treatment of promises (itself rejected by
mainstream promises proponents), our `then` method is very definitely **not** "the name for `flatMap`". Our `then`
method is simply a "glorified callback aggregator".

The implementation skeleton for Infusion's promises was taken from a code sample by John Hann (unscriptable) in this
[gist](https://gist.github.com/unscriptable/814052) - full credit and thanks, and please read the gist for some further
commentary and coverage of limitations.

## Core Promises Utility API

The library implements a few utilities without which it is inconvenient to use promises:

### fluid.isPromise(totest)

* `totest {Any}` An object to be checked for being a promise
* Returns: `{Boolean}` If `totest` has a member `then` of type `Function`, returns `true`.

Determines whether an object is a promise, for our purposes. Any object with a member `then` of type `Function` passes
this test. This includes essentially every known variety, including jQuery promises. This test in fact identifies what
in other libraries is termed a "foreign thenable".

### fluid.toPromise(value)

* `value {Any}` A value to be converted ("hoisted") to a promise
* Returns: `{Promise}` If the supplied value is already a promise, it is returned unchanged. Otherwise a fresh promise
  is created with the value as resolution and returned.

Coerces any value to a promise. If it is already a promise, it is returned unchanged.

### fluid.promise.follow(source, target)

* `source {Promise}` A promise which is to be followed in its resolution.
* `target {Promise}` A promise which will follow the `source` in its resolution. `target` will receive a call to `then`
  causing it to resolve when `source` resolves, and reject when `source` rejects.

Chains the resolution methods of one promise (target) so that they follow those of another (source). That is, whenever
source resolves, target will resolve, or when source rejects, target will reject, with the same payloads in each case.

### fluid.promise.map(source, func)

* `source {Object|Promise}` An object or promise whose value is to be mapped by a function (if an object, will be
  converted first to a promise via `fluid.toPromise()`).
* `func {Function: ({Any})  →  {Any|Promise}}` A function which will map the resolved promise value. This function can
  return either an actual mapped value or a promise whose resolved value is the mapped value.
* Returns: `{Promise}` A promise for the resolved mapped value.

Returns a promise whose resolved value is mapped from the source promise or value by the supplied function. If the input
value is not a promise, it will be converted first to a promise via `fluid.toPromise()`. If the input promise rejects,
its rejection reason will be propagated unmapped. Examples:

```javascript
var promiseTwo = fluid.toPromise(2);
var double = function (value) {
    return value * 2;
};
var promiseFour = fluid.promise.map(promiseTwo, double);
```

```javascript
var promiseTwo = fluid.toPromise(2);
var double = function (value) {
    return fluid.promise().resolve(value * 2);
};
var promiseFour = fluid.promise.map(promiseTwo, double);
```

## Promise algorithms

The only currently implemented promise algorithms are based around a core skeleton operating an array of promises in a
linear sequence. These are responsive to an additional element of our promises API, the
[`promise.accumulateRejectionReason`](#promiseaccumulaterejectionreasonerror) "inverse API" described below.

### fluid.promise.sequence(sources[, options])

* `sources {Array of {Any|Promise|Function:(options {Object}) →  {Any|Promise}}}` An array of sources of values or
  promises which will be evaluated in sequence.
* `options {Object}` [optional] A structure of options which will be supplied to function members of `sources`.

Accepts an array of values, promises, functions returning values or functions returning promises and evaluates them in
sequence. Evaluating a value is a no-op which returns the value itself. Note that a standard name for a "function
returning a promise" is a *task* - this implementation can be directly compared to
[sequence](https://github.com/cujojs/when/blob/master/docs/api.md#whensequence) in the [when.js
library](https://github.com/cujojs/when).

In the case that the source element is a function returning a promise (a task), `fluid.promise.sequence` will ensure
that at most one of these in "in flight" at a time - that is, the succeeding function will not be invoked until the
promise at the preceding position has resolved.

### fluid.promise.fireTransformEvent(event, payload[, options])

* `event {`[`Event`](InfusionEventSystem.md)`}` A "pseudoevent" whose listeners are to be treated as successive
  (asynchronous) stages in the process of transforming a payload.
* `payload {Any}` The original payload input to the transforming chain.
* `options {Object}` [optional] A set of additional options to be supplied to each listener in the transform chain.
  Accepts two special options:
  * `reverse: {Boolean}` If `true`, the sequence of handlers will be notified in reverse order
  * `filterNamespaces: {Array of String}` A collection of event [namespaces](InfusionEventSystem.md#namespaced-listeners)
    to be filtered out of the processing chain for this particular firing

This is a slightly esoteric but very powerful API. To get a sense of its overall function, it could be compared with the
standard [pipeline](https://github.com/cujojs/when/blob/master/docs/api.md#whenpipeline) algorithm supplied with
[when.js](https://github.com/cujojs/when) - the concept is that an "initial payload" (which may be empty) is
successively transformed by sequential, possibly asynchronous, stages of a pipeline of functions. Each function accepts
the return value of its predecessor, and may synchronously return a transformed payload, or a promise asynchronously
yielding such a payload. It may also of course also return a promise which rejects, terminating the transform chain.

This packaging of the pipeline algorithm is significantly more powerful, since it can call upon the
[priority](Priorities.md) feature of standard Infusion [events](InfusionEventSystem.md) in order to allow processing
elements to be integrated together from multiple sources, with each one free to insert themselves at any symbolically
identified (by means of `before:` and `after:` type constraint priorities) position in the chain.

Each listener to the "transform event" (we call this a "pseudoevent" precisely because each listener does not receive
the *same* argument list as with traditional events, but instead receives the returned and resolved value of its
precessor) has the following signature:

* `listener {Function:(previousValue {Any}, options {Object}) →  {Any|Promise}}` where `previousValue` is the resolved
  return from the previous listener notified in the chain, or the initial `payload` value supplied to
  `fluid.promise.fireTransformEvent` if it is the first in the chain, and `options` is the last argument to
  `fluid.promise.fireTransformEvent`.

## Inverse API recognised by promises consumed by sequential algorithms

Both `fluid.promise.sequence` and `fluid.promise.fireTransformEvent` will recognise the following method supplied by the
user on any promise returned by one of the sources in the sequence:

### promise.accumulateRejectionReason(error)

* `error: {Object|Error}` A rejection which has been received from a promise "to the right" of this one in a promise
  sequence.
* Returns: `{Object|Error}` A rejection reason which has been "wrapped" or "decorated" in some way in order to add
  information about the function of **this** promise. For example, if this promise was intended to resolve by reading a
  file from the filesystem, the rejection reason could be decorated with a string like "while reading file Xxxxx". It's
  important that the user's implementation preserves all the information in the original rejection reason - if it
  contains a string `message`, it should be prefixed or suffixed with the additional information, or if it contains an
  error stack, it should be left untouched.

This is a form of "inverse API". The promise API does not implement this method, but it can be implemented by any
consumer of promises by adding a function with this signature named `accumulateRejectionReason` to a promise object.
This method is only relevant when consuming a sequence of promises using one of Infusion's sequential [promise
algorithms](#promise-algorithms).

Let us imagine the promises in a sequence (array) laid out from left to right, in order of sequential execution. This
method is called by a sequential promise algorithm when a promise somewhere in the sequence has rejected. Ordinarily,
execution would pass directly to the overall rejection handler for the sequence. However, before this happens, the
sequence algorithm will pass from *right to left** from the point of rejection and inspect each of the promises in that
section for an `accumulateRejectionReason` implementation.

If an implementation is found, it will be called with the current rejection reason as an argument, and the return value
will be used as the new rejection reason. The resolution algorithm then continues to the left with this new rejection
reason in place, etc. Finally the fully accumulated rejection reason will be dispatched to the overall rejection
handler.

What familiar exception-handling pattern from synchronous code does this reproduce? It is the **rethrowing pattern**,
described in the Java context by [Bruce Eckel](http://www.mindview.net/Etc/Discussions/CheckedExceptions/). Some more
general commentary is on the "original wiki" at [Nested Exception](http://c2.com/cgi/wiki?NestedException). Thankfully,
JavaScript is free of "checked exception specifications" but both the bathwater and baby have been thrown out in that it
is also free of exception wrapping. The promises community is still so immature that the lack of this facility has not
yet even been characterised. Here is some old-fashioned sequential code illustrating what is going on here:

```java

try {
    fallibleThing()
} catch (e) {
    e.message += " whilst doing what I was doing";
    throw e;
}
```

The contents of the catch block correspond to the internals of the `accumulateRejectionReason` function. Note that this
is impossible to emulate with standard promises since there is no reason for the system to revisit a previously seen
source of promises to query it for more information. And outside the context of a sequential algorithm this construct
has no meaning because there is no natural sense of "before" and "after" (or, correspondingly, "above" and "below" in
the call stack) unless the sequential algorithm gives it one. So this facility could only ever be implemented with i) an
extension to the base contract of a promise that ii) is recognised specially within the context of a sequential
algorithm. This is not possible even in theory with "industry standard promises" since there is no stable concept of "an
instance of a promise" - since their object identity is constantly changed after a chaining action.
