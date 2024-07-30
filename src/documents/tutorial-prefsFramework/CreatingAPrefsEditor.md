---
title: Creating a Preferences Editor
category: Tutorials
---

This tutorial will walk you through the process of building a Preference Editor using the
Infusion [Preferences Framework](../PreferencesFramework.md).

<div class="infusion-docs-note"><strong>Note:</strong> This tutorial is not yet complete.
Where more information is still to come, this will be clearly noted.</div>

## Introduction

A Preferences Editor is a web application that supports the creation and modification of a user's preferred settings for
a device or application. In this tutorial, we'll look at a functional – but very simple – Preference Editor and explain
how it works. From there, we’ll learn about more features of the Preferences Framework by adding functionality to the
Editor.

Throughout this tutorial, you’ll find links into the documentation for various parts of Infusion and the Preferences
Framework. You shouldn’t need to visit these links to follow the tutorial; they’re there in case you’re interested in
reading more about something.

### Example code

The source code used in this tutorial is one of the examples provided in the Infusion code base, which you can download
from github: [https://github.com/fluid-project/infusion](https://github.com/fluid-project/infusion). You’ll find the
code for the simple Preference Editor in the examples folder:
[https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor](https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor).
We recommend you download the Infusion library and load the example code into your favourite editor.

<figure>
    <img src="/images/prefsEditorFolders.png" alt="the folder hierarchy of the sample code">
    <figcaption>Figure 1: Folder hierarchy for the Preference Editor example</figcaption>
</figure>

Your company, Awesome Cars, has created the world’s first flying car. The example code is a Preference Editor for the
car. If you run a local webserver (for example using [this
approach](https://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python), or using
[MAMP](https://www.mamp.info/en/)) and navigate to the `index.html` file in a browser, you should see this interface:

<figure id="figure2">
    <img src="/images/simplePrefsEditor.png" alt="The screen of the example Preference Editor">
    <figcaption>Figure 2: The screen of the example Preference Editor</figcaption>
</figure>

This Preference Editor has only one preference – a simple boolean setting for the car’s heated seats feature – and a
Save button. Try it out: If you check the checkbox and click save, the state of the preference will be stored in a
cookie, and when you reload the page, the checkbox will be set to the saved value. Go ahead, try it.

Let’s talk about what we’re seeing in this interface:

<figure>
    <img src="/images/prefsEditorParts.png" alt="The parts of a Preference Editor screen">
    <figcaption>Figure 3: The parts of a Preference Editor screen</figcaption>
</figure>

* This Editor is a full-page editor, so all of what you see is Preferences Editor (the outer, blue dashed line).
* The content inside the rectangle (outlined with a green dashed line) is called a Panel – a container representing one
  (or more) preferences. This particular Editor has only one Panel, but a realistic Editor will likely have several.
  This tutorial will teach you what you need to know to add more Panels to this Editor.
* Inside the Panel is an Adjuster (outlined by the inner-most, orange dashed line) – the controls for adjusting a
  particular preference. This Panel has only one Adjuster in it, but you might want to create a Panel that has multiple
  Adjusters, say, in the case of very closely-related preferences.  This tutorial will teach you about creating Panels
  with multiple Adjusters.

Let’s take a close look at the code.

#### Primary Schema

The [Primary Schema](../PrimarySchemaForPreferencesFramework.md) is a document that defines the preferences for the
Editor. The Primary Schema for our example Editor is defined in the `schemas/primary.js` file using the JSON schema
format (you can learn about JSON schemas at <https://json-schema.org/>):

```javascript
/**
 * Primary Schema
 * This schema defines the "heated seats" preference edited by this preferences
 * editor: its name, type, default value, etc.
 */
fluid.defaults("awesomeCars.prefs.schemas.heatedSeats", {

    // the base grade for the schema;
    // using this grade tells the framework that this is a primary schema
    gradeNames: ["fluid.prefs.schemas"],

    schema: {
        // the actual specification of the preference
        "awesomeCars.prefs.heatedSeats": {
            "type": "boolean",
            "default": false
        }
    }
});
```

In this code snippet, the Primary Schema is created using a call to the Infusion Framework function `fluid.defaults().`

<aside class="infusion-docs-callout">

`fluid.defaults()` is one of the core functions in Infusion: It is used to create
[components](../UnderstandingInfusionComponents.md) (the building blocks of any Infusion application) and register
them with the Framework.
</aside>

`fluid.defaults()` accepts two arguments:

1. a string name, and
2. a JavaScript object containing [options for configuring](../ComponentConfigurationOptions.md) the component.

In the code snippet above, the first argument – the name – is `“awesomeCars.prefs.schemas.heatedSeats”`. The second
argument – the options – is an object containing (in this case) two properties: `gradeNames` and `schema`:

<dl>
    <dt>

`gradeNames`
    </dt>
    <dd>

Almost every call to `fluid.defaults()` includes the `gradeNames` property in the options argument. This
property defines the base _[grade](../ComponentGrades.md)_ for the component.
        <aside class="infusion-docs-callout">

A **grade** is _very loosely_ analogous to a class, in that the properties of the component are derived from the
elements in the grade document. It’s actually a bit more complex than that; later, you’ll probably want to read the
documentation about [Component Grades](../ComponentGrades.md). This tutorial will explain more about grades as it
goes along.
        </aside>
In a Primary Schema, the `gradeNames` property must include the grade `“fluid.prefs.schemas”`, which is defined by the
Preferences Framework. **Using this particular grade is what registers this component as a Primary Schema with the
Framework.** The Framework will automatically record this fact and use this Primary Schema with your Preference Editor.
    </dd>
    <dt>

`schema`
    </dt>
    <dd>
        This property is the actual JSON definition of the preferences for this Preference Editor.
    </dd>
</dl>

In this particular example, only a single preference is being defined; a boolean called
`“awesomeCars.prefs.heatedSeats”`:

```json5
{
    "awesomeCars.prefs.heatedSeats": {
        "type": "boolean",
        "default": false
    }
}
```

The key in the JSON definition is the name of the preference. This name will be used throughout the Preferences
Framework to associate all the components related to the setting. The name can be anything, so long as it is used
consistently, but keep in mind that it will be used in the persistent storage for the user's preference, and will be
shared with other technologies that may wish to define enactors to respond to it. We recommend that it be thoughtfully
namespaced and human-understandable.

The value is an object containing the properties of the preference. Every preference in a Primary Schema must have at
least two properties: `“type”` and `“default”`.  _Coming soon: More information about these two properties._

#### Panel

A [Panel](../Panels.md) is a [component](../UnderstandingInfusionComponents.md) responsible for rendering the user
interface controls for a preference and tying them to the internal model that represents the preference value. The Panel
for the heated seats preference control is defined in the `prefsEditor.js` file:

<aside class="infusion-docs-callout">

[Components](../UnderstandingInfusionComponents.md) are the core building-blocks of any Infusion application. An
Infusion component can represent a visible component on screen, a collection of related functionality (such as an
object, as in object-orientation), or simply a unit of work or relationship between other components.
</aside>

```javascript
/**
 * Panel for the heated seats preference
 */
fluid.defaults("awesomeCars.prefs.panels.heatedSeats", {
    gradeNames: ["fluid.prefs.panel"],

    // the Preference Map maps the information in the primary schema to this panel
    preferenceMap: {
        // the key must match the name of the pref in the primary schema
        "awesomeCars.prefs.heatedSeats": {
            // this key, "model.heatedSeats", is the path into the panel's model
            // where this preference is stored
            "model.heatedSeats": "value"
        }
    },

    // selectors identify elements in the DOM that need to be accessed by the code;
    // in this case, the Renderer will render data into these particular elements
    selectors: {
        heatedSeats: ".awec-heatedSeats"
    },

    // the ProtoTree is basically instructions to the Renderer
    // the keys in the protoTree match the selectors above
    protoTree: {
        // "${heatedSeats}" is a reference to the last part of the model path in the preferenceMap
        heatedSeats: "${heatedSeats}"
    }
});
```

In this code snippet, the Panel is created using a call to the Infusion Framework function
`fluid.defaults()`, just as the Primary Schema was. As with the Primary Schema, the call to
`fluid.defaults()` is passed two arguments:

1. a string name (`"awesomeCars.prefs.panels.heatedSeats"`), and
2. a JavaScript object containing options for configuring the component – in this case, the Panel.

The screenshot in [Figure 2 (above)](#figure2) shows what the Panel looks like to the user: A single checkbox
and label, with a header above. The options for configuring this Panel
include four properties: `gradeNames`, `preferenceMap`, `selectors` and `protoTree`:

<dl>
<dt>

`gradeNames`
</dt>
<dd>

As we saw with the Primary Schema, any call to `fluid.defaults()` must refer to any parent
grades using the `gradeNames` property. Panels must use the `"fluid.prefs.panel"` grade.
</dd>
<dt>

`preferenceMap`
</dt>
<dd>A Panel must have a _Preference Map_, which maps the information in the Primary Schema
into your Panel. Let’s look at this one more closely:
<pre class="highlight">
<code class="hljs javascript">preferenceMap: {
    "awesomeCars.prefs.heatedSeats": {
        "model.heatedSeats": "value"
    }
}</code></pre>

The first line of the  Preference Map, `“awesomeCars.prefs.heatedSeats”`, is the name of the preference.
This exactly matches the name we saw in the Primary Schema earlier. The value for this
key is a JavaScript object that defines how this particular preference relates to the Panel’s
internal data model.

The content of this  Preference Map is a key/value pair:
<ul>
<li>

The key, `“model.heatedSeats”`, is an [EL path](../FrameworkConcepts.md#el-paths) into the
Panel’s data model. An “EL path” is just a
dot-separated path built from names. In this case, it means “the `heatedSeats`
property of the [`model`](../FrameworkConcepts.md#model-objects) property” of the Panel.

<aside class="infusion-docs-callout">

[Models](../FrameworkConcepts.md#model-objects) are central to Infusion, which,
while not formally a [Model-View-Controller framework](../FrameworkConcepts.md#mvc),
embodies the the separation of concerns that is central to MVC.
Most Infusion components have an internal model, for maintaining the state of the component.
</aside>
</li>
<li>

The value, `“value”`, is an EL path referencing the stored value or the `“default”` property in the Primary Schema.
</li>
</ul>

This  Preference Map is saying two things:

<ol>
<li>

The preference called `“awesomeCars.prefs.heatedSeats”` should be stored in the Panel’s model
in a property called `heatedSeats`, and
</li>
<li>

the initial value for the property should be taken from the `“default”` property of the Primary Schema.
</li>
</ul>

A Preference Map can specify other destinations for Primary Schema information, besides the model.
We'll see an example of this when we add another panel, later in this tutorial.
</dd>

<dt>

`selectors`
</dt>
<dd>

A Panel is a _[view component](../tutorial-gettingStartedWithInfusion/ViewComponents.md)_ – a type of Infusion component
that has a _view_, that is, a user interface. In order to maintain a separation between the code and the HTML for the
view, the code interacts with the HTML through named [selectors](../ComponentConfigurationOptions.md#selectors): The
code only references the name, and a Framework feature called the DOM Binder looks up the relevant DOM node for the name
based on the information in this `selectors` option.

Let’s look at this more closely:

<pre class="highlight">
<code class="hljs javascript">selectors: {
    heatedSeats: ".awec-heatedSeats"
},</code></pre>

The content of a `selectors` property is a set of key/value pairs. The key is the name of the selector and the value is
the selector itself. This property has only one selector, named `heatedSeats`. The value is the CSS selector
`".awec-heatedSeats"`. This selector references the actual checkbox in the template for the Panel. This template is
found in the `html/heatedSeats.html` file, which looks like this:

<pre class="highlight">
<code class="hljs html">&lt;section class="awe-panel"&gt;
    &lt;h2&gt;Heated Seats&lt;/h2&gt;

    &lt;label for="prefsEd-heatedSeats"&gt;Enable the heated seats when the car starts&lt;/label&gt;
    &lt;input type="checkbox" id="prefsEd-heatedSeats" class="awec-heatedSeats"/&gt;
&lt;/section&gt;</code></pre>

You can see the `“awec-heatedSeats”` class name on the `<input>` element.
</dd>
<dt>

`protoTree`
</dt>
<dd>

A Panel is also a _[Renderer component](../RendererComponents.md)_ – a type of Infusion component that uses the Infusion
[Renderer](../Renderer.md) to render the view based on data in the component’s model. The
_[protoTree](../RendererComponentTrees.md)_ is the instructions for how the data in the component’s model maps to the
template. Let’s look at this more closely:

<pre class="highlight">
<code class="hljs javascript">protoTree: {
    heatedSeats: "${heatedSeats}"
}</code>
</pre>

A protoTree contains key/value pairs, where

* the key is a selector _name_ specified in the `selectors` option, and
* the value is the specification for what to render into the DOM node referenced by the selector.

Here, the one key `heatedSeats` refers to the selector named `heatedSeats` i.e. the reference to the checkbox in the
HTML template. The value is a reference to the `heatedSeats` property of Panel’s data model. In the Infusion Framework,
an _[IoC reference](../IoCReferences.md)_ (IoC stands for Inversion of Control) is a reference to an object in the
current context using a particular syntax – specifically, the form `{context-name}.some.path.segments`. _Coming soon:
More information about IoC references._
</dd>
</dl>

#### Auxiliary Schema

The [Auxiliary Schema](../AuxiliarySchemaForPreferencesFramework.md) is a document that specifies all the things needed
to actually build the Preference Editor. The Auxiliary Schema for our example Editor is defined in the
`schemas/auxiliary.js` file:

```javascript
fluid.defaults("awesomeCars.prefs.auxSchema", {
    gradeNames: ["fluid.prefs.auxSchema"],
    auxiliarySchema: {
        // some code not shown
    }
});
```

Again, we use `fluid.defaults()` to create the Schema. As with the Primary Schema and the Panel, `fluid.defaults()` is
passed two arguments: 1) a string name (`"awesomeCars.prefs.auxSchema"`), and 2) a JavaScript object literal containing
configuration options.

Let’s look at the Schema itself in detail:

```json5
{
    auxiliarySchema: {
        // the loaderGrade identifies the "base" form of preference editor desired
        loaderGrades: ["fluid.prefs.fullNoPreview"],
        componentGrades: {
            messageLoader: "awesomeCars.prefs.messageLoader"
        },

        // Remove the default path as we have not configured core message bundles for this editor.
        message: null,

        // 'terms' are strings that can be re-used elsewhere in this schema;
        terms: {
            templatePrefix: "html",
            messagePrefix: "messages"
        },

        // the main template for the preference editor itself
        template: "%templatePrefix/prefsEditorTemplate.html",

        // indicates that the adjuster panel containers do not need to be generated and are included in the
        // template.
        "generatePanelContainers": false
    }
}
```

An auxiliary schema can be generally divided into two kinds of properties:

1. top-level members, defining globally-used values, and
2. per-preference members (one per preference), defining the specific requirements for each preference.

##### Loader Grade

The _loader grade_ specifies the _type_ of Preference Editor:

```json5
{
    loaderGrades: ["fluid.prefs.fullNoPreview"]
}
```

The Preference Framework provides three pre-defined types of Editor:

1. separated panel (the default): This is a page-width panel collapsed at the top of the page; it slides down when
   activated by the user.
2. full page, no preview: This is a Preference Editor that occupies the full page.
3. full page, with preview: This is a Preference Editor that occupies the full page, but includes provisions for an
   iframe in the page to preview any changes made by the Editor.

In the code snippet above, the `loaderGrades` option is used to specify the “full page, no preview” form.

##### Templates

The Auxiliary Schema must declare where to find the main HTML template for the Preference Editor. In our example, this
template is located in the same folder as other HTML templates. The Auxiliary Schema allows you to define `terms` –
strings that can be re-used elsewhere in the schema. Here, it is being used to define, in a single place, the path to
where the HTML templates are:

```json5
{
    terms: {
        templatePrefix: "html"
    }
}
```

The template property specifies the main HTML template for the entire Preference Editor:

```json5
{
    template: "%templatePrefix/prefsEditorTemplate.html"
}
```

You can see the full text of this file, `prefsEditorTemplate.html`, in the github repo:
[https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor/html/prefsEditorTemplate.html](https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor/html/prefsEditorTemplate.html)
The main thing to note in the template is the placeholder for the Panel, in this example a `<div>` with the class
`awec-heatedSeats`:

```html
<!-- placeholder for the heated seats preference panel -->
<div class="awec-heatedSeats"></div>The Framework will insert the constructed Panel into this div
```

The Framework will insert the constructed Panel into this `<div>`.

##### Messages

The Auxiliary Schema must declare where to find the main JSON message bundles for the Preference Editor. In our example,
the messages are expected to be in the same folder as other message bundles. The Auxiliary Schema allows you to define
`terms` – strings that can be re-used elsewhere in the schema. Here, it is being used to define, in a single place, the
path to where the JSON message bundles are:

```json5
{
    terms: {
        messagePrefix: "html"
    }
}
```

The message property specifies the main JSON message bundle for the entire Preference Editor. However, in this case one
isn't used:

```json5
{
    message: null
}
```

You can see the full text of this file, `prefsEditorTemplate.html`, in the github repo:
[https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor/html/prefsEditorTemplate.html](https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor/html/prefsEditorTemplate.html)

##### Preferences

The next thing in the Auxiliary Schema is the configuration for the heated seats preference. This is actually defined
in the `awesomeCars.prefs.auxSchema` auxiliary schema grade, which will be automatically picked up during instantiation.

```json5
{
    // this key must match the name of the pref in the primary schema
    "awesomeCars.prefs.heatedSeats": {
        panel: {
            // this 'type' must match the name of the panel grade created for this pref
            type: "awesomeCars.prefs.panels.heatedSeats",

            // selector indicating where, in the main template, to place this panel
            container: ".awec-heatedSeats",

            // the template for this panel
            template: "%templatePrefix/heatedSeats.html",

            // the message bundle for this panel
            message: "%messagePrefix/heatedSeats.json"
        }
    }
}
```

(The name of the property, `awesomeCars.prefs.heatedSeats`, is the preference's name and must match the one specified in
the primary schema.)

In our example, the heated seats preference configuration only needs to supply configuraiton informatio for the panel.

The value of the `panel` property is a JavaScript object containing configuration information
for the Panel. Let’s look at each of the properties:
<dl>
<dt>

`type`
</dt>
<dd>

This is the name of the Panel that was defined in the call to `fluid.defaults()` above.
</dd>
<dt>

`container`
</dt>
<dd>

This is a CSS-based selector referencing the Panel’s placeholder element in the main HTML
template – the one referenced by the `template` property above.
</dd>
<dt>

`template`
</dt>
<dd>

This is the path and filename of the HTML template for this Panel.
Notice, in this example, how the `templatePrefix` term is being used.
</dd>
<dt>

`message`
</dt>
<dd>

This is the path and filename of the JSON message bundle for this Panel.
Notice, in this example, how the `messagePrefix` term is being used.
</dd>
</dl>

#### Instantiation

The last thing in the `js/prefsEditor.js` file is a call to the Preferences Framework
function [`fluid.uiOptions()`](../UserInterfaceOptionsAPI.md). This function actually creates the Preference Editor.
It accepts two arguments:

1. a CSS selector indicating the container element for the Preference Editor, and
2. a JavaScript object containing configuration information for the Preference Editor.

This function is invoked in the main HTML file for the Preference Editor, `index.html`. You can see the entire file
here:
[https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor/index.html](https://github.com/fluid-project/infusion/tree/main/examples/framework/preferences/minimalEditor/index.html).
Let’s look at this invocation:

```html
<div id="preferencesEditor"></div>

<script type="text/javascript">
    fluid.uiOptions("#preferencesEditor", {
        // the preference
        preferences: ["awesomeCars.prefs.heatedSeats"],
        auxiliarySchema: {
            // the loaderGrade identifies the "base" form of preference editor desired
            loaderGrades: ["fluid.prefs.fullNoPreview"],
            componentGrades: {
                messageLoader: "awesomeCars.prefs.messageLoader"
            },

            // Remove the default path as we have not configured core message bundles for this editor.
            message: null,

            // 'terms' are strings that can be re-used elsewhere in this schema;
            terms: {
                templatePrefix: "html",
                messagePrefix: "messages"
            },

            // the main template for the preference editor itself
            template: "%templatePrefix/prefsEditorTemplate.html",

            // indicates that the adjuster panel containers do not need to be generated and are included in the
            // template.
            "generatePanelContainers": false
        }
    });
</script>
```

In the HTML snippet above, the `<div>` is the container that the Preference Editor will be rendered inside of. The call
to `fluid.uiOptions` is passed the ID of the element, `“#preferencesEditor”`, as the container argument.

In the code snippet above, the first argument – `container` – is the CSS identifier passed to the function. The second
argument, the options. This options are a JavaScript object containing information that will be passed to the Builder, a
key part of the Preferences Framework. The Builder is the core component responsible for actually building the
Preference Editor based on all of the configuration information for the preferences, the Panels, etc. For our simple
Preference Editor, the options contain the preference we are defining along with the auxiliarySchema information for
this particular instance.

The Auxiliary Schema (plus the Primary Schema that was registered with the Framework automatically) contains all the
information the Builder needs to construct the Preference Editor.

## Adding another preference

Let’s use what we’ve learned so far to add another simple preference to the Editor: Preferred volume for the radio. This
preference will be a number, and it will have a range of possible values.

To add this preference, we’ll need to

1. define the preference,
2. create the Panel, and
3. add the Panel to the Editor.

### Defining the preference

We’ll edit the Primary Schema definition in `schemas/primary.js` to add the new preference definition. It’s `type` is
`“number”`, and in addition to the default, we’ll have to define a minimum and maximum, as well as the step value:

```javascript
fluid.defaults("awesomeCars.prefs.schemas.radioVolume", {
    gradeNames: ["fluid.prefs.schemas"],
    schema: {
        "awesomeCars.prefs.radioVolume": {
            "type": "number",
            "default": "2",
            "minimum": "1",
            "maximum": "5",
            "multipleOf": "0.5"
        }
    }
});
```

### Creating the Panel

#### Template and Adjuster

We will need an HTML template for the Panel. Since the preference is a range, we’ll use a slider for the Adjuster.

Create a new file in the `html` folder called `radioVolume.html` and use a structure similar to the one already used for
the heated seats template:

```html
<section class="awe-panel">
    <h2>Radio Volume</h2>

    <label for="prefsEd-radioVolume">Set the desired volume for the radio</label>
    <input type="range" id="prefsEd-radioVolume" class="awec-radioVolume"/>
</section>
```

We’ve used an `<input>` with type `“range”` for the Adjuster. The template doesn’t need to set the min, max or value
attributes; those are dependent on the Primary Schema and will be added in by the Preference Editor.

#### Panel component

In the `prefsEditor.js` file, we'll create the Panel component for this preference. As with the heated seats Panel, we
use a call to `fluid.defaults()` and set the grade to `“fluid.prefs.panel”`:

```javascript
fluid.defaults("awesomeCars.prefs.panels.radioVolume", {
    gradeNames: ["fluid.prefs.panel"]
    // options will go here...
});
```

As with the heated seats Panel, we need a Preference Map:

```javascript
fluid.defaults("awesomeCars.prefs.panels.radioVolume", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        "awesomeCars.prefs.radioVolume": {
            "model.radioVolume": "value"
        }
    }
    // ...
});
```

The Panel component also needs to know about the minimum, maximum and step value defined in the Primary Schema. These
values are not likely to change over the life of the component, so it’s not really appropriate to store them in the
model. Instead, we create a `range` property as a component option:

```javascript
fluid.defaults("awesomeCars.prefs.panels.radioVolume", {
    gradeNames: ["fluid.prefs.panel"],

    preferenceMap: {
        "awesomeCars.prefs.radioVolume": {
            "model.radioVolume": "value"
        }
    },
    range: {
        min: 1,
        max: 10,
        step: 1
    }
    // ...
});
```

Finally, the Preference Map needs to tell the component to map the Primary Schema values into the `range` property:

```javascript
fluid.defaults("awesomeCars.prefs.panels.radioVolume", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        "awesomeCars.prefs.radioVolume": {
            "model.radioVolume": "value",
            "range.min": "minimum",
            "range.max": "maximum",
            "range.step": "multipleOf"
        }
    },
    range: {
        min: 1,
        max: 10,
        step: 1
    }
    // ...
});
```

As we saw with the heated seats Panel, we need to define a selector to identify the HTML element where the preference
value will be bound:

```javascript
fluid.defaults("awesomeCars.prefs.panels.radioVolume", {
    gradeNames: ["fluid.prefs.panel"],
    preferenceMap: {
        "awesomeCars.prefs.radioVolume": {
            "model.radioVolume": "value",
            "range.min": "minimum",
            "range.max": "maximum",
            "range.step": "multipleOf"
        }
    },
    range: {
        min: 1,
        max: 10,
        step: 1
    },
    selectors: {
        radioVolume: ".awec-radioVolume"
    }
    // ...
});
```

Finally, we need to define the Renderer protoTree – the instructions for rendering the model value into the template.
This protoTree will need to be a little bit more complicated than what we used for the heated seats preference. That
protoTree needed to do only one thing: bind the model value to the input element. For the range input, we still need to
bind the model value, but we _also_ need to set the `min`, `max` and `step` attributes of the element. For this, a
simple key/value pair isn’t enough. Instead of a simple string reference as the value, we’ll use an object with a value
property:

```json5
{
    protoTree: {
        radioVolume: {
          value: "${radioVolume}"
        }
    }
}
```

To this, we will add a _[Renderer Decorator](../RendererDecorators.md)_ to set the attributes using the contents of the
`range` property:

<aside class="infusion-docs-callout">

[Renderer Decorators](../RendererDecorators.md) allow users of the Renderer to attach various things, such as functions,
class names, etc., to the components at render time.
</aside>

```json5
{
    protoTree: {
        radioVolume: {
          value: "${radioVolume}",
          decorators: [{
              type: "attrs",
              attributes: {
                  min: "{that}.options.range.min",
                  max: "{that}.options.range.max",
                  step: "{that}.options.range.step"
              }
          }]
        }
    }
}
```

So, this is what our final radio volume Panel component definition looks like:

```javascript
fluid.defaults("awesomeCars.prefs.panels.radioVolume", {
    gradeNames: ["fluid.prefs.panel"],

    preferenceMap: {
        "awesomeCars.prefs.radioVolume": {
            "model.radioVolume": "value",
            "range.min": "minimum",
            "range.max": "maximum",
            "range.step": "multipleOf"
        }
    },

    range: {
        min: 1,
        max: 10,
        step: 1
    },

    selectors: {
        radioVolume: ".awec-radioVolume"
    },

    protoTree: {
        radioVolume: {
            value: "${radioVolume}",
            decorators: [{
                type: "attrs",
                attributes: {
                    min: "{that}.options.range.min",
                    max: "{that}.options.range.max",
                    step: "{that}.options.range.step"
                }
            }]
        }
    }
});
```

### Adding the Panel to the Editor

We saw above that the main HTML template for the tool, `html/prefsEditorTemplate.html`,
has a placeholder in it for the heated seats Panel.
 We will add another placeholder for the radio volume Panel:

```html
<!-- placeholder for the heated seats preference panel -->
<div class="awec-heatedSeats"></div>

<!-- placeholder for the radio volume preference panel -->
<div class="radioVolume"></div>
```

We’ll also need to add additional auxiliary schema information in `schemas/auxiliary.js`,  to provide the
configuration options specific to the new Panel:

```JavaScript
fluid.defaults("awesomeCarsRadioVolume.prefs.auxSchema", {
    gradeNames: ["fluid.prefs.auxSchema"],

    auxiliarySchema: {
        // this key must match the name of the pref in the primary schema
        "awesomeCars.prefs.radioVolume": {
            panel: {
                type: "awesomeCars.prefs.panels.radioVolume",
                container: ".awec-radioVolume",
                template: "%templatePrefix/radioVolume.html"
            }
        }
    }
});
```

## Saving Preferences

Right now, when you click the "save" button, the preferences are saved – if you reload the page,
they're all there.
How does that happen? Where are they saved to? And how would you change that?

By default, the Preferences Framework automatically saves the preferences to a browser cookie.
How does that happen?

* The template has a specific class on the "save" button: `flc-prefsEditor-save`.
* The Preferences Framework automatically binds a click handler to anything with that class.
* The click handler ultimately invokes the `set` method on the default [settings store](../SettingsStore.md), which is a
  [CookieStore](../SettingsStore.md#fluidprefscookiestore).

Cookies are great for websites, but this is a car. The preferences need to be saved to the car's internal storage. We
need to a) create a Settings Store that will save to the internal storage and b) tell the preferences editor to use that
instead.

The first step is to create a grade that uses the built-in `fluid.prefs.store`:

```javascript
fluid.defaults("awesomeCars.prefs.store", {
    gradeNames: ["fluid.prefs.store"]
});
```

We'll need to override the default `get()` and `set()` methods with our own versions. These methods are implemented as
[invokers](../Invokers.md), which makes it easy to plug in our own functions:

```javascript
fluid.defaults("awesomeCars.prefs.store", {
    gradeNames: ["fluid.prefs.store"],
    invokers: {
        get: {
            funcName: "awesomeCars.prefs.store.get"
        },
        set: {
            funcName: "awesomeCars.prefs.store.set",
            args: ["{arguments}.0"]
        }
    }
});
```

Our `get` and `set` functions will need to do whatever is necessary to save and retrieve the preferences to the car's
internal data storage:

```javascript
fluid.defaults("awesomeCars.prefs.store", {
    gradeNames: ["fluid.prefs.store"],
    invokers: {
        get: {
            funcName: "awesomeCars.prefs.store.get"
        },
        set: {
            funcName: "awesomeCars.prefs.store.set",
            args: ["{arguments}.0"]
        }
    }
});

awesomeCars.prefs.store.get = function () {
    // do whatever you need to do, to retrieve the settings
    return settings;
};
awesomeCars.prefs.store.set = function (settings) {
    // do whatever you need to do to store the settings
};
```

Finally, we need to tell the preferences editor to use our new settings store instead of the default cookie store. We do
this by using the `storeType` option when we create the editor (as we saw back in [Instantiation](#instantiation)):

```javascript
fluid.uiOptions("#preferencesEditor", {
    // the preference
    preferences: [
        "awesomeCars.prefs.heatedSeats",
        "awesomeCars.prefs.radioVolume"
    ],
    auxiliarySchema: {
        // the loaderGrade identifies the "base" form of preference editor desired
        loaderGrades: ["fluid.prefs.fullNoPreview"],
        componentGrades: {
            messageLoader: "awesomeCars.prefs.messageLoader"
        },

        // Remove the default path as we have not configured core message bundles for this editor.
        message: null,

        // 'terms' are strings that can be re-used elsewhere in this schema;
        terms: {
            templatePrefix: "html",
            messagePrefix: "messages"
        },

        // the main template for the preference editor itself
        template: "%templatePrefix/prefsEditorTemplate.html",

        // indicates that the adjuster panel containers do not need to be generated and are included in the
        // template.
        "generatePanelContainers": false
    },
    store: {
        storeType: "awesomeCars.prefs.store"
    }
});
```

## Coming Soon:

Information about:

* Enactors
* More complicated Panels
* Localization
* Design consideration
* Case studies
