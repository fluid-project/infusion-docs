---
title: Getting User Interface Options
category: Tutorials
---

Outlined below are a few common methods for retrieiving UI Options for use in your project. Please review each option to
determine which is best for your project.

## Using `npm`

Many JavaScript projects make use of NPM for sourcing their dependencies and distributing their own packages. If your
project is already using NPM this will likely be the easiest to setup and generally the easiest way to manage and track
versions.

To install the latest version of Infusion:

```bash
npm i infusion
```

To install a specific version of Infusion:

```bash
# Retrieves a particular version of Infustion
npm i infusion@v2.0.0

# The most recent dev release
npm i infusion@dev

# A specific dev release
npm i infusion@3.0.0-dev.20200326T173810Z.24ddb2718
```

Once infusion is installed, you can find different builds within the `./node_modules/infusion/dist/` directory. If you
will only be using UI Options, the `infusion-uio.js` build includes just UI Options and its related JavaScript
dependencies. Additionally, you'll also need access to resources from `./node_modules/infusion/src`; such as CSS,
HTML templates, JSON Message bundles, and Fonts. Most of these reside in `./node_modules/src/framework/preferences`.
Depending on your setup you may be able to server from the `./nodue_modules` directory directly, or need to copy the
necessary resources to another served location in your project.

## Prebundled Zip package

This method will download and install the last published release of Infusion. These are typically only generated for
stable releases and published to the GitHub relase page. If you are not using NPM and want to only use a published
stable release, this is a good option.

1. Download the latest Infusion UI Options Zip package from the
   [Infusion Releases page](https://github.com/fluid-project/infusion/releases). There are different packages of
   Infusion - download the file starting with `infuions-uio.X.X.X.zip` if you are only interested in UI Options.
2. Unzip the contents of the downloaded ZIP file to a location within your project.
   <div class="infusion-docs-note"><strong>Note:</strong> In this guide we will use the directory
   `my-project/lib/infusion`.</div>
3. Your `infusion` directory will include a single file containing all of the JavaScript you need
   (`infusion-uio.js`), HTML templates, CSS files, and other components to get UI Options to work. You will later
   link to these files in your HTML files.
4. Now that `infusion` is in your project directory, you can delete the `infusion-uio-X.X.X.zip` (or similar name)
   from your download directory.

## Create your own build

In this method, you'll be generating your own build straight from Infusion's source. The process isn't complicated but
will require you to checkout the Infusion's code base and install all depedencies and dev dependencies as you would if
you were developing Infusion. The benefit is that you can generate other types of custom builds that may not be offered
in the dists or prebundled zip packages. You'll also be able to generate builds at your discretion, for example between
releases. However, you'll need to treat the output like you would with the prebundled zip packages, unless you push up
the results to somewhere NPM accessible on your own.

<div class="infusion-docs-note">
<strong>Note:</strong>
While the Fluid community strives to keep `main` in a working state, we don't recommend this approach for most
production environments. Stable release are the most thoroughly tested. Dev releases have been partially vetted
and are recommended when you need to use a more recent version.
</div>

<div class="infusion-docs-note">
<strong>Note:</strong>
If using the latest development source, there may be some differences in documentation, or instances where documentation
does not yet exist.
</div>

Requirements: [node](https://nodejs.org/), [npm](https://www.npmjs.com/)

1. Run `git clone https://github.com/fluid-project/infusion` to copy the Infusion GitHub repository to your local
filesystem. This will create a directory `infusion` containing the Infusion source code.
   1. This will pull down the latest version from the `main` branch. You can switch to another branch or other revision
   using `git checkout`; however, the build instructions may be different depending on the point in history you land on.
2. Run `npm install` within the `infusion` directory to get the needed dependencies.
3. Build using `npm run build:pkg:custom -- --include="fluid-ui-options" --name="uio"` to create a version of Infusion
with UI Options. The output will be in the `infusion/build/` and `infusion/products` directories. The Infusion [README](https://github.com/fluid-project/infusion/blob/main/README.md)
file contains more information on creating [custom builds](https://github.com/fluid-project/infusion#custom-build).

<div class="infusion-docs-note">
<strong>Note:</strong>
You can also generate dist builds by running `npm run build`; however these won't be accessible through NPM unless you
push them somewhere NPM accessible like publishing to NPM or committed to a GitHub repo.
</div>

### Summary of commands:

```bash
git clone https://github.com/fluid-project/infusion
cd infusion
npm install
npm run build:pkg:custom -- --include="fluid-ui-options" --name="uio"
```

## Adding UI Options to projects

After obtaining Infusion with UI Options using one of the methods above, visit
[Setting Up User Interface Options](./UserInterfaceOptions.md) how-to guide for instructions on adding UI Options to a
project.
