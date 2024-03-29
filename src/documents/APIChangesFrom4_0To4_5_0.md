---
title: API Changes from 4.0 to 4.5.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 4.5.0.

## Framework Changes

### Core Framework Changes

#### Improve Framework Error Messages

Framework error messages display readable component structure.

### Preferences Framework / UI Options (UIO)

#### Style Influence from Hosting Site

In Infusion 4.5.0, UI Options is no longer displayed in a separate iframe. It's now rendered as a section in the
current page. This change make it possible that the style of the hosting site may affect the style of UI Options. The
solution is to use [CSS specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity) to override the css
from the hosting site on affected elements in UI Options.

#### Template Changes

Remove the css selector `flc-prefsEditor-iframe` from the UI Options template.

### UI Options Template In Infusion 4.0

```html
<body>
    <!-- BEGIN markup for Preference Editor -->
    <section class="flc-prefsEditor-separatedPanel fl-prefsEditor-separatedPanel">
        <!--
            This div is for the sliding panel bar that shows and hides the Preference Editor controls in the mobile view.
            A separate panel bar for mobile displays is needed to preserve the correct tab order.
        -->
        <div class="fl-panelBar fl-panelBar-smallScreen">
            <span class="fl-prefsEditor-buttons">
                <button class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide"> Show/Hide</button>
                <button class="flc-prefsEditor-reset fl-prefsEditor-reset"><span class="fl-icon-undo"></span> Reset</button>
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
                <button class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide"> Show/Hide</button>
                <button class="flc-prefsEditor-reset fl-prefsEditor-reset"><span class="fl-icon-undo"></span> Reset</button>
            </span>
        </div>
    </section>
    <!-- END markup for Preference Editor -->


    <!-- the rest of your page here -->
    <h1>My Website</h1>
</body>
```

### UI Options Template in Infusion 4.5

Remove the css selector `flc-prefsEditor-iframe` from the div that will contain the Preference Editor component.

```html
<body>
    <!-- BEGIN markup for Preference Editor -->
    <section class="flc-prefsEditor-separatedPanel fl-prefsEditor-separatedPanel">
        <!--
            This div is for the sliding panel bar that shows and hides the Preference Editor controls in the mobile view.
            A separate panel bar for mobile displays is needed to preserve the correct tab order.
        -->
        <div class="fl-panelBar fl-panelBar-smallScreen">
            <span class="fl-prefsEditor-buttons">
                <button class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide"> Show/Hide</button>
                <button class="flc-prefsEditor-reset fl-prefsEditor-reset"><span class="fl-icon-undo"></span> Reset</button>
            </span>
        </div>

        <!-- This is the div that will contain the Preference Editor component -->
        <div class="flc-slidingPanel-panel"></div>

        <!--
            This div is for the sliding panel bar that shows and hides the Preference Editor controls in the desktop view.
            A separate panel bar for desktop displays is needed to preserve the correct tab order.
        -->
        <div class="fl-panelBar fl-panelBar-wideScreen">
            <span class="fl-prefsEditor-buttons">
                <button class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide"> Show/Hide</button>
                <button class="flc-prefsEditor-reset fl-prefsEditor-reset"><span class="fl-icon-undo"></span> Reset</button>
            </span>
        </div>
    </section>
    <!-- END markup for Preference Editor -->


    <!-- the rest of your page here -->
    <h1>My Website</h1>
</body>
```
