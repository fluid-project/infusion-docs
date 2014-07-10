# UI Options 1.5 Migration #


This page will walk you through the process of upgrading your existing 1.4 UI Options implementation to the new 1.5 version. This tutorial assumes that:

* you are already familiar with HTML, Javascript and CSS
* you are familiar with what UI Options is and does
* you have an existing implementation that makes use of UI Options and worked with the 1.4 Infusion release.
* you are using the default classes

## Dependency Changes ##

### In 1.5 ###

#### CSS Files ####

```html
<link rel="stylesheet" type="text/css" href="../../framework/fss/css/fss-reset-global.css" />
<link rel="stylesheet" type="text/css" href="../../framework/fss/css/fss-base-global.css" />
<link rel="stylesheet" type="text/css" href="../../framework/fss/css/fss-layout.css" />
<link rel="stylesheet" type="text/css" href="../../framework/fss/css/fss-text.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/fss/fss-theme-bw-prefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/fss/fss-theme-wb-prefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/fss/fss-theme-by-prefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/fss/fss-theme-yb-prefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/fss/fss-theme-lgdg-prefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/fss/fss-theme-dglg-prefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/fss/fss-text-prefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../lib/jquery/ui/css/fl-theme-by/by.css" />
<link rel="stylesheet" type="text/css" href="../../lib/jquery/ui/css/fl-theme-yb/yb.css" />
<link rel="stylesheet" type="text/css" href="../../lib/jquery/ui/css/fl-theme-bw/bw.css" />
<link rel="stylesheet" type="text/css" href="../../lib/jquery/ui/css/fl-theme-wb/wb.css" />
<link rel="stylesheet" type="text/css" href="../../lib/jquery/ui/css/fl-theme-lgdg/lgdg.css" />
<link rel="stylesheet" type="text/css" href="../../lib/jquery/ui/css/fl-theme-dglg/dglg.css" />

<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/PrefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../framework/preferences/css/SeparatedPanelPrefsEditor.css" />
<link rel="stylesheet" type="text/css" href="../../components/overviewPanel/css/OverviewPanel.css" />
```

#### JS Files ####

```html
<script type="text/javascript" src="../../lib/jquery/core/js/jquery.js"></script>
<script type="text/javascript" src="../../lib/jquery/ui/js/jquery.ui.core.js"></script>
<script type="text/javascript" src="../../lib/jquery/ui/js/jquery.ui.widget.js"></script>
<script type="text/javascript" src="../../lib/jquery/ui/js/jquery.ui.mouse.js"></script>
<script type="text/javascript" src="../../lib/jquery/ui/js/jquery.ui.slider.js"></script>
<script type="text/javascript" src="../../lib/json/js/json2.js"></script>

<script type="text/javascript" src="../../framework/core/js/FluidDocument.js"></script>
<script type="text/javascript" src="../../framework/core/js/jquery.keyboard-a11y.js"></script>
<script type="text/javascript" src="../../framework/core/js/Fluid.js"></script>
<script type="text/javascript" src="../../framework/core/js/FluidRequests.js"></script>
<script type="text/javascript" src="../../framework/core/js/FluidDOMUtilities.js"></script>
<script type="text/javascript" src="../../framework/core/js/FluidIoC.js"></script>
<script type="text/javascript" src="../../framework/core/js/DataBinding.js"></script>
<script type="text/javascript" src="../../framework/core/js/FluidView.js"></script>
<script type="text/javascript" src="../../lib/fastXmlPull/js/fastXmlPull.js"></script>
<script type="text/javascript" src="../../framework/renderer/js/fluidParser.js"></script>
<script type="text/javascript" src="../../framework/renderer/js/fluidRenderer.js"></script>
<script type="text/javascript" src="../../framework/renderer/js/RendererUtilities.js"></script>

<script type="text/javascript" src="../../framework/preferences/js/URLUtilities.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/Store.js"></script>
<script type="text/javascript" src="../../components/textfieldSlider/js/TextfieldSlider.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/UIEnhancer.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/PrefsEditor.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/Panels.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/ModelRelay.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/Enactors.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/SeparatedPanelPrefsEditor.js"></script>
<script type="text/javascript" src="../../components/slidingPanel/js/SlidingPanel.js"></script>
<script type="text/javascript" src="../../components/tableOfContents/js/TableOfContents.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/PrimaryBuilder.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/AuxBuilder.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/StarterSchemas.js"></script>
<script type="text/javascript" src="../../framework/preferences/js/Builder.js"></script>
<script type="text/javascript" src="../../components/uiOptions/js/UIOptions.js"></script>
```

### In 1.4 ###

#### Theme Files ####

```html
<link rel="stylesheet" type="text/css" href="../../../framework/fss/css/fss-reset-global.css" />
<link rel="stylesheet" type="text/css" href="../../../framework/fss/css/fss-base-global.css" />
<link rel="stylesheet" type="text/css" href="../../../framework/fss/css/fss-layout.css" />
<link rel="stylesheet" type="text/css" href="../../../framework/fss/css/fss-text.css" />
<link rel="stylesheet" type="text/css" href="../../../components/uiOptions/css/fss/fss-theme-bw-uio.css" />
<link rel="stylesheet" type="text/css" href="../../../components/uiOptions/css/fss/fss-theme-wb-uio.css" />
<link rel="stylesheet" type="text/css" href="../../../components/uiOptions/css/fss/fss-theme-by-uio.css" />
<link rel="stylesheet" type="text/css" href="../../../components/uiOptions/css/fss/fss-theme-yb-uio.css" />
<link rel="stylesheet" type="text/css" href="../../../components/uiOptions/css/fss/fss-text-uio.css" />
<link rel="stylesheet" type="text/css" href="../../../lib/jquery/ui/css/fl-theme-by/by.css" />
<link rel="stylesheet" type="text/css" href="../../../lib/jquery/ui/css/fl-theme-yb/yb.css" />
<link rel="stylesheet" type="text/css" href="../../../lib/jquery/ui/css/fl-theme-bw/bw.css" />
<link rel="stylesheet" type="text/css" href="../../../lib/jquery/ui/css/fl-theme-wb/wb.css" />

<link rel="stylesheet" type="text/css" href="../../../components/uiOptions/css/UIOptions.css" />
<link rel="stylesheet" type="text/css" href="../../../components/uiOptions/css/FatPanelUIOptions.css" />
```

#### JS Files ####

```html
<script type="text/javascript" src="../../../lib/jquery/core/js/jquery.js"></script>
<script type="text/javascript" src="../../../lib/jquery/ui/js/jquery.ui.core.js"></script>
<script type="text/javascript" src="../../../lib/json/js/json2.js"></script>

<script type="text/javascript" src="../../../framework/core/js/FluidDocument.js"></script>
<script type="text/javascript" src="../../../framework/core/js/jquery.keyboard-a11y.js"></script>
<script type="text/javascript" src="../../../framework/core/js/Fluid.js"></script>
<script type="text/javascript" src="../../../framework/core/js/FluidRequests.js"></script>
<script type="text/javascript" src="../../../framework/core/js/FluidDOMUtilities.js"></script>
<script type="text/javascript" src="../../../framework/core/js/DataBinding.js"></script>
<script type="text/javascript" src="../../../framework/core/js/FluidIoC.js"></script>
<script type="text/javascript" src="../../../lib/fastXmlPull/js/fastXmlPull.js"></script>
<script type="text/javascript" src="../../../framework/renderer/js/fluidParser.js"></script>
<script type="text/javascript" src="../../../framework/renderer/js/fluidRenderer.js"></script>
<script type="text/javascript" src="../../../framework/renderer/js/RendererUtilities.js"></script>

<script type="text/javascript" src="../../../components/uiOptions/js/URLUtilities.js"></script>
<script type="text/javascript" src="../../../components/uiOptions/js/Store.js"></script>
<script type="text/javascript" src="../../../components/uiOptions/js/UIOptions.js"></script>
<script type="text/javascript" src="../../../components/uiOptions/js/UIEnhancer.js"></script>
<script type="text/javascript" src="../../../components/uiOptions/js/FatPanelUIOptions.js"></script>
<script type="text/javascript" src="../../../components/uiOptions/js/SlidingPanel.js"></script>
<script type="text/javascript" src="../../../components/tableOfContents/js/TableOfContents.js"></script>
```

## Instantiation Changes ##

### In 1.5 ###

```javascript
fluid.uiOptions.prefsEditor("container", {
    templatePrefix: "pathToTemplates",
    messagePrefix: "pathToMessages",
    tocTemplate: "pathToTemplate"
});
```

_**NOTE:** If you'd like to provide a custom theme to use as the default theme, you should use the [Preferences Framework](PreferencesFramework.md) instead_

### In 1.4 ###

```javascript
fluid.pageEnhancer({
    tocTemplate: "pathToTocTemplate"
});

fluid.uiOptions.fatPanel("container", {
    prefix: "pathToTemplates"
});
```
