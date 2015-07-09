Infusion Documentation
======================

## Browse the Infusion Documentation on GitHub


You can [browse the Infusion Documentation directly on GitHub](src/documents).

## Build with DocPad


Install DocPad:

```
npm install -g docpad
```

Get the node modules for this project:

```
npm install
```

To generate the HTML and run the DocPad server locally:

```
docpad run --env static
```

Point your browser to:

```
http://localhost:9778/
```

## Deploy to GitHub Pages

```
docpad deploy-ghpages --env static
```

*Note* deploy-ghpages will upload the site to the repository's source. In order
to upload to the production site, you will need to be working from a clone of
the production repository.
