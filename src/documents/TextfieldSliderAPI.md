---
title: Textfield Slider
layout: default
category: Components
---

The **Textfield Slider** is a user interface component for adjusting a number value using a range input. It is paired
with a [Textfield](TextfieldAPI.md) for direct entry of the value.

## Creator

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
                Instantiates the Textfield Slider component. Connects a slider (range input) and textfield, and keeps
                their values in sync with the model. Entries are restricted to numbers within a given range.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>container</dt>
                    <dd>
                        A CSS-based selectors, single-element jQuery object, or DOM element that identifies the root DOM
                        node where the Textfield Slider should be placed.
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
<pre class="highlight"><code class="hljs javascript">
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    strings: {
        "label": "Textfield Slider"
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
});</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

## Model Paths

The following model paths can be used with [model listeners](ChangeApplierAPI.md).

<table>
    <thead>
        <tr>
            <td>Model Path</td>
            <td>Description</td>
            <td>Default</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <code>"value"</code>
            </td>
            <td>
                May be any numerical value provided it is within the range (inclusive).
            </td>
            <td>
                <code>null</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>"step"</code>
            </td>
            <td>
                The amount to increment/decrement the model value by. Primarily this is used by the slider.
            </td>
            <td>
                <code>1.0</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>"range.min"</code>
            </td>
            <td>
                The minimum the model value can be.
            </td>
            <td>
                <code>0</code>
            </td>
        </tr>
        <tr>
            <td>
                <code>"range.max"</code>
            </td>
            <td>
                The maximum the model value can be.
            </td>
            <td>
                <code>100</code>
            </td>
        </tr>
    </tbody>
</table>

## Options

### strings

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>strings</code> option allows you to specify strings to be used by the component and is the
                main location for localization. Amongst other strings, this is used to set an <code>"aria-label"</code>
                to the textfield element and range input, via the <code>attrs</code> option.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>Nothing specified by default</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight"><code class="hljs javascript">
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    strings: {
        "label": "Text Size"
    }
});</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### attrs

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>attrs</code> option allows you to specify attributes to be added on creation. In particular
                this is used to set aria attributes used by the component, such as <code>"aria-labelledby"</code>. By
                default this option is passed along to and applied by both the <a href="TextfieldAPI.md">textfield</a>
                and Slider subcomponents.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>Nothing specified by default</td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight"><code class="hljs javascript">
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    attrs: {
        "aria-labelledby": "elementID"
    }
});</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### styles

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>styles</code> option allows you to specify classes to be added programmatically and used for
                styling with CSS to the component.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre class="highlight"><code class="hljs javascript">
{
    container: "fl-textfieldSlider fl-focus"
}</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight"><code class="hljs javascript">
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    styles: {
        container: "fl-textfieldSlider fl-textfieldSlider-focus"
    }
});</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### selectors

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>selectors</code> option allows you to identify the elements within the component's markup for
                programmatically interacting with.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
<pre class="highlight"><code class="hljs javascript">
{
    textfield: ".flc-textfieldSlider-field",
    slider: ".flc-textfieldSlider-slider"
}</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre class="highlight"><code class="hljs javascript">
var textfieldSlider = fluid.textfieldSlider(".flc-textfieldSlider", {
    selectors: {
        textfield: ".demo-textfieldSlider-field",
        slider: ".demo-textfieldSlider-slider"
    }
});</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>
