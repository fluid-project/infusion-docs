---
title: How to Create and Use Font Icons
layout: default
category: Tutorials
---

Using a font to render an icon has several advantages over the traditional method of using an image. This tutorial will
explain how to create Font Icons.

Some of the advantages of icons include:

* Scalable - works nicely regardless of client's magnification or view device DPI;
* Can change the colour with CSS;
* Can do everything traditional icons can (e.g. change opacity, rotation, etc.);
* Can add strokes, gradients, shadows, and etc.;
* Convert to text (with ligatures);
* Ligatures are read by screen readers;
* Changing icons used is as simple as changing the font-family in CSS.

However, there are some shortcomings to keep in mind:

* Icon fonts are generally mono tone in colour.
* IE8 and IE9 do not support ligatures.
* Need to use `!important` or scoping to prevent globally changing fonts from swapping out the icons.
* In situations where there is existing text accompanying an icon, specific markup containers need to be created for the
  icon.
* Modifying the icon font requires generating a whole new font file

## Procedure Summary

* Create the icon and save it as an SVG graphic.
* Use [IcoMoon](http://icomoon.io/) to generate a font from an SVG graphic.
* Add the font to your markup. Example:

```css
@font-face {
    font-family: 'CustomIcons';
    src: url('../fonts/CustomIcons.ttf'),
         url('../fonts/CustomIcons.eot');
}

a.myLink-icon {
    font-family: 'CustomIcons';
}

a.myLink-icon:before {
    content: "\e000"; /* The custom Unicode (aka. PUA) for the icon you want. */
    color: #ED3820;   /* Custom colour. */
}
```

## Step 1. Creating an SVG Symbol

Use illustration software to create an SVG version of the icon you want to use as a font.

Tips:

* The dimensions of the graphic doesn't matter since everything will be scaled by the browser's font-rendering. However,
  all of the icons should be sized and drawn in a consistent fashion.
* Work in binary (i.e. black and white) and do not apply effects such as drop-shadows or embossing.
* Sometimes the font conversion of the SVG may not work properly, so be prepared to edit your SVG file again.
* Overlapping regions of shapes may cause a subtraction when converted in IcoMoon (i.e. it will render as transparent) -
  in this case you may need to build a single shape from these conflicting shapes, or ensure none of your shapes overlap.

Download Example SVG file: [pencil-icon-01.svg](../images/pencil-icon-01.svg)

Consult the [Infusion Icons Visual Style Guide](https://wiki.fluidproject.org/display/fluid/Infusion+Icons+Visual+Style+Guide)
for how icons are created for Infusion.

## Step 2. Generating the Font

### Using Infusion-Icons to Generate the Font

This is the preferred method for use with Infusion related projects because it makes modifying the font and tracking PUA
codes much simpler. Once the [Infusion-Icons npm module](https://www.npmjs.com/package/infusion-icons), and all its
dependencies, are installed, fonts can be generated with a config file.

(See: [Infusion-Icons README](https://github.com/fluid-project/infusion-icons/blob/master/README.md) for more detailed
instructions)

#### Example

```json
{
    "src": [
        "svg/iconName.svg"
    ],
    "options": {
        "font": "CustomIcons",
        "codepoints": {
            "iconName": "0xE000"
        }
    }
}
```

```bash
# generating an Icon Font from a config file
grunt build --config="path/to/config.json"
```

### Using IcoMoon to Generate the Font

Steps:

1. Go to [IcoMoon](http://icomoon.io/app) (you can also run IcoMoon in "offline" mode in Chrome browser by installing
   the [IcoMoon Chrome app](http://goo.gl/we6ra))
2. Import your SVG icon - select "Import Icons" and choose your SVG file.
3. Select your icon from the list (should appear under "Your Custom Icons" section, and select the "Font ->" button at
   the bottom of the screen.
4. Save the ZIP file to a known location.
    * Note: selecting the "Preferences" button will give you options to name your CSS classes and files. It i
      recommended you use identifiers
5. Extract the contents of the ZIP file.
    * The files we are most interested in are the `./fonts/*.eot`, `./fonts/*.woff`, and the `./index.html` files.
6. To verify that the font looks proper, open the `./index.html` file in a web browser. If the icon doesn't look right,
   you may need to edit the SVG file and repeat the font generation process.

## Step 3. Working with CSS and HTML

Once you are satisfied with the appearance of your font, it is time to add it to your HTML and CSS markup.

First, add or identify an element in your HTML markup for the new icon.

For example you have the following existing HTML and CSS:

```html
/* Existing HTML markup before adding new icon font. */
<a href="contact.html" id="contact_form">Contact us</a> /*this where the new font icon will go */
```

```css
/* Existing CSS markup for the HTML before adding new icon font. */
#contact_form {
    background: url("../images/envelope.png"); /*existing image that will be replaced by icon */
}
```

Next, add the new font to the CSS markup.

```css
@font-face {
    font-family: 'CustomIcons';                /*Specify the new font */
    src: url('../fonts/CustomIcons.eot?#iefix') format('embedded-opentype'), /* IE8 fix. */
         url('../fonts/CustomIcons.woff');
}

#contact_form {
    background: url("../images/envelope.png"); /*existing image that will be replaced by icon */
    font-family: 'CustomIcons';                /*the new font icon */
}
```

Finally, add the new icon into the BEFORE pseudo class and delete any references to the old icon image.

```css
@font-face {
    font-family: 'CustomIcons';                /*Specify the new font */
    src: url('../fonts/CustomIcons.eot?#iefix') format('embedded-opentype'), /* IE8 fix. */
         url('../fonts/CustomIcons.woff');
}

#contact_form {
    /* old icon image has been removed. */
    font-family: 'CustomIcons';                /*the new font icon */
}

#contact_form:before {
    content: "\e000";                          /*the custom Unicode (aka. PUA) for the icon.*/
}
```

This is all that is needed to add the new icon to your markup. You will notice there is a line specific to IE8 - for
more information on this, please see
[http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax](http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).

## Unicode for font

_The Unicode (or "PUA code") for the custom font, generated by IcoMoon, can be found in the HTML and CSS file. If the
HTML and CSS files are unavailable, you can retrieve the Unicode using one of the methods listed under the section
"[Dealing with the TTF Unicode](HowToCreateAndUseFontIcons.md#dealing-with-the-unicode)" below._

**However, there is a problem** - the new icon font will replace the existing font of its container and all child
elements and therefore removing any font styling you may have wanted to preserve. The next section will outline common
issues and how to fix them and some best practices.

## Common Issues

### Preserving Existing Fonts

In the example above, the new custom icon font was added to an element that has existing text which causes a problem -
any other existing custom font will be overwritten within that container.

To illustrate this problem, assume Comic Sans is the font applied to the `<body>` element of our example, and an icon
font added to the `<a>` anchor within the `<body>`. Comic Sans will appear throughout the document except for the
contents within the `<a>`, which means "Contact us" will no longer be Comic Sans.

```html
<body>
    /* "Contact Us" should be in comic sans  */
    <a href="contact.html" id="contact_form">Contact us</a>
</body>
```

```css
@font-face {
    font-family: 'CustomIcons';
    src: url('../fonts/CustomIcons.ttf'),
         url('../fonts/CustomIcons.eot');
}

body {
    font-family: 'Comic Sans MS';
}

#contact_form {
    font-family: 'CustomIcons';
}

#contact_form:before {
    content: "\e000";
}
```

To overcome this issue, a new separate element should be created in the HTML for the icon font with no other content
contained within. The CSS file is then updated to reference this new markup structure.

```html
<body>
    /* "Contact Us" should be in comic sans */
    <span id="#icon-envelope"></span><a href="contact.html" id="contact_form">Contact us</a>
</body>
```

```css
@font-face {
    font-family: 'CustomIcons';
    src: url('../fonts/CustomIcons.ttf'),
         url('../fonts/CustomIcons.eot');
}

body {
    font-family: 'Comic Sans MS';
}

#icon-envelope {
    font-family: 'CustomIcons';
}

#icon-envelope:before {
    content: "\e000";
}
```

### Images and Labels

It's common for images to be used in functional ways such as acting as a button within an anchor tag. For example:

```html
<a href="download.html"><img src="./images/download.png" alt="Download our latest stuff!"></a>
```

However if we replace the image in the anchor with an icon font, any text descriptions (the alt text of the original image) will be removed as well; potentially causing usability and accessibility issues.

```html
/* The alt text is now gone, causing a usability and accessibility issue. */
<a href="download.html"></a>
```

```css
@font-face {
    font-family: 'CustomIcons';
    src: url('../fonts/CustomIcons.ttf'),
         url('../fonts/CustomIcons.eot');
}

a {
    font-family: 'CustomIcons';
}
a:before {
    content: "\e001";
}
```

To bring back some semantics and to help improve accessibility, we use "aria-label" to describe the functionality.

```html
/* Aria-label takes the place of alt text. */
<a href="download.html" aria-label="Download our latest stuff!"></a>
```

### Cross-Browser Oddities

Icon fonts can appear different across browsers and across operating systems. For example, the following icon is
rendered differently in Firefox in Mac OS X and in Windows despite being the same icon and the same browser.

![a partially displayed font icon on firefox, Mac system](../images/Icon-FF-OSX.png)
![a partially displayed font icon on firefox, Windows system](../images/Icon-FF-windows.png)

To avoid these rendering problems, when creating the SVG images avoid using fine details - not only does this help
eliminate details in the icon font being lost during rendering, it also helps improve usability through clearer
icons.

### IE8 Compatibility

To ensure custom fonts get rendered properly in Internet Explorer 8, you will need to add `?#iefix')
format('embedded-opentype')` to your CSS. For example:

```css
@font-face {
    font-family: 'CustomIcons';                /*Specify the new font */
    src: url('../fonts/CustomIcons.eot?#iefix') format('embedded-opentype'), /* IE8 fix. */
         url('../fonts/CustomIcons.ttf'),
         url('../fonts/CustomIcons.eot');
}
```

The IE8 fix needs to be the first URL in the list of sources otherwise the font will not appear.

Reference: [http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax](http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax)

### Dealing with the Unicode

Infusion-Icons generates the icon font based off of a config where the Unicode values can be specified;
IcoMoon conveniently generates an HTML and CSS file for custom fonts which contain the Unicode to be used in your
markup. However, if the information about the Unicode values is lost, here are two ways to obtain them.

#### Obtaining Unicode on the Web

1. Open a tool like [FontDrop!](https://fontdrop.info)
2. Upload the font file
3. Inspect the icon information to find the Unicode value.
    * In FontDrop! the Unicode value will appear by hover over or clicking on the glyphs.

#### Obtaining Unicode in Windows

1. Install the custom TTF font to the OS (usually a right-click then select "Install" from the context menu).
2. Run Character Map (done by searching the Start menu, or by typing Win+R then "charmap").
3. Select the custom font from the Font drop-down menu. The glyphs in the custom font should now appear in the window.
4. Select a character in the window. The Unicode will appear in the bottom-left corner in the status bar.

![Unicode character map](../images/Unicode-charmap.png)

## What about SVG Icons

SVG icons can be used as an alternative to icons supplied through an icon font. Below is a quick summary of the pros and
cons of SVG Icons. For more information on SVG Icons see the
[Research SVG Icons](https://wiki.fluidproject.org/display/fluid/Research+SVG+Icons) wiki page.

### Benefits of SVG Icons

* Can use multiple colours
* Can support complex icons including multiple colours
  * although it increases the complexity to style with CSS
* Don't have to compile into a font

### Drawbacks of SVG Icons

* Less browser support, although modern browsers should handle most features
* Many different ways to add to a page, but only those that allow access to the SVG markup will permit styling via CSS
* Styling multi-coloured SVGs can be complex and may not always be supported
* Depending on how they are added to the page, may make reading page markup harder
* Depending on how they are added to the page, may increase transfer size due to lack of caching.
