---
title: Switch API
layout: default
category: Components
---

The Switch component is a user interface widget for switching/toggling a setting, preference, option, etc.

## Creating a Switch ##

```javascript
var switchUI = fluid.switchUI (container[, options]);
```

### Parameters ###

#### container ####

The `container` parameter is a CSS-based [selector](http://api.jquery.com/category/selectors/), single-element jQuery object, or DOM element specifying the containing element for the Switch.

#### options parameter ####

The `options` parameter is an optional collection of name-value pairs that configure the Switch, as described in the [Options](#options) section below.

## Options ##

### General options ###

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td><code>selectors</code></td>
            <td>JavaScript object defining CSS-style selectors for important DOM elements. See [Selectors](#selectors) for more information.</td>
            <td>The object may contain the following keys:
                <ul>
                    <li><code>on</code></li>
                    <li><code>off</code></li>
                    <li><code>control</code></li>
                </ul>
            </td>
            <td>
                <pre>
                    <code>
selectors: {
    on: ".flc-switchUI-on",
    off: ".flc-switchUI-off",
    control: ".flc-switchUI-control"
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td><code>strings</code></td>
            <td>An object containing text to be used by the switch. These are displayed visually on the screen and/or provided as a label for an assistive technology.</td>
            <td>The object may contain the following keys:
                <ul>
                    <li><code>label</code></li>
                    <li><code>on</code></li>
                    <li><code>off</code></li>
                </ul>
            </td>
            <td>
                <pre>
                    <code>
strings: {
    // Specified by implementor
    // text of label to apply the switch, must add to "aria-label" in the attrs block
    label: "",
    on: "on",
    off: "off"
}
                    </code>
                </pre>
            </td>
        </tr>

        <tr>
            <td><code>attrs</code></td>
            <td>An object containing any HTML attributes to be added to the switch <code>control</code>.</td>
            <td>
                An object containing any key/value pairs representing valid HTML attributes and their respective values. In particular, an integrator should define a key/value pairing for <code>"aria-label"</code> or <code>"aria-labelledby"</code>.
                <div class="infusion-docs-note"><strong>Note:</strong> If the switch controls another element on the page, <code>"aria-controls"</code> should be added to indicate the relationship.</div>
            </td>
            <td>
                <pre>
                    <code>
attrs: {
    role: "switch",
    tabindex: 0
}
                    </code>
                </pre>
            </td>
        </tr>

        <tr>
            <td><code>model</code></td>
            <td>The state of the switch.</td>
            <td><code>true</code> is "on", <code>false</code> is off</td>
            <td>
                <pre>
                    <code>
model: {
    enabled: false
}
                    </code>
                </pre>
            </td>
        </tr>
    </tbody>
</table>

### Selectors ###

The `selectors` option is an object containing CSS-based selectors for the various parts of the Switch. Supported selectors are:

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>on</code></td>
            <td>Identifies the element for the "on" identifier</td>
            <td>
                <pre>
                    <code>
selectors: {
    on: ".flc-switchUI-on"
}
                    </code>
                </pre>
            </td>
        </tr>

        <tr>
            <td><code>off</code></td>
            <td>Identifies the element for the "off" identifier</td>
            <td>
                <pre>
                    <code>
selectors: {
    off: ".flc-switchUI-off"
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td><code>selectables</code></td>
            <td>Identifies the DOM element that represents the actual UI switch control.</td>
            <td>
                <pre>
                    <code>
selectors: {
    control: ".flc-switchUI-control"
}
                    </code>
                </pre>
            </td>
        </tr>
    </tbody>
</table>

## Styling the Switch

The Switch includes default CSS styles that it applies to its elements. The application of styles is based on known class names. The _default_ class names are described below, and can be used by including the Switch stylesheet:

```html
<link href="components/switch/css/Switch.css" type="text/css" rel="stylesheet" media="all">;
```

<div class="infusion-docs-note"><strong>Note:</strong> Switch.css is generated from the Switch.styl Stylus file. See the <a href="https://github.com/fluid-project/infusion/blob/master/README.md#developing-with-the-preferences-framework">Developing with the Preferences Framework</a> section of the <a href="https://github.com/fluid-project/infusion/blob/master/README.md">Infusion README</a> for how to build Stylus files.</div>

These styling classes should be added to the markup used by the Switch. To modify the appearance, one can modify the markup and/or override the style declarations applied to the classes.

### Default Classes

* `fl-switchUI` - Should be added to the switch container.
* `fl-switchUI-text ` - Should be applied to the "on" and "off" indicators.
* `fl-switchUI-control` - Should be applied to the actual switch control.
* `fl-switchUI-controlKnob` - Should be applied to the knob of the switch control.

## Dependencies

The Switch dependencies can be met by including the `infusion-all.js` file in the header of the HTML file:

```html
<script type="text/javascript" src="infusion-all.js"></script>
```

Alternatively, the individual file requirements are:

```html
<script type="text/javascript" src="lib/jquery/core/js/jquery.js"></script>
<script type="text/javascript" src="lib/jquery/ui/js/jquery-ui.js"></script>
<script type="text/javascript" src="framework/core/js/Fluid.js"></script>
<script type="text/javascript" src="framework/core/js/jquery.keyboard-a11y.js"></script>
<script type="text/javascript" src="framework/core/js/FluidDocument.js"></script>
<script type="text/javascript" src="framework/core/js/FluidIoC.js"></script>
<script type="text/javascript" src="framework/core/js/DataBinding.js"></script>
<script type="text/javascript" src="framework/core/js/FluidView.js"></script>
<script type="text/javascript" src="components/switch/js/Switch.js"></script>
```

The Switch also requires the following stylesheet:

```html
<link rel="stylesheet" type="text/css" href="components/switch/css/Switch.css" />
```
