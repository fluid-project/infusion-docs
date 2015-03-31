---
title: Creating an Auxiliary Schema
layout: default
---

---
Part of the [Creating a Preferences Editor Using the Preferences Framework Tutorial](CreatingAPreferencesEditorUsingThePreferencesFramework.md)

This article describes how to use the Infusion [Preferences Framework](../PreferencesFramework.md)
to create an [Auxiliary Schema](../AuxiliarySchemaForPreferencesFramework.md), a JSON document that defines how panels are combined in a preferences editor.

---

The auxiliary schema defines the panels and enactors to be used for the preferences defined in the primary schema.

An auxiliary schema includes two parts:

1. Several [top-level members](../AuxiliarySchemaForPreferencesFramework.md#top-level-properties), defining globally-used values, and
2. [One object per preference](../AuxiliarySchemaForPreferencesFramework.md#preference-block-properties), defining the specific requirements for that preference.

For detailed information about what members are required and permitted in an auxilliary schema, see [Auxiliary Schema for Preferences Framework](../AuxiliarySchemaForPreferencesFramework.md).

## Example: UI Options Preferences ##

The following example shows the auxiliary schema that would be used for the preferences defined in the [primary schema example](CreatingAPrimarySchema.md#example-selected-ui-options-preferences).

```javascript
fluid.defaults("fluid.prefs.auxSchema.starter", {
    gradeNames: ["fluid.prefs.auxSchema", "autoInit"],
    auxiliarySchema: {
        // The global values:
        "namespace": "fluid.prefs.constructed",
        "templatePrefix": "../../../framework/preferences/html/", // The common path to settings panel templates
        "template": "%prefix/SeparatedPanelPrefsEditor.html",
        "messagePrefix": "../../../framework/preferences/messages/",
        "message": "%prefix/prefsEditor.json",

        // The preference-specific information:
        "lineSpace": {
            "type": "fluid.prefs.lineSpace",
            "enactor": {
                "type": "fluid.prefs.enactor.lineSpace",
                "fontSizeMap": {
                    "xx-small": "9px",
                    "x-small": "11px",
                    "small": "13px",
                    "medium": "15px",
                    "large": "18px",
                    "x-large": "23px",
                    "xx-large": "30px"
                }
            },
            "panel": {
                "type": "fluid.prefs.panels.lineSpace",
                "container": ".flc-prefsEditor-line-space",  // the css selector in the template where the panel is rendered
                "template": "%prefix/PrefsEditorTemplate-lineSpace.html",
                "message": "%prefix/lineSpace.json"
            }
        },
        "textFont": {
            "type": "fluid.prefs.textFont",
            "classes": {
                "": "",
                "Times New Roman": "fl-font-uio-times",
                "Comic Sans": "fl-font-uio-comic-sans",
                "Arial": "fl-font-uio-arial",
                "Verdana": "fl-font-uio-verdana"
            },
            "enactor": {
                "type": "fluid.prefs.enactor.textFont",
                "classes": "@textFont.classes"
            },
            "panel": {
                "type": "fluid.prefs.panels.textFont",
                "container": ".flc-prefsEditor-text-font",  // the css selector in the template where the panel is rendered
                "classnameMap": {"textFont": "@textFont.classes"},
                "template": "%prefix/PrefsEditorTemplate-textFont.html",
                "message": "%prefix/textFont.json"
            }
        },
        "tableOfContents": {
            "type": "fluid.prefs.tableOfContents",
            "enactor": {
                "type": "fluid.prefs.enactor.tableOfContents",
                "tocTemplate": "../../../components/tableOfContents/html/TableOfContents.html"
            },
            "panel": {
                "type": "fluid.prefs.panels.layoutControls",
                "container": ".flc-prefsEditor-layout-controls",  // the css selector in the template where the panel is rendered
                "template": "%prefix/PrefsEditorTemplate-layout.html",
                "message": "%prefix/tableOfContents.json"
            }
        }
    }
});
```

## Example: Video Player Captions and Transcripts Preferences ##

The following example shows the auxiliary schema that would be used by the Video Player to add extra panels to Preferences Editor for the preferences defined in the [primary schema example](CreatingAPrimarySchema.md#example-video-player-extra-preferences).

```javascript
fluid.videoPlayer.auxSchema = {
    "namespace": "fluid.prefs.vp",
    "template": "../html/SeparatedPanelPrefsEditor.html",
    "templatePrefix": "../lib/infusion/framework/preferences/html/",
    "messagePrefix": "../lib/infusion/framework/preferences/messages/",
    captions: {
        type: "fluid.videoPlayer.captions",
        panel: {
            type: "fluid.videoPlayer.panels.captionsSettings",
            container: ".flc-prefsEditor-captions-settings",
            template: "../html/MediaPanelTemplate.html",
            message: "../messages/captions.json"
        }
    },
    captionLanguage: {
        type: "fluid.videoPlayer.captionLanguage",
        panel: {
            type: "fluid.videoPlayer.panels.captionsSettings"
        }
    }
    transcripts: {
        type: "fluid.videoPlayer.transcripts",
        panel: {
            type: "fluid.videoPlayer.panels.transcriptsSettings",
            container: ".flc-prefsEditor-transcripts-settings",
            template: "../html/MediaPanelTemplate.html",
            message: "../messages/transcripts.json"
        }
    },
    transcriptLanguage: {
        type: "fluid.videoPlayer.transcriptLanguage",
        panel: {
            type: "fluid.videoPlayer.panels.transcriptsSettings"
        }
    }
};
```
