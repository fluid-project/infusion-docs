---
title: Deprecated in 3.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that are deprecated as of Infusion 3.0.

<div class="infusion-docs-note"><strong>Note:</strong> While the intention is to provide advance notice of future
changes, the contents of this page may not be exhaustive.</div>

## Core Framework

### ResourceLoader

The use of the `href` field in a `ResourceSpec` structure has been deprecated in this release and will be removed in
Infusion 4.0. Use the `url` field instead.

### Component options

Modifying component options by direct assignment (e.g. with `that.options.key = value`) has been deprecated and will not
be supported in Infusion 4.0. Component options will be immutable after component construction.

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

## Bundles

### Files

The following bundles are no longer produced as part of the build process:

* dist/infusion-all-no-jquery.min.js
* dist/infusion-all-no-jquery.min.js.map
* dist/infusion-all.min.js
* dist/infusion-all.min.js.map
* dist/infusion-framework-no-jquery.min.js
* dist/infusion-framework-no-jquery.min.js.map
* dist/infusion-framework.min.js
* dist/infusion-framework.min.js.map
* dist/infusion-uio-no-jquery.min.js
* dist/infusion-uio-no-jquery.min.js.map
* dist/infusion-uio.min.js
* dist/infusion-uio.min.js.map

We only produce minified javascript bundles now, so if you previously used one of the above minified files, you
can simply update the relative path/filename to remove the `min`, i.e. `dist/infusion-all.js`.
