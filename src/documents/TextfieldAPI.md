---
title: Textfield
layout: default
category: Components
---

The **Textfield** is a small component for adding aria attributes and data binding to a HTML textfield. Typically this will be used in conjunction with a controller (e.g. [**Textfield Slider**](TextfieldSliderAPI.md), [**Textfield Stepper**](TextfieldStepperAPI.md)) to restrict the values and pair with additional input methods.

## Creator ##

Use the following function to create a Textfield component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.textfield(container, options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiates the textfield component. Provides data binding between the HTML `<input>` and the component's model. Also provides options for setting an `"aria-label"` and/or `"aria-labelledby"` attribute.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>container</dt>
                    <dd>
                        A CSS-based selectors, single-element jQuery object, or DOM element that identifies HTML `<input>` to bind the Textfield component to.
                    </dd>
                </dl>
                <dl>
                    <dt>options</dt>
                    <dd>
                        An optional data structure that configures the Textfield component, as described below.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>The Textfield component</td>
        </tr>
        <tr>
            <th>Examples</th>
            <td>
<pre>
<code>
var textfield = fluid.textfield(".flc-textfield", {
    model: {
        value: "Hello World"
    },
    strings: {
        "label": "Insert Demo Name"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

## Methods ##

### setModel ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textfield.setModel(event);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>setModel</code> method allows for updating the model value based on an event. This is primarily used internally for binding to the input's change event.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>event</dt>
                    <dd>
                        A <a href="http://api.jquery.com/category/events/event-object/">jQuery event object</a> including a change value. The <code>setModel</code> method will source the change value from <code>event.target.value</code>.
                    </dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

## Model Paths ##

The following model paths can be used with [model listeners](ChangeApplierAPI.md).

* `model.value`: `undefined` by default but can contain any value that is valid for the input.

## Options ##

### strings ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>strings</code> option allows you to specify strings to be used by the component and is the main location for localization. In particular this is used to set an <code>"aria-label"</code> to the components container element, via the <code>attrs</code> option.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>Nothing specified by default</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
var textfield = fluid.textfield(".flc-textfield", {
    strings: {
        "label": "Insert Demo Name"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### attrs ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>attrs</code> option allows you to specify attributes to be added on creation to the components container element. In particular this is used to set aria attributes used by the component, such as <code>"aria-labelledby"</code>.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>Nothing specified by default</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
var textfield = fluid.textfield(".flc-textfield", {
    attrs: {
        "aria-labelledby": "elementID"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>
