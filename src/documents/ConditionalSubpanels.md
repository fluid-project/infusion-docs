---
title: Conditional Subpanels
category: Infusion
---

Conditional subpanels are subpanels that are only displayed if the value of a specified boolean preference is true. This
functionality allows adjusters to be displayed or hidden based on the setting of another on/off adjuster.

The relationship between the controlling boolean preference and its dependent subpanels is defined in the panels
property of the groups block. The panels property has one required property: always, which is an array of keys defining
panels which should always be displayed. Other properties use a preference name as a key; the preference must be a
boolean preference that is in a subpanel in the 'always' list. The value is an array of panel keys that should be
displayed only if the specified preference is true.

```snippet
"panels": {
    always: [<list of subpanels to always include in this composite panel; must contain at least one>], // required
    <pref.name>: [<list of subpanels to display only when this pref is on>], // optional
    <pref.name>: [<list of subpanels to display only when this pref is on>]
    // ...,
}
```

## Notes:

* A conditional subpanel must contain **ONLY ONE** adjuster.
* A controlling preference **MUST** be a boolean.
* The `pref.name` keys **MUST** refer to a preference referenced in the `always` property.
* Not _every_ `always` panel must control a conditional subpanel.
* Panel definitions are the same for controlling subpanels, conditional subpanels and regular subpanels; there is no
  difference.

## Example: Auxiliary schema for one controlling preference with two conditional preferences

```json5
{
    "template": "html/prefsEditor.html",
    "generatePanelContainers": false,
    "message": "%messagePrefix/prefsEditor.json",
    "terms": {
        "templatePrefix": "../shared/html",
        "messagePrefix": "../shared/messages"
    },
    "groups": {
        "speakIncrease": {
            "container": ".mpe-speakIncrease",
            "template": "%templatePrefix/speakIncrease.html",
            "message": "%messagePrefix/speakIncrease.json",
            "type": "example.panels.speakIncrease",
            "panels": {
                "always": ["example.speakText", "example.increaseSize"],
                "example.speakText": ["example.volume", "example.wordsPerMinute"],
                "example.increaseSize": [
                    "example.cursorSize",
                    "example.magnification",
                    "example.magnifierPosition"
                ]
            }
        }
    }
}
```
