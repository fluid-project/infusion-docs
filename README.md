# Infusion Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/c9061766-d760-4eda-922f-da3b838a6013/deploy-status)](https://app.netlify.com/sites/fluid-infusion-docs/deploys)

## Browse the Infusion Documentation

You can [browse the Infusion Documentation website](http://docs.fluidproject.org/infusion/), or if
you prefer, you can [browse the source documentation files directly on GitHub](src/documents).

## Working with the Infusion Documentation locally

You must have [Node and NPM](https://nodejs.org/en/download/) installed in order to work on the Infusion Documentation
locally (the LTS version is recommended).

To install the dependencies for this project:

```shell
npm install
```

To serve the site locally in development mode with live reloading using [Eleventy](https://11ty.dev):

```shell
npm run start
```

Then, point your browser to: `http://localhost:8080/`

To statically build the site using [Eleventy](https://11ty.dev):

```shell
npm run build
```

## Deploying the Infusion Documentation website

The [Infusion Documentation website](http://docs.fluidproject.org/infusion/) is published with [Netlify](https://netlify.com)
every time new content is pushed to the `main` branch of this repository. [Deploy previews](https://docs.netlify.com/site-deploys/overview/#deploy-preview-controls)
are also generated for every pull request. For more information, please review Netlify's [documentation](https://docs.netlify.com).

## Generating a Docker image

You can serve the website from a [Docker](https://docs.docker.com/get-docker) container.

Once you have Docker installed, run the following commands to build a Docker image and start a container:

* Build the image: `docker build -t infusion-docs .`
* Run the container: `docker run --name infusion-docs -p 8000:80 infusion-docs`

The documentation will be available at [http://localhost:8000](http://localhost:8000)

* To stop and remove the container: `docker rm -f infusion-docs`

If you make changes to the documentation, repeat the steps to build the image and start a new container.

## 3rd party software included

### MIT License

* [Heroicons v2.1.1](https://heroicons.com)
