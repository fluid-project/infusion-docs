---
title: RemoteModel API
layout: default
category: Infusion
---

`fluid.remoteModelComponent` builds on top of [`fluid.modelComponent`](ComponentGrades.md) with the purpose of providing
a buffer between a local and remote model that are attempting to stay in sync. For example, a local model is being
updated by user interaction, this is sent back to a remote server, which in turn attempts to update the local model. If
additional user actions occur during this roundtrip, an infinite loop of updates may occur. `fluid.remoteModelComponent`
solves this by restricting reading and writing to a single request at a time, waiting for one request to complete before
operating the next. Additionally, it will rebase local and remote changes, with the local changes taking priority. (See:
[Fetch Workflow](#fetch-workflow) for more details on the rebasing.)

## Supported Events

In addition to the standard `fluid.modelComponent` events, `fluid.remoteModelComponent` adds the following:

* `onFetch`,
* `onFetchError`,
* `afterFetch`,
* `onWrite`,
* `onWriteError`,
* `afterWrite`

For information on how events work and how to configure listeners to them, see [Infusion Event System](InfusionEventSystem.md).

<div class="infusion-docs-note">
    <strong>Note:</strong> The <code>onFetch</code>, <code>afterFetch</code>, <code>onWrite</code> and
    <code>afterWrite</code> are <a href="PromisesAPI.md#fluidpromisefiretransformeventevent-payload-options">synthetic
    events</a> that fire as a sequence. As implemented in the <code>fluid.remoteModelComponent</code>, the listeners for
    the event will all fire in the specified order and be passed the same arguments. However, the next listener will not
    trigger till the previous one has completed. That is, either returned a value or resolved/rejected a returned
    promise. This is useful to prevent further actions from happening until all of the listeners have completed, but
    unlike other <a href="PromisesAPI.md#fluidpromisefiretransformeventevent-payload-options">event sequences</a>, it
    cannot be used to pass the payload through a series of transformations.
</div>

### onFetch

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Fires an event sequence that executes before <code>fetchImpl</code> is called.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>Undefined</td>
        </tr>
    </tbody>
</table>

### onFetchError

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Fired if the <code>onFetch</code> sequence or <code>fetchImpl</code> promises are rejected. By default
                the <code>afterFetch.unblock</code> (unblocks the request queue) handler will execute.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                Any parameters passed along to the rejected promise. This may be an <code>Error</code> object, an error
                message, and/or some other means of indicating the rejection reason.
            </td>
        </tr>
    </tbody>
</table>

### afterFetch

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Fires an event sequence that executes after <code>fetchImpl</code> is called. By default the
                <code>afterFetch.updateModel</code> and <code>afterFetch.unblock</code> (unblocks the request queue)
                handlers will execute as part of this event sequence.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dt>data</dt>
                <dd>
                    The payload returned from the resolved <code>fetchImpl</code> promise.
                </dd>
            </td>
        </tr>
    </tbody>
</table>

### onWrite

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Fires an event sequence that executes before <code>writeImpl</code> is called.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
    </tbody>
</table>

### onWriteError

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Fired if the <code>onWrite</code> sequence or <code>writeImpl</code> promises are rejected. By default
                the <code>afterWrite.unblock</code> (unblocks the request queue) handler will execute.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                Any parameters passed along to the rejected promise. This may be an <code>Error</code> object, an error
                message, and/or some other means of indicating the rejection reason.
            </td>
        </tr>
    </tbody>
</table>

### afterWrite

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Fires an event sequence that executes after <code>writeImpl</code> is called. By default the
                <code>afterWrite.unblock</code> (unblocks the request queue) handler will execute as part of this event
                sequence.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dt>data</dt>
                <dd>
                    The payload returned from the resolved <code>writeImpl</code> promise.
                </dd>
            </td>
        </tr>
    </tbody>
</table>

## Model

<table>
    <thead>
        <tr>
            <th>Model Path</th>
            <th>Description</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>local</code></td>
            <td>
                Provides the buffered mapping of the portions of the components's model to the remote data that should
                be kept in sync. An implementor must setup the <a href="ModelRelay.md">model relay(s)</a> between the
                component's model data and what is contained in the <code>local</code> path.
            </td>
            <td><code>{}</code></td>
        </tr>
        <tr>
            <td><code>remote</code></td>
            <td>
                Stores the data fetched from the remote source.
                <div class="infusion-docs-note">
                    <strong>Note:</strong> This is managed by the component and should not be modified directly.
                </div>
            </td>
            <td><code>{}</code></td>
        </tr>
        <tr>
            <td><code>requestInFlight</code></td>
            <td>
                The state of the requests. When a request is in flight, being processed, the state will be
                <code>true</code> and <code>false</code> otherwise. This is used to prevent more than one request from
                executing at a time.
                <div class="infusion-docs-note">
                    <strong>Note:</strong> This is managed by the component and should not be modified directly.
                </div>
            </td>
            <td><code>false</code></td>
        </tr>
    </tbody>
</table>

## Invokers

### fetch

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Initiates a fetch request. See the <a href="#fetch-workflow">Fetch Workflow</a> for more details.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td><code>"fluid.remoteModelComponent.fetch"</code></td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dt>that</dt>
                <dd>
                    The component.
                </dd>
            </td>
        </tr>
    </tbody>
</table>

### fetchImpl

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Must be supplied by an implementor to provide the concrete implementation for fetching data from the
                remote source. It must return a promise.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td><code>"fluid.notImplemented"</code></td>
        </tr>
    </tbody>
</table>

### write

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Initiates a write request. See the <a href="#write-workflow">Write Workflow</a> for more details.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td><code>"fluid.remoteModelComponent.write"</code></td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dt>that</dt>
                <dd>
                    The component.
                </dd>
            </td>
        </tr>
    </tbody>
</table>

### writeImpl

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                Must be supplied by an implementor to provide the concrete implementation for writing data to the remote
                source. It must return a promise that is resolved/rejected after the write operation has been handled by
                the remote end point.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td><code>"fluid.notImplemented"</code></td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dt>payload</dt>
                <dd>
                    The data, from <code>that.model.local</code>, to send to the remote source.
                </dd>
            </td>
        </tr>
    </tbody>
</table>

## Fetch Workflow

Executing the `fetch` invoker will add a fetch request and returns a promise for the result. Only one request can be in
flight (processing) at a time. If a write request is in flight, the fetch will be queued. If a fetch request is already
in queue/flight, the requests will be coalesced into a single fetch request sent to the server, and all representatives
in the queue will receive the same response payload. When a fetch request is in flight , it will trigger the `fetchImpl`
invoker to perform the actual request.

Two synthetic events, `onFetch` and `afterFetch`, are fired during the processing of a fetch. `onFetch` can be used to
perform any necessary actions before running `fetchImpl`. `afterFetch` can be used to perform any necessary actions
after running `fetchImpl` (e.g. updating the model, unblocking the queue). If promises returned from `onFetch`,
`afterFetch`, or `fetchImpl` are rejected, the `onFetchError` event will be fired.

After a fetch is performed, the local representation is rebased with the results. The rebasing is performed by
re-applying the local model changes on top of the values returned from the fetch. In this way the local changes are not
lost and take precedence over changes pulled down from the remote.

![A flow diagram depicting the Fetch workflow](images/remoteModel_fetch_diagram.svg)

## Write Workflow

Executing the `write` invoker adds a write request and returns a promise for the result. Only one request can be in
flight (processing) at a time. If a fetch or write request is in flight, the write will be queued. If a write request is
already in queue, the requests will be coalesced into a single write request sent to the server, and all representatives
in the queue will receive the same response payload. When a write request is in flight, it will trigger the `writeImpl`
invoker to perform the actual request.

Two synthetic events, `onWrite` and `afterWrite`, are fired during the processing of a write. `onWrite` can be used to
perform any necessary actions before running `writeImpl` (e.g. performing a fetch). `afterWrite` can be used to perform
any necessary actions after running `writeImpl` (e.g. updating the remote model, unblocking the queue, performing a
fetch). If promises returned from `onWrite`, `afterWrite`, or `writeImpl` are rejected, the `onWriteError` event will be
fired.

By default, upon a successful write, the `afterWrite` event will trigger the `remote` model path to be updated with the
values from the `local` model path. Because of this, the `writeImpl` must resolve/reject its promise after the write
implementation has been handled by the remote end point, not simply after the request has been made.

![A flow diagram depicting the Write workflow](images/remoteModel_write_diagram.svg)
