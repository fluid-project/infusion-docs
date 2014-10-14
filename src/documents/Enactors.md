---
title: Enactors
layout: default
---

# Enactors #

## Overview ##

An Enactor is an [Infusion component](UnderstandingInfusionComponents.md) that "acts upon" a preference setting, making whatever adjustments that are necessary to enact the preference. There are only a few requirements for an Enactor, since its nature is determined by the preference it acts upon. For example:

* the 'text size' enactor provided by the Preferences Framework defines functions that adjust CSS on the page;
* a 'self-voicing' enactor defined for the GPII Exploration Tool defines functions that use a server-based text-to-speech engine to speak text found on the page.

Enactors defaults must include certain things:

* the `fluid.prefs.enactor` [grade](ComponentGrades.md)
* a preferences map (only when using [schemas](PrimarySchemaForPreferencesFramework.md))

Each of these is explained below.

### Grade ###

Enactors must be defined using the `fluid.prefs.enactors` [grade](ComponentGrades.md), as shown in the following code block:
```javascript
fluid.defaults("my.pref.enactor", {
    gradeNames: ["fluid.prefs.enactors", "autoInit"],
    ...
});
```

Enactors are, by default, [model components](tutorial-gettingStartedWithInfusion/ModelComponents.md) and [evented components](tutorial-gettingStartedWithInfusion/EventedComponents.md), so they automatically provides support for a model and for events. If other support is needed, other grades can be added. For example, if the enactor will be operating on the DOM, the [`fluid.viewComponent`](https://github.com/fluid-project/infusion/blob/infusion-1.5/src/framework/core/js/FluidView.js#L34-L36) grade should be used, and the `selectors` option should be provided, as shown in the following example:
```javascript
fluid.defaults("my.pref.enactor", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactors", "autoInit"],
    selectors: {
        <selectors as required>
    },
    ...
 });
```

If you are defining several enactors which share common functionality, you can create a single grade that includes that functionality and uses the `fluid.prefs.enactors` grade, then use your common grade for your enactors, as illustrated in the following code sample:
```javascript
// shared grade, defining common functionality
fluid.defaults("my.pref.enactorGrade", {
    gradeNames: ["fluid.prefs.enactors", "autoInit"],
    <common defaults>
});
 
// one specific enactor, which uses the shared grade
fluid.defaults("my.pref.enactor1", {
    gradeNames: ["my.pref.enactorGrade", "autoInit"],
    <defaults specific to enactor 1>
});
 
// another specific enactor, which uses the shared grade
fluid.defaults("my.pref.enactor2", {
    gradeNames: ["my.pref.enactorGrade", "autoInit"],
    <defaults specific to enactor 2>
});
```

### Preference Map (Schema Only) ###

_**IMPORTANT NOTE:** Preference Maps are only required if you are working with [schemas](PrimarySchemaForPreferencesFramework.md). If you are using grades instead (only necessary in rare cases), you do not need a preference map._

A Preference Map is an option that allows you to map the information in the [Primary Schema](PrimarySchemaForPreferencesFramework.md) into your Enactor. For each relevant preference defined in the primary schema, the preference map specifies where in the current component's options the value should be store. This is used to pull the default preference value into the Enactor's model, as well as any other relevant information.

The format of a preference map is shown in the follow code sample:

```javascript
preferenceMap: {
    <key from primary schema>: {
        <path in enactor's defaults where value should be held>: <key in primary schema where value held>,
        <path in enactor's defaults where value should be held>: <key in primary schema where value held>,
        ...
    },
    <key from primary schema>: {
        <path in enactor's defaults where value should be held>: <key in primary schema where value held>
    },
    ...
}
```

Typically, an enactor will work with only a single preference and will only be concerned with the default value, so the preference map will be quite simple. The following example shows the preference map used in the Preference Framework's text font enactor:

```javascript
fluid.defaults("fluid.prefs.enactors.textFont", {
    gradeNames: ["fluid.prefs.enactors.classSwapper", "autoInit"],
    preferenceMap: {
        "fluid.prefs.textFont": {
            "model.value": "default"
        }
    }
});
```

## Models and Model Changes ##

Enactors are Infusion [model components](tutorial-gettingStartedWithInfusion/ModelComponents.md): They automatically have a top-level property called `model` which holds the Enactor's internal model representing the preference it acts upon. It is not necessary for you to define this property directly; its structure will be inferred from the preferences map. If you are working with grades instead of with schemas, the model will be inferred from the rules supplied for the Panel.

## Examples ##

**Example: Enactor that calls a setter function when the model changes**
```javascript
fluid.defaults("gpii.enactor.cursorSize", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor", "autoInit"],
    preferenceMap: {
        "gpii.primarySchema.cursorSize": {
            "model.value": "default"
        }
    },
    selectors: {
        cursorDiv: ".gpiic-increaseSize-previewPerSettingCursorDiv"
    },
    invokers: {
        set: {
            funcName: "gpii.enactor.cursorSize.set",
            args: ["{that}.model.value", "{that}.dom.cursorDiv"],
            dynamic: true
        }
    },
    listeners: {
        "onCreate.init": {
            listener: "{that}.applier.modelChanged.addListener",
            args: ["value", "{that}.set"]
        }
    }
});
 
gpii.enactor.cursorSize.set = function (times, cursorDiv) {
    cursorDiv.css("font-size", times + "em");
};
```

**Example: Enactor that uses a text-to-speech server to self-voice a page**
```javascript
fluid.defaults("gpii.explorationTool.enactors.selfVoicing", {
    gradeNames: ["fluid.viewComponent", "fluid.prefs.enactor", "autoInit"],
    model: {
        value: false
    },
    listeners: {
        "afterAnnounce.next": "{that}.announceNext"
    },
    events: {
        afterAnnounce: null,
        onError: null
    },
    invokers: {
        handleSelfVoicing: {
            funcName: "gpii.explorationTool.enactors.selfVoicing.handleSelfVoicing",
            args: "{that}"
        },
        announce: {
            funcName: "gpii.explorationTool.enactors.selfVoicing.announce",
            args: ["{that}", "{arguments}.0"]
        },
        announceNext: {
            funcName: "gpii.explorationTool.enactors.selfVoicing.announceNext",
            args: "{that}"
        }
    },
    members: {
        seen: [],
        speaking: false
    },
    strings: {
        loaded: "text to speech enabled"
    },
    styles: {
        current: "fl-selfVoicing-current"
    },
 
    // Fireworks Server
    ttsUrl: "http://tts.idrc.ocadu.ca?q=%text",
 
    lang: "en"
});
```

