---
title: Infusion node.js Support and API
layout: default
category: Infusion
---

Infusion's [core API](CoreAPI.md) and [IoC system](HowToUseInfusionIoC.md) are fully supported in node.js. Infusion is supplied with a 
standard [package.json](https://github.com/fluid-project/infusion/blob/master/package.json) file and registered as a module in [npm's registry](https://www.npmjs.com/package/infusion).
Infusion's global namespace model, as operated through functions such as [`fluid.registerNamespace`](CoreAPI.md#fluid-registernamespace-path-)
and [`fluid.defaults`](CoreAPI.md#fluid-defaults-gradename-options-), requires some care in the node.js environment which makes significant efforts to balkanise
modules one from another, and to ensure that precisely this kind of thing never occurs — reference to artifacts held
in a single, shared global namespace.

## Accessing and exporting global names

Given that node.js ensures that each module's global object is scrubbed clean of any potentially contaminating references, you will need to make liberal use of
Infusion's [fluid.registerNamespace](CoreAPI.md#fluid-registernamespace-path-) API in order to import such references back into your scope. Statements like

```javascript
var colin = fluid.registerNamespace("colin");
```

are common in the preamble to node-aware, Infusion-aware `.js` files. Note that you will still need to make calls to node.js's standard `require` implementation if the
code or definitions you wish to reference have not been loaded into the system at all. The recommended pattern is for a package with npm name `colin` to make an
export of the same value that will be assigned to the global namespace `colin` in its implementation — e.g.

```javascript

var colin = fluid.registerNamespace("colin");

... add definitions to namespace colin, either directly or via fluid.defaults

module.exports = colin;
```

is a standard pattern for a module named `colin` — ensuring that the results of `var colin = require("colin")` and `var colin = fluid.registerNamespace("colin")` 
will coincide in client code. 

## node.js module APIs

Infusion includes a few small utilities to ease the process of working with a node/npm module layout:

### fluid.module.register(name, baseDir, moduleRequire)

This is an intensely useful method that will allow you to register your Infusion-aware module and its base path in Infusion's global registery of modules.
This will allow you, for example, to later issue a call to `fluid.require("%myModule/myPath")` for any asset nested within that module, regardless of its location in 
the filesystem. Other productive uses of such records are imaginable — for example, issuing `require` directives for modules from their point of view, resolving cyclic references between modules, etc.

* `name {String}` The name of your module. This should agree with its name in the npm registry.
* `baseDir {String}` The base directory of your module. This should be the value of `__dirname` in its root directory.
* `moduleRequire {Require}` This should be the value of `require` handed to you by node's own module loader.

### fluid.module.resolvePath(path)

Resolve a path expression which may begin with a module reference of the form `%module-name` into an absolute path. Note that more
modules are resolvable here than were necessarily registered with `fluid.module.register` — on startup, Infusion's node module will "pre-inspect" its filesystem path
to the root in order to discover anything which plausibly looks like a module root — that is, it will recognise a `package.json` file which need not necessarily have a grandparent path of `node_nodules`. 
If the supplied path does not begin with such a module reference, it is returned unchanged.

* `path {String}` A path expression to be resolved, perhaps containing symbolic module references such as `%module-name`
* Returns: `{String}` The path expression with any symbolic module references resolved against the `fluid.module.modules` database

### fluid.require(moduleName[, foreignRequire, namespace]) 

Issues node's `require` against a possibly symbolic path, and possibly also install the result at a particular global namespace path from the point of view of Infusion.

* `moduleName {String}` A string to be supplied to node's `require`, possibly starting with a module reference of the form `%module-name` to indicate a base reference into an already
 loaded module that was previously registered using `fluid.module.register`.
* `foreignRequire {Require}` The instance of `require` to be operated after the module name has been interpolated. If omitted, defaults to Infusion's own `require` (which may not be able to
see everything you can — since it will very likely be lower down in the module tree than you are)
* `namespace {String}` If this is supplied, the returned value from `require` will be written into Infusion's global namespace by using the [fluid.setGlobalValue](CoreAPI.md#fluid-setglobalvalue-path-value-) API.

### fluid.module.modules

Holds for public inspection Infusion's records of modules as registered via `fluid.module.register`. This will be a hash of `moduleName` to records of the following form:

* `baseDir {String}` the `baseDir` argument supplied to `fluid.module.register` for this module
* `require {Require}` the `moduleRequire` argument supplied to `fluid.module.register` for this module


## Global nature of Infusion and self-deduping

It is essential that just a ***single*** instance of Infusion's [node module](https://www.npmjs.com/package/infusion) is present in 
an application's module tree. This is essential for Infusion because of its global nature — duplicate 
modules will result in some [grade](ComponentGrades.md) definitions being sent to 
one Infusion instance and some to another, resulting in "global chaos". Normally `npm`'s standard deduplication algorithm is sufficient, but it can often fail in the case of version mismatches
or else in the case the dependency is hosted from `git`. Infusion applies a special algorithm at the point one issues `require("infusion")` to hunt upwards through
the current module tree for the copy of Infusion at the highest path, and return that one to the requestor, rather than the one resolved by the standard [node module resolution algorithm](https://nodejs.org/api/modules.html#modules_all_together).

Normally this is completely transparent to users and occurs automatically — however, in some cases
users may be surprised by receiving a different version of Infusion than the one they expected — in practice, the one requested by the top-level module in whatever 
application they are nested in, rather than the one the requested via their own `package.json`.

This is an architectural risk that we are aware of — in that it requires that all the cooperating modules within an Infusion application are compatible with a single
version of Infusion, the one requested at the application's module root. Future work on [modularization of Infusion](https://wiki.fluidproject.org/display/fluid/Notes+on+Modularisation+of+Infusion) will address
this risk by splitting Infusion into several smaller modules, only one of which (responsible for storing and retrieving grade definitions and module paths) requires to be application-global.
