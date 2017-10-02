---
title: StateTracker API
layout: default
category: Components
---

A **StateTracker** is an [Infusion component](UnderstandingInfusionComponents.md) that tracks another object whose state can change over time, and provides notification of the change in state.

One example is tracking an operating system process to detect when that process starts or stops running.  Another example is tracking the checked state of a checkbox.  The tracker is agnostic about the state to track, and how to track it.  It is up to the client to provide information about states and how they change.  The tracker focusses on checking the state and notifying when a change occurs.

The StateTracker uses polling to periodically check the state.  Polling is implemented using JavaScript's `setInterval()` function.

## Grade ##

StateTrackers are defined using the `fluid.component` [grade](ComponentGrades.md), as shown in the following code block:

```javascript
fluid.defaults("fluid.stateTracker", {
    gradeNames: ["fluid.component"],
    ...
});
```
## Creator ##

Use the following function to create a StateTracker component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.stateTracker();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiate the state tracker. The methods of the instantiated component can be called to start and stop tracking.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>The state tracker component</td>
        </tr>
        <tr>
            <th>Examples</th>
            <td>
<pre>
<code>
var stateTracker = fluid.stateTracker();
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

## Supported Methods ##

### startTracking ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>stateTracker.startTracking(changeEvaluator, changeListener[, interval]);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>startTracking</code> method allows clients to attach a callback that the tracker calls when the relevant state changes.  The <code>changeEvaluator</code> parameter is an object that knows which state to track, and if that state changed in the relavant manner.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>changeEvaluator</dt>
                    <dd>
                        A JavaScript object that has a zero parameter <code>evaluateChange()</code> method that returns a boolean.
                    </dd>
                    <dt>changeListener</dt>
                    <dd>
                        A callback function that is invoked when the <code>onStateChange</code> event occurs.
                    </dd>
                    <dt>interval</dt>
                    <dd>
                       An optional parameter that defines how frequently the state is checked to see if it has changed, in msec.  If not specified, the interval defaults to that defined by the global <code>setInterval()</code> function, i.e. 10 msec.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>An <code>intervalID</code> as returned by <code>setInterval()</code>.  This is used later to cancel  tracking.</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
// Use the runtime's default interval.
var intervalID = stateTracker.startTracking(checkBoxEvaluator, onCheckStateChanged);

// Check the state every 100 msec.
var intervalID = stateTracker.startTracking(checkBoxEvaluator, onCheckStateChanged, 100);
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### stopTracking ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>stateTracker.stopTracking(intervalID);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>stopTracking()</code> method allows clients to cancel state change tracking.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>intervalID</dt>
                    <dd>
                        The intervalID returned by <code>startTracking()</code>
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
stateTracker.stopTracking(intervalID);
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### monitorChange ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>stateTracker.monitorChange();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Internal method used to coordinate monitoring of the changes in
                state using the evaluator object, and emitting <code>onStateChange</code> events as needed.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### initMonitorInfo ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>stateTracker.initMonitorInfo();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Internal method called to create and initialize a monitor object that is subseqently used by <code>stateTracker.monitorChange()</code>.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>changeEvaluator</dt>
                    <dd>
                        The JavaScript object passed to <code>stateTracker.startTracking()</code> that is used to evaluate if a change in state has occurred.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>
                <p>A <code>monitorInfo</code> object whose structure is:</p>
<pre>
<code>
{
    intervalID:         // slot for the interval id
    changeEvaluator:    // the change evaluator object
}
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

## Supported Events ##

<div class="infusion-docs-note"><strong>Note:</strong> if needed, please read the <a href="InfusionEventSystem.md">Infusion Event System</a> document for a full description of infusion events.</div>

The event fired by the State Tracker component is described below.

### onStateChange ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when a change in state is detected.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>changeEvaluator</dt>
                    <dd>
                        The state evaluator object that was passed to <code>stateTracker.startTracking()</code>.
                    </dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

## Caveat ##

Since the state tracker uses polling to detect changes in state, it is possible that some of the changes are missed or, even, that none of the changes are detected.  This can happen when the polling frequency is less than the frequency with which the state changes.  For example, suppose the state being monitored changes from <code>state0</code> to <code>state1</code> after 23 msec, and then back to <code>state0</code> 11 msec later.  If the tracker is checking that change every 100 msec, then it will fail to notice the changes due to the relatively longer time between evaluations.  The limiting factor is the JavaScript runtime environment's fastest polling frequency, which is typically every 10 msec.  If the state that you are interested in changes more frequently than every 10 msec, then another, possibly native, tracker is needed.

