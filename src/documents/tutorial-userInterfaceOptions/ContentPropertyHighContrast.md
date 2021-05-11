---
title: CSS "Content" Property in Contrast Modes
category: Tutorials
---

The CSS `content` property can be used to add additional content to your webpage using CSS. Often it is used to add a
character, symbol, or font icon before or after some content on webpage. For example, it can be used to add vertical
bars to separate items on a horizontal navigation list as depicted by the following HTML and CSS snippets.

```html
<nav>
  <ul class="topnav">
    <li>Home</li>
    <li>Browse</li>
    <li>Shop</li>
  </ul>
</nav>
```

```css
.topnav {
    color: #00f;
    list-style: none;
}

.topnav li {
    float: left;
}

.topnav li::after {
    color: #00f;
    content: "|";
    padding: 0 2rem;
}
```

The above example would look like this:
![A horizontal navigation list with blue text on grey background.](/images//tutorial-uio-content-default.png)

To style this example, a new colour for `content` should be specified for each contrast. The updated CSS could look like
this:

```css
.fl-theme-yb .topnav li::after {
    color: #ff0; /* yellow for yellow-on-black */
}

.fl-theme-wb .topnav li::after {
    color: #fff;  /* white for white-on-black */
}

.fl-theme-by .topnav li::after,
.fl-theme-bw .topnav li::after {
    color: #000; /* black for black-on-yellow and black-on-white */
}

.fl-theme-lgdg .topnav li::after {
    color: #bdbdbb;  /* light grey for light grey on dark grey */
}
```

When properly styled, the `content` value will change according to the contrast theme. Our example would now look like
this:

* ![A horizontal navigation list with yellow text on black background.](/images//tutorial-uio-content-yb.png)
* ![A horizontal navigation list with white text on black background.](/images//tutorial-uio-content-wb.png)
* ![A horizontal navigation list with black text on white background.](/images//tutorial-uio-content-bw.png)
* ![A horizontal navigation list with black text on yellow background.](/images//tutorial-uio-content-by.png)
* ![A horizontal navigation list with light grey text on grey background.](/images//tutorial-uio-content-lgdg.png)
