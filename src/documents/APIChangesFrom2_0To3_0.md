---
title: API Changes from 2.0 to 3.0
layout: default
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 3.0.

## Framework Changes

### Core Framework Changes

This section describes major APIs that were in common use. For information about less widely-used features removed in 3.0, consult [Deprecations in 2.0](DeprecatedIn2_0.md).

#### Model Transformations

* `fluid.transforms.round` can take in `scale` and `method` options for rounding numbers to a decimal value. Additionally, numbers round away from 0 (i.e 0.5 -> 1, -0.5 -> -1).
* `fluid.transforms.valueMapper` takes an `defaultInput` option to provide the model data directly. This also provides a location for adding nested transformations.

### Preferences Framework

#### Model Changes

##### Reset

By default, reset will only reset the `preferences` model path. Other model values will remain unchanged. If you'd like to also have these paths changed, add a listener to the `beforeReset` event to execute a fireChangeRequest for the model paths you need to reset. (See: [ArrowScrolling.js](https://github.com/fluid-project/infusion/blob/master/src/framework/preferences/js/ArrowScrolling.js))

```snippet
listeners: {
    "beforeReset.resetPanelIndex": {
        listener: "{that}.applier.fireChangeRequest",
        args: {path: "panelIndex", value: 0, type: "ADD", source: "reset"}
    }
}
```

##### Model Paths

Any prefsEditor using the `fluid.prefs.arrowScrolling` grade, such as the one contained in `fluid.prefs.separatedPanel`, will contain the following new model paths.

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

The "Links and Buttons" adjusters and enactors are collapsed to a single preference called "Enhance Links".

##### Selectors

All panels must supply a `header` selector, which will be used by the `fluid.prefs.arrowScrolling` grade to provide the clickable arrows for navigating between adjusters in the small screen responsive view.

##### Message Bundle Keys

###### Additions

* enhanceInputs.json
  * `"label"`
  * `"description"`
  * `"switchOn"`
  * `"switchOff"`
* speak.json
  * `"switchOn"`
  * `"switchOff"`
* tableOfContents.json
  * `"switchOn"`
  * `"switchOff"`

###### Removals

* inputsLarger.json
* emphasizeLinks.json
* linksControls.json

###### Changes

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
            <td rowspan="2">speak.json</td>
            <td><code>"label"</code></td>
            <td><code>"speakLabel"</code></td>
        </tr>
        <tr>
            <td><code>"description"</code></td>
            <td><code>"speakDescr"</code></td>
        </tr>
        <tr>
            <td rowspan="2">tableOfContents.json</td>
            <td><code>"label"</code></td>
            <td><code>"tocLabel"</code></td>
        </tr>
        <tr>
            <td><code>"description"</code></td>
            <td><code>"tocDescr"</code></td>
        </tr>
    </tbody>
</table>

## Component API Changes

### Tabs Component

The `fluid.tabs` component has been removed.

### Reorderer Component

* The `stylisticOffset` selector was no longer in use and has been removed.
