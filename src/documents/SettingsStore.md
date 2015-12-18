---
title: Settings Store
layout: default
category: Infusion
---

_DRAFT; still in progress_

The Infusion [Preferences Framework](PreferencesFramework.md) uses a _Settings Store_ to read and
write preferences.

## fluid.prefs.dataSource ##

A grade used by `fluid.prefs.store`; defines placeholders for `get` and `set` methods.

Method Placeholder  | Description
------------------- | -----------
`get`  | For retrieving preferences. Should return the preferences
`set`  | For saving preferences. Should accept the preferences as an argument.


## fluid.prefs.store ##

A base grade to be used by any preference setting store.

## fluid.prefs.cookieStore ##

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

## fluid.prefs.tempStore ##

A settings store mock that doesn't do persistence.

<table>
    <tbody>
        <tr>
            <th>Method</th><th>Implementation</th>
        </tr>
        <tr>
            <td><code>get</code></td>
            <td><code>[fluid.identity](CoreAPI.md#fluid-identity-arg-)</code></td>
        </tr>
        <tr>
            <td><code>set</code></td>
            <td><pre><code>fluid.prefs.tempStore.set = function (settings, applier)</code></pre></td>
        </tr>
    </tbody>
</table>

