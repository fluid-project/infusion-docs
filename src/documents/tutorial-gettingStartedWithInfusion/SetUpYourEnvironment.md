---
title: Set up your environment
layout: default
---

---
Part of the [Getting Started with Infusion Tutorial](GettingStartedWithInfusion.md)

---

## Background ##

If you haven't already, it might be helpful to read our [Developer Introduction to the Infusion Framework](../to-do/DeveloperIntroductionToInfusionFramework.md) before starting this tutorial.

## Set Up Directory Structure ##

For this tutorial we'll assume this component is being created for your own use, not as a contribution to Infusion. If you do want to contribute your component to Infusion, the directory set-up and requirements will be a little different and is explained in [Contributing Code](http://wiki.fluidproject.org/display/fluid/Contributing+Code).

Let's suppose you're creating a component that will carry out currency conversion. You'll need to get a copy of Infusion:
* Download the [latest release of Fluid Infusion](https://github.com/fluid-project/infusion/releases/) and unpack it (or check out the [master branch](https://github.com/fluid-project/infusion) for the very latest, unreleased version).
* Follow the instructions in the [Readme file](https://github.com/fluid-project/infusion/blob/master/README.md) to [create your Infusion package](https://github.com/fluid-project/infusion/blob/master/README.md#how-do-i-create-an-infusion-package). 
* The build process places the output in a .zip file in the "products" folder. Unpack that archive and place the resulting "infusion" folder in a "lib" folder in your source hierarchy.

So supposing your project is in a folder called "converter," your source hierarchy might look like this:
* converter
    * src
* lib
    * infusion

All of the Infusion JavaScript is in a single file in the "infusion" folder called ```infusion-all.js``` (unless you provided custom options to your grunt command). You will need to link to this file in your HTML headers.

**NOTE:** The "infusion" folder actually contains some files you don't need, but it's not required to remove them, so we won't worry about that right now.

Next: [Define a namespace and create a closure](DefineANamespaceAndCreateAClosure.md)
