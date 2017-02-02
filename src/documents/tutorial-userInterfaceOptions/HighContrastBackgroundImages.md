---
title: High contrast background images
layout: default
category: Tutorials
---

## Logos

While logos are typically implemented using <img> tags, using background images instead makes it very simple to substitute a different version of the image when a high-contrast theme is used. The following example shows how this can be done.

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

For suggestions on how to convert images to high-contrast versions using Photoshop, see [Converting Images to High Contrast](./ConvertingImagesToHighContrast.md).

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
