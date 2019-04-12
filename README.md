# Infusion Documentation

## A Note on Versions of Node, DocPad, and the DocPad plugins

As of this writing (2019-04-12), we are dependent on a version of DocPad (6.79.4) and the supporting plugins that run only on Node 8, which is behind the current LTS release. If you want to run the site without Docker, you will need to be using Node 8 for it, with [Node Version Manager](https://github.com/creationix/nvm) or similar.

## Browse the Infusion Documentation on GitHub

You can [browse the Infusion Documentation as static user friendly pages](http://docs.fluidproject.org/infusion/), or if you prefer, you can [browse the Infusion Documentation directly on GitHub](src/documents).

## Docker Instructions

Docker provides us with an environment to run Node 8 in that is separated from the host, in order to work on the site. Since we deploy the static product of the DocPad build process, this is OK for now.

### Docker Dev Container (for local development purposes)

Builds ands run site in DocPad, with a bind mount between local `src` and `src in container`, allowing for local development.

`docker-compose -f docker-compose-dev.yml up --build`

### Build Static Site on Host With Docker (for deploying manually)

Builds the container and copies the `out` directory to `out` on the host; removes all the Docker build artifacts afterwards.

**User Action Required ☹️**: commit the contents of the `out` directory to the `deploy` branch of the repo to actually deploy the site.

```
docker build -t infusiondocsbuild . &&
docker create -ti --name infusiondocsbuildcontainer infusiondocs &&
docker cp infusiondocsbuildcontainer:/usr/share/nginx/html ./out &&
docker rm -fv infusiondocsbuildcontainer &&
docker rmi infusiondocsbuild
```

### Docker Production Container

Builds and deploys static site to nginx container - we may eventually use this for production deployment, but don't currently.

`docker-compose up`

## Legacy Instructions

**2019-04-12:** These instructions may no longer be relevant due to the compatibility issues described above, but are retained for now.

### Build with DocPad

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

### Deploy

While GitHub Pages is not used to host [fluiproject.org](https://docs.fluidproject.org), our deployment process requires that the generated site be pushed to the `deploy` branch in the project repo. The contents of the `deploy` branch will automatically be served as the contents are changed.

To generate and push to the `deploy` branch on the project repo run the following:

```shell
npm run deploy
```

This runs the command:

```shell
docpad deploy-ghpages --env static
```

_**WARNING:** Deploying will upload the site to the `deploy` branch of the `origin` remote. If you have cloned
from the production repository and you have push access, you will actually run the docs publication
workflow against the live production branch, regardless of whichever branch you happen to be working on._

### A Note on DocPad plugins

Changes to DocPad plugins used by this package only take effect when your `node_modules` directory is up to date.  It is
therefore highly important to remove your existing `node_modules` and rerun `npm install` when pulling down updates to
this repository.  Failure to do so may result in broken links, rendering errors, and other problems.
