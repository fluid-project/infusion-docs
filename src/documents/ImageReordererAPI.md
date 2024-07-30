---
title: Image Reorderer API
category: Components
---

The Image Reorderer is a convenience function for applying the Reorderer to images within a collection. This page
provides technical details of the API.

## Creating an Image Reorderer

```javascript
var myImageReorderer = fluid.reorderImages(container);

// or

var myImageReordererWithOptions = fluid.reorderImages(container, options);
```

### Parameters

#### container

The `container` parameter is a CSS-based [selector](https://api.jquery.com/category/selectors/), single-element jQuery
object, or DOM element specifying the root node of the Reorderer.

#### options parameter

The `options` parameter is an optional collection of name-value pairs that configure the Image Reorderer, as described
in the [Options](#options) section below.

## Supported Events

The Image Reorderer fires the following events.

<table>
    <thead>
        <tr>
            <th>Event</th>
            <th>Type</th>
            <th>Description</th>
            <th>Parameters</th>
            <th>Parameters Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>

`onShowKeyboardDropWarning1`
</td>
            <td>default</td>
            <td>
                This event fires before a drop warning is displayed.
            </td>
            <td>

`item`, `kbDropWarning`
</td>
            <td>

`item`: The item being moved.
`kbDropWarning`: The DOM element that contains the drop warning, and that will be displayed.</td>
        </tr>
        <tr>
            <td>

`onSelect`
</td>
            <td>default</td>
            <td>
                This event fires when an item is selected by the user.
            </td>
            <td>

`item`
</td>
            <td>

`item`: The item being selected.</td>
        </tr>
        <tr>
            <td>

`onBeginMove`
</td>
            <td>"preventable"</td>
            <td>
                This event fires just before a request to move is processed. Because the event is preventable, listeners
                may prevent the move from happening.
            </td>
            <td>

`item`
</td>
            <td>

`item`: The item being moved.</td>
        </tr>
        <tr>
            <td>

`onMove`
</td>
            <td>default</td>
            <td>
                This event fires just before an item is actually moved.
            </td>
            <td>

`item`, `requestedPosition`
</td>
            <td>

`item`: The item being moved.
`requestedPosition`: An object describing the position that the user is trying to move the item into:
<pre>
    <code>
requestedPosition = {
element,
// the drop target

position
// the position, relative to the drop target, that a dragged item should be dropped. One of BEFORE, AFTER, INSIDE, or REPLACE
}
    </code>
</pre>
</td>
        </tr>
        <tr>
            <td>

`afterMove`
</td>
            <td>default</td>
            <td>

This event fires after an item has successfully been moved. For more information, see [Talking to the Server Using The
afterMove Event](to-do/TalkingToTheServerUsingTheAfterMoveEvent.md).

This event replaces the `afterMoveCallbackUrl` option, which was deprecated at version 1.1.2.
</td>
            <td>

`item`, `requestedPosition`, `movables`
</td>
            <td>

`item`: The item being moved.
`requestedPosition`: An object describing the position that the user is trying to move the item into:
<pre>
    <code>
requestedPosition = {
element,
// the drop target

position
// the position, relative to the drop target, that a dragged item should be dropped. One of BEFORE, AFTER, INSIDE, or REPLACE
}
    </code>
</pre>
`movables`: A list of all of the movable elements.
</td>
        </tr>
        <tr>
            <td>

`onHover`
</td>
            <td>default</td>
            <td>

This event fires when the cursor moves over top of an item, and when the cursor moves away from an item. The default
listener either adds or removes the hover class (`styles.hover`) to/from the item.
</td>
            <td>

`item`, `state`
</td>
            <td>

`item`: The item being moved.
`state`: A boolean indicating whether the cursor is moving to (`true`) or away from (`false`) the item.
</td>
        </tr>
        <tr>
            <td>

`onRefresh`
</td>
            <td>default</td>
            <td>

This event fires any time the order of the items changes, or when the `refresh()` function is called.
</td>
            <td>none</td>
            <td>
            </td>
        </tr>
    </tbody>
</table>

## Options

### General options

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>

`selectors`
</td>
            <td>

JavaScript object defining CSS-style selectors for important DOM elements. See [Selectors](#selectors) for more
information.
</td>
            <td>

The object must be a list of objects containing any subset of the following keys:

* `dropWarning`
* `movables`
* `selectables`
* `dropTargets`
* `grabHandle`
            </td>
            <td>
                <pre>
                    <code>
selectors: {
    dropWarning: ".flc-reorderer-dropWarning",
    movables:    ".flc-reorderer-movable",
    selectables: ".flc-reorderer-movable",
    dropTargets: ".flc-reorderer-movable",
    grabHandle:  ""
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`listeners`
</td>
            <td>JavaScript object containing listeners to be attached to the supported events.</td>
            <td>Keys in the object are event names, values are functions or arrays of functions.</td>
            <td>

See [Supported Events](#supported-events)
</td>
        </tr>
        <tr>
            <td>

`styles`
</td>
            <td>an object containing CSS class names for styling the Reorderer.</td>
            <td>
                The object may contain any of the keys defined in the default class names (shown to the right). Any
                class names not provided will revert to the default.
            </td>
            <td>
                <pre>
                    <code>
styles: {
    defaultStyle: "fl-reorderer-movable-default",
    selected: "fl-reorderer-movable-selected",
    dragging: "fl-reorderer-movable-dragging",
    mouseDrag: "fl-reorderer-movable-dragging",
    hover: "fl-reorderer-movable-hover",
    dropMarker: "fl-reorderer-dropMarker",
    avatar: "fl-reorderer-avatar"
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`keysets`
</td>
            <td>
                an object containing sets of keycodes to use for directional navigation, and for the modifier key used
                for moving a movable item.
            </td>
            <td>
The object must be a list of objects containing the following keys:

* `modifier` : a function that returns true or false, indicating whether or not the required modifier(s) are activated
* `up`
* `down`
* `right`
* `left`
            </td>
            <td>
                <pre>
                    <code>
fluid.reorderer.defaultKeysets = [{
    modifier : function (evt) {
        return evt.ctrlKey;
    },
    up : fluid.reorderer.keys.UP,
    down : fluid.reorderer.keys.DOWN,
    right : fluid.reorderer.keys.RIGHT,
    left : fluid.reorderer.keys.LEFT
},
{
    modifier : function (evt) {
        return evt.ctrlKey;
    },
    up : fluid.reorderer.keys.i,
    down : fluid.reorderer.keys.m,
    right : fluid.reorderer.keys.k,
    left : fluid.reorderer.keys.j
}];
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`selectablesTabindex`
</td>
            <td>Normally injected automatically from the layoutHandler</td>
            <td>

String [IoC expression](IoCReferences.md)</td>
            <td>
                <pre>
                    <code>
selectablesTabindex: "{that}.layoutHandler.options.selectablesTabindex"
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`avatarCreator`
</td>
            <td>a function that returns a valid DOM node to be used as the dragging avatar</td>
            <td></td>
            <td>The item being dragged will be cloned</td>
        </tr>
        <tr>
            <td>

`disableWrap`
</td>
            <td>This option is used to disable wrapping of elements within the container.</td>
            <td>boolean</td>
            <td>false</td>
        </tr>
        <tr>
            <td>

`mergePolicy`
</td>
            <td>

an object describing how user options should be merged in with defaults
For information on options merging, see [Options Merging](OptionsMerging.md)
</td>
            <td></td>
            <td>
                <pre>
                    <code>
mergePolicy: {
    keysets: "replace",
    "selectors.selectables":
        "selectors.movables",
    "selectors.dropTargets":
        "selectors.movables"
}
                    </code>
                </pre>
            </td>
        </tr>
    </tbody>
</table>

### Image Reorderer Options

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>

<strong>Deprecated as of 1.1.2:</strong> `afterMoveCallbackUrl`
</td>
            <td>
                If an URL is provided with this option, the current state of the component model will be sent to that
                URL after a move is carried out using a default afterMove event handler.
            </td>
            <td>an URL</td>
            <td>none</td>
        </tr>
    </tbody>
</table>

### Selectors

The `selectors` option is an object containing CSS-based selectors for various parts of the Image Reorderer. Supported
selectors are:

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Default</th>
            <th>Examples</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>

`grabHandle`
</td>
            <td>
                If present, identifies a single element within a movable item that the user must click on to drag the
                movable item. (If not specified, the entire movable item can be clicked on.)
            </td>
            <td>""
(empty string) </td>
            <td>
                <pre>
                    <code>
selectors: {
    grabHandle: ".title-bar"
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`dropTargets`
</td>
            <td>
                Identifies the DOM elements contained within the Reorderer container that can have movable elements
                dropped relative to them. Note that not all elements within the container need to be drop targets.
            </td>
            <td>same as movables</td>
            <td>
                <pre>
                    <code>
selectors: {
    dropTargets: "div.dropTarget"
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`selectables`
</td>
            <td>
                Identifies the DOM elements contained within the Reorderer container that can be selected using
                keyboard. Note that selectable elements do not have to be movable.
            </td>
            <td>same as movables</td>
            <td>
                <pre>
                    <code>
selectors: {
    selectables: "div.selectable"
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`movables`
</td>
            <td>
                Identifies the DOM elements contained within the Reorderer container that can be moved using the
                Reorderer.
            </td>
            <td>".flc-reorderer-movable"</td>
            <td>
                <pre>
                    <code>
selectors: {
    movables: "div.movable"
}
                    </code>
                </pre>
            </td>
        </tr>
        <tr>
            <td>

`dropWarning`
</td>
            <td>
                Identifies a single element within the DOM that can be shown to display a warning when the user tries to
                move an item where it can't be moved. It is assumed that this element contains whatever drop warning
                text and mark-up the implementor desires.
            </td>
            <td>".flc-reorderer-dropWarning"</td>
            <td>
                <pre>
                    <code>
selectors: {
    dropWarning: "#drop-warning"
}
                    </code>
                </pre>
            </td>
        </tr>
    </tbody>
</table>

### Image Reorderer-specific Selector

The Image Reorderer supports one additional selector:

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>

`imageTitle`
</td>
            <td>Identifies a DOM element that contains a title for the image</td>
            <td>

`".flc-reorderer-imageTitle"`
</td>
            <td>
                <pre>
                    <code>
selectors: {
    imageTitle: ".caption"
}
                    </code>
                </pre>
            </td>
        </tr>
    </tbody>
</table>

## Styling the Image Reorderer

The Image Reorderer includes default CSS styles that it applies to the thumbnails. The application of styles is based on
known class names. The _default_ class names are described below, and can be used by including the Image Reorderer
stylesheet:

```html
<link href="components/reorderer/css/imageReorderer.css" type="text/css" rel="stylesheet" media="all">;
```

NOTE that the default class names can be overridden with your own classes using the `styles` option: refer to the
[Options](#options) section above.

### Default Classes

* `fl-reorderer-movable-default` - This class is applied to thumbnail elements in their default state.
* `fl-reorderer-movable-selected` - This class is applied to the thumbnail that has been selected. The selected
  thumbnail item can be moved using keystrokes.
* `fl-reorderer-movable-hover` - This class is applied to thumbnails when the mouse hovers over them.
* `fl-reorderer-movable-dragging` - This class is applied to the thumbnail that is currently being moved.
* `fl-reorderer-avatar` - This class is applied to the avatar, the image of the thumbnail as it is being dragged about
  by the mouse.
* `fl-reorderer-dropMarker` - This class is applied to the drop target indicator when the mouse is used to drag a
  thumbnail.

## Dependencies

The Image Reorderer dependencies can be met by including the `infusion-custom.js` file in the header of the HTML file:

```html
<script type="text/javascript" src="infusion-custom.js"></script>
```

Alternatively, the individual file requirements are:

```html
<script type="text/javascript" src="lib/jquery/core/js/jquery.js"></script>
<script type="text/javascript" src="lib/jquery/ui/js/jquery.ui.core.js"></script>
<script type="text/javascript" src="lib/jquery/ui/js/jquery.ui.widget.js"></script>
<script type="text/javascript" src="lib/jquery/ui/js/jquery.ui.mouse.js"></script>
<script type="text/javascript" src="lib/jquery/ui/js/jquery.ui.draggable.js"></script>
<script type="text/javascript" src="framework/core/js/FluidDocument.js"></script>
<script type="text/javascript" src="framework/core/js/jquery.keyboard-a11y.js"></script>
<script type="text/javascript" src="framework/core/js/Fluid.js"></script>
<script type="text/javascript" src="framework/core/js/FluidDOMUtilities.js"></script>
<script type="text/javascript" src="framework/core/js/FluidIoC.js"></script>
<script type="text/javascript" src="framework/core/js/FluidView.js"></script>
<script type="text/javascript" src="framework/core/js/DataBinding.js"></script>
<script type="text/javascript" src="components/reorderer/js/ReordererDOMUtilities.js"></script>
<script type="text/javascript" src="components/reorderer/js/GeometricManager.js"></script>
<script type="text/javascript" src="components/reorderer/js/Reorderer.js"></script>
<script type="text/javascript" src="components/reorderer/js/ImageReorderer.js"></script>
```

The Image Reorderer also requires the following stylesheets:

```html
<link rel="stylesheet" type="text/css" href="framework/core/css/fluid.css" />
<link rel="stylesheet" type="text/css" href="components/reorderer/css/Reorderer.css" />
<link rel="stylesheet" type="text/css" href="components/reorderer/css/ImageReorderer.css" />
```
