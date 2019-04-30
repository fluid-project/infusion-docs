---
title: Component Lifecycle
layout: default
category: Infusion
---

Every Fluid component has a standard lifecycle, various points of which are signalled by firing of standard framework
[events](InfusionEventSystem.md).  Every component which has a grade of [fluid.component](ComponentGrades.md) has these
events attached, and the framework will fire them as the component reaches the appropriate lifecycle points. The events,
in the expected order of firing for a component, are as follows:

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
                    <dt><dfn><code>that {Component}</code></dfn></dt>
                    <dd>the component being constructed</dd>
                </dl>
            </td>
            <td>
                Fired when component construction is complete - that is, all options have been merged for the component
                and all subcomponents (which were not marked with
                <a href="SubcomponentDeclaration.md#basic-subcomponent-declaration">createOnEvent</a>) have constructed.
            </td>
        </tr>
        <tr>
            <td>onDestroy</td>
            <td>
                <dl>
                    <dt><dfn><code>that {Component}</code></dfn></dt>
                    <dd>the component being destroyed</dd>
                </dl>
            </td>
            <td>
                Fired when the component is about to be destroyed. This will be a preliminary to beginning the
                destruction process for all its subcomponents.
            </td>
        </tr>
        <tr>
            <td>afterDestroy</td>
            <td>
            <dl>
                <dt><dfn><code>that {Component}</code></dfn></dt>
                <dd>the component which has been destroyed</dd>
            </dl>
            </td>
            <td>
                Fired after the component and its children have been completely destroyed, and detached from any parent
                component.
                <div class="infusion-docs-note">
                    <strong>Note:</strong> At this point you may only safely access plain data members of the component
                    such as id and typeName. Do not attempt to invoke any methods, fire any events, or resolve any IoC
                    references from listeners to this event.
                </div>
            </td>
        </tr>
    </tbody>
</table>

Note that since JavaScript is a garbage-collected language, the component object reference and many of its members will
hang around in memory during and after the destruction process, although it will as noted above be detached from its
parent (via a call to `delete`) and similarly all subcomponent references will be recursively detached from their
parents. The component author may schedule various actions to clean up any external resources (perhaps a jQuery widget,
or a network connection) during the destruction process by adding listeners to the `onDestroy` event.

Every Fluid component is supplied with a standard method named `destroy` which is available after `onCreate` has fired.
`destroy` takes no arguments and will initiate the destruction process for the component - `onDestroy` followed by
`afterDestroy`.

<div class="infusion-docs-note">
    <strong>Note:</strong> You can detect the lifecycle status of a component by means of the standard utility
    <a href="CoreAPI.md#fluidisdestroyedcomponent"><code>fluid.isDestroyed(component)</code></a> - this will return
    <code>true</code> if the object reference represents a component which has been destroyed.
</div>
