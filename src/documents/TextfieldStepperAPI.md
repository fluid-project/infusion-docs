---
title: Textfield Stepper
layout: default
category: Components
---

The **Textfield Stepper** is a user interface component for adjusting a number value using a [Textfield](Textfield.md) for direct entry of the value, along buttons for incrementing and decrementing the value. A user can also increment/decrement the values using the up/down arrow keys.

## Creator ##

Use the following function to create a Textfield Stepper component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.textfieldStepper(container, options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiates the Textfield Stepper component. Connects a a textfield and a pair of increment/decrement buttons to set a model value. Entries are restricted to numbers within a given range.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>container</dt>
                    <dd>
                        A CSS-based selectors, single-element jQuery object, or DOM element that identifies the root DOM node where the Textfield Stepper should be placed.
                    </dd>
                </dl>
                <dl>
                    <dt>options</dt>
                    <dd>
                        An optional data structure that configures the Textfield Stepper component, as described below.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>The Textfield Stepper component</td>
        </tr>
        <tr>
            <th>Examples</th>
            <td>
<pre>
<code>
var textfieldStepper = fluid.textfieldStepper(".flc-textfieldStepper", {
    strings: {
        "label": "Textfield Stepper"
    },
    model: {
        value: 1,
        step: 0.1,
        range: {
            min: 1,
            max: 2
        }
    },
    scale: 1
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

## Methods ##

### increase ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textfieldStepper.increase();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>increase</code> method increases the model value by the <code>model.step</code> amount.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                By default this method does not take any arguments.
            </td>
        </tr>
    </tbody>
</table>

### decrease ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textfieldStepper.decrease();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>decrease</code> method decreases the model value by the <code>model.step</code> amount.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                By default this method does not take any arguments.
            </td>
        </tr>
    </tbody>
</table>

### addFocus ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textfieldStepper.addFocus();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>addFocus</code> method adds the focus style classes to the <code>focusContainer</code>.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### removeFocus ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textfieldStepper.removeFocus();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>removeFocus</code> method removes the focus style classes from the <code>focusContainer</code>.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

## Model Paths ##

The following model paths can be used with [model listeners](ChangeApplierAPI.md).

<table>
    <thead>
        <tr>
            <td>Model Path</td>
            <td>Default</td>
            <td>Description</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>"value"</code>
            </td>
            <td>
                <code>null</code>
            </td>
            <td>
                May be any numerical value provided it is within the range (inclusive).
            </td>
        </tr>
        <tr>
            <td>
                <code>"step"</code>
            </td>
            <td>
                <code>1</code>
            </td>
            <td>
                The amount to increment/decrement the model value by.
            </td>
        </tr>
        <tr>
            <td>
                <code>"range.min"</code>
            </td>
            <td>
                <code>0</code>
            </td>
            <td>
                The minimum the model value can be.
            </td>
        </tr>
        <tr>
            <td>
                <code>"range.max"</code>
            </td>
            <td>
                <code>100</code>
            </td>
            <td>
                The maximum the model value can be.
            </td>
        </tr>
    </tbody>
</table>

## Options ##

### strings ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>strings</code> option allows you to specify strings to be used by the component and is the main location for localization. Amongst other strings, this is used to set an <code>"aria-label"</code> to the textfield element, via the <code>attrs</code> option.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre>
<code>
{
    increaseLabel: "increment",
    decreaseLabel: "decrement"
}
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
var textfieldStepper = fluid.textfieldStepper(".flc-textfieldStepper", {
    strings: {
        "label": "Text Size",
        increaseLabel: "increase",
        decreaseLabel: "decrease"
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
                The <code>attrs</code> option allows you to specify attributes to be added on creation. In particular this is used to set aria attributes used by the component, such as <code>"aria-labelledby"</code>. By default this option is passed along to and applied by the <a href="Textfield.md">textfield</a> subcomponent.
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
var textfieldStepper = fluid.textfieldStepper(".flc-textfieldStepper", {
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

### styles ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>styles</code> option allows you to specify classes to be added programmatically and used for styling with CSS to the component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre>
<code>
{
    container: "fl-textfieldStepper",
    focus: "fl-textfieldStepper-focus"
}
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
var textfieldStepper = fluid.textfieldStepper(".flc-textfieldStepper", {
    styles: {
        container: "fl-textfieldStepper-container",
        focus: "fl-focus"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### selectors ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>selectors</code> option allows you to identify the elements within the component's markup for programmatically interacting with.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre>
<code>
{
    textfield: ".flc-textfieldStepper-field",
    focusContainer: ".flc-textfieldStepper-focusContainer",
    increaseButton: ".flc-textfieldStepper-increase",
    decreaseButton: ".flc-textfieldStepper-decrease"
}
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
var textfieldStepper = fluid.textfieldStepper(".flc-textfieldStepper", {
    selectors: {
        textfield: ".demo-textfieldStepper-field",
        focusContainer: ".demo-textfieldStepper-focusContainer",
        increaseButton: ".demo-textfieldStepper-increase",
        decreaseButton: ".demo-textfieldStepper-decrease"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>
