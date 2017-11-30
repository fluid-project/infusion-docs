# Infusion Documentation

## Browse the Infusion Documentation on GitHub

You can [browse the Infusion Documentation as static user friendly pages](http://docs.fluidproject.org/infusion/), or if
you prefer, you can [browse the Infusion Documentation directly on GitHub](src/documents).

## Build with DocPad

Install DocPad:

```shell
npm install -g docpad
```

Get the node modules for this project:

```shell
npm install
```

To generate the HTML and run the DocPad server locally:

```shell
npm run docpad
```

This runs the command:

```shell
docpad run --env static
```

Point your browser to: `http://localhost:9778/`

## Deploy to GitHub Pages

```shell
npm run deploy
```

This runs the command:

```shell
docpad deploy-ghpages --env static
```

*WARNING* `deploy` will upload the site to the repository's `origin`. If you have cloned
from the production repository and you have push access, you will actually run the docs publication
workflow against the live production branch, whichever branch you happen to be working on.

## A Note on DocPad plugins

Changes to DocPad plugins used by this package only take effect when your `node_modules` directory is up to date.  It is
therefore highly important to remove your existing `node_modules` and rerun `npm install` when pulling down updates to
this repository.  Failure to do so may result in broken links, rendering errors, and other problems.
