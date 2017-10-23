---
title: Settings Store
layout: default
category: Infusion
---

The Infusion [Preferences Framework](PreferencesFramework.md) uses a _Settings Store_ to read and
write preferences.

## fluid.prefs.store

A base grade to be used by any preference setting store.
This component uses the following base [grades](ComponentGrades.md):

* [`fluid.prefs.dataSource`](#fluidprefsdatasource)
* [`fluid.contextAware`](ContextAwareness.md)

## fluid.prefs.dataSource

A grade used by `fluid.prefs.store`; defines placeholders for `get` and `set` methods.

Method Placeholder  | Description
------------------- | -----------
`get`  | For retrieving preferences. Should return the preferences
`set`  | For saving preferences. Should accept the preferences as an argument.

<div class="infusion-docs-note"><strong>Note</strong> that no particular parameters are prescribed for these methods. It is up to the developer
to choose whatever is appropriate for the particular implementation.</div>

## fluid.prefs.cookieStore

A settings store grade that uses a cookie for persistence.

<table>
    <tbody>
        <tr>
            <th>Method</th><th>Implementation</th>
        </tr>
        <tr>
            <td><code>get</code></td>
            <td><pre><code>fluid.prefs.cookieStore.get = function (cookieName)</code></pre></td>
        </tr>
        <tr>
            <td><code>set</code></td>
            <td><pre><code>fluid.prefs.cookieStore.set = function (settings, cookieOptions)</code></pre></td>
        </tr>
    </tbody>
</table>

## fluid.prefs.tempStore

A settings store mock that doesn't do persistence. This grade is useful for tests.

<table>
    <tbody>
        <tr>
            <th>Method</th><th>Implementation</th>
        </tr>
        <tr>
            <td><code>get</code></td>
            <td><code><a href="CoreAPI.md#fluididentityarg">fluid.identity</a></code></td>
        </tr>
        <tr>
            <td><code>set</code></td>
            <td><pre><code>fluid.prefs.tempStore.set = function (settings, applier)</code></pre></td>
        </tr>
    </tbody>
</table>
