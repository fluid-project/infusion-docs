---
title: Resource Loader
layout: default
category: Infusion
---

The Infusion Resource Loader ```fluid.resourceLoader``` offers a mechanism to load multiple physical files in one shot. These resources can be html templates, JSON objects or any other resources. Due to the nature of asynchronous file loading with jQuery.ajax() that ```fluid.resourceLoader``` is implemented with, on completion, the resource loader fires an ```onResourcesLoaded``` event with an argument of the populated structure with fetched resource text in the field "resourceText" for each entry. This populated structure can also be retrieved directly on the resource loader instance via the path ```resources```.

```javascript
var resourceLoader = fluid.resourceLoader([options]);
```

### Parameters ###
<table>
<tr>
    <td><code>options</code></td>
    <td>(optional) (Object) Configuration options. See <a href="#options">Options</a> below for more information.</td>
</tr>
</table>

### Return Value ###

<table>
<tr>
    <td><strong>Object</strong></td>
    <td>(Object) The resource loader instance.</td>
</tr>
</table>

### Options ###

<table>
<tr><th>Name</th><th>Description</th><th>Values</th><th>Default</th></tr>
<tr>
    <td><code>terms</code></td>
    <td>Contains a map of variable names and replacement values to compose the path to each physical file. The map structure complies with the format of the second <code>terms</code> argument of <a href="CoreAPI.html#fluid-stringtemplate-template-terms-">fluid.stringTemplate()</a> API. Also see <a href="./tutorial-usingStringTemplates/UsingStringTemplates.html">Using String Templates</a> for more information.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
<tr>
    <td><code>resources</code></td>
    <td>Contains a map of resource names and paths to these resources. These paths can be actual path strings, for example, ```../data/template.html```, or templating strings with embedded variables that have mapped replacement values defined in the <code>term</code> option, for example, ```%prefix/template.html```. The format of templating paths complies with the format of the <code>template</code> argument of <a href="CoreAPI.html#fluid-stringtemplate-template-terms-">fluid.stringTemplate()</a> API.</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
<tr>
    <td><code>locale</code></td>
    <td>Specifies the language code with the desired localization. Language codes are expected in a form similar to <a href="https://tools.ietf.org/html/bcp47">BCP 47 tags</a> but with a "_" instead of a "-" separating the language code from the country code. When specified, the resource loader will add a suffix of the locale value to each entry defined in the <code>resources</code> and look for them at the first attempt. If any such resource is not located, the resource loader follows <a href="ResourceLoader.html#fallback-rules-with-locale-and-defaultlocale">Fallback Rules</a> to attempt to find aother localization.</td>
    <td>String</td>
    <td><code>null</code></td>
</tr>
<tr>
    <td><code>defaultLocale</code></td>
    <td>Specifies the default language code. Provides a fallback to use if the desired localization cannot be located. See <code>locale</code> option for the format of language codes. Also See <a href="ResourceLoader.html#fallback-rules-with-locale-and-defaultlocale">Fallback Rules</a> for when <code>defaultLocale</code> value will be used.</td>
    <td>String</td>
    <td><code>null</code></td>
</tr>
<tr>
    <td><code>resourceOptions</code></td>
    <td>Contains "options" holding raw options to be forwarded to jQuery.ajax().</td>
    <td>Object</td>
    <td><code>{}</code></td>
</tr>
</table>

#### Fallback Rules with ```locale``` and ```defaultLocale``` ####

```locale``` and ```defaultLocale``` options can be used to load localized resources, for example, to load messages in different languages.

```javascript
fluid.defaults("fluid.messageLoader", {
    gradeNames: ["fluid.resourceLoader"],
    resources: {
        translation: "../data/translation.json"
    },
    locale: "fr_CA",
    defaultLocale: "en_US"
});
```

This example requests to load a JSON file that contains translations. The ```fluid.messageLoader``` follows fallback rules below to satisfy the request:

1. look for a suffixed resource corresponding to the language code specified by the `locale` option: ```../data/translation-fr_CA.json```
2. look for a suffixed resource with the same language as the language code specified by the `locale` option: ```../data/translation-fr.json```
3. look for a suffixed resource corresponding to the language code specified by the `defaultLocale` option: ```../data/translation-en_US.json```
4. look for a suffixed resource with the same language as the language code specified by the `defaultLocale` option: ```../data/translation-en.json```
5. look for a resource with the exact URL as specified through the ```resources``` option: ```../data/translation.json```

### Events ###
<table>
<tr><th>Name</th><th>Description</th><th>Arguments</th></tr>
<tr>
    <td><code>onResourcesLoaded</code></td>
    <td>Fired when all resources are finished loading.</td>
    <td>A populated object with fetched resource text in the field "resourceText" for each entry. If an error occurs during a fetch, the <code>fetchError</code> field will be populated for that entry. This object can also be retrieved directly on the resource loader instance via the path <code>resources</code>.</td>
</tr>
</table>

## Using ```fluid.resourceLoader``` ##

The example below demonstrates when and how to use the fetched resource text in an IoC component tree. Generally speaking, the part that requires the fetched resources needs to postpone the instantiation via ```createOnEvent``` until resources are ready.

```javascript
fluid.defaults("fluid.UI", {
    gradeNames: ["fluid.viewComponent"],
    components: {
        templateLoader: {
            type: "fluid.resourceLoader",
            options: {
                terms: {
                    prefix: "../data"
                },
                resources: {
                    template: "%prefix/testTemplate.html"
                },
                listeners: {
                    "onResourcesLoaded.escalate": "{fluid.UI}.events.onTemplatesReady"
                }
            }
        },
        renderUI: {
            type: "fluid.viewComponent",
            container: "{fluid.UI}.container",
            createOnEvent: "onTemplatesReady",
            options: {
                listeners: {
                    "onCreate.appendTemplate": {
                        "this": "{that}.container",
                        "method": "append",
                        args: ["{templateLoader}.resources.template.resourceText"]
                    }
                }
            }
        }
    },
    events: {
        onTemplatesReady: null
    }
});

var UI = fluid.UI(".flc-UI");
```
