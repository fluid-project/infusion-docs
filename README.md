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

*WARNINGNote* `deploy-ghpages` will upload the site to the repository's source. If you have cloned
from the production repository and you have push access, you will actually run the docs publication
workflow against the live production branch, whichever branch you happen to be working on.
