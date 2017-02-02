---
title: Using Images in Contrast Modes
layout: default
category: Tutorials
---

The User Interface Options component allows users to easily transform pages into one of several contrast versions. The results of this transformation are much more complete if any logos, images, and other graphics are also converted to match the contrast scheme.

If you are integrating UI Options into your site, we highly recommend you create contrast versions of your site logo, and any other similarly static image. This page provides simple steps you can use if you have Photoshop or similar image editing software.

This guide uses Photoshop as an example.

![A logo appearing properly with a yellow-on-black contrast theme](../images/tutorial-uio-good-bad-logos.png)

UI Options provides four high-contrast themes:

* black on white
* white on black
* black on yellow
* yellow-on-black

These themes would require three versions of your logo: all-black, all-white and all-yellow.

For suggestions on how to create the CSS to swap in the high-contrast images, see "High contrast background images" further down this page.

## Converting Images With Transparency

The simplest images to convert are ones that already have a transparent background. Creating high-contrast versions involves simply 'locking' the transparent pixels so they stay transparent and then painting over everything not-transparent with the desired colour.

### Step 1 - Lock the transparent pixels

In Photoshop, you can lock the transparent pixels in one of at least two ways:

1. Type the '/' key, or
2. In the "Layers" panel, click the 'lock pixels button (see image below).

![Image of the Photoshop Layers panel with the mouse cursor hovering over the Lock transparent pixels button]

### Step 2 - Fill the rest of the image with the desired colour

In Photoshop, there are several ways to fill the image with a single colour:

1. Type Alt + Delete on Mac, or Alt + Backspace on Windows to fill the image with the current foreground colour, or
2. Type Command + Delete on Mac, or Command + Backspace on Windows to fill the image with the current background colour, or
3. Choose a paintbrush and a foreground colour, and drag the cursor over the image.

### Step 3 - Save the image for the web

* On Mac: Type Shift + Alt + Command + S
* On Windows: Type Shift + Alt + Ctrl + S

### Another handy tip

If you've created a black (or white) image, you can easily invert the colour to convert it to white (or black) by typing Command + I on Mac, or Ctrl + I on Windows.

## Background Images and Logos

While logos are typically implemented using `<img>` tags, using background images instead makes it very simple to substitute a different version of the image when a high-contrast theme is used. The following example shows how this can be done.

### HTML
```html
<a class="site-logo" title="Inclusive Design Institute"
   href="http://inclusivedesign.ca/">
</a>
```

### CSS
```css
.site-logo {
    background-image: url("images/logo.png");
    background-position: 4.1em 0;
    background-repeat: no-repeat;
    height: 4.3em;
    margin-left: auto;
    margin-right: auto;
}
/* white logo for white-on-black theme */
.fl-theme-uio-wb .site-logo {
    background-image: url("images/logo-white.png");
}
/* yellow logo for yellow-on-black theme */
.fl-theme-uio-yb .site-logo {
    background-image: url("images/logo-yellow.png");
}
/* black logo for black-on-white and black-on-yellow themes */
.fl-theme-uio-bw .site-logo,
.fl-theme-uio-by .site-logo {
    background-image: url("images/logo-black.png");
}
```

The site's logo is implemented as a background image on a link to the site's home page. The original style for the image specifies the image file and positions it as desired. The high-contrast images are substituted by using the same selector prefaced with the theme class, and specifying only the new image file. All other styles remain the same.

When a user selects a high-contrast theme using UI Options, the theme class will be added to the <body> of the document and the high-contrast logo will automatically be loaded.

Note that the high-contrast logos are implemented using a transparent background so the black logo can be used for both the black-on-white theme and the black-on-yellow theme.

## Icons

Icons, for example on navigational tabs, are often implemented as background images. When they are, it's extremely easy to define a high-contrast version. The following example shows how this can be done.

### HTML

```html
<div class="nav-links">
  <ul>
    <li><a href="about" class="idi_about">About</a></li>
    <li><a href="people" class="idi_people current_page">People</a></li>
    <li><a href="news" class="idi_news">News</a></li>
  </ul>
</div>
```

```css
.nav-links .idi-people.current_page {
  background-image: url("images/people-white.png");
  background-position: 0.3em 50%;
  background-repeat: no-repeat;
  background-size: auto 75%;
  padding-left: 2em;
  background-color: #0076B0;
  color: #FFFFFF;
}
.fl-theme-uio-by nav-main .idi-people.current_page {
    background-image: url("images/people-yellow.png");
}
.fl-theme-uio-yb nav-main .idi-people.current_page,
.fl-theme-uio-wb nav-main .idi-people.current_page {
    background-image: url("images/people-black.png");
}
```

In this example, the 'current page' tab has an inverted colour scheme. The default colour would appear as shown in the following image:
![A graphical icon in its default colour of blue on white.](/images/tutorial-uio-icon-regular.png)

The high-contrast version of the theme inverts the colour, so in the "black-on-white" theme, for example, the icon will actually be white:
![A graphical icon in black on white contrast theme.](/images/tutorial-uio-icon-hc.png)
