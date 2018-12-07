# Infusion Documentation

## Browse the Infusion Documentation on GitHub

You can [browse the Infusion Documentation as static user friendly pages](http://docs.fluidproject.org/infusion/), or if you prefer, you can [browse the Infusion Documentation directly on GitHub](src/documents).

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

## A Note on DocPad plugins

Changes to DocPad plugins used by this package only take effect when your `node_modules` directory is up to date.  It is
therefore highly important to remove your existing `node_modules` and rerun `npm install` when pulling down updates to
this repository.  Failure to do so may result in broken links, rendering errors, and other problems.
