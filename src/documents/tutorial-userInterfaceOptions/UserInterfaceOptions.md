---
title: User Interface Options
layout: default
category: Tutorials
---

The **User Interface Options (UI Options)** component allows users to transform the presentation of the user interface and content resources so that they are personalized to the individual user's needs.

UI Options does three things:

* places a preferences editor dialog with a set of six panels in a collapsible panel at the top of the page, accessible through a button in the upper right corner of the page;
* instantiates a cookie-based [Settings Store](../SettingsStore.md) for storing the user's preferences; and
* acts upon the user's preferences.

![Screen shot of the UI Options Component](../images/uio-showcase.png "Screen shot of the UI Options Component")

This tutorial assumes that:

* you are already familiar with HTML, Javascript and CSS,
* you are familiar with what the UI Options preferences editor is and does, and
* now you just want to know how to add it to your website.

## Scenario ##

You're putting together a website that you know will have a diverse audience. You'd like to allow your visitors to customize the presentation of the site to their individual needs, by enlarging the text or increasing the visual contrast, for example. This tutorial will show you how to add the Infusion [UI Options](http://wiki.fluidproject.org/pages/viewpage.action?pageId=3907847) component to your site.

These are the basic steps to add UI Options to your website:

1. [Download and install the Infusion library](#download-and-install-the-infusion-library)
2. [Prepare your page](#prepare-your-page)
    * [The Sliding Panel](#the-sliding-panel)
    * [The Table of Contents](#the-table-of-contents)
3. [Add dependencies to the page](#add-dependencies-to-the-page)
4. [Add the UI Options component](#add-the-ui-options-component)

The rest of this tutorial will explain each of these steps in detail.

## Download and install the Infusion library ##

1. Download the current source code from Github as a [ZIP file]( https://github.com/fluid-project/infusion/archive/master.zip).
2. Unzip the downloaded ZIP file. This will result in a new directory `infusion-master`. 
3. Using a command line terminal, change to the `infusion-master` directory.
4. Install [Node.js](http://nodejs.org/download/), if it hasn't been installed.
5. Install [Grunt](http://gruntjs.com/getting-started) globally, if it hasn't been installed. For Windows, you can run `npm install -g grunt-cli` as Administrator. For Mac OSX, you can run `sudo npm install -g grunt-cli` from the command line terminal.
6. Create your build by running the `grunt` command in the command line terminal. If you would like to customize your build, you can create a custom build by running the `grunt custom` command in the command line terminal. See the [README.md](https://github.com/fluid-project/infusion/blob/master/README.md#how-do-i-create-an-infusion-package) file for instructions on how to make a custom build of Infusion.
7. A ZIP file, such as infusion-2.0.0.zip, will be created in the infusion-master/products directory. Copy this Infusion ZIP file into your project directory. 
8. Now unzip the Infusion ZIP file in your project directory. This will create a new directory called infusion which contains all the Javascript and files you will need to use UI Options.
9. Now that infusion is in your project directory, you can go ahead and clean up the files and directories we created so far. You can safely delete: 
   * The ZIP file downloaded in Step 1.
   * The infusion-master directory created in Step 2.
   * The infusion-2.0.0.zip (or similar name) from your project directory.
10. Your `infusion` folder will include a single file containing all of the JavaScript you need: `infusion-all.js`. If you made a custom build, the file is named `infusion-custom.js`. You will later link to this file in the headers of your HTML files.

## Prepare your page ##

### The Sliding Panel ###

The UI Options component includes HTML templates for all the controls, so you don't need to create any HTML for them. You only need to add a small amount of markup to the top of your webpage to tell UI Options where to render itself.

Add the following markup at the very beginning within your `<body>` tag to your page html:

```html
<div class="flc-prefsEditor-separatedPanel fl-prefsEditor-separatedPanel">
    <!-- This is the div that will contain the Preference Editor component -->
    <div class="flc-slidingPanel-panel flc-prefsEditor-iframe"></div>
    <!-- This div is for the sliding panel that shows and hides the Preference Editor controls -->
    <div class="fl-panelBar">
        <span class="fl-prefsEditor-buttons">
            <button id="reset" class="flc-prefsEditor-reset fl-prefsEditor-reset"><span class="fl-icon-undo"></span> Reset</button>
            <button id="show-hide" class="flc-slidingPanel-toggleButton fl-prefsEditor-showHide"> Show/Hide</button>
        </span>
    </div>
</div>
```

The main `<div>` in this snippet contains two things:

1. a `<div>` where an iframe will be inserted, containing the UI Options adjusters, and
2. a `<div>` where the sliding panel and button will be created.

The elements in this snippet all have particular class names attached to them, and it's important to keep them:

* the class names starting with `flc-` are used to identify the elements to UI Options;
* the class names starting with `fl-` are used for visual styling.

If you open this page in your browser now, you'll only see the button in the upper left corner, since we haven't set up the CSS and UI Options isn't present on the page yet:

![Screen shot of the UI Options buttons, unstyled](../images/uio-buttons.png "Screen shot of the UI Options buttons, unstyled")

<div class="infusion-docs-note"><strong>Note:</strong> It doesn't matter what text you put in the button. The UI Options component will add a label and update it to reflect whether or not the panel is currently open. You can configure the text that the component uses by setting its configuration parameters. </div>

### The Table of Contents ###

One of the UI Options controls allows users to add a Table Of Contents to the top of the page. You need to add a placeholder `<div>` to your page for the Table Of Contents. It should have a class of `"flc-toc-tocContainer"` like this:

```html
<div class="flc-toc-tocContainer"> </div>
```

Where exactly on your page you put this <div> is up to you, but it will depend on the exact layout of your page. It should be pretty close to the top, so that it's easily visible and accessible quickly for keyboard-only users. You can, of course, add additional classes of your own to style the Table Of Contents to fit in with the look of your site.

## Add dependencies to the page ##

* the CSS files, and
* the main Infusion JavaScript file: `infusion_all.js` or if you made a custom build, `infusion_custom.js`.

In the header of your file, link to the CSS files with `<link>` tags (you may have to adjust the paths to reflect where you've saved the Infusion package).

```html
<link rel="stylesheet" type="text/css" href="lib/infusion/src/lib/normalize/css/normalize.css" />
<link rel="stylesheet" type="text/css" href="lib/infusion/src/framework/core/css/fluid.css" />
<link rel="stylesheet" type="text/css" href="lib/infusion/src/framework/preferences/css/Enactors.css" />
<link rel="stylesheet" type="text/css" href="lib/infusion/src/framework/preferences/css/PrefsEditor.css" />
<link rel="stylesheet" type="text/css" href="lib/infusion/src/framework/preferences/css/SeparatedPanelPrefsEditor.css" />
```

We'll use the `<script>` tag to link to the Infusion library:

```html
<!-- The Infusion Library -->
<script type="text/javascript" src="lib/infusion/infusion-all.js"></script>
```

<div class="infusion-docs-note"><strong>Note:</strong> The <code>infusion-custom.js</code> file is a concatenation of all of the required JavaScript files and will be minified (i.e. all of the whitespace removed) if you've built the minified version. If so, it might be difficult to debug with. If you want to be able to debug the code, you might want to choose the "source" version when you create your Infusion bundle.</div>

If you open this page in your browser now, you'll only see that the button has been styled differently: it is in the upper right corner and the font has been changed. You can also see the bar of the sliding panel. The button still doesn't do anything, since we still haven't added the UI Options component to the page.

![Screen shot of the UI Options buttons, styled](../images/uio-buttons-styled.png "Screen shot of the UI Options buttons, styled")

## Add the UI Options component ##

The simplest way to add the UI Options component to your page is using a `<script>` tag near the top of the page. We suggest placing it right before the UI Options markup created in [Step 1](#download-and-install-the-infusion-library).

Change the directory of `infusion` to be `lib/infusion` and add the script block as shown below:

```html
<body>
    <script type="text/javascript">
    $(document).ready(function () {
        fluid.uiOptions.prefsEditor(".flc-prefsEditor-separatedPanel", {
            tocTemplate: "lib/infusion/components/tableOfContents/html/TableOfContents.html",
            terms: {
                templatePrefix: "lib/infusion/framework/preferences/html",
                messagePrefix: "lib/infusion/framework/preferences/messages"
            }
        });
    })
    </script>

    <div class="flc-prefsEditor-separatedPanel fl-prefsEditor-separatedPanel">
        ...
    </div>

    <!-- the rest of your page here -->
</body>
```

This script calls the `fluid.uiOptions.prefsEditor()` function to create the component. The function takes two arguments:

1. the selector of the container for the component, and
2. an options object for configuring the component.

The selector for our UI Options will be the classname of the `<div>` we created in [Step 1](#download-and-install-the-infusion-library). In this markup, the selector is `".flc-prefsEditor-separatedPanel"`.

The options tell the component about three things:

* where to find the Table of Contents template: the `tocTemplate` option,
* where to find the UI Options HTML templates included in Infusion: the `terms.templatePrefix` option, and
* where to find the message bundles, the strings that will be used in the interface: the `terms.messagePrefix` option.

In the code above, the `terms.messagePrefix` option is referencing the default strings provided by the component.

## Congratulations! ##

UI Options is now fully functional on your page. Now, when you load your page in your browser and click on the "Show Display Preferences" button, you will see the UI Options controls, as shown in the image below. If you adjust the controls, you will see your changes being applied to the page.

![Screen shot of UI Options](../images/uio.png "Screen shot of UI Options.")
