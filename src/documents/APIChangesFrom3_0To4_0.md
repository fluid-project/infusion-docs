---
title: API Changes from 3.0 to 4.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that have changed in Infusion 4.0.

## Framework Changes

### Core Framework Changes

#### DataSources

The DataSource implementation was refactored around two pseudoevents `onRead` and `onWrite` as described
in the [DataSource API](DataSourceAPI.md).

An browser implementation of <code>fluid.dataSource.url</code> has been provided, based on the XMLHttpRequest API.
Previously this was only supported in node.js.

#### Fluid View

A few undocumented utilities, `fluid.dom.isContainer` and `fluid.dom.getElementText` were removed. Use the
standard browser APIs `element.contains` and `element.innerText` instead.
