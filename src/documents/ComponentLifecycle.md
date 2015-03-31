---
title: Component Lifecycle
layout: default
---

Every Fluid component has a standard lifecycle, various points of which are signalled by firing of standard framework events. Every component which has a grade of [fluid.eventedComponent](ComponentGrades.md) is able to receive and react to these events. The events, in the expected order of firing for a component, are as follows:

<table>
    <thead>
        <tr>
            <th>Event</th>
            <th>Arguments</th>
            <th>Lifecycle Point</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>onCreate</td>
            <td>
                <dl>
                    <dt><dfn>that {Object}</dfn></dt>
                    <dd>the component being constructed</dd>
                </dl>
            </td>
            <td>
                Fired when component construction is complete - that is, all options have been merged for the component and all subcomponents (which were not marked with <a href="tutorial-gettingStartedWithInfusion/Subcomponents.md">createOnEvent</a>) have constructed.
            </td>
        </tr>
        <tr>
            <td>onAttach</td>
            <td>
                <dl>
                    <dt><dfn>that {Object}</dfn></dt>
                    <dd>the component being attached</dd>
                    <dt><dfn>name {String}</dfn></dt>
                    <dd>the member name of the component in the parent to which it is being attached</dd>
                    <dt><dfn>parent {Object}</dfn></dt>
                    <dd>the parent component to which the component is being attached</dd>
                </dl>
            </td>
            <td>
                Fired when the component is attached to the overall component tree of which it is a part.
            </td>
        </tr>
        <tr>
            <td>onClear</td>
            <td>
                <dl>
                    <dt><dfn>that {Object}</dfn></dt>
                    <dd>the component being cleared</dd>
                    <dt><dfn>name {String}</dfn></dt>
                    <dd>the member name of the component in the parent from which it is being cleared</dd>
                    <dt><dfn>parent {Object}</dfn></dt>
                    <dd>the parent component to which the component is being deattached</dd>
                </dl>
            </td>
            <td>
               Fired when the component is detached from the component tree, as a preliminary to destroying it completely
            </td>
        </tr>
        <tr>
            <td>onDestroy</td>
            <td>
                <dl>
                    <dt><dfn>that {Object}</dfn></dt>
                    <dd>the component being destroyed</dd>
                </dl>
            </td>
            <td>
                Fired when the component is about to be destroyed. This will be a preliminary to beginning the destruction process for all its subcomponents.
            </td>
        </tr>
        <tr>
            <td>afterDestroy</td>
            <td>
            <dl>
                <dt><dfn>that {Object}</dfn></dt>
                <dd>the component which has been destroyed</dd>
            </dl>
            </td>
            <td>
                Fired after the component and its children have been completely destroyed. 
                <p>
                    <em><strong>NOTE:</strong> at this point you may only safely access plain data members of the component such as id and typeName. Do not attempt to invoke any methods, fire any events, or resolve any IoC references from listeners to this event.</em>
                </p>
            </td>
        </tr>
    </tbody>
</table>

Note that since JavaScript is a garbage-collected language, the component object reference and many of its members will hang around in memory during and after the destruction process, although it will as noted above be detached from its parent (via a call to `delete`) and similarly all subcomponent references will be recursively detached from their parents. The component author may schedule various actions to clean up any external resources (perhaps a jQuery widget, or a network connection) during the destruction process by adding listeners to the `onDestroy` event.

Every Fluid component is supplied with a standard method named `destroy` which is available after `onCreate` has fired. destroy takes no arguments and will initiate the destruction process for the component - that is, `onClear` followed by `onDestroy` and `afterDestroy`.
