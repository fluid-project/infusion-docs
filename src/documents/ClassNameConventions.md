---
title: Class Name Conventions
layout: default
---

# Class Name Conventions #

Infusion components use various conventions for defining CSS class names. These conventions prevent confusion, making it easier for developers and integrators to be clear on what's what when creating or using components.

## CSS classnames ##

The template for **CSS classnames** (i.e. class names use for styling) take the form **fl-[fluid:thing]-[fluid:role]-[fluid:state]** with some guidelines:

1. multiple words are in camelCase, so they might look like **fl-[fluid:multiWordThing]-[fluid:multiWordRole]-[fluid:state]**
2. components are always the first "thing", so they would look like **fl-[fluid:componentName]-[fluid:thing]-[fluid:role]-[fluid:state]**

**[fluid:thing]** = _required_ the concept the class name is referring to at the most general yet still meaningful level (eg. fl-**tabs**, fl-**widget**, fl-**col**, fl-**container**, etc)

**[fluid:role]** = _optional_ the purpose or action of **THING**, which could be a more detailed version of **THING** (eg. fl-tabs-**centered**, fl-col-**flex**, fl-container-**500**, fl-widget-**titleBar**)

**[fluid:state]** = _optional_ a modifier of the **ROLE** or **THING**, which is only temporary and dependant on other actions (eg. fl-button-left-**disabled**, fl-widget-content-**draggable**)

Some examples of these class names:

* `fl-col-flex`: a flexible width column
* `fl-tabs-left`: left-oriented tabs
* `fl-grid-caption`: the caption of an image in a grid
* `fl-widget-titlebar`: the titlebar of a widget

## Infusion selectors ##

The template for **Infusion selectors** (i.e. classnames used for programmatic manipulation of the DOM) take the form

    **flc-[fluid:componentName]-[fluid:thing]-[fluid:role]-[fluid:state]**

with the same guidelines as CSS selectors.

Some examples of component selectors:

* `flc-progress-label`: the label for a progress bar ([Progress](to-do/Progress.md) component)
* `flc-reorderer-dropWarning`: the drop warning used with the reorderer ([Reorderer](to-do/Reorderer.md) component)
* `flc-inlineEdit-textEditButton`: the 'edit' button used with an inline edit ([Inline Edit](to-do/InlineEdit.md) component
* `flc-pager-pageLink-skip`: a page link that should be skipped ([Pager](to-do/Pager.md) component)

When combining class names for styling and class names for selectors, the convention is 

```html
<el class="flc-* fl-*">
```

so that the DOM selectors are before the CSS selectors.
