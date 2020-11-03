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

This method will download and install the most recent development release of Infusion available on npm.

1. From your project directory, run `npm i infusion`.
2. Once infusion has installed, you can find different builds of UI Options within the `./node_modules/infusion/dist/` directory.

## Infusion Latest Development Source

This method will download and install the current version of Infusion in development.

<div class="infusion-docs-note">
<strong>Note:</strong>
If using the latest development source, there may be some differences in documentation, or instances where documentation does not yet exist.
</div>

Requirements: [node](https://nodejs.org), [npm](https://www.npmjs.com/), [grunt](https://gruntjs.com/), and [grunt CLI](https://www.npmjs.com/package/grunt-cli)

1. Clone the Infusion GitHub repository anywhere to your local filesystem: `git clone
   https://github.com/fluid-project/infusion`. This will create a directory `infusion` containing the Infusion source
   code.
2. Within the `infusion` directory, run `npm install` to get Infusion's dependencies.
3. Build a version of Infusion with UI Options by running `grunt custom --include="uiOptions" --name="uiOptions"`. This
   will create a build of Infusion in the directory `infusion/build/`.
4. Your `infusion/build` directory will include a single file containing all of the JavaScript you need
   (`infusion-uiOptions.js`), HTML templates, CSS files, and other components to get UI Options to work. You will later
   link to these files in your HTML files.
5. Rename the directory from `build` to `infusion`, and move (or copy) the `build` directory to your project (i.e.
  `my-project/lib/infusion`).
6. Optional: You can now safely delete the `infusion` directory created in step 1.

### Summary of commands:

```bash
git clone https://github.com/fluid-project/infusion
cd infusion
npm install
grunt custom --include="uiOptions" --name="uiOptions"
mv build/ my-project/lib/infusion
```
