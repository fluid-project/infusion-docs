---
title: Deprecated in 2.0
category: Infusion
---

This page contains a list of the features, APIs, and etc. that are deprecated as of Infusion 2.0.

<div class="infusion-docs-note"><strong>Note:</strong> While the intention is to provide advance notice of future
changes, the contents of this page may not be exhaustive.</div>

## Components

<table>
    <thead>
        <tr>
            <th>Deprecated</th>
            <th>Alternative</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>fluid.progress</code></td>
            <td>
                HTML5 <a href="https://html.spec.whatwg.org/multipage/form-elements.html#the-progress-element"><code>progress</code></a>
                element
            </td>
        </tr>
    </tbody>
</table>

## Features

<table>
    <thead>
        <tr>
            <th>Deprecated</th>
            <th>Alternative</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>jQuery UI Slider version of <code>fluid.textfieldSlider</code></td>
            <td>
                Native HTML5 version of <code>fluid.textfieldSlider</code> making use of the
                <a href="https://html.spec.whatwg.org/multipage/input.html#range-state-(type%3Drange)"><code>range</code>
                input</a>
            </td>
        </tr>
        <tr>
            <td>no JavaScript version of <code>fluid.uploader</code></td>
            <td>
                See <a href="https://github.com/fluid-project/infusion/blob/infusion-2.0/src/components/uploader/html/Uploader.html#L37-L41">Infusion
                2.0</a> as an example for creating a custom fallback.
            </td>
        </tr>
    </tbody>
</table>
