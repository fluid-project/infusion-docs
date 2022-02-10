---
title: Integrating UI Options Styling Preferences
category: Tutorials
---

Enactors modify a website to meet the preferences specified through UI Options. However, not all enactors modify
the styling of a website. For those that do, stylesheets are provided in `src/framework/preferences/css/` to facilitate
this application. Each styling related enactor will provide its own stylesheet(s), so that an integrator can import only
the styles for the enactors they are using in their particular configuration. Alternatively the `Enactors.css` or
`Enactors_base.css` stylesheets can be used to quickly access all of the available styling enactors styles.

## Sass

The styles for UI Options are written using [Sass](https://sass-lang.com), using
[SCSS syntax](https://sass-lang.com/documentation/syntax#scss). All of the related Sass files are contained within the
`src/framework/preferences/css/sass`. These stylesheets are used to style the Preference Editors as well provide the
means for applying enactor styles to a website. The Sass files may be used directly within an integrators own build
tools. Additionally pre-compiled CSS equivalents are provided at `src/framework/preferences/css/`.

<div class="infusion-docs-note">

<strong>Note:</strong> `src/framework/preferences/css/sass/utils/` contains
<a href="https://sass-lang.com/guide#topic-4">Sass partials</a> with
<a href="https://sass-lang.com/documentation/at-rules/mixin">mixins</a> for other Sass files to import. These files are
not compiled into CSS.

</div>

## Enactor Stylesheets

### Base Stylesheets

The styling related enactors use [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
as hooks for applying the styling. Some enactors such as `Text Size`, set their CSS custom properties (e.g.
`--fl-textSize`) via JavaScript, others supply them via classes in their related `*_base` stylesheet. For example the
`Enhance Inputs` preference sets the class `fl-input-enhanced` and uses the `EnhanceInputs_base.css` stylesheet. An
integrator can hook into the enactor's CSS custom properties to implement their own styles, allowing the site to
automatically adapt along with the preference changes.

```css
/* set font size of the main element with the `--fl-textSize` custom property if it's set */
main {
    font-size: var(--fl-textSize, 1rem);
}

/* scale the font-size of the my-custom-input class when enhance inputs is enabled */
.my-custom-input {
    font-size: calc(var(--fl-enhance-font-size-factor, 1) * 1.3rem);
}
```

### Drop-in Style Application

To allow for quicker initial integration with UI Options, an integrator may choose to use the drop-in stylesheets, which
will additionally provide a set of pre-designed styles to apply the preference. For example the `Enhance Inputs`
preference provides the `EnhanceInputs.css` stylesheet. `Enactors.css` will provide the complete set of enactors styles
with their application.

<div class="infusion-docs-note">

<strong>Note:</strong> The drop-in styles are necessarily heavy handed, and include <code>!important</code> to attempt
to override default styles. If the drop-in styles need to be overridden, it may be better to use the <code>*_base</code>
stylesheets and build up custom styles for the site.

</div>

## CSS Custom Properties

### Sizing and Factors

The enactors that provide sizing adjustments follow a
convention where a related `-factor` suffixed custom property is also provided. The purpose is to provide a means for
scaling your existing styles, rather than applying a specific value.

For example, when the Line Spacing preference is adjusted, the value is a multiplier of the initial `line-height` value
(typically this is `1.2`). If the Line Spacing is set to `1.5` the `--fl-lineSpace` is set to `1.8`; (`1.2` * `1.5`).
The `--fl-lineSpace-factor` is set to the multiplier value of `1.5`.

```css
main {
    /* sets a specific line-height */
    line-height: var(--fl-lineSpace); /* evaluates to 1.8 */
}

main .intro {
    /* scales line-height based on the original value */
    line-height: calc(var(--fl-lineSpace-factor, 1) * 1.3); /* evaluates to 1.95 */
}
```

### Enactors

#### Contrast

The contrast CSS custom properties are set when one of the contrast classes (e.g. `.fl-theme-bw`) is applied.

* `--fl-fgColor`: foreground colour, often text colour
* `--fl-bgColor`: background colour
* `--fl-linkColor`: text colour for links
* `--fl-disabledColor`: text colour for disabled inputs
* `--fl-selectedFgColor`: colour for selected text
* `--fl-selectedBgColor`: selection background colour
* `--fl-buttonFgColor`: text colour for buttons
* `--fl-buttonBgColor`: background colour for buttons

#### Enhance Inputs

The CSS Custom properties added by the `.fl-input-enhanced` class:

* `--fl-enhance-font-size-factor`: (default is 1.25) the factor of the font-size increase, can be used with `calc`.
* `--fl-enhance-font-size`: (default is 125%) the font-size value
* `--fl-enhance-font-weight`: (default is bold) font-weight value
* `--fl-enhance-text-decoration`: (default is underline) the text-decoration value. Used to enhance links.

#### Font

Makes use of the `src/framework/preferences/css/sass/utils/_fonts.scss` partial; which may be useful if defining custom
fonts for use with the UI Options, in your own Sass build.

The following custom property is set when one of the font classes (e.g. `fl-font-arial`) is applied.

* `--fl-font-family`: the font family to apply

#### Letter Space

Set programmatically with JavaScript on the enactor's container element, usually the body.

* `--fl-letterSpace-factor`: the factor of the letter space change, can be used with `calc`.
* `--fl-letterSpace`: the letter-spacing value

#### Line Space

Set programmatically with JavaScript on the enactor's container element, usually the body.

* `--fl-lineSpace-factor`: the factor of the line height change, can be used with `calc`.
* `--fl-lineSpace`: the line-height value

#### Text Size

Set programmatically with JavaScript on the enactor's container element, usually the body.

* `--fl-textSize-factor`: the factor of the font size change, can be used with `calc`.
* `--fl-textSize`: the font-size value

#### Word Space

Set programmatically with JavaScript on the enactor's container element, usually the body.

* `--fl-wordSpace-factor`: the factor of the word-spacing change, can be used with `calc`.
* `--fl-wordSpace`: the word-spacing value
