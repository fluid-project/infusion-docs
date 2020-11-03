---
title: Getting User Interface Options
layout: default
category: Tutorials
---

This document outlines different methods to obtain UI Options. Choose the best option that meets your needs.

See [Setting Up User Interface Options](./UserInterfaceOptions.md) how-to guide for adding UI Options to your project.

## Get Infusion UI Options Stable Release - Zip Package

This method will download and install the last published release of Infusion. For more current development versions,
refer to the other methods below.

1. Download the latest Infusion UI Options Zip package from the
   [Infusion Releases page](https://github.com/fluid-project/infusion/releases). There are different packages of
   Infusion - download the file "`infusion-uiOptions-X.X.X-source.zip`" if you are only interested in UI Options.
2. Unzip the contents of the downloaded ZIP file to a location within your project. This will result in a new directory
   `infusion`.<div class="infusion-docs-note"><strong>Note:</strong> In this guide we will use the directory
   `my-project/lib/`.</div>
3. Your `infusion` directory will include a single file containing all of the JavaScript you need
   (`infusion-uiOptions.js`), HTML templates, CSS files, and other components to get UI Options to work. You will later
   link to these files in your HTML files.
4. Now that `infusion` is in your project directory, you can delete the `infusion-uiOptions-X.X.X.zip` (or similar name)
   from your download directory.

## Get Infusion UI Options with `npm`

Get the latest published development version of Infusion on npm by running:

```
npm i infusion
```

Once infusion has installed, you can find different builds of UI Options within the `./node_modules/infusion/dist/`
directory.

## Get Infusion from GitHub

This method will download and install the current version of Infusion in development.

<div class="infusion-docs-note">
<strong>Note:</strong>
If using the latest development source, there may be some differences in documentation, or instances where documentation
does not yet exist.
</div>

Requirements: [node](https://nodejs.org), [npm](https://www.npmjs.com/), [grunt](https://gruntjs.com/), and [grunt CLI](https://www.npmjs.com/package/grunt-cli)

1. Run `git clone https://github.com/fluid-project/infusion` to copy the Infusion GitHub repository to your local
filesystem. This will create a directory `infusion` containing the Infusion source code.
2. Run `npm install` within the `infusion` directory to get the needed dependencies.
3. Build using `grunt custom --include="uiOptions" --name="uiOptions"` to create a version of Infusion with UI Options.
The output will be in the `infusion/build/` directory.

The contents of `infusion/build/` can now be used in your project.

### Summary of commands:

```bash
git clone https://github.com/fluid-project/infusion
cd infusion
npm install
grunt custom --include="uiOptions" --name="uiOptions"
```
