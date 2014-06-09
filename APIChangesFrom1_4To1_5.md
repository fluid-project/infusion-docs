# API Changes from 1.4 to 1.5 #

## Component API Changes ##

### Inline Edit ###

* Undo has been refactored into a proper Infusion Component

### Pager ###

* RSF ID's no longer required
* Components have been renamed
* Components have been restructured

### UI Options ###

* Major refactoring into a preferences framework
    * See migration guide

### Uploader ###

* Flash version removed (see: [FLUID-5354](http://issues.fluidproject.org/browse/FLUID-5354))
* Support for Firefox 3.x's implmentation of HTML5 upload

## Framework API Changes ##

### Model Transformation ###

* `expander` renamed to `transform`

### `fluid.defaults`

* the `true` flag has been removed

### `fluid.merge` ###

* the `reverse` merge policy has been removed
* now returns a fresh block of options, rather than a target passed in.

### `fluid.alias` ###

* `fluid.alias` has been removed
