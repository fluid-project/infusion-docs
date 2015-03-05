---
title: Text To Speech API
layout: default
---

# Text To Speech API #

The **Text To Speech** component uses [Web Speech Synthesis API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section) to queue up and read texts.

## Browser Support ##
The Text To Speech component can be used in browsers that support [Web Speech Synthesis API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section) is supported. At the moment when this document is written, Mar 4 2015, these browsers include:
* Chrome 33+ 
* Chrome for Android 40+
* Safari 7.1+

## Creator ##

Use the following function to create a Text To Speech component:

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>fluid.textToSpeech(options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                Instantiate the text to speech component. The methods of the instantiated component can be called to queue up and read texts.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>options</dt>
                    <dd>
                        An optional data structure that configures the Text To Speech component, as described below.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Returns</th>
            <td>The Text To Speech component</td>
        </tr>
        <tr>
            <th>Examples</th>
            <td>
<pre>
<code>
var tts = fluid.textToSpeech({
    utteranceOpts: {
        volume: 1
    }
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>See also</th>
            <td>
                <a href="#utteranceopts-options">Utteranceopts Options</a>
            </td>
        </tr>
    </tbody>
</table>

## Supported Methods ##

### `queueSpeech` ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.queueSpeech(text, interrupt, options);</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>queueSpeech</code> method allows you to append the text to the end of the queue to begin speaking after the other texts in the queue have been spoken. This method can also be used to remove all texts from the queue by passing in the `interrupt` argument with a true value.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>text</dt>
                    <dd>
                        The string of the text to be appended to the end of the queue to be spoken.
                    </dd>
                    <dt>interrupt</dt>
                    <dd>
                        An optional boolean value. Passing in a true value to remove all texts from the queue. Passing in the false value doesn't interfere the component state.
                    </dd>
                    <dt>options</dt>
                    <dd>
                        An optional javascript object. To config the internal `SpeechSynthesisUtterance` instance. Refer to <a href="#utteranceopts-options">utteranceOpts Options</a> for the options that can be defined in this object.
                    </dd>
                </dl>
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.queueSpeech("Hello world", false, {
    volume: 0.5
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### `cancel` ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.cancel();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>cancel</code> method allows you to remove all texts from the queue. If a text is being spoken, speaking ceases immediately.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### `pause` ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.pause();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>pause</code> method allows you to immediately pause any texts that are being spoken..
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### `resume` ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.resume();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>resume</code> method allows you to resume speaking a text that was previously paused.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>

### `getVoices` ###

<table>
    <tbody>
        <tr>
            <th>Method</th>
            <td>
                <code>textToSpeech.getVoices();</code>
            </td>
        </tr>
        <tr>
            <th>Description</th>
            <td>
                The <code>getVoices</code> method allows you to get a list of all the voices that are supported by the browser.
            </td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>none</td>
        </tr>
    </tbody>
</table>


## Supported Events ##

_**Note:** If needed, please read the [Infusion Event System](InfusionEventSystem.md) document for a full description of infusion events._

The events fired by the Text To Speech component are described below.

### `onStart` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the text has begun to be spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### `onStop` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the speaking stops.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### `onPause` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when the text is paused whilst being spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### `onResume` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when a paused text resumes being spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### `onError` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when an error occurs that prevents the text from being spoken.</em></p>
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                none
            </td>
        </tr>
    </tbody>
</table>

### `onSpeechQueued` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                This event fires when a text has been queued up to be spoken.
            </td>
        </tr>
        <tr>
            <th>Type</th>
            <td>default</td>
        </tr>
        <tr>
            <th>Parameters</th>
            <td>
                <dl>
                    <dt>text</dt>
                    <dd>
                        The text that has been added to the queue.
                    </dd>
                </dl>
            </td>
        </tr>
    </tbody>
</table>

## `utteranceOpts` Options ##

_**Note:** If needed, please read the [Component Configuration Options](ComponentConfigurationOptions.md) document for a full description of infusion component options._

The only option supported by the Text To Speech component is `utteranceOpts`This option is a javascript object that contains a number of attributes that users can use to define the behaviour of their `SpeechSynthesisUtterance` instances. [The `SpeechSynthesisUtterance` instance](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#utterance-attributes) is a part of the web speech API that the Text To Speech component interacts with. These attributes include:

### `text` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>text</code> option allows you to set the text that you wish to be spoken. Be careful with this option as it will override any text that was previously passed.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                ""
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    utteranceOpts: {
        text: "Override other texts"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### `lang` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>lang</code> option gives you the ability to specify the language of the text.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                Default to the language of the HTML document.
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    utteranceOpts: {
        lang: "en-US"
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### `voiceURI` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>voiceURI</code> option specifies speech synthesis voice and the location of the speech synthesis service that the web application wishes to use.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                Default to the user agent default speech service. It varies depending on the browser configuration.
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    utteranceOpts: {
        voiceURI: {
            "default": false,
            "localService": false,
            "lang": "en-GB",
            "name": "Google UK English Male",
            "voiceURI": "Google UK English Male"
        }
    }
});
</code>
</pre>
            </td>
        </tr>
        <tr>
            <th>See also</th>
            <td>
            Method <a href="#getvoices">getVoices()</a>
            </td>
        </tr>
    </tbody>
</table>

### `volume` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>volume</code> option allows you to adjust the volume of the speech. This is a float value between 0 and 1.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                1
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    utteranceOpts: {
        volume: 0.5
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### `rate` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>rate</code> option allows you to define the speed at which the text should be spoken. This is a float value between 0 and 10.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                1
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    utteranceOpts: {
        rate: 5
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>

### `pitch` ###

<table>
    <tbody>
        <tr>
            <th>Description</th>
            <td>
                The <code>pitch</code> option allows you to control how high or low the text is spoken. This is a float value between 0 and 2.
            </td>
        </tr>
        <tr>
            <th>Default</th>
            <td>
                1
            </td>
        </tr>
        <tr>
            <th>Example</th>
            <td>
<pre>
<code>
fluid.textToSpeech({
    utteranceOpts: {
        pitch: 2
    }
});
</code>
</pre>
            </td>
        </tr>
    </tbody>
</table>
