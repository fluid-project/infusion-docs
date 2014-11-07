---
title: Creating a Preferences Editor Using the Preferences Framework
layout: default
---

# Creating a Preferences Editor Using the Preferences Framework #

A Preferences Editor is a web application that supports the creation and modification of a users preferred settings for a device or application. The [Preferences Framework](../PreferencesFramework.md) can be used to build many different forms of preferneces editors, but the process of building a preferences editor remains the same.

Preferences Editors are constructed by combining three main parts:
* **panels** containing controls for users to adjust a preference setting;
* a **data store** providing persistence for the user's selections; and
* **enactors** that respond to a user's settings.

The Preferences Framework provides all the lifecycle events, configuration hooks, and persistence infrastructure required to support hooking these pieces together, as well as providing some pre-existing panels and enactors that can be re-used if desired.

There are two main ways you will likely use the Preferences Framework:

1. to add a Preferences Editor to a page
    * In addition to the user interface for adjusting preferences, this mode will also add the data store and the enactors to the page.
2. or to add only the data store and enactors to a page
    * This mode allows a page to be responsive to saved preferences, even if there is no Preferences Editor on the page.

The configuration is the same for both of these modes; only the actual instantiation differs. This tutorial will teach both modes.

## General process for creating a preferences editor ##

1. [Create a primary schema defining your preferences](CreatingAPrimarySchema.md).
2. [Create panel components for your adjustors](CreatingPanels.md).
3. [Create enactor components to act on the preferences](CreatingEnactors.md).
4. [Create an auxiliary schema specifying which panels and enactors to associate with the preferences](CreatingAnAuxiliarySchema.md).
5. Instantiate:
    1. [the preferences editor, along with the settings store and enhancer](InstantiatingThePreferencesEditor.md), or
    2. [only the settings store and enhancer](InstantiatingTheEnhancerAndSettingsStoreOnly.md)
6. [Style the Preferences Editor](StylingThePreferencesEditor.md)
