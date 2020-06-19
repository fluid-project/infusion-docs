---
title: Style Effects and Legibility in Contrast Modes
layout: default
category: Tutorials
---

One of the goals of the contrast themes is to provide legibility and clarity for viewers. Shadows on text or other
graphics can provide appealing visual effects, but this can adversely affect legibility for some people. When creating
styles for contrast modes, it's important to remember to remove such shadows and other graphical effects.

## Improving Clarity - Removing Drop Shadows

```html
<button class="idi-prefs-button">preferences</button>
```

```css
.idi-prefs-button {
    color: #000000;
    text-shadow: 0.1rem 0.1rem 0 #FFFFFF;
    background-color: #E5E5E5;
    background-image: url("images/preferences.png");
    background-position: 0.4em 50%;
    background-repeat: no-repeat;
    width: 8em;
}
.fl-theme-yb .idi-prefs-button {
    text-shadow: none;
    border: 0.1rem solid yellow;
    background-image: url("images/preferences-yellow.png");
}
```

This button uses a white drop shadow on the black text to provide an elegant embossed look:

![A button with text label with a shadow effect.](../images/tutorial-uio-shadow-regular.png)

But such a shadow would be inappropriate for a high contrast theme. In this example (the yellow-on-black theme in this
case), the text shadow is removed completely:

![A button with a yellow yellow text label on a black background.](../images/tutorial-uio-shadow-hc.png)

## Another Example - Gradients

Gradients are often used for visual effects, as well as giving buttons a 3D effect. The example below shows how to use
the UI Options contrast class to improve legibility for contrast modes.

```html
<button class="search-btn">Search</button>
```

```css
.search-btn {
  background: rgba(70,140,170,1);
  background: -moz-linear-gradient(top, rgba(70,140,170,1) 0%, rgba(19,88,118,1) 100%);
  background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(70,140,170,1)), color-stop(100%, rgba(19,88,118,1)));
  background: -webkit-linear-gradient(top, rgba(70,140,170,1) 0%, rgba(19,88,118,1) 100%);
  background: -ms-linear-gradient(top, rgba(70,140,170,1) 0%, rgba(19,88,118,1) 100%);
  background: linear-gradient(to bottom, rgba(70,140,170,1) 0%, rgba(19,88,118,1) 100%);
  border: medium none;
  box-shadow: 0.1rem 0.1rem 0 #135876 inset, 0.1rem 0.1rem 0 #FFFFFF;
  color: #FFFFFF;
}
.fl-theme-wb .search-btn {
  background: #FFFFFF;
  border-color: #000000;
  color: #000000;
  box-shadow: none;
}
```

In this example, a button was given a gradient effect:
![Image of a button with white text label on a shaded blue background.](../images/tutorial-uio-button-regular.png)

The CSS for the high-contrast version (in this example, "white-on-black") simply inverts the basic colour scheme to
produce a 'button' effect, removing the gradient, shadow, and forcing the background and border colours to conform to
the theme colours.
![Image of a button with black text label on a solid white background.](../images/tutorial-uio-button-hc.png)
