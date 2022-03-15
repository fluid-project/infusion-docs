---
title: Deprecated in 4.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that are deprecated as of Infusion 4.0.

<div class="infusion-docs-note"><strong>Note:</strong> While the intention is to provide advance notice of future
changes, the contents of this page may not be exhaustive.</div>

## Core framework

The following core documented utilities are deprecated:

* `fluid.contains`
* `fluid.stableSort`
* `fluid.add`
* `fluid.accumulate`

<div class="infusion-docs-note"><strong>Note:</strong> As of Infusion 3.0, the "old Renderer" and all components
dependent on it (Table, PagedTable) were <a href="DeprecatedIn3_0.md">deprecated</a>.
These will be removed in Infusion 5.0.</div>

## Preferences Framework

In a future version of Infusion the preferences framework and UI Options will undergo a re-write and redesign. The API,
including Auxiliary Schemas, are likely to change or be removed. This is also the case for any components that are
used by/within the preferences framework.

## Components

UI widgets and other components included with Infusion will be evaluated for future releases. A number of these widgets
are no longer required as native HTML options and other tools have filled in the gaps that they were meant to address.
