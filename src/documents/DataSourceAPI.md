---
title: DataSource API
category: Infusion
---

The DataSource component provides a workflow for getting/setting (read/write) data from a data source (an external
database, cookie, in memory storage and etc). The specifics for accessing the data source must be provided in a concrete
implementation. Additionally the payload of a request may be configured to be processed through an encoding/decoding
step and other transformations during the get and set workflows.

Concrete DataSource implementations include `fluid.dataSource.url` which read and write data over HTTP both in the
browser and in node.js, as well as [`kettle.dataSource.file`](https://github.com/fluid-project/kettle/blob/main/docs/DataSources.md#configuration-options-accepted-by-kettledatasourcefile)
 available in node.js acting on the filesystem, and
`fluid.prefs.cookieStore` which acts on cookies in the browser. Mixin grades include [
`kettle.dataSource.CouchDB`](https://github.com/fluid-project/kettle/blob/main/docs/DataSources.md#the-kettledatasourcecouchdb-mixin-grade)
which is capable of imbuing a core DataSource with CouchDB-like persistence semantics. Grades in the
`kettle` namespace are provided in Infusion's node.js companion project [Kettle](https://github.com/fluid-project/kettle).

<div class="infusion-docs-note">
    <strong>Note:</strong> A browser implementation of <code>fluid.dataSource.url</code> is only available in the
upcoming Infusion 4.x.
</div>

The workflow of a DataSource operates Infusion's
[transforming promise chain](PromisesAPI.md#fluidpromisefiretransformeventevent-payload-options) algorithm for
operating an open pipeline of functions which collaborate to asynchronously transform a data payload connecting
sources and sinks of data.

## How to use a DataSource

A DataSource is implemented by a component derived from the [grade](ComponentGrades.md) `fluid.dataSource`, or, in addition,
`fluid.dataSource.writable` if the DataSource is writable.

A read-only DataSource allows data to be read using the invoker `get`, whereas a writable DataSource in addition allows
data to be written using the invoker `set`. These each accept a configuration object named `directModel` as the first
argument, encoding the coordinates of the data to be read or written.

### get(directModel, options)

Fetches data from the dataSource, returning a promise yielding the fetched data.

* `directModel {Object}` The direct model expressing the "coordinates" of the model to be fetched
* `options {Object}` A structure of options configuring the action of this get request - many of these will be specific
to the particular concrete DataSource

By default `get` is concretely implemented with `fluid.dataSource.get` which operates the core "transforming promise
workflow". The initial listener provides the initial payload; which then proceeds through the transform chain to arrive
at the final payload. A promise is returned with the final resolved payload.

#### Example:

Consider a simple in-memory read-only dataSource that contains the model data:

```json
{
    "foo": {
        "bar": "baz"
    }
}
```

For this dataSource, the `directModel` simply takes the form of a path indexing into the model using
[fluid.get](CoreAPI.md#fluidgetmodel-path).

The following call to get,

```javascript
dataSource.get("foo");
```

would return a promise yielding:

```json
{
    "bar": "baz"
}
```

### set(directModel, model, options)

Sends data to the configured dataSource. May return a promise yielding the write response from the dataSource.

* `directModel {Object}` The direct model expressing the "coordinates" of the model to be written
* `model {Object}` The payload to be written to the dataSource
* `options {Object}` A structure of options configuring the action of this set request - many of these will be specific
to the particular concrete DataSource

By default `set` is concretely implemented with `fluid.dataSource.set` which operates the core "transforming promise
workflow". Any return from this is then pushed forwards through a range of the transforms (typically, just decoding it
as JSON) on its way back to the user via the `onWriteResponse` event. A promise for the final resolved payload may be
returned.

#### Example:

Consider a simple in-memory dataSource that contains the model data:

```json
{
    "foo": {
        "bar": "baz"
    }
}
```

Corresponding to the read-only API dataSource, the `directModel` of this dataSource accessed via `set` takes the
form of path expressions dispatched to [fluid.set](CoreAPI.md#fluidsetmodel-path-newvalue).

The following call to set,

```javascript
dataSource.set(["foo", "bar"], "qux");
```

could return a promise yielding:

```json
{
    "foo": {
        "bar": "qux"
    }
}
```

## Implementing or customising a DataSource

There are two core base grades `fluid.dataSource` and `fluid.dataSource.writable`. `fluid.dataSource` contains the base
configuration and includes configuration for getting (reading) from a data source. `fluid.dataSource.writable` adds the
configuration for setting (writing) to a data source. Instances of `fluid.dataSource` will need to provide a concrete
handler for the `"onRead.impl"` and those using `fluid.dataSource.writable` will also need to add one for the
`"onWrite.impl"` listener.

```javascript
fluid.defaults("my.component", {
    components: {
        dataSource: {
            type: "fluid.dataSource",
            options: {
                writableGrade: "fluid.dataSource.writable",
                writable: true,
                listeners: {
                    // these would point at concrete implementations for performing the read and write operations.
                    "onRead.impl": "my.component.doRead",
                    "onWrite.impl": "my.component.doWrite"
                }
            }
        }
    }
});
```

When implementing a new kind of dataSource, where reading and writing functionality are needed, the `fluid.dataSource`
and `fluid.dataSource.writable` grades can be used as base grades.

```javascript
fluid.defaults("my.dataSource", {
    gradeNames: ["fluid.dataSource"],
    writableGrade: "my.dataSource.writable",
    listeners: {
        // thise would point at a concrete implementation for performing the read operation.
        "onRead.impl": "my.component.doRead"
    }
    // add grade specific configuration
});

fluid.defaults("my.dataSource.writable", {
    gradeNames: ["fluid.dataSource.writable"],
    listeners: {
        // thise would point at a concrete implementation for performing the write operation.
        "onWrite.impl": "my.component.doWrite"
    }
    // add grade specific configuration
});

fluid.defaults("my.component", {
    components: {
        dataSource: {
            type: "my.dataSource",
            options: {
                writable: true // Enables the data source's set function
            }
        }
    }
});
```

## Encoding

During the `get` (read) and `set` (write) workflows, `onRead` and `onWrite`
[synthetic events](PromisesAPI.md#fluidpromisefiretransformeventevent-payload-options) are provided and usable as
handles for encoding and transforming the payload; for example serializing and deserializing the payload on its way to
and from a server. The encoding/decoding is implemented by a supplied encoding component which includes `parse` and
`render` methods. For `get` the data is run through `parse`. For `set`, the data is run through `render` when being sent
to the server, and any returned values are sent through `parse`.

Two encoding classes are provided for use, `fluid.dataSource.encoding.JSON` (serializes/deserializes JSON data) and
`fluid.dataSource.encoding.none` (provides no encoding/decoding transformation). However, other encoder subcomponents
can be implemented and configured into the dataSource.

The `onRead`, `onWrite`, and `onWriteResponse` event sequences can be used to further modify the data, in addition to
the specific encoding transformations. Because the encoding happens as part of these event sequences, other
transformations may be added before or after the encoding phase. For example providing
[modelTransformations](ModelTransformationAPI.md) before/after serializing/deserializing JSON.

## Standalone utilities packaged with DataSources

### fluid.dataSource.parseJSON(string)

Deserializes a JSON string into a proper JavaScript object and returns a promise for the result.

* `string: {String}` The JSON string to be deserialized
* Returns: `{Promise}` If there is an error, the promise will be rejected and contain the error message. Otherwise the
promise will be resolved with the JavaScript object or `undefined` if the `string` value is falsey.

### fluid.dataSource.stringifyJSON(obj)

Serializes a JavaScript object into a JSON string.

* `obj: {Object}` The JavaScript object to be serialized
* Returns: `{String}` If the object is undefined, an empty string is returned.
