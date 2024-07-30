---
title: Pager 1.5 Migration
category: Infusion
---

This page will walk you through the process of upgrading your existing 1.4 Pager component implementation to the new 1.5
version. This tutorial assumes that:

* you are already familiar with HTML, Javascript and CSS
* you are familiar with what the Pager component is and does
* you have an existing implementation that makes use of the Pager and worked with the 1.4 Infusion release.

## Dependency Changes

<div class="infusion-docs-note"><strong>Note:</strong> actual paths may vary, as they are dependent on the location of
infusion.</div>

### In 1.5

#### CSS Files

```html
<link rel="stylesheet" type="text/css" href="infusion/framework/fss/css/fss-reset-global.css" />
<link rel="stylesheet" type="text/css" href="infusion/framework/fss/css/fss-base-global.css" />
<link rel="stylesheet" type="text/css" href="infusion/framework/fss/css/fss-layout.css" />
<link rel="stylesheet" type="text/css" href="infusion/lib/jquery/ui/css/default-theme/jquery.ui.theme.css" />

<link rel="stylesheet" type="text/css" href="infusion/components/pager/css/Pager.css" />
```

#### JS Files

##### Using the infusion-all bundle

```html
<script type="text/javascript" src="infusion/infusion-all.js"></script>
```

##### Using the individual files

```html
<script type="text/javascript" src="infusion/lib/jquery/core/js/jquery.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/ui/js/jquery.ui.core.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/ui/js/jquery.ui.widget.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/ui/js/jquery.ui.position.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/ui/js/jquery.ui.tooltip.js"></script>
<script type="text/javascript" src="infusion/lib/json/js/json2.js"></script>

<script type="text/javascript" src="infusion/framework/core/js/Fluid.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidDOMUtilities.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidDocument.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/jquery.keyboard-a11y.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidIoC.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/ModelTransformation.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/ModelTransformationTransforms.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/DataBinding.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidRequests.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidView.js"></script>
<script type="text/javascript" src="infusion/lib/fastXmlPull/js/fastXmlPull.js"></script>
<script type="text/javascript" src="infusion/framework/renderer/js/fluidParser.js"></script>
<script type="text/javascript" src="infusion/framework/renderer/js/fluidRenderer.js"></script>
<script type="text/javascript" src="infusion/framework/renderer/js/RendererUtilities.js"></script>

<script type="text/javascript" src="infusion/components/tooltip/js/Tooltip.js"></script>
<script type="text/javascript" src="infusion/components/pager/js/Pager.js"></script>
<script type="text/javascript" src="infusion/components/pager/js/Table.js"></script>
<script type="text/javascript" src="infusion/components/pager/js/PagedTable.js"></script>
```

### In 1.4

#### CSS Files

```html
<link rel="stylesheet" type="text/css" href="infusion/framework/fss/css/fss-reset-global.css" />
<link rel="stylesheet" type="text/css" href="infusion/framework/fss/css/fss-base-global.css" />
<link rel="stylesheet" type="text/css" href="infusion/framework/fss/css/fss-layout.css" />
<link rel="stylesheet" type="text/css" href="infusion/lib/jquery/plugins/tooltip/css/jquery.tooltip.css" media="all" />
<link rel="stylesheet" type="text/css" href="infusion/lib/jquery/ui/css/default-theme/jquery.ui.theme.css" />

<link rel="stylesheet" type="text/css" href="infusion/components/pager/css/Pager.css" />
```

#### JS Files

(For 1.4, the Pager was not IoC-enabled and had a single unfactored implementation file)

```html
<script type="text/javascript" src="infusion/lib/jquery/core/js/jquery.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/ui/js/jquery.ui.core.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/ui/js/jquery.ui.widget.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/ui/js/jquery.ui.position.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/plugins/bgiframe/js/jquery.bgiframe.js"></script>
<script type="text/javascript" src="infusion/lib/jquery/plugins/tooltip/js/jquery.ui.tooltip.js"></script>
<script type="text/javascript" src="infusion/lib/json/js/json2.js"></script>

<script type="text/javascript" src="infusion/framework/core/js/Fluid.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidDOMUtilities.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidDocument.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/jquery.keyboard-a11y.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/DataBinding.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidRequests.js"></script>
<script type="text/javascript" src="infusion/framework/core/js/FluidView.js"></script>
<script type="text/javascript" src="infusion/lib/fastXmlPull/js/fastXmlPull.js"></script>
<script type="text/javascript" src="infusion/framework/renderer/js/fluidParser.js"></script>
<script type="text/javascript" src="infusion/framework/renderer/js/fluidRenderer.js"></script>

<script type="text/javascript" src="infusion/components/tooltip/js/Tooltip.js"></script>
<script type="text/javascript" src="infusion/components/pager/js/Pager.js"></script>
```

## Instantiation Changes

### In 1.5

These configuration blocks show how a minimal configuration of the Pager has changed between the versions. Numerous
other configuration options are of course supported as listed in the API documentation.

```javascript
fluid.pagedTable("container", {
    dataModel: {
        // ...
    },
    columnDefs: {
        // ...
    },
    components: {
        bodyRenderer: {
            options: {
                selectors: {
                    // ...
                }
            }
        }
    }
});

```

### In 1.4

```javascript
fluid.pager("container", {
    dataModel: {
        // ...
    },
    columnDefs: {
        // ...
    },
    bodyRenderer: {
        options: {
            selectors: {
                // ...
            }
        }
    }
});
```

### General configuration changes

* Every "pseudocomponent" attached to the Pager (e.g. pagerBar, summary, pageSize) etc. is now a genuine IoC-configured
  component, and should have its options entered in the `components` area rather than at top level as before
* The single monolithic component `Pager` has been factored into 3 components, plain `Pager` which now just has
  responsibility for paging, `Table` which renders tabular data, and a new top-level grade `pagedTable` which
  orchestrates the two factored grades `Pager` and `Table` into an integrated solution. As a result of this, many type
  names have moved into a new namespace, either `fluid.table` or `fluid.pagedTable` depending on their functionality.
* The user is recommended to configure the rendering components (`fluid.table.selfRender`,
  `fluid.pager.renderedPageList`) using selectors to bind onto markup rather than use the old-fashioned markup pollution
  based on the special attribute `rsf:id`).
* The duplicate component `pagerBarSecondary` has been removed and `pagerBar` is instead initialised as a standard
  IoC-driven *dynamic component* which will create as many pager bars as there are matching elements in the markup

### Change in type names

The following table shows the changes in the type names of 1.4 components moving to 1.5 (remember that when used, these
must also be housed in the `components` block of the parent component, rather than appearing at top level as before):

|1.4 type name|1.5 type name|
| --- | --- |
|fluid.pager.pagerBar|fluid.pager.pagerBar|
|fluid.pager.summary|fluid.pager.summary|
|fluid.pager.directPageSize|fluid.pager.directPageSize|
|fluid.pager.directPageList|fluid.pager.directPageList|
|fluid.pager.renderedPageList|fluid.pager.renderedPageList|
|fluid.pager.selfRender|fluid.table.selfRender|
|fluid.pager.rangeAnnotator|fluid.pagedTable.rangeAnnotator|

Note that the Pager Component remains in "Sneak Peek" mode for the 1.5 release and its API is not expected to be stable.
Please get in touch with the Infusion team on Chat or the mailing lists (see
[Get Involved](https://fluidproject.atlassian.net/wiki/spaces/fluid/pages/11547481/Get+Involved)) if you
are contemplating any non-trivial usage.
