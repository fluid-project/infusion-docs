---
title: DataSource API
layout: default
category: Infusion
---

The DataSource component provides a workflow for getting/setting (read/write) data from a data source (an external database, cookie, in memory storage and etc). The specifics for accessing the data source must be provided in a concrete implementation. Additionally the payload of a request may be configured to be processed through an encoding/decoding step and other transformations during the get and set workflows.

## Grades and Linkage

There are two main grades `fluid.dataSource` and `fluid.dataSource.writable`. `fluid.dataSource` contains the base configuration and includes configuration for getting (reading) from a data source. `fluid.dataSource.writable` adds the configuration for setting (writing) to a data source. Instances of `fluid.dataSource` will need to provide a concrete handler for the `"onRead.impl"` and those using `fluid.dataSource.writable` will also need to add one for the `"onWrite.impl"` listener.

```javascript
fluid.defaults("my.component", {
    components: {
        dataSource: {
            type: "fluid.dataSource",
            options: {
                gradeNames: ["fluid.dataSource.writable"],
                listeners: {
                    // these would point at concrete implementations for performing the read and write operations.
                    "onRead.impl": "my.component.doRead",
                    "onRead.impl": "my.component.doWrite"
                }
            }
        }
    }
});
```

When implementing a new kind of dataSource, where reading and writing functionality are needed, [grade linkage](IoCAPI.md#fluidmakegradelinkagelinkagename-inputnames-outputnames) is required to apply the concrete writable grade to the dataSource configuration. In this way, one would only need to add the `fluid.dataSource.writable` grade to gain the configuration from the concrete writable grade.

```javascript
fluid.defaults("my.dataSource", {
    gradeNames: ["fluid.dataSource"]
    // add grade specific configuration
});

fluid.defaults("my.dataSource.writable", {
    gradeNames: ["fluid.dataSource.writable"]
    // add grade specific configuration
});

fluid.makeGradeLinkage("my.dataSource.linkage", ["fluid.dataSource.writable", "my.dataSource"], "my.dataSource.writable");
```

## Encoding

During the `get` (read) and `set` (write) workflows, listeners are provided as handles for encoding and transforming the payload. For example serializing and deserializing the payload on it's way to and from a server. The encoding is implemented by a supplied encoding component which includes `parse` and `render` methods. For `get` the data is run through `parse`. For `set`, the data is run through `render` when being sent to the server, and any returned values are sent through `parse`.

Two encoding classes are provided for use, `fluid.dataSource.encoding.JSON` (serializes/deserializes JSON data) and `fluid.dataSource.encoding.none` (provides no encoding/decoding transformation). If these do not meet the requirements necessary for the concrete dataSource, a different encoder subcomponent may be provided to the concrete dataSource grade.

The `onRead`, `onWrite`, and `onWriteResponse` event sequences can be used to further modify the data, in addition to the specific encoding transformations. Because the encoding happens as part of these event sequences, other transformation may be added before or after the encoding phase. For example providing [modelTransformations](ModelTransformationAPI.md) before/after serializing/deserializing JSON.

### fluid.dataSource.parseJSON(string)

Deserializes a JSON string into a proper JavaScript object and returns a promise for the result. If there is an error, the promise will be rejected and contain the error message. Otherwise the promise will be resolved with the JavaScript object or `undefined` if the `string` value is falsey.

* `string {String}` The JSON string to be deserialized

### fluid.dataSource.stringifyJSON(obj)

Serializes a JavaScript object into a JSON string. If the object is undefined, an empty string is returned.

* `obj {Object}` The JavaScript object to be serialized

## Core

### fluid.dataSource.registerStandardPromiseHandlers(that, promise, options)

Registers the default promise handlers for a dataSource operation:

1. If the user has supplied a function in place of method `options`, register this function as a success handler
2. If the user has supplied an `onError` handler in method `options`, this is registered, otherwise we register the firer of the dataSource's own `onError` method.

* `that {Object}` The concrete dataSource component
* `promise {Promise}` The promise to bind the resolution and reject handlers too
* `options {Object|Function}` (optional) Either a function to be executed on resolution, or an object containing an `onError` ({onError: function}) handler executed on rejection.

### fluid.dataSource.defaultiseOptions(componentOptions, options, directModel, isSet)

Compiles the options to be passed along to the each listener in a transform event sequence. The following properties will be added to the `options` passed in: `directModel`, `operation` ("set" or "get"), and `notFoundIsEmpty`.

* `componentOptions {Object}` The components options.
* `options {Object}` The base set of options to be passed along to the each listener.
* `directModel {Object}` The direct model expressing the "coordinates" of the model
* `isSet {Boolean}` A flag to indicate if it is for a "get" or "set" operation.

### fluid.dataSource.get(that, directModel, options)

Operate the core "transforming promise workflow" of a dataSource's `get` method. The initial listener provides the initial payload; which then proceeds through the transform chain to arrive at the final payload. A promise is returned with the final resolved payload.

* `that {Component}` The dataSource itself
* `directModel {Object}` The direct model expressing the "coordinates" of the model to be fetched
* `options {Object}` A structure of options configuring the action of this get request - many of these will be specific to the particular concrete DataSource

### fluid.dataSource.set(that, directModel, model, options)

Operate the core "transforming promise workflow" of a dataSource's `set` method. Any return from this is then pushed forwards through a range of the transforms (typically, e.g. just decoding it as JSON) on its way back to the user via the `onWriteResponse` event. A promise for the final resolved payload may be returned.

* `that {Component}` The dataSource itself
* `directModel {Object}` The direct model expressing the "coordinates" of the model to be written
* `model {Object}` The payload to be written to the dataSource
* `options {Object}` A structure of options configuring the action of this set request - many of these will be specific to the particular concrete DataSource
