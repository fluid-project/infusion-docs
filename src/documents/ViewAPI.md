---
title: Infusion View API
layout: default
category: Infusion
---

This file documents some low-level View APIs which are provided by Infusion at the JavaScript level, which are
dependent on running in a browser. See also the [DOM Binder API](DOMBinderAPI.md).

## Querying and Manipulating the DOM

### fluid.allocateSimpleId(element)

* `element {DomElement|jQuery}` The DOM element or jQuery object for which a unique id is required
* Returns: `{String}` The unique id for the element - at the point of return, agrees with the node's `id` attribute.

Allocate an id to the supplied element if it has none already, by a simple
scheme resulting in ids "fluid-id-nnnn" where nnnn is a string returned from [fluid.allocateGuid](CoreAPI.md#fluidallocateguid).
If the element already has an id allocated in the DOM, this existing id is returned unchanged.

### fluid.jById(id[, dokkument])

* `id {String}` The id of the node which is to be found
* `dokkument {DomDocument}` [optional] The DOM Document in which the node is to be found. If omitted, defaults to the current global value of `document`.
* Returns: `{jQuery}` A one or zero-element jQuery object holding the node to be found

Returns a jQuery object given the id of a DOM node. In the case the element is not found, will return an empty list.

### fluid.byId(id[, dokkument])

* `id {String}` The id of the node which is to be found
* `dokkument {DomDocument}` [optional] The DOM Document in which the node is to be found. If omitted, defaults to the current global value of `document`.
* Returns: `{DomElement|Null}` The DOM element with the required id, or `null` if there is no such element

Returns an DOM element quickly, given an id. This forwards to `document.getElementById` as well as performing a safety check that the returned element
indeed has the required id.

### fluid.getId(element)

* `element {jQuery|DomElement}` The element to return the id attribute for
* Returns: `{String|Undefined}` The required id or `undefined` if the element has none

Returns the `id` attribute from a jQuery or pure DOM element.

### fluid.wrap(obj[, userJQuery])

* `obj {Any}` The object to wrap in a jQuery. Falsey and existing jQuery objects are returned unchanged.
* `userJQuery {jQueryFramework}` [optional] The jQuery framework object to use for the wrapping - use Infusion's value of `$` if absent
* Returns: `{jQuery|Falsey}` The wrapped object

Wraps an object in a jQuery if it isn't already one. This function is useful since
it ensures to wrap a null or otherwise falsey argument to itself, rather than the
often unhelpful jQuery default of returning the overall document node.

### fluid.unwrap(obj)

* `obj {jQuery|Any}` The jQuery instance to unwrap into a pure DOM element
* Returns: `{DomElement|Any}` The unwrapped element or the original argument

If `obj` is a jQuery, this function will return the first DOM element within it. Otherwise, the object will be returned unchanged.

### fluid.getDocument(element)

* `element {jQuery||DomElement}` The element to return the document for
* Returns: `{Document}` The document in which it is to be found

### fluid.value(nodeIn[, newValue])

* `nodeIn {jQuery|DomElement}` The node whose value is to be read or written
* `newValue {String|Boolean|Array of String}` [optional] The value to be written - if omitted, the value will be read
* Returns: `{String|Array of String}` The value read from the DOM, if required

A generalisation of [`jQuery.val`](http://api.jquery.com/val/) to correctly handle the case of acquiring and
setting the value of clustered radio button/checkbox sets, potentially, given a node corresponding to just one element.
If the supplied element is not an HTML radio button or checkbox, the
implementation will defer to `jQuery.val`. If the supplied element is an HTML radio button or checkbox, the function
will automatically acquire all other elements sharing the same HTML `name` within the same `form` element before performing
the read or write.

## ARIA Labeller

A standalone utility and associated component for easily managing an [ARIA live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) and/or the [`aria-label`](http://www.w3.org/TR/wai-aria/complete#aria-label)
holding a label associated with a particular DOM node in the document.

### fluid.updateAriaLabel(element, text[, options])

* `element {jQueryable}` A selector, DOM element or jQuery representing the DOM node on whose behalf a live region label is required
* `text {String}` The string to be entered into the live region - this will be announced "soon" depending on the "politeness setting" attached to the `aria-live` attribute of the region (default: `"polite"`)
* `options {AriaLabellerOptions}` [optional] A set of options for configuring the behaviour of the labeller. These options are described in the [table below](#structure-of-arialabelleroptions).
* Returns: `{Component}` An Infusion [view component](ComponentConfigurationOptions.md#view-components) managing the interaction with the label. ***Note:*** disposing of this component is the responsibility of the caller. If you have destroyed the markup to which this component is attached, you must destroy the component using its `destroy()` method or it will leak. Successive calls to `fluid.updateAriaLabel` for the same DOM node will return the same component.

#### Structure of `AriaLabellerOptions`

| Name | Type | Description | Default |
|------|------|-------------|---------|
|`dynamicLabel`| `Boolean`| Whether or not an ARIA  live region should be created and associated with the element, as well as the use of `aria-label`| `false` |
|`liveRegionMarkup`| `String` | The markup to use to create the live region (only used if `dynamicLabel` is `true`).|`"<div class=\"liveRegion fl-offScreen-hidden\" aria-live=\"polite\"></div>"`|
|`liveRegionId`| `String` | The ID to assign to the live region (only used if `dynamicLabel` is true). |`"fluid-ariaLabeller-liveRegion"`|
|text| `String` | The text to place in the live region (only used if `dynamicLabel` is true).|none|

Note that as well as forming the 3rd argument to `fluid.updateAriaLabel`, these options also form the [component options](ComponentOptionsAndDefaults.md) to the associated component, which is
an Infusion `fluid.viewComponent` of type `fluid.ariaLabeller`.

## Managing Focus and Blur

Infusion includes two "major utilities" for managing focus interactions, [`fluid.globalDismissal`](#fluidglobaldismissalnodes-dismissfunc) and [`fluid.deadMansBlur`](#fluiddeadmansblurcontrol-options), as well as a few minor utilities.

### fluid.globalDismissal(nodes[, dismissFunc])

* `nodes {Object: String  → DomElement|jQuery}` A free hash of names onto nodes that a click ***outside*** of will trigger `dismissFunc`
* `dismissFunc {Function: DomEvent  →  None}|Undefined` A function which will be executed when a "dismissal click" is received in the document. If this argument is not supplied, any existing dismissal function will be disarmed.

Used in the stereotypical situation where a click event (morally, one which shifts focus outside a dialog or other region of interaction - but only actual `click` events
are supported by this function) should have the effect of "dismissing" the dialog or interaction region. This accepts a free hash of nodes designating the interaction
region and an optional "dismissal function". If `dismissFunc` is set, this "arms" the dismissal system, such that when a click
is received OUTSIDE any of the DOM node hierarchy covered by `nodes`, the dismissal function will be executed, and supplied with the DOM event
triggered by the click event. `fluid.globalDismissal` is a "one shot deal" - if the `dismissFunc` is executed, the system is disarmed and will need
to be armed again.

### fluid.deadMansBlur(control, options)

* `control {jQueryable}` The control for which a blur interaction is to be managed.
* `options {DeadMansBlurOptions}` A set of options managing the interaction, described in [table below](#structure-of-deadmansbluroptions).
* Returns: `{Component}` A component managing the interaction

This utility is designed to compensate for the fact that delivery of blur events in browsers has always been extremely unreliable. Sometimes blur events
are delivered simply because focus has moved to another control within the same interaction region, they are not delivered at all, or in some even more
perverse cases (especially on Internet Explorer) are delivered *after* the focus event which morally causes them.

This utility uses the following strategy: on receiving a standard `blur` event on the `control`, a timer is started which waits for a short period of
time (`options.delay`, defaults to 150ms) to discover whether the reason for the blur interaction is that either a focus or click is being serviced on a nominated
set of "exclusions" (`options.exclusions`, a free hash of elements or jQueries, as accepted by `fluid.globalDismissal`).

If no such event is received within the window, `options.handler` will be called with the argument `control`, to service whatever interaction is required of the
blur. If, further, a click is received *outside* the list of exclusions (as per `fluid.globalDismissal`), `options.handler` will be notified immediately.

Unlike `fluid.globalDismissal`, this interaction is permanent and will persist as long as the nominated DOM elements are in the DOM.

<div class="infusion-docs-note"><strong>Note:</strong> The behaviour of this API has not been vetted for several years against the behaviour of our currently supported browsers, and it also has some deficits which
require reimplementation (e.g. that its handlers can't be removed from the target elements). It should be considered as an unstable API - however it is still being found
broadly useful.</div>

#### Structure of `DeadMansBlurOptions`

| Name | Type | Description | Default |
|------|------|-------------|---------|
|`exclusions`|<code>Object: String  → DomElement&#124;jQuery</code>| A free hash of names onto nodes that a click ***outside*** of will trigger `handler`, *** OR *** that a focus event received within the time window of `delay` from a blur event on `control` will *** cancel *** notification of `handler`| none |
|`handler`|`Function: (jQueryable)  →  None`| A function which will be invoked when the component has determined that a meaningful blur has been triggered on `control`. It will be invoked with `control` as the argument.| none |
|`delay`|`Number`| The interval of time (in ms) that the component will wait after receiving a `blur` event on `control` in order to determine that the reason is that another element within `exclusions` is being focused.|150|
|`backDelay`|`Number`| The interval of time *** before *** a `blur` event in which the component will be sensitive to an anomalous `pre-focusing` of an element within `exclusions` (primarily useful on Internet Explorer)|100|
|`cancelByDefault`|`Boolean`| If `true`, the focus timer logic of `deadMansBlur` is disabled and it the user is expected to operate the component manually (unsupported API)|`false`|

### fluid.getLastFocusedElement()

* Returns: `{DomElement}` Returns the last element which was focused in the DOM.

By means of registering a global listener to the synthetic jQuery [`focusin`](https://api.jquery.com/focusin/) event, allows the user to retrieve the last DOM element which was focused.

### fluid.focus(element)

* `element {jQueryable}` An element onto which focus should be transferred

This utility and `fluid.blur` should be used in test cases which are trying to test focus interactions, since the browser's fidelity in allowing focus to be moved programmatically is
often patchy. This utility will, in the following order, trigger the following:

* A synthetic jQuery event named `fluid-focus`
* The jQuery event `focus`
* The native DOM event `focus`

### fluid.blur(element)

* `element {jQueryable}` An element which should lose focus as a result of receiving a `blur` event.

This utility and `fluid.focus` should be used in test cases which are trying to test focus interactions, since the browser's fidelity in allowing focus to be moved programmatically is
often patchy. This utility will, in the following order, trigger the following:

* A synthetic jQuery event named `fluid-blur`
* The jQuery event `blur`
* The native DOM event `blur`
