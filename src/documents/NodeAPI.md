---
title: node.js Support and API
layout: default
category: Infusion
---

# Infusion in node.js

Infusion's [core API](CoreAPI.md) and [IoC system](HowToUseInfusionIoC.md) are fully supported in node.js. It is supplied with a 
standard [package.json](https://github.com/fluid-project/infusion/blob/master/package.json) file and registered as a module in [npm's registry](https://www.npmjs.com/package/infusion).
Infusion's global namespace model, as operated through functions such as [`fluid.registerNamespace`](CoreAPI.md#fluid-registernamespace-path-)
and [`fluid.defaults`](CoreAPI.md#fluid-defaults-gradename-options-) require some care in the node.js environment which makes significant efforts to balkananise
modules one from another, and to ensure that precisely this kind of thing never occurs — reference to artifacts held
in a single, shared global namespace.

## dedupe-infusion

To start with, it is essential that just a *** single *** instance of Infusion's [node module](https://www.npmjs.com/package/infusion) is present in 
an application's module tree. Normally `npm`'s standard deduplication algorithm is sufficient, but it can often fail in the case of version mismatches
or else in the case the dependency is hosted from `git`. For this case we have produced the [`dedupe-infusion`](https://www.npmjs.com/package/dedupe-infusion) module
which can be `require`d in the normal way and executed as part of a final build step to ensure that only the topmost instance of the `infusion` module survives. This
is particularly essential for Infusion because of its global nature — duplicate modules will result in some [grade](ComponentGrades.md) definitions being sent to 
once instance and some to another, resulting in "global chaos". In fact, Infusion will detect this condition on startup and issue an immediate failure directing you
to run the `dedupe-infusion` task.

## Accessing and exporting global names

Given that node.js ensures that each module's global object is scrubbed clean of any potentially contaminating references, you will need to make liberal use of
Infusion's [fluid.registerNamespace](CoreAPI.md#fluid-registernamespace-path-) API in order to import such references back into your scope. Statements like

```javascript
var colin = fluid.registerNamespace("colin")
```

are common in the preamble to node-aware, Infusion-aware .js files. Note that you will still need to make calls to node.js standard `require` implementation if the
code or definitions you wish to reference have not been loaded into the system at all. The recommended pattern is for a package with npm name `colin` to make an
export of the same value that will be assigned to the global namespace `colin` in its implementation — e.g.

```javascript

var colin = fluid.registerNamespace("colin")

... add definitions to namespace colin, either directly or via fluid.defaults

module.exports = colin
```

is a standard pattern for a module named `colin` — ensuring that the results of `var colin = require("colin")` and `var colin = fluid.registerNamespace("colin")` 
will coincide in client code. 

## node.js module APIs

Infusion includes a few small utilities to ease the process of working with a node/npm module layout.

### fluid.module.register(name, baseDir, moduleRequire)

This is an intensely useful method that will allow you to register your Infusion-aware module and its base path in Infusion's global registery of modules.
This will allow you, for example, to later issue a call to `fluid.require("${myModule}/myPath)"` for any assert nested within that module, regardless of its location in 
the filesystem. Other productive uses of such records are imaginable — for example, issuing `require` directives for modules from their point of view, etc.

* `name {String}` The name of your module. This should agree with its name in the npm registry.
* `baseDir {String}` The base directory of your module. This should be the value of `__dirname` in its root directory.
* `moduleRequire {Require}` This should be the value of `require` handed to you by node's own module loader.

### fluid.module.resolvePath(path)

Resolve a path expression which may begin with a module reference of the form `${module-name}` into an absolute path relative to that module, using the
database of base directories registered previously with `fluid.module.register`.If the path does not begin with such a module reference, it is returned unchanged.

* `path {String}` A path expression to be resolved, perhaps containing symbolic module references such as `${module-name}`
* Returns: `{String}` The path expression with any symbolic module references resolved against the `fluid.module.modules` database

### fluid.require(moduleName[, foreignRequire, namespace]) 

Issues node's `require` against a possibly symbolic path, and possibly also install the result at a particular global namespace path from the point of view of Infusion.

* `moduleName {String}` A string be supplied to node's `require`, possibly starting with a module reference of the form `module-name` to indicate a base reference into an already
 loaded module that was previously registered using `fluid.module.register`.
* `foreignRequire {Require}` The instance of `require` to be operated after the module name has been interpolated. If omitted, defaults to Infusion's own `require` (which may not be able to
see everything you can - since it will very likely be higher up in the module tree than you are)
* `namespace {String}` If this is supplied, the returned value from `require` will be written into Infusion's global namespace by using the [fluid.setGlobalValue](CoreAPI.md#fluid-setglobalvalue-path-value-) API.

### fluid.module.modules

Holds for public inspection Infusion's records of modules as registered via `fluid.module.register`. This will be a hash of `moduleName` to records of the following form:

* `baseDir {String}` the `baseDir` argument supplied to `fluid.module.register` for this module
* `require {Require}` the `moduleRequier` argument supplied to `fluid.module.register` for this module


 