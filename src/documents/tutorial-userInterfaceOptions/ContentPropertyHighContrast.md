---
title: CSS "content" property in high contrast
layout: default
category: Tutorials
---

The CSS content property is typically used to add a character or symbol after each item in a list, such as vertical bars between horizontal navigation items. These characters or symbols are often given their own colour, different from the main text colour:

```html
<ul class="topnav">
  <li>Home</li>
  <li>Browse</li>
  <li>Shop</li>
</ul>
.topnav li:after {
    color: #CCCCCC;
    content: "/";
}
```

```css
.topnav li:after {
    color: #CCCCCC;
    content: "/";
}
```

You must specify a new colour for the high-contrast themes for the content:

```css
.fl-theme-uio-yb .topnav li:after {
    color: #FFFF00; /* yellow for yellow-on-black */
}
.fl-theme-uio-wb .topnav li:after {
    color: #FFFFFF;  /* white for white-on-black */
}
.fl-theme-uio-by .topnav li:after,
.fl-theme-uio-bw .topnav li:after {
    color: #000000; /* black for black-on-yellow and black-on-white */
}
```
