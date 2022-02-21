---
title: Working with UI Options
category: Tutorials
---

Once User Interface Options or a Preferences Editor is incorporated into your website (see the [User Interface Options
tutorial](./UserInterfaceOptions.md) for installation procedure), it's important to ensure that the site transforms and
responds correctly.

This documentation assumes you are somewhat comfortable with writing and editing CSS.

In addition to the methods below, [Integrating UI Options Styling Preferences](./IntegratingUIOptionsStylingPreferences.md),
describes the [CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
UI Options provides. These can be used as an alternative or additional approach for applying your own custom styling
when a preference is applied.

## Contrast Themes

UI Options adds support for high contrast themes by transforming the colours on your website. Since contrast themes
transform almost all aspects of the webpage, it's probable there will be some styling issues initially. This section
aims to help you fix some common issues.

UI Options transforms the user interface into one of four high contrast or one low contrast colour combinations:

* high contrast
  * black on white
  * white on black
  * black on yellow
  * yellow on black
* low contrast
  * light grey on dark grey

The themes attempt to remove any other colours from the interface, along with gradients, shadows, background images, and
other styling that may reduce legibility. This type of contrast interface can be extremely helpful for users with
different forms vision needs.

UI Options applies contrast themes by adding a special class to the `<body>` element of the document and providing
styles that are scoped to that class. You will likely need to create a few more special classes, scoped to the theme,
for some areas of your site.

To help you in creating a website that works well with UI Options, here are a few basic guidelines:

* [Make cosmetic graphics background images in CSS; create contrast versions; and use CSS to swap in the contrast versions when the themes are activated.](./UsingImagesInContrastModes.md)
* [Improve clarity and legibility by removing gradients, shadows, and other styling effects.](./StyleEffectsAndLegibilityInContrastModes.md)
* [Double-check use of CSS "content" property](./ContentPropertyHighContrast.md)

## How to define special styles for contrast themes

If something doesn't transform into contrast mode automatically when using the contrast adjustment, here's how you
define styles to address those cases:

### Scope your styles to the theme name

UI Options will add the theme name as a class to the `<body>` element.

* yellow (`#FFFF00`) on black (`#000000`): `<body class="fl-theme-yb">`
* white (`#FFFFFF`) on black (`#000000`): `<body class="fl-theme-wb">`
* black (`#000000`) on yellow (`#FFFF00`): `<body class="fl-theme-by">`
* black (`#000000`) on white (`#FFFFFF`): `<body class="fl-theme-bw">`
* light grey (`#BDBDBB`) on dark grey (`#555555`): `<body class="fl-theme-lgdg">`

Scope your styles using the class name as shown in the following example. This example is for the yellow on black theme,
which uses the class name `fl-theme-yb`:

```html
<body class="fl-theme-yb">
    <div class="toolbar">
        <a class="helpLink">Help</a>
    </div>
</body>
```

```css
/* default style for button */
.toolbar .helpLink {
    background: #efefef;
    color: #008cba;
    outline: solid 0.2rem #008cba;
    text-shadow: 1px 1px 0 #fff;
}

/* high contrast for button */
.fl-theme-yb .toolbar .helpLink {
    background: #000;
    color: #ff0;
    outline: solid 0.2rem #ff0;
    text-shadow: none;
}
```

<div class="infusion-docs-note"><strong>Note:</strong>
    <p>
        In some cases you may have to use the <code>!important</code> rule with your contrast styles to make them work.
        For example: <code>color: #ff0 !important;</code>.
    </p>
    <p>
        Using <code>!important</code> should be used carefully as documented in <a
        href="https://css-tricks.com/when-using-important-is-the-right-choice/">this article on CSS-tricks.com</a>.
    </p>
</div>

### Make sure you have styles for all the themes

UI Options defines five contrast themes:

* yellow (`#FFFF00`) on black (`#000000`): theme class name `fl-theme-yb`
* white (`#FFFFFF`) on black (`#000000`): theme class name `fl-theme-wb`
* black (`#000000`) on yellow (`#FFFF00`): theme class name `fl-theme-by`
* black (`#000000`) on white (`#FFFFFF`): theme class name `fl-theme-bw`
* light grey (`#BDBDBB`) on dark grey (`#555555`): theme class name `fl-theme-lgdg`

If you need to define a style for a contrast theme, you'll most likely need to define styles all the themes. The styles
will likely look very similar to each other, with differences only related to the colours:

```css
/* contrast background icon for button. these images have a transparent background */
.fl-theme-yb .toolbar .saveButton {
    background-image: url('images/save-yellow.png');
}

.fl-theme-wb .toolbar .saveButton {
    background-image: url('images/save-white.png');
}

.fl-theme-by .toolbar .saveButton,
.fl-theme-bw .toolbar .saveButton {
    background-image: url('images/save-black.png');
}

.fl-theme-lgdg .toolbar .saveButton {
    background-image: url('images/save-grey.png');
}
```

Creating contrast styles can be simplified by mix-ins if you are using a CSS stylesheet language like Sass, Stylus, or
LESS.

### Use background images when possible

If you're using images to give your buttons or menu items a unique look, follow these guidelines:

* use semantically appropriate tags for your graphics. For example, images important to your content should use `<img>`,
  and cosmetic images can be implemented as background images in CSS. UI Options can replace background images using CSS
  only.
  * See [Using Images in Contrast Modes](./UsingImagesInContrastModes.md).
* ensure background images are sized to scale to fit their container (for more info, see
  [Background Size on Mozilla Developer](https://developer.mozilla.org/en-US/docs/CSS/background-size))
  * contain and cover preserve proportions of image
  * a percentage will stretch image
  * use `background-size: 100%;`
* don't build the label text into the image, instead consider using `<figure>` elements with a corresponding `<figcaption>`
  tag. See [`<figure>` on Mozilla Developer](https://developer.mozilla.org/en/docs/Web/HTML/Element/figure).
* if the 'image' is a gradient, consider using CSS gradients. See
  [Style Effects and Legibility in Contrast Modes](./StyleEffectsAndLegibilityInContrastModes.md) for more information.

## Testing Your Changes With UI Options

### Enlarge the font

Open the UI Options interface and use the "Text Size" control to enlarge the font. Check the site:

* does the text enlarge correctly?
* is the layout of the entire page still reasonable?

To help make your webpage respond better with UI Options, see the suggestions in this article: ["How to make your page
more responsive"](https://wiki.fluidproject.org/display/fluid/How+to+make+your+page+more+responsive).

### Increase the line spacing

Open the UI Options interface and use the "Line Spacing" control to increase the line spacing.

* If you use a pixel value, it will not scale when User Interface Options is used to increase line height.
* If you use em or percentages, the value not be inherited correctly by elements inside your element.

The safest way to use line-height is as a unitless number, which will multiply the element's font size. This will also
allow line heights to be adjusted by User Interface Options correctly. For more information, see the [MDN documentation
on line-height](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height).

If you find that the layout of your website does not lay out properly, or does not scale according to the text size, you
may need to [switch to using `rem` or `em` values
instead](https://wiki.fluidproject.org/display/fluid/How+to+make+your+page+more+responsive#Howtomakeyourpagemoreresponsive-Useremoremforcontainersizes).

### Try each of the themes

Open the UI Options interface and use the "Colour & Contrast" control to select each of the contrast themes. Check the
site:

* is all of the text in the correct colours?
* do buttons and links appear in the selected contrast?
* do icons and logos appear in the selected contrast?
* does anything still have shadows or gradients in the wrong colours?
* are hover and focus styles reasonable?

In the cases where the contrast isn't being applied, you will need to create specific CSS rules to fix them. [Style
Effects and Legibility in Contrast Modes](./StyleEffectsAndLegibilityInContrastModes.md) describes the general approach
of using CSS to fix contrast styling issues.

### Try each of the fonts

Open the UI Options interface and use the "Text Style" control and select each of the different font styles. Check the
site:

* is all of the text in the correct font?
* is the layout of the page still reasonable?
* some fonts take up more room than others, and sometimes selecting a different font might affect the overall layout of
  the page.

To fix font related issues, you may have to fix styling issues related to overflow, text wrapping / breaking, margins,
and padding.

### Enhance links and enlarge inputs

Open the UI Options interface and use the controls under "Enhance Inputs" to enhance links and buttons. Check the site:

* are links underlined, bolded and enlarged?
* are inputs (such as text fields and buttons) enlarged?

A common issue occurs when links are styled to appear like buttons. UI Options will treat them as links despite them
looking like buttons. Consider using the appropriate semantic markup for links and buttons instead. Links "take you
somewhere", whereas buttons "do something". For an explanation of buttons vs. links, see "[When to Use the Button
Element](https://css-tricks.com/use-button-element/)" on CSS-Tricks.com.

### Check Table of Contents

Open the UI Options interface and use the control under "Table of Contents" to show the table of contents. Check the
site:

* are all Headers appearing in the table of contents?
* do all links in the table of contents go to the proper place?
* are Headers marked as "ignored" correctly omitted from the table of contents?
