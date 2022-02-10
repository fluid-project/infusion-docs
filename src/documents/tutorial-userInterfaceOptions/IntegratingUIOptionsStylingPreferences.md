---
title: Integrating UI Options Styling Preferences
category: Tutorials
---

Enactors modify a website to meet the preferences specified through UI Options. However, not all enactors modify
the styling of a website. For those that do, stylesheets are provided to facilitate this application. Each stlying
related enactor will provide its own stylesheet(s), so that an integrator can import only the styles for the enactors
they are using in their particular configuration. Althernatively the `Enactors` or `Enactors_base` stylesheets can be
used to quickly access all of the available styling enactors styles.

## Enactor Stylesheets

### Base Styleheets

The styling related enactors use [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
as hooks for applying the styling. Some enactors such as `Text Size`, set their CSS custom properties via JavaScript,
others supply them via classes in their related `*_base` stylesheet. For example the `Enhance Inputs` preference uses
the `EnhanceInputs_base` stylesheet. An integrator can hook into the enactor's CSS custom properties to implement their
own styles, allowing the site to automatically adapt along with the preference changes.

### Drop-in Style Application

To allow for quicker initial integration with UI Options, an integrator may choose to use the drop-in stylesheets, which
will additionally provide a set of pre-designed styles to apply the prefernce. For example the `Enhance Inputs`
preference provides the `EnhanceInputs.css` stylesheet. `Enactors.css` will provide the complete set of enactors styles
with their application; similar to how previous versions of Infusion supported styling for enactors.

<div class="infusion-docs-note">

<strong>Note:</strong> The drop-in styles are necessarily heavy handed, and include <code>!important</code> to attempt
to override default styles. If the drop-in styles need to be overridden, it may be better to use the <code>*_base</code>
stylesheets and build up custom styles for the site.

</div>

## CSS Custom Properties

### Contrast

The contrast CSS custom properties are set when one of the contrast classes (e.g. `.fl-theme-bw`) is applied.

* `--fl-fgColor`: foreground colour, often text colour
* `--fl-bgColor`: background colour
* `--fl-linkColor`: text colour for links
* `--fl-disabledColor`: text colour for disabled inputs
* `--fl-selectedFgColor`: colour for selected text
* `--fl-selectedBgColor`: selection background colour
* `--fl-buttonFgColor`: text colour for buttons
* `--fl-buttonBgColor`: background colour for buttons

### Enhance Inputs

The CSS Custom properties added by the `.fl-input-enhanced` class:

* `--fl-enhance-font-size-factor`: (default is 1.25) the factor of the font-size increase, can be used with `calc`.
* `--fl-enhance-font-size`: (default is 125%) the font-size value
* `--fl-enhance-font-weight`: (default is bold) font-weight value
* `--fl-enhance-text-decoration`: (default is underline) the text-decoration value. Used to enhance links.

### Font

Makes use of the `utils/_fonts.scss` for mixin functions; which may be useful if defining custom fonts for use with the
Preferences Framework.

The following custom property is set when one of the font classess (e.g. `fl-font-arial`) is applied.

* `--fl-font-family`: the font family to apply

### Letter Space

Set programmatically with JavaScript on the enactors container element, usually the body.

* `--fl-letterSpace-factor`: the factor of the letter space change, can be used with `calc`.
* `--fl-letterSpace`: the letter-spacing value

### Line Space

Set programmatically with JavaScript on the enactors container element, usually the body.

* `--fl-lineSpace-factor`: the factor of the line height change, can be used with `calc`.
* `--fl-lineSpace`: the line-height value

### Text Size

Set programmatically with JavaScript on the enactors container element, usually the body.

* `--fl-textSize-factor`: the factor of the font size change, can be used with `calc`.
* `--fl-textSize`: the font-size value

### Word Space

Set programmatically with JavaScript on the enactors container element, usually the body.

* `--fl-wordSpace-factor`: the factor of the word-spacing change, can be used with `calc`.
* `--fl-wordSpace`: the word-spacing value
