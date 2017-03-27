---
title: Textfield Slider
layout: default
category: Components
---

The **Textfield Slider** is user interface component for adjusting a number value using a range input. It is paired with a [Textfield](Textfield.md) for direct entry of the value.

## Creator ##

Use the following function to create a Textfield Slider component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.textfieldSlider(container, options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiates the Textfield Slider component. Connects a slider (range input) and textfield, and keeps their values in sync with the model. Entries are restricted to numbers within a given range.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>container</dt>
                    <dd>
                        A CSS-based selectors, single-element jQuery object, or DOM element that identifies the root DOM node where the Textfield Slider should be placed.
                    </dd>
                </dl>
                <dl>
                    <dt>options</dt>
                    <dd>
                        An optional data structure that configures the Textfield Slider component, as described below.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>The Textfield Slider component</td>
        </tr>
        <tr>
            <th>Examples</th>
            <td>
<pre>
<code>
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    strings: {
        "aria-label": "Textfield Slider"
    },
    model: {
        value: 7,
        step: 1,
        range: {
            min: 0,
            max: 10
        }
    },
    scale: 0
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

## Model Paths ##

The following model paths can be used with [model listeners](ChangeApplierAPI.md).

* `model.value`: `null` by default but can contain any numerical value provided it is within the range (inclusive).
* `model.step`: `1.0` the amount to increment/decrement the model value by. Primarily this is used by the slider.
* `model.range.min`: `0` the minimum value the model value can be.
* `model.range.max`: `100` the maximum value the model value can be.

## Options ##

### strings ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>strings</code> option allows you to specify strings to be used by the component and is the main location for localization. In particular this is used to set an <code>"aria-label"</code>.
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
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    strings: {
        "aria-label": "Text Size"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### ariaOptions ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>ariaOptions</code> option allows you to specify aria attributes to be used by the component. In particular this is used to set an <code>"aria-labelledby"</code>.
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
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    ariaOptions: {
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
    container: "fl-textfieldSlider fl-focus"
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
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    styles: {
        container: "fl-textfieldSlider fl-textfieldSlider-focus"
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
    textfield: ".flc-textfieldSlider-field",
    slider: ".flc-textfieldSlider-slider"
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
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    selectors: {
        textfield: ".demo-textfieldSlider-field",
        slider: ".demo-textfieldSlider-slider"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>
