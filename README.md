# Infusion Documentation

## Browse the Infusion Documentation on GitHub

You can [browse the Infusion Documentation as static user friendly pages](http://docs.fluidproject.org/infusion/), or if
you prefer, you can [browse the Infusion Documentation directly on GitHub](src/documents).

## Building a Local Copy of the Documentation

Get the node modules for this project:

```shell
npm install
```

To generate the HTML and run the DocPad server locally:

```shell
npm run docpad
```

Then, point your browser to: `http://localhost:9778/`

## Deploy

While GitHub Pages is not used to host [fluidproject.org](https://docs.fluidproject.org), our deployment process requires
that the generated site be pushed to the `deploy` branch in the project repo. The contents of the `deploy` branch will
automatically be served as the contents are changed.

To generate and push to the `deploy` branch on the project repo run the following:

```shell
npm run deploy
```

_**WARNING:** Deploying will upload the site to the `deploy` branch of the `origin` remote. If you have cloned
from the production repository and you have push access, you will actually run the docs publication
workflow against the live production branch, regardless of whichever branch you happen to be working on._

## A Note on DocPad plugins

Changes to DocPad plugins used by this package only take effect when your `node_modules` directory is up to date.  It is
therefore highly important to remove your existing `node_modules` and rerun `npm install` when pulling down updates to
this repository.  Failure to do so may result in broken links, rendering errors, and other problems.

Note also that the plugins used by this package are only compatible with DocPad 6.79.4 or earlier.  You should use the
version of docpad installed as a dependency of this package rather than a globally installed version.  This is handled
automatically by the `npm run` commands mentioned in the rest of this document.
