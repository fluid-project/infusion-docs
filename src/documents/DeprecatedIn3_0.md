---
title: Deprecated in 3.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that are deprecated as of Infusion 3.0.

<div class="infusion-docs-note"><strong>Note:</strong> While the intention is to provide advance notice of future
changes, the contents of this page may not be exhaustive.</div>

## Pager

### Files

The following files and all their contents are deprecated:

* src/components/pager/js/PagedTable.js
* src/components/pager/js/Table.js

### Grades

* `fluid.pagedTable`
* `fluid.table`

## Renderer

The Renderer will be completely overhauled in an upcoming release. Expect API breakage, and that all of the existing
Renderer implementation is deprecated.

<div class="infusion-docs-note">

<strong>Note:</strong> The Preferences Framework and Infusion components may also under go API breaking changes related
to these deprecations.
</div>

### Files

The following files and all their contents are deprecated:

* src/framework/renderer/js/fluidParser.js
* src/framework/renderer/js/fluidRenderer.js
* src/framework/renderer/js/RendererUtilities.js

### Functions

* `fluid.render`
* `fluid.reRender`
* `fluid.renderTemplates`
* `fluid.selfRender`

Everything in the following namespaces are deprecated:

* `fluid.renderer.*`

## Fast XML Pull

This is currently included as a 3rd party file, as it's based off of work by Michael Houghton (mike@idle.org), Raymond
Irving and David Joham (djoham@yahoo.com). However, it has been modified to be included in the `fluid` namespace. In the
future fastXmlPull.js, and included code, will be removed from all Infusion packages.

### Files

The following files and all their contents are deprecated:

* src/lib/fastXmlPull/js/fastXmlPull.js

### Functions

Everything in the following namespaces are deprecated:

* `fluid.XMLP.*`
* `fluid.SAXStrings.*`
