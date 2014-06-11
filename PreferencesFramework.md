# Preferences Framework #

## Overview ##

The Infusion Preferences Framework offers a reusable set of schemas, programming APIs, and UI building blocks specific to the creation, persistence, and integration of preference editors into a variety of web-based applications, content management systems, and delivery environments. It does not prescribe a single means by which content should be delivered to users. Instead, the Preferences Framework architecture provides an event-driven API that enables different, pluggable personalization strategies to listen for changes in a user's preferences and respond accordingly.

The Preferences Framework allows for the creation of a customized [Preferences Editor](PreferencesEditor.md) by supplying a [Primary Schema](PrimarySchemaForPreferencesFramework.md) and [Auxiliary Schema](AuxiliarySchemaForPreferencesFramework.md). The [Primary Schema](PrimarySchemaForPreferencesFramework.md) provides a description of the preferences that the editor will manage. It includes both the default values, as well as, the set of values that the preference can take. The [Auxiliary Schema](AuxiliarySchemaForPreferencesFramework.md) provides the instructions for combining the panels (for setting preferences) and enactors (for applying preferences) that will operate on these preferences. 


## More Information ##

    [Preferences Editor](PreferencesEditor.md)
    [Builder](Builder.md)
        [Primary Schema for Preferences Framework](PrimarySchemaForPreferencesFramework.md)
        [Auxiliary Schema for Preferences Framework](AuxiliarySchemaForPreferencesFramework.md)
    [Using the Preferences Framework with User-Defined Grades](UsingThePreferencesFrameworkWithUser-DefinedGrades.md)
    [Enactors](Enactors.md)
    [Panels](Panels.md)
        [Composite Panels](CompositePanels.md)
        [Conditional Subpanels](ConditionalSubpanels.md)
    [Connecting the Parts of a Preferences Editor](ConnectingThePartsOfAPreferencesEditor.md)
    [Localization in the Preferences Framework](LocalizationInThePreferencesFramework.md)

## Tutorials ##

    [Tutorial - Creating a Preferences Editor Using the Preferences Framework](CreatingAPreferencesEditorUsingThePreferencesFramework.md)
        [Creating a Primary Schema](CreatingAPrimarySchema.md)
        [Creating Enactors](CreatingEnactors.md)
        [Creating Panels](CreatingPanels.md)
        [Creating an Auxiliary Schema](CreatingAnAuxiliarySchema.md)
        [Instantiating the Preferences Editor](InstantiatingThePreferencesEditor.md)
        [Instantiating the Enhancer and Settings Store Only](InstantiatingTheEnhancerAndSettingsStoreOnly.md)
        [Styling the Preferences Editor](StylingThePreferencesEditor.md)
    [Tutorial - Full Page Preferences Editor](FullPagePreferencesEditor.md)
    [Tutorial - Full Page Preferences Editor (with Preview)](FullPagePreferencesEditorWithPreview.md)
    [Tutorial - Creating a New Adjuster UI](CreatingANewAdjusterUI.md)

