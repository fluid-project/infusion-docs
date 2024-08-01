---
title: Uploader API
category: Components
---

The Infusion Uploader provides an easy way for users to upload many files at once, providing useful feedback about the
status and progress of each file along the way.

Uploader implements a couple different ways to upload multiple files. With its built-in support for progressive
enhancement, users will automatically receive a version of the Uploader best suited to the capabilities of their
browsers. There are two different flavours of Uploader:

1. Single file: delivered to browsers that don't support JavaScript and HTML 5
2. HTML 5: the best and most widely-supported version of Uploader, suitable for modern browsers

The HTML 5 version of the Uploader will be delivered to modern, standards-compliant browsers, including:

* Internet Explorer 10+
* Firefox 3.6+
* Safari 4+
* Google Chrome

<div class="infusion-docs-note">
    <strong>Note:</strong> As of Infusion 1.5, the Flash version of the Uploader has been removed due to a <a
    href="https://nealpoole.com/blog/2012/05/xss-and-csrf-via-swf-applets-swfupload-plupload/">cross-site scripting
    vulnerability</a>.
</div>

### Progressive Enhancement

The Uploader utilizes the concept of progressive enhancement. The goal is to ensure that the page is usable by the
widest possible audience, even with old browsers or when JavaScript is turned off. This is done by specifying a regular
file input element in the markup. When the Uploader is initialized, the Upload code will replace that element with the
Fluid Uploader. As of Infusion 1.3, progressive enhancement will occur automatically by default. It can be overridden by
choosing a specific upload strategy instead of using the `fluid.uploader.progressiveStrategy`.

### Upload Strategy

The Infusion Uploader, like many Fluid components, is really one interface to a collection of components that work
together to provide a unified user experience.

The Uploader provides a facade object, called a `strategy`, which represents the entire subsystem for a particular
implementation of Uploader. There are currently two different strategies available to choose from:

1. `fluid.uploader.html5Strategy`, which provides the modern HTML 5 implementation of Uploader
2. `fluid.uploader.progressiveStrategy`, which uses the Infusion IoC - Inversion of Control System to deliver the best
   possible version of Uploader based on the capabilities of the user's browser.

The default strategy for Uploader is `fluid.uploader.progressiveStrategy`.

### Upgrading

#### Upgrading from Infusion 1.2

The Uploader was substantially refactored for the Infusion 1.3 in order to support the new HTML 5 version. However, most
users should be unaffected. All events, selectors, and classes remain compatible with previous versions. Since the
Uploader's underlying structure has changed significantly, and support for Infusion's IoC System was introduced, several
other configuration options have changed. In order to ease the transition, we've provided a compatibility file that will
automatically transform your options from the old format to the new when you invoke `fluid.uploader()`. This can be
enabled by including the `UploaderCompatibility-Infusion1.2.js` file your page. If you're not using a custom build of
Infusion, you will also need to include the framework's `ModelTransformations.js` file.

## Creating an Uploader

To instantiate a new Uploader on your page using the recommended progressive enhancement feature:

```javascript
var myUploader = fluid.uploader(container, options);
```

Returns: An Uploader component object. The resulting type may be either `fluid.uploader.multiFileUploader` or
`fluid.uploader.singleFileUploader` depending on the capabilities of your user's browser. If you're programmatically
calling methods on the Uploader, be sure to check its `typeName` or use duck typing first.

### Parameters

#### container

The `container` is a CSS-based [selector](https://api.jquery.com/category/selectors/), single-element jQuery object, or DOM
element that identifies the root DOM node of the Uploader markup.

#### options

The `options` object is an optional data structure that configures the Uploader, as described in the [Options](#options)
section below.

## Supported Events

The Uploader fires the following events

<table>
    <thead>
        <tr>
            <th>Event</th>
            <th>Type</th>
            <th>Description</th>
            <th>Parameters</th>
            <th>Parameters Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>onFileDialog</code></td>
            <td>default</td>
            <td>
                The event is fired when the OS File Open dialog is displayed.
            </td>
            <td>none</td>
            <td></td>
        </tr>
        <tr>
            <td><code>onFilesSelected</code></td>
            <td>default</td>
            <td>
                The event is fired when files have been selected for addition to the file queue.
                <strong><em>HTML5 only.</em></strong>
            </td>
            <td><code>numFiles</code></td>
            <td>The number of files selected.</td>
        </tr>
        <tr>
            <td><code>afterFileQueued</code></td>
            <td>default</td>
            <td>
                This event is fired for each file that is queued after the File Selection Dialog window is closed.
            </td>
            <td><code>file</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> that has just been added to the queue.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>afterFileRemoved</code></td>
            <td>default</td>
            <td>
                Event is fired for each file that is removed from the filequeue model
            </td>
            <td><code>file</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> that was just removed from the queue.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>onQueueError</code></td>
            <td>default</td>
            <td>
                This event is fired for each file that was not queued after the File Selection Dialog window is closed.
            </td>
            <td><code>file</code>, <code>errorCode</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> that failed to be added to the queue.
                    </dd>
                    <dt><code>errorCode</code></dt>
                    <dd>
                        indication of the reason for the file not being added to the queue.
                    </dd>
                </dl>
                <em>
                    <strong>Note:</strong> A file may not be queued for several reasons such as, the file exceeds the
                    file size, the file is empty or a file or queue limit has been exceeded.
                </em>
            </td>
        </tr>
        <tr>
            <td><code>afterFileDialog</code></td>
            <td>default</td>
            <td>
                This event fires after the File Selection Dialog window has been closed and all the selected files have
                been processed.
            </td>
            <td>none</td>
            <td></td>
        </tr>
        <tr>
            <td><code>onUploadStart</code></td>
            <td>default</td>
            <td>
                This event at the beginning of the entire upload cycle.
            </td>
            <td><code>fileList</code></td>
            <td>
                <dl>
                    <dt><code>fileList</code></dt>
                    <dd>
                        a list of the <a href="#file-objects">File objects</a> that will be uploaded to the server.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>onFileStart</code></td>
            <td>default</td>
            <td>
                This event is fired immediately before the file is uploaded.
            </td>
            <td><code>file</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> that has started to be uploaded.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>onFileProgress</code></td>
            <td>default</td>
            <td>
                This event is fired periodically by the upload manager during a file upload and is useful for providing
                UI updates on the page. Also keeps up-to-date the overall progress of the currently uploading batch.
            </td>
            <td><code>file</code>, <code>fileBytesComplete</code>, <code>fileTotalBytes</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> for this progress event.
                    </dd>
                    <dt><code>fileBytesComplete</code></dt>
                    <dd>
                        the number of bytes for the current file that have been uploaded to the server
                    </dd>
                    <dt><code>fileTotalBytes</code></dt>
                    <dd>the total size of the file in bytes.</dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>onFileError</code></td>
            <td>default</td>
            <td>
                This event is fired any time an individual file upload is interrupted or does not complete successfully.
            </td>
            <td><code>file</code>, <code>error</code>, <code>status</code>, <code>xhr</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> that errored.
                    </dd>
                    <dt><code>error</code></dt>
                    <dd>
                        whether the file failed because the user cancelled the upload or because of another file
                        specific error Use fluid.uploader.fileStatusConstants to interpret the value.
                    </dd>
                    <dt><code>status</code></dt>
                    <dd>
                        xhr.status. 0 if the error occurs during the upload, otherwise, the HTTP status code.
                    </dd>
                    <dt><code>xhr</code><dt>
                    <dd>
                        Defaults to the ActiveXObject when available (IE), the XMLHttpRequest otherwise.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>onFileSuccess</code></td>
            <td>default</td>
            <td>
                This event is fired when an upload completes and the server returns a HTTP 200 status code.
            </td>
            <td><code>file</code>, <code>responseText</code>, <code>xhr</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> that has completed.
                    </dd>
                    <dt><code>responseText</code></dt>
                    <dd>
                        the response text returned from the server.
                    </dd>
                    <dt><code>xhr</code><dt>
                    <dd>
                        Defaults to the ActiveXObject when available (IE), the XMLHttpRequest otherwise.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>afterFileComplete</code></td>
            <td>default</td>
            <td>
                This event is fired for each file uploaded whether or not the file is uploaded successfully,
                <code>onFileSuccess</code>, or the file failed to upload, <code>onFileError</code>. At this point the
                upload process for the currently uploading file is complete and the upload for the next file in the
                queue is started.
            </td>
            <td><code>file</code></td>
            <td>
                <dl>
                    <dt><code>file</code></dt>
                    <dd>
                        the <a href="#file-objects">File object</a> that was successfully uploaded.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <td><code>afterUploadComplete</code></td>
            <td>default</td>
            <td>
                This event is fired at the end of an upload cycle when all the files have either been uploaded, failed
                to upload, the user stopped the upload cycle, or there was an unrecoverable error in the upload process
                and the upload cycle was stopped.
            </td>
            <td><code>fileList</code></td>
            <td>
                <dl>
                    <dt><code>fileList</code></dt>
                    <dd>
                        the <a href="#file-objects">File objects</a> that "completed" (either succeeded or failed), in
                        this upload.
                    </dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

### File Objects

Many of the Uploader's events pass a `File` object as a parameter to the event listener. These objects provide useful
information about the file, including its name, size in bytes, and its current status in the queue.

`File` object: a representation of each file in the file queue, as provided from the upload strategy. At the moment, the
properties of this object will be slightly different depending on the strategy you're using. This will be addressed in a
future release.

Regardless of the strategy, the following properties will be available:

* id - (string) A unique id for each file in the queue
* name - (string) The file name. The path is not provided.
* size - (number) The file size in bytes
* filestatus - (number) The file's current status.
  * Use `fluid.uploader.fileStatusConstants` to interpret the value.

#### File Status Constants

The Uploader offers a set of constants used to denote the status of a particular file in the queue. These can be used
when querying the filestatus property of a [File object](#file-objects).

<table>
    <thead>
        <tr>
            <th>Upload Error Constants</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>fluid.uploader.errorConstants.HTTP_ERROR</code></td>
            <td>
                An HTTP error occurred while uploading a file.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.MISSING_UPLOAD_URL</code></td>
            <td>
                The <code>uploadURL</code> was not correctly specified in the <code>uploadManager</code> options.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.IO_ERROR</code></td>
            <td>
                An IO error occurred while transferring the file.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.SECURITY_ERROR</code></td>
            <td>
                The upload caused a security error to occur.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.UPLOAD_LIMIT_EXCEEDED</code></td>
            <td>
                The user attempted to upload more files than allowed by the <code>fileUploadLimit</code> option for the
                <code>uploadManager</code>.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.UPLOAD_FAILED</code></td>
            <td>
                The Uploader was unable to start uploading the file to the server.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.SPECIFIED_FILE_ID_NOT_FOUND</code></td>
            <td>
                This indicates an error in the Uploader and should be filed as a <a
                href="https://fluidproject.atlassian.net/jira/software/c/projects/FLUID/issues">bug</a>.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.FILE_VALIDATION_FAILED</code></td>
            <td></td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.FILE_CANCELLED</code></td>
            <td>The upload was canceled by the user.</td>
        </tr>
        <tr>
            <td><code>fluid.uploader.errorConstants.UPLOAD_STOPPED</code></td>
            <td>The upload was stopped by the user.</td>
        </tr>
        <tr>
            <th>File Status Constants</th>
            <th>Description</th>
        </tr>
        <tr>
            <td><code>fluid.uploader.fileStatusConstants.QUEUED</code></td>
            <td>
                The file is currently queued up and ready to be sent to the server.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.fileStatusConstants.IN_PROGRESS</code></td>
            <td>
                The file is currently being uploaded to the server.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.fileStatusConstants.ERROR</code></td>
            <td>
                An error occurred while trying to upload the file.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.fileStatusConstants.COMPLETE</code></td>
            <td>
                The file was successfully uploaded to the server.
            </td>
        </tr>
        <tr>
            <td><code>fluid.uploader.fileStatusConstants.CANCELLED</code></td>
            <td>
                The file was canceled by the user while in the process of being uploaded.
            </td>
        </tr>
    </tbody>
</table>

## Options

The Uploader supports a "plug-and-play" architecture that allows for many of the sub-components of the Uploader to be
swapped out for other components or your own custom components. The best example of this is the `strategy` component,
which allows you to choose between the `fluid.uploader.html5Strategy` and the `fluid.uploader.progressiveStrategy`.
However you can also replace the Progress subcomponent and the FileQueueView subcomponent, with a customized version you
have implemented yourself.

The Uploader and its sub-components are also highly configurable; you can make many adjustments to the user experience
through a combination of HTML, CSS and the built-in configuration options. To customize the component for your own
needs, start with these out-of-the-box features. If you need more flexibility, feel free to to write your own
sub-component.

In addition to the Uploader options, there are also options specifically for the FileQueueView, Progress, and `strategy`
subcomponents.

### Uploader Subcomponents

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>strategy</code></td>
            <td>
                The strategy for how files are uploaded to the server (e.g. HTML 5, etc.)
            </td>
            <td>
                <code>"fluid.uploader.progressiveStrategy"</code>,
                <code>"fluid.uploader.html5Strategy"</code>
            </td>
            <td>
                <pre class="highlight"><code class="hljs javascript">
strategy: {
    type: "fluid.uploader.progressiveStrategy"
}</code>
                </pre>
            </td>
        </tr>
        <tr>
            <td><code>fileQueueView</code></td>
            <td>
                Specifies the type of fileQueueView subcomponent to use.
Currently there is only one fileQueueView sub-component.
            </td>
            <td>
                <code>"fluid.fileQueueView"</code>
            </td>
            <td>
                <pre class="highlight"><code class="hljs javascript">
fileQueueView: {
    type: "fluid.fileQueueView"
}</code>
                </pre>
            </td>
        </tr>
        <tr>
            <td><code>totalProgressBar</code></td>
            <td>
                Specifies the type and options to use for the total progress bar.
            </td>
            <td>
                See the <a href="to-do/ProgressAPI.md">Progress API documentation</a> for a full descriptions of the
                available options.
            </td>
            <td>
                <pre class="highlight"><code class="hljs javascript">
totalProgressBar: {
    type: "fluid.progress",
    options: {
        selectors: {
            progressBar: ".flc-uploader-queue-footer", (was ".flc-uploader-scroller-footer" in v1.0)
            displayElement: ".flc-uploader-total-progress",
            label: ".flc-uploader-total-progress-text",
            indicator: ".flc-uploader-total-progress",
            ariaElement: ".flc-uploader-total-progress"
        }
    }
},</code>
                </pre>
            </td>
        </tr>
    </tbody>
</table>

### Uploader Options

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>selectors</code></td>
            <td>
                Javascript object containing selectors for various fragments of the uploader markup
            </td>
            <td></td>
            <td>see <a href="#selectors">Selectors</a> below</td>
        </tr>
        <tr>
            <td><code>listeners</code></td>
            <td>
                JavaScript object containing events and the listeners that are attached to them.
            </td>
            <td>
                Keys in the object are event names, values are functions or arrays of functions.
            </td>
            <td>see <a href="#supported-events">Supported Events</a></td>
        </tr>
        <tr>
            <td><code>focusWithEvent</code></td>
            <td>
                Javascript object containing selectors for markup elements that should obtain focus after certain <a
                href="#supported-events">events</a>.
            </td>
            <td>
                Keys in the object are supported event names.
                <p>
                    <em><strong>Note:</strong> only specific methods in the Uploader have been factored to use this
                    values.</em>
                </p>
            </td>
            <td>
                <pre class="highlight"><code class="hljs javascript">
focusWithEvent: {
    afterFileDialog: "uploadButton",
    afterUploadStart: "pauseButton",
    afterUploadStop: "uploadButton"
},</code>
                </pre>
            </td>
        </tr>
        <tr>
            <td><code>styles</code></td>
            <td>
                Specific class names used to achieve the look and feel of the different states of the Uploader
            </td>
            <td></td>
            <td>
                <pre class="highlight"><code class="hljs javascript">
styles: {
    disabled: "fl-uploader-disabled",
    hidden: "fl-uploader-hidden",
    dim: "fl-uploader-dim",
    totalProgress: "fl-uploader-total-progress-okay",
    totalProgressError: "fl-uploader-total-progress-errored"
}</code>
                </pre>
            </td>
        </tr>
        <tr>
            <td><code>strings</code></td>
            <td>
                Strings that are used in the Uploader. Note: The strings that contain tokens (example:
                <code>%curFileN</code>) are passed through a string template parser.
            </td>
            <td></td>
            <td>
                <strong>v1.5</strong>
                <pre class="highlight"><code class="hljs javascript">
strings: {
    progress: {
        fileUploadLimitLabel: "%fileUploadLimit %fileLabel maximum",
        noFiles: "0 files",
        toUploadLabel: "%uploadedCount out of %totalCount files uploaded (%uploadedSize of %totalSize)",
        totalProgressLabel: "%uploadedCount out of %totalCount files uploaded (%uploadedSize of %totalSize)",
        completedLabel: "%uploadedCount out of %totalCount files uploaded (%uploadedSize of %totalSize)%errorString",
        numberOfErrors: ", %errorsN %errorLabel",
        singleFile: "file",
        pluralFiles: "files",
        singleError: "error",
        pluralErrors: "errors"
    },
    buttons: {
        browse: "Browse Files",
        addMore: "Add More",
        stopUpload: "Stop Upload",
        cancelRemaning: "Cancel remaining Uploads",
        resumeUpload: "Resume Upload",
        remove: "Remove"
    }
}</code>
                </pre>
                <strong>v1.4</strong>
                <pre class="highlight"><code class="hljs javascript">
strings: {
    progress: {
        fileUploadLimitLabel: "%fileUploadLimit %fileLabel maximum",
        toUploadLabel: "To upload: %fileCount %fileLabel (%totalBytes)",
        totalProgressLabel: "Uploading: %curFileN of %totalFilesN %fileLabel (%currBytes of %totalBytes)",
        completedLabel: "Uploaded: %curFileN of %totalFilesN %fileLabel (%totalCurrBytes)%errorString",
        numberOfErrors: ", %errorsN %errorLabel",
        singleFile: "file",
        pluralFiles: "files",
        singleError: "error",
        pluralErrors: "errors"
    },
    buttons: {
        browse: "Browse Files",
        addMore: "Add More",
        stopUpload: "Stop Upload",
        cancelRemaning: "Cancel remaining Uploads",
        resumeUpload: "Resume Upload"
    },
    queue: {
        emptyQueue: "File list: No files waiting to be uploaded.",
        queueSummary: "File list:  %totalUploaded files uploaded, %totalInUploadQueue file waiting to be uploaded."
    }
}</code>
                </pre>
            </td>
        </tr>
        <tr>
            <td><code>demo</code></td>
            <td>
                Boolean indicating whether to run in "demo" mode. See <a href="#running-locally-demo-mode">Running
                locally: "demo" mode</a> below.
            </td>
            <td>false</td>
            <td><code>demo: false</code></td>
        </tr>
    </tbody>
</table>

### queueSettings Options

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>uploadURL</code></td>
            <td>
                The URL to which files should be sent via POST requests.
            </td>
            <td>String</td>
            <td>""</td>
        </tr>
        <tr>
            <td><code>fileUploadLimit</code></td>
            <td>
                The maximum number of files allowed to be uploaded. 0 is unlimited.
            </td>
            <td>Integer</td>
            <td>0</td>
        </tr>
        <tr>
            <td><code>fileQueueLimit</code></td>
            <td>
                The number of files that can be queued at once before uploading them. 0 is unlimited
            </td>
            <td>Integer</td>
            <td>0</td>
        </tr>
        <tr>
            <td><code>postParams</code></td>
            <td>
                Parameters to send along with the POST request to the server when uploading files.
            </td>
            <td>Javascript Object</td>
            <td>{}</td>
        </tr>
        <tr>
            <td><code>fileSizeLimit</code></td>
            <td>
                The maximum size of a file to send to the server. Files larger than this will not be added to the queue.
            </td>
            <td>Integer, specified in bytes</td>
            <td>"20480"</td>
        </tr>
        <tr>
            <td><code>fileTypes</code></td>
            <td>
                The type of files that are allowed to be uploaded. Each file type should be specified as *.[fluid:file
                extension], separated by semicolons. Example: "*.jpg;*.jpeg;*.gif;*.tiff"
            </td>
            <td>String</td>
            <td>
                <strong>v1.4</strong>
                <p>null</p>

                <strong>v1.1</strong>
                <p>"*"</p>

                <strong>v1.0</strong>
                <p>"*.*"</p>
            </td>
        </tr>
    </tbody>
</table>

### htmlStrategy Options

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Values</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>legacyBrowserFileLimit</code></td>
            <td>
                A special file size limit for older browsers (such as Firefox 3.6), which don't fully support HTML 5
                file uploads.
            </td>
            <td>any integer value, specified in megabytes</td>
            <td>100</td>
        </tr>
    </tbody>
</table>

### Selectors

One of the options that can be provided to the Uploader is a set of CSS-based selectors identifying where in the DOM
different elements can be found. The value for the option is itself a Javascript object containing name/value pairs:

```json5
{
    selectors: {
        selector1Name: "selector 1 string",
        selector2Name: "selector 2 string"
        // ...
    }
}
```

The different parts of the Uploader interface each have their own set of selectors (though all selectors must be
provided together in a single object). Each also has a default, as defined below:

#### General

<table>
    <thead>
        <tr>
            <th>Selector Name</th>
            <th>Description</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>fileQueue</code></td>
            <td>The container element of the File Queue.</td>
            <td>".flc-uploader-queue"</td>
        </tr>
        <tr>
            <td><code>browseButton</code></td>
            <td>The Browse Files button.</td>
            <td>".flc-uploader-button-browse"</td>
        </tr>
        <tr>
            <td><code>uploadButton</code></td>
            <td>The Upload button.</td>
            <td>".flc-uploader-button-upload"</td>
        </tr>
        <tr>
            <td><code>pauseButton</code></td>
            <td>The Pause button.</td>
            <td>".flc-uploader-button-pause"</td>
        </tr>
        <tr>
            <td><code>totalFileProgressBar</code></td>
            <td>The file container for the total progress bar.</td>
            <td>".flc-uploader-queue-footer"</td>
        </tr>
        <tr>
            <td><code>totalFileStatusText</code></td>
            <td>
                The element to write the total progress bar status text into.
            </td>
            <td>".flc-uploader-total-progress-text"</td>
        </tr>
        <tr>
            <td><code>instructions</code></td>
            <td>The element containing the browse files instructions.</td>
            <td>".flc-uploader-browse-instructions"</td>
        </tr>
    </tbody>
</table>

#### File Queue

<table>
    <thead>
        <tr>
            <th>Selector Name</th>
            <th>Description</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>fileRows</code></td>
            <td>The files rows in the queue.</td>
            <td>".flc-uploader-file"</td>
        </tr>
        <tr>
            <td><code>fileName</code></td>
            <td>
                The container for the file's name. Scoped within an individual file row.
            </td>
            <td>".flc-uploader-file-name"</td>
        </tr>
        <tr>
            <td><code>fileSize</code></td>
            <td>
                The container for the file's size. Scoped within an individual file row.
            </td>
            <td>".flc-uploader-file-size"</td>
        </tr>
        <tr>
            <td><code>fileIconBtn</code></td>
            <td>
                The container for the file row icons. Scoped within an individual file row.
            </td>
            <td>".flc-uploader-file-action"</td>
        </tr>
        <tr>
            <td><code>errorText</code></td>
            <td>
                The container for file specific error text. Scoped within an individual file row.
            </td>
            <td>".flc-uploader-file-error"</td>
        </tr>
        <tr>
            <td><code>rowTemplate</code></td>
            <td>
                A template element to clone when creating new rows in the file queue.
            </td>
            <td>".flc-uploader-file-tmplt"</td>
        </tr>
        <tr>
            <td><code>errorInfoRowTemplate</code></td>
            <td>
                A template element to close when displaying an error for an individual file.
            </td>
            <td>".flc-uploader-file-error-tmplt"</td>
        </tr>
        <tr>
            <td><code>rowProgressorTemplate</code></td>
            <td>
                A template element to clone when creating the progress bar for a file row.
            </td>
            <td>".flc-uploader-file-progressor-tmplt"</td>
        </tr>
    </tbody>
</table>

#### Scroller

<table>
    <thead>
        <tr>
            <th>Selector Name</th>
            <th>Description</th>
            <th>Default</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>wrapper</code></td>
            <td>A wrapper container around the scrollable element.</td>
            <td>".flc-scroller"</td>
        </tr>
    </tbody>
</table>

#### Progress

<div class="infusion-docs-note">
    <strong>Note:</strong> Please see the <a href="to-do/ProgressAPI.md">Progress API</a> document for a full
    description of Fluid Progress.
</div>

Uploader uses the following selector options for Progress:

```json5
{
    selectors: {
        progressBar: ".flc-uploader-queue-footer",
        displayElement: ".flc-uploader-total-progress",
        label: ".flc-uploader-total-progress-text",
        indicator: ".flc-uploader-total-progress",
        ariaElement: ".flc-uploader-total-progress"
    }
}
```

Any selectors not provided as an option will revert to the default. Implementers may choose to use the default class
names in their markup, or customize the selectors, or a combination of these two approaches.

For example, if your markup uses all of the default selectors, except for the file queue selector and the remove button
selector, you would provide the following selectors option:

```json5
{
    selectors: {
        fileQueue: "#my-file-queue",
        removeButton: "#my-remove-button"
    }
}
```

## Dependencies

### Required

The Uploader dependencies can be met by including in the header of the HTML file

* the minified infusion-all.js file
* the Fluid layout CSS file
* the Uploader CSS file

as shown below:

```html
<link rel="stylesheet" type="text/css" href="/framework/core/css/fluid.css" />
<link rel="stylesheet" type="text/css" href="components/uploader/css/Uploader.css" />
<script type="text/javascript" src="framework/core/js/infusion-all.js"></script>
```

Alternatively, the individual file requirements are:

```html
<link rel="stylesheet" type="text/css" href="../../../framework/core/css/fluid.css" />
<link rel="stylesheet" type="text/css" href="../css/Uploader.css" />

<!-- Fluid and jQuery Dependencies -->
<script type="text/javascript" src="../../../lib/jquery/core/js/jquery.js"></script>
<script type="text/javascript" src="../../../lib/jquery/ui/js/jquery.ui.core.js"></script>
<script type="text/javascript" src="../../../framework/core/js/jquery.keyboard-a11y.js"></script>
<script type="text/javascript" src="../../../framework/core/js/Fluid.js"></script>
<script type="text/javascript" src="../../../framework/core/js/FluidDocument.js"></script>
<script type="text/javascript" src="../../../framework/core/js/FluidView.js"></script>
<script type="text/javascript" src="../../../framework/core/js/DataBinding.js"></script>
<script type="text/javascript" src="../../../framework/core/js/FluidIoC.js"></script>
<script type="text/javascript" src="../../../framework/enhancement/js/ProgressiveEnhancement.js"></script>

<!-- Uploader dependencies -->
<script type="text/javascript" src="../js/Uploader.js"></script>
<script type="text/javascript" src="../js/FileQueue.js"></script>
<script type="text/javascript" src="../js/Scroller.js"></script>
<script type="text/javascript" src="../../progress/js/Progress.js"></script>
<script type="text/javascript" src="../js/FileQueueView.js"></script>
<script type="text/javascript" src="../js/HTML5UploaderSupport.js"></script>
<script type="text/javascript" src="../js/DemoUploadManager.js"></script>
```

## Important Notes for Developers

### Running locally: "demo" mode

The Upload component requires a server component to accept the uploaded files.

However there are times when you want to run the uploader with out a server: when working on integrating the component
with your code, developing or testing the UI, or demonstrating the functionality of the code. For that reason the
Uploader has a "demo" mode. In demo mode, the Uploader uses a special version of the uploadManager that pretends to be
talking to a server. Most of the code is identical to the server mode because the same events are being fired and the
model is exactly the same. Most of the code in the Uploader thinks that there is a server.

To run locally you must specify `demo: true` in your component configuration:

```javascript
var myUploader = fluid.progressiveEnhanceableUploader(".flc-uploader", ".fl-ProgEnhance-basic", {
    demo: true
});
```
