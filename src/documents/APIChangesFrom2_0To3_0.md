---
title: API Changes from 2.0 to 3.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 3.0.

## Framework Changes

### Core Framework Changes

This section describes major APIs that were in common use. For information about less widely-used features removed in
3.0, consult [Deprecations in 2.0](DeprecatedIn2_0.md).

#### Model Transformations

* `fluid.transforms.round` can take in `scale` and `method` options for rounding numbers to a decimal value.
   Additionally, numbers round away from 0 (i.e 0.5 -> 1, -0.5 -> -1).
* `fluid.transforms.valueMapper` takes an `defaultInput` option to provide the model data directly. This also provides a
   location for adding nested transformations.

#### Fluid Document

`fluid.focus` and `fluid.blur` now return an ES6 promise resolved when the related DOM event fires. In Infusion 2.0,
they would immediately return the node that the event was bound to.

### Preferences Framework

#### Model Changes

##### Reset

By default, reset will only reset the `preferences` model path. Other model values will remain unchanged. If you'd like
to also have these paths changed, add a listener to the `beforeReset` event to execute a fireChangeRequest for the model
paths you need to reset. (See: [ArrowScrolling.js](https://github.com/fluid-project/infusion/blob/main/src/framework/preferences/js/ArrowScrolling.js))

```snippet
listeners: {
    "beforeReset.resetPanelIndex": {
        listener: "{that}.applier.fireChangeRequest",
        args: {path: "panelIndex", value: 0, type: "ADD", source: "reset"}
    }
}
```

##### Model Paths

A prefsEditor is configured with the [`fluid.remoteModelComponent`](RemoteModelAPI.md) grade. This adds a `local` and
`remote` model path for managing model changes between the component and those stored elsewhere. Any model value that
should be persisted must be relayed into the `local` model path.

Any prefsEditor using the `fluid.prefs.arrowScrolling` grade, such as the one contained in `fluid.prefs.separatedPanel`,
will contain the following new model paths.

<table>
    <thead>
        <tr>
            <th>Model Path</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>panelIndex</code></td>
            <td>0</td>
            <td>The index of the panel to scroll to in the small screen responsive view.</td>
        </tr>
        <tr>
            <td><code>panelMaxIndex</code></td>
            <td>A number representing the index of the last panel</td>
            <td>The maximum index that panelIndex can take. It is calculated from the total number of panels present.</td>
        </tr>
    </tbody>
</table>

#### Preference Map

The keyword `"default"` was used to setup a model relay between an internal model and the preferences state. If no
existing preference was stored, the value was taken from the `"default"` property of the related primary schema. The
keyword has been changed to `"value"`.

##### In 2.0

```json
{
    "preferenceMap": {
        "fluid.prefs.tableOfContents": {
            "model.toc": "default"
        }
    }
}
```

##### In 3.0

```json
{
    "preferenceMap": {
        "fluid.prefs.tableOfContents": {
            "model.toc": "value"
        }
    }
}
```

#### Preference Editor

##### Selectors

The `panels` selector, by default `.flc-prefsEditor-panel`, is used to find all panel containers within the preference
editor. The mobile presentation of UIO makes use of this to determine which panel is in view.

##### UI Options / Separated Panel

###### In 2.0

```html
<!-- BEGIN markup for Preference Editor -->
<div class="flc-prefsEditor-separatedPanel fl-prefsEditor-separatedPanel">
    <!-- This div is for the sliding panel that shows and hides the Preference Editor controls -->
    <div class="fl-panelBar">
        <span class="fl-prefsEditor-buttons">
            <button id="reset" class="flc-prefsEditor-reset fl-prefsEditor-reset">
                <span class="fl-icon-undo"></span>
                Reset
            </button>
            <button id="show-hide" class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide">
                Show/Hide
            </button>
        </span>
    </div>
</div>
<!-- END markup for Preference Editor -->
```

###### In 3.0

```html
<!-- BEGIN markup for Preference Editor -->
<div class="flc-prefsEditor-separatedPanel fl-prefsEditor-separatedPanel">
    <!--
        This div is for the sliding panel bar that shows and hides the Preference Editor controls in the mobile view.
        A separate panel bar for mobile displays is needed to preserve the correct tab order.
    -->
    <div class="fl-panelBar fl-panelBar-smallScreen">
        <span class="fl-prefsEditor-buttons">
            <button class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide">
                Show/Hide
            </button>
            <button class="flc-prefsEditor-reset fl-prefsEditor-reset">
                <span class="fl-icon-undo"></span>
                Reset
            </button>
        </span>
    </div>

    <!-- This is the div that will contain the Preference Editor component -->
    <div class="flc-slidingPanel-panel flc-prefsEditor-iframe"></div>

    <!--
        This div is for the sliding panel bar that shows and hides the Preference Editor controls in the desktop view.
        A separate panel bar for desktop displays is needed to preserve the correct tab order.
    -->
    <div class="fl-panelBar fl-panelBar-wideScreen">
        <span class="fl-prefsEditor-buttons">
            <button class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide">
                Show/Hide
            </button>
            <button class="flc-prefsEditor-reset fl-prefsEditor-reset">
                <span class="fl-icon-undo"></span>
                Reset
            </button>
        </span>
    </div>
</div>
<!-- END markup for Preference Editor -->
```

#### Panel Changes

##### Selectors

All panels must supply a `header` selector, by default `.flc-prefsEditor-header`. This will be used by the
`fluid.prefs.arrowScrolling` grade to provide the clickable arrows for navigating between adjusters in the small screen
responsive view.

##### Contrast

The "Contrast" panel was refactored to be based off of the `fluid.prefs.panel.themePicker` grade.

###### Selectors

<table>
    <thead>
        <tr>
            <th colspan="2">In 3.0.0</th>
            <th colspan="2">In 2.0.0</th>
        </tr>
        <tr>
            <th>Selector Name</th>
            <th>Selector</th>
            <th>Selector Name</th>
            <th>Selector</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>description</td>
            <td><code>.flc-prefsEditor-themePicker-descr</code></td>
            <td>contrastDescr</td>
            <td><code>.flc-prefsEditor-contrast-descr</code></td>
        </tr>
        <tr>
            <td>label</td>
            <td><code>.flc-prefsEditor-themePicker-label</code></td>
            <td>label</td>
            <td><code>.flc-prefsEditor-contrast-label</code></td>
        </tr>
    </tbody>
</table>

###### Message Bundle Changes

<table>
    <thead>
        <tr>
            <th>Message Bundle</th>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="3">contrast.json</td>
            <td><code>"label"</code></td>
            <td><code>"contrastLabel"</code></td>
        </tr>
        <tr>
            <td><code>"description"</code></td>
            <td><code>"contrastDescr"</code></td>
        </tr>
        <tr>
            <td></td>
            <td><code>"multiplier"</code></td>
        </tr>
    </tbody>
</table>

##### Line Spacing

The "Line Spacing" panel was refactored to be based off of the `fluid.prefs.panel.stepperAdjuster` grade.

###### Model Changes

<table>
    <thead>
        <tr>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>value</code></td>
            <td><code>lineSpace</code></td>
        </tr>
    </tbody>
</table>

###### Message Bundle Changes

<table>
    <thead>
        <tr>
            <th>Message Bundle</th>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="3">lineSpace.json</td>
            <td><code>"label"</code></td>
            <td><code>"lineSpaceLabel"</code></td>
        </tr>
        <tr>
            <td><code>"description"</code></td>
            <td><code>"lineSpaceDescr"</code></td>
        </tr>
        <tr>
            <td></td>
            <td><code>"multiplier"</code></td>
        </tr>
    </tbody>
</table>

##### Links and Buttons

The "Links and Buttons" adjusters and enactors are collapsed to a single preference called "Enhance Inputs".

###### Model Changes

<table>
    <thead>
        <tr>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>value</code></td>
            <td>
                <ul>
                    <li><code>links</code></li>
                    <li><code>inputsLarger</code></li>
                <ul>
            </td>
        </tr>
    </tbody>
</table>

###### Message Bundle Changes

<table>
    <thead>
        <tr>
            <th colspan="2">In 3.0.0</th>
            <th colspan="2">In 2.0.0</th>
        </tr>
        <tr>
            <th>Message Bundle</th>
            <th>Property</th>
            <th>Message Bundle</th>
            <th>Property</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="5">enhanceInputs.json</td>
            <td><code>label</code></td>
            <td>linksControls.json</td>
            <td><code>linksControlsLabel</code></td>
        </tr>
        <tr>
            <td rowspan="2"><code>description</code></td>
            <td>inputsLarger.json</td>
            <td><code>inputsChoiceLabel</code></td>
        </tr>
        <tr>
            <td>linksControls.json</td>
            <td><code>LinksChoiceLabel</code></td>
        </tr>
        <tr>
            <td><code>switchOn</code></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td><code>switchOff</code></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>

##### Table of Contents

The table of contents panel was refactored to be based off of the `fluid.prefs.panel.switchAdjuster` grade.

###### Model Changes

<table>
    <thead>
        <tr>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>value</code></td>
            <td><code>toc</code></td>
        </tr>
    </tbody>
</table>

###### Message Bundle Changes

<table>
    <thead>
        <tr>
            <th>Message Bundle</th>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="4">tableOfContents.json</td>
            <td><code>"label"</code></td>
            <td><code>"tocLabel"</code></td>
        </tr>
        <tr>
            <td><code>"description"</code></td>
            <td><code>"tocDescr"</code></td>
        </tr>
        <tr>
            <td><code>"switchOn"</code></td>
            <td></td>
        </tr>
        <tr>
            <td><code>"switchOff"</code></td>
            <td></td>
        </tr>
    </tbody>
</table>

##### Text Size

The text size panel was refactored to be based off of the `fluid.prefs.panel.stepperAdjuster` grade.

###### Model Changes

<table>
    <thead>
        <tr>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>value</code></td>
            <td><code>textSize</code></td>
        </tr>
    </tbody>
</table>

###### Message Bundle Changes

<table>
    <thead>
        <tr>
            <th>Message Bundle</th>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="3">textSize.json</td>
            <td><code>"label"</code></td>
            <td><code>"textSizeLabel"</code></td>
        </tr>
        <tr>
            <td><code>"description"</code></td>
            <td><code>"textSizeDescr"</code></td>
        </tr>
        <tr>
            <td></td>
            <td><code>"multiplier"</code></td>
        </tr>
    </tbody>
</table>

##### Text to Speech

The text to speech panel was refactored to be based off of the `fluid.prefs.panel.switchAdjuster` grade.

###### Model Changes

<table>
    <thead>
        <tr>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>value</code></td>
            <td><code>speak</code></td>
        </tr>
    </tbody>
</table>

###### Message Bundle Changes

<table>
    <thead>
        <tr>
            <th>Message Bundle</th>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="4">speak.json</td>
            <td><code>"label"</code></td>
            <td><code>"speakLabel"</code></td>
        </tr>
        <tr>
            <td><code>"description"</code></td>
            <td><code>"speakDescr"</code></td>
        </tr>
        <tr>
            <td><code>"switchOn"</code></td>
            <td></td>
        </tr>
        <tr>
            <td><code>"switchOff"</code></td>
            <td></td>
        </tr>
    </tbody>
</table>

#### Store Changes

The `fluid.prefs.store` grade has been refactored to use [`fluid.dataSource`](DataSourceAPI.md) as its base grade.

#### Primary Schema Changes

<table>
    <thead>
        <tr>
            <th>In 3.0.0</th>
            <th>In 2.0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>"enumLabels"</code></td>
            <td></td>
        </tr>
        <tr>
            <td><code>"multipleOf"</code></td>
            <td><code>"divisibleBy"</code></td>
        </tr>
    </tbody>
</table>

## Component API Changes

### Reorderer Component

* The `stylisticOffset` selector was no longer in use and has been removed.

### Tabs Component

The `fluid.tabs` component has been removed.

### Textfield Slider

Removed the [jQuery UI Slider](https://jqueryui.com/slider/), in favour of using a native [HTML5 range input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range).
