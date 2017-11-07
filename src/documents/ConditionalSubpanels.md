---
title: Conditional Subpanels
layout: default
category: Infusion
---

Conditional subpanels are subpanels that are only displayed if the value of a specified boolean preference is true. This functionality allows adjusters to be displayed or hidden based on the setting of another on/off adjuster.

The relationship between the controlling boolean preference and its dependent subpanels is defined in the panels property of the groups block. The panels property has one required property: always, which is an array of keys defining panels which should always be displayed. Other properties use a preference name as a key; the preference must be a boolean preference that is in a subpanel in the 'always' list. The value is an array of panel keys that should be displayed only if the specified preference is true.

```snippet
"panels": {
    always: [<list of subpanels to always include in this composite panel; must contain at least one>], // required
    <pref.name>: [<list of subpanels to display only when this pref is on>], // optional
    <pref.name>: [<list of subpanels to display only when this pref is on>]
    // ...,
}
```

**Notes:**

* A conditional subpanel must contain **ONLY ONE** adjuster.
* A controlling preference **MUST** be a boolean.
* The `pref.name` keys **MUST** refer to a preference referenced in the `always` property.
* Not _every_ `always` panel must control a conditional subpanel.
* Panel definitions are the same for controlling subpanels, conditional subpanels and regular subpanels; there is no difference.

## Examples

### Auxiliary schema for one controlling preference with two conditional preferences

```json5
{
    auxiliarySchema: {
        template: "%prefix/prefsEditor.html",
        message: "%prefix/prefsEditor.json",
        groups: {
            speaking: {
                "container": ".mpe-speaking",
                "template": "%prefix/speaking.html",
                "message": "%prefix/speaking.json",
                "type": "demo.panels.speaking",
                "panels": {
                    // the 'speak' subpanel will always be displayed
                    "always": ["speak"],
                    // the volume and words-per-minute subpanels will only display when 'speak' is true
                    "demo.speakText": ["vol", "wpm"]
                }
            }
        },
        speak: {
            type: "demo.speakText",
            enactor: {
                type: "demo.enactors.speak"
            },
            panel: {
                type: "demo.panels.speak",
                container: ".mpe-speaking-onOff",
                template: "%prefix/speak-template.html"
            }
        },
        vol: {
            type: "demo.volume",
            enactor: {
                type: "demo.enactors.vol"
            },
            panel: {
                type: "demo.panels.vol",
                container: ".mpe-speaking-vol",
                template: "%prefix/slider-template.html"
            }
        },
        wpm: {
            type: "demo.wordsPerMinute",
            enactor: {
                type: "demo.enactors.wpm"
            },
            panel: {
                type: "demo.panels.wpm",
                container: ".mpe-speaking-wpm",
                template: "%prefix/slider-template.html"
            }
        }
    }
}
```
