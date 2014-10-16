---
title: Styling the Preferences Editor
layout: default
---

---
Part of the [Creating a Preferences Editor Using the Preferences Framework Tutorial](CreatingAPreferencesEditorUsingThePreferencesFramework.md)

This article describes how to style a preferences editor created using the Infusion [Preferences Framework](../PreferencesFramework.md).

---

The Preferences Framework includes a number of CSS stylesheets that are used to control the layout and appearance of the interface. These stylesheets should be used as the basis for your styles, even if you choose to override some of the styling to make the interface match your application. All stylesheets are found in `src/framework/preferences/css`.

<table>
    <thead>
        <tr>
            <th>Filename</th>
            <th>Used by</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>PrefsEditor.css</td>
            <td>all versions</td>
        </tr>
        <tr>
            <td>SeparatedPanelPrefsEditor.css</td>
            <td>separated panel</td>
        </tr>
        <tr>
            <td>SeparatedPanelPrefsEditorFrame.css</td>
            <td>the contents of the separated panel</td>
        </tr>
        <tr>
            <td>FullPrefsEditor.css</td>
            <td>all full-page versions</td>
        </tr>
        <tr>
            <td>FullNoPreviewPrefsEditor.css</td>
            <td>all full-page, without preview</td>
        </tr>
        <tr>
            <td>FullPreviewPrefsEditor.css</td>
            <td>all full-page, with preview</td>
        </tr>
        <tr>
            <td>ie8.css</td>
            <td>pages requiring support in Internet Explorer 8</td>
        </tr>
    </tbody>
</table>
