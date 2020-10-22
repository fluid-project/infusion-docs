---
title: API Changes from 2.0 to 3.0
layout: default
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

#### Panel Changes

##### Selectors

All panels must supply a `header` selector, which will be used by the `fluid.prefs.arrowScrolling` grade to provide the
clickable arrows for navigating between adjusters in the small screen responsive view.

##### Line Spacing

The "Line Spacing" panel was refactored to be based off of the `fluid.prefs.panel.stepperAjuster` grade.

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

The text size panel was refactored to be based off of the `fluid.prefs.panel.stepperAjuster` grade.

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

## Component API Changes

### Tabs Component

The `fluid.tabs` component has been removed.

### Reorderer Component

* The `stylisticOffset` selector was no longer in use and has been removed.
