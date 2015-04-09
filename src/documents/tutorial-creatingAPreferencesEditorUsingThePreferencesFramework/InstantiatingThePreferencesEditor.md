---
title: Instantiating the Preferences Editor
layout: default
category: Tutorials
---

---
Part of the [Creating a Preferences Editor Using the Preferences Framework Tutorial](CreatingAPreferencesEditorUsingThePreferencesFramework.md)

This article describes how to instantiate a preferences editor created using the Infusion [Preferences Framework](../PreferencesFramework.md)

---

## Using a Single Function Call ##

The simplest way to instantiate the Preferences Editor defined by your schemas is using the convenience function `fluid.prefs.create()`. This function uses the schemas you specify to build all the necessary components, including the Editor itself, the settings store and the enhancer and enactors. It instantiates and renders the Editor onto the page and returns the editor object.

### SeparatedPanel Editor ###

The default layout for a Preferences Editor is a separated panel, typically rendered at the top of the page and hidden until a user interaction that slides it into view. The following examples show this use, using either the `auxiliarySchema` property or an auxiliary schema grade:

#### Example: Instantiation Using `auxiliarySchema` Property ####

```javascript
var myEditor = fluid.prefs.create(".prefs-editor-container", {
    build: {
        primarySchema: myPrimarySchema,
        auxiliarySchema: myAuxiliarySchema
    }
});
```

#### Example: Instantiation Using Auxiliary Schema Grade ####

```javascript
var myEditor = fluid.prefs.create(".prefs-editor-container", {
    build: {
        gradeNames: ["my.auxSchemaGrade"],
        primarySchema: myPrimarySchema
    }
});
```

### Full-Page Editor ###

The Preferences Framework also provides built-in configurations for two full-page modes: with or without a preview. To choose one of these configurations, add a second option, as shown in the example below:

#### Sample Instantiation of a Full-page Preferences Editor with No Preview ####

```javascript
var myEditor = fluid.prefs.create(".prefs-editor-container", {
    build: {
        primarySchema: myPrimarySchema,
        auxiliaryScham: myAuxiliarySchema
    },
    prefsEditor: {
        prefsEditorType: "fluid.prefs.fullNoPreview"
    }
});
```

#### Sample Instantiation of a Full-page Preferences Editor with a Preview ####

```javascript
var myEditor = fluid.prefs.create(".prefs-editor-container", {
    build: {
        primarySchema: myPrimarySchema,
        auxiliaryScham: myAuxiliarySchema
    },
    prefsEditor: {
        prefsEditorType: "fluid.prefs.fullPreview",
        prefsEditor: {
            preview: {
                templateUrl: "html/previewTemplate.html"
            }
        }
    }
});
```

In this example, the `preview.templateUrl` options specifies the relative path and filename of an HTML template to use inside the preview iFrame.

## Using the Builder ##

You can also instantiate the Preferences Editor using a two-step process:

1. Use the Builder to build the editor, then
2. Instantiate the editor built by the builder.

The single function call described in the previous section actually carries out these two steps for you, it just conveniently hides that fact from you. If you are going to be instantiating only the settings store and the page enhancer, then you must use this two-step process, so if you're planning to write a single script that can be shared on pages that do and don't have the preferences editor, you'll want to use this process.

### Build the Editor ###

Build the editor, settings store and enhancer with a call to the Preferences Framework Builder. As with the single function call described above, the Builder can be used with either the `auxiliarySchema` property or with an auxiliary schema grade.

<div class="infusion-docs-note"><strong>Note:</strong> If you're going to use the builder, your auxiliary schema <strong>MUST</strong> specify a namespace. You'll need this namespace to access the components created by the builder.</div>

#### Example: Using the Builder with the `auxiliarySchema` Property ####

```javascript
vary myAuxiliarySchema = {
    namespace: "my.prefs",
    ...
};

fluid.prefs.builder({
    primarySchema: myPrimarySchema,
    auxiliaryScham: myAuxiliarySchema
});
```

#### Example: Using the Builder with an Auxiliary Schema Grade ####

```javascript
fluid.defaults("my.auxSchemaGrade", {
    gradeNames: ["fluid.prefs.auxSchema", "autoInit"],
    auxiliarySchema: {
        namespace: "my.prefs",
        ....
    }
});

fluid.prefs.builder({
    gradeNames: ["my.auxSchemaGrade"],
    primarySchema: myPrimarySchema
});
```

### Instantiate the Editor ###

Once you've run the builder, you can access the preferences editor through the namespace you specified in your auxiliary schema:

#### Instantiating the Default Separated Panel Editor ####

```javascript
var myEditor = my.prefs.prefsEditor(".prefs-editor-container");
```

#### Instantiating a 'Full-page with Preview' Editor ####

```javascript
var myEditor = my.prefs.prefsEditor(".prefs-editor-container", {
    prefsEditorType: "fluid.prefs.fullPreview",
    prefsEditor: {
        preview: {
            templateUrl: "html/previewTemplate.html"
        }
    }
});
```
